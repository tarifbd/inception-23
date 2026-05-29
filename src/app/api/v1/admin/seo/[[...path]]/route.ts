import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, readJson } from '@/lib/api/http';
import { requirePermission } from '@/lib/admin/rbac';
import { auditSeo } from '@/lib/seo/audit';
import { generateAIContent } from '@/lib/ai/service';

type Params = { params: Promise<{ path?: string[] }> };

async function getPath(params: Params['params']) {
  const resolved = await params;
  return resolved.path || [];
}

function metadataData(body: Record<string, unknown>) {
  return {
    entityType: typeof body.entityType === 'string' ? body.entityType : undefined,
    entityId: typeof body.entityId === 'string' ? body.entityId : null,
    seoTitle: typeof body.seoTitle === 'string' ? body.seoTitle : undefined,
    metaDescription: typeof body.metaDescription === 'string' ? body.metaDescription : undefined,
    metaKeywords: typeof body.metaKeywords === 'string' ? body.metaKeywords : null,
    slug: typeof body.slug === 'string' ? body.slug : undefined,
    canonicalUrl: typeof body.canonicalUrl === 'string' ? body.canonicalUrl : null,
    robotsIndex: typeof body.robotsIndex === 'boolean' ? body.robotsIndex : undefined,
    robotsFollow: typeof body.robotsFollow === 'boolean' ? body.robotsFollow : undefined,
    ogTitle: typeof body.ogTitle === 'string' ? body.ogTitle : null,
    ogDescription: typeof body.ogDescription === 'string' ? body.ogDescription : null,
    ogImage: typeof body.ogImage === 'string' ? body.ogImage : null,
    twitterTitle: typeof body.twitterTitle === 'string' ? body.twitterTitle : null,
    twitterDescription: typeof body.twitterDescription === 'string' ? body.twitterDescription : null,
    twitterImage: typeof body.twitterImage === 'string' ? body.twitterImage : null,
    focusKeyword: typeof body.focusKeyword === 'string' ? body.focusKeyword : null,
    secondaryKeywordsJson: Array.isArray(body.secondaryKeywords) ? JSON.stringify(body.secondaryKeywords) : undefined,
    schemaType: typeof body.schemaType === 'string' ? body.schemaType : null,
    schemaJson: body.schemaJson ? (typeof body.schemaJson === 'string' ? body.schemaJson : JSON.stringify(body.schemaJson)) : undefined,
    hreflangJson: body.hreflang ? JSON.stringify(body.hreflang) : undefined,
  };
}

async function dashboard() {
  const [metadata, redirects, sitemap, audits] = await Promise.all([
    db.seoMetadata.findMany(),
    db.seoRedirect.count({ where: { isActive: true } }),
    db.seoSitemapEntry.count({ where: { includeInSitemap: true } }),
    db.seoAudit.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);
  return {
    total_indexable_pages: metadata.filter((item) => item.robotsIndex).length,
    missing_meta_title_count: metadata.filter((item) => !item.seoTitle).length,
    missing_meta_description_count: metadata.filter((item) => !item.metaDescription).length,
    duplicate_title_count: metadata.length - new Set(metadata.map((item) => item.seoTitle).filter(Boolean)).size,
    duplicate_description_count: metadata.length - new Set(metadata.map((item) => item.metaDescription).filter(Boolean)).size,
    poor_seo_score_count: metadata.filter((item) => (item.seoScore || 0) < 60).length,
    sitemap_url_count: sitemap,
    active_redirect_count: redirects,
    recent_audits: audits,
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, 'seo.view');
  if (forbidden) return forbidden;

  try {
    if (path[0] === 'dashboard') return Response.json(await dashboard());
    if (path[0] === 'settings') {
      return Response.json(await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }));
    }
    if (path[0] === 'robots') {
      const settings = await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
      return Response.json({ robotsTxt: settings.robotsTxt });
    }
    if (path[0] === 'metadata') {
      if (path[1]) return Response.json(await db.seoMetadata.findUnique({ where: { id: path[1] } }));
      return Response.json(await db.seoMetadata.findMany({ orderBy: { updatedAt: 'desc' } }));
    }
    if (path[0] === 'products' || path[0] === 'categories' || path[0] === 'pages') {
      const entityType = path[0] === 'products' ? 'PRODUCT' : path[0] === 'categories' ? 'CATEGORY' : 'PAGE';
      if (path[1]) return Response.json(await db.seoMetadata.findFirst({ where: { entityType, entityId: path[1] } }));
      return Response.json(await db.seoMetadata.findMany({ where: { entityType }, orderBy: { updatedAt: 'desc' } }));
    }
    if (path[0] === 'audits') {
      if (path[1]) return Response.json(await db.seoAudit.findUnique({ where: { id: path[1] } }));
      return Response.json(await db.seoAudit.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }));
    }
    if (path[0] === 'redirects') {
      if (path[1]) return Response.json(await db.seoRedirect.findUnique({ where: { id: path[1] } }));
      return Response.json(await db.seoRedirect.findMany({ orderBy: { updatedAt: 'desc' } }));
    }
    if (path[0] === 'sitemap') {
      return Response.json(await db.seoSitemapEntry.findMany({ orderBy: { url: 'asc' } }));
    }
    if (path[0] === 'image-alts') {
      return Response.json(await db.seoImageAlt.findMany({ orderBy: { updatedAt: 'desc' } }));
    }
    if (path.length >= 2) {
      const [entityType, entityId] = path;
      return Response.json(await db.seoMetadata.findFirst({ where: { entityType: entityType.toUpperCase(), entityId } }));
    }
    return jsonError('SEO endpoint not found', 404);
  } catch (error) {
    console.error('SEO GET error:', error);
    return jsonError('SEO request failed', 500);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path.includes('audit') ? 'seo.audit' : path.includes('generate-ai') ? 'seo.use_ai' : 'seo.update');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (path[0] === 'metadata') {
      const data = metadataData(body);
      if (!data.entityType || !data.seoTitle || !data.metaDescription || !data.slug) return jsonError('entityType, seoTitle, metaDescription, and slug are required', 400);
      return Response.json(await db.seoMetadata.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          seoTitle: data.seoTitle,
          metaDescription: data.metaDescription,
          slug: data.slug,
          metaKeywords: data.metaKeywords,
          canonicalUrl: data.canonicalUrl,
          robotsIndex: data.robotsIndex,
          robotsFollow: data.robotsFollow,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          twitterTitle: data.twitterTitle,
          twitterDescription: data.twitterDescription,
          twitterImage: data.twitterImage,
          focusKeyword: data.focusKeyword,
          secondaryKeywordsJson: data.secondaryKeywordsJson,
          schemaType: data.schemaType,
          schemaJson: data.schemaJson,
          hreflangJson: data.hreflangJson,
        },
      }), { status: 201 });
    }
    if (path[0] === 'redirects') {
      return Response.json(await db.seoRedirect.create({
        data: {
          sourcePath: String(body.sourcePath || ''),
          targetPath: String(body.targetPath || ''),
          statusCode: Number(body.statusCode || 301),
          isActive: body.isActive !== false,
        },
      }), { status: 201 });
    }
    if (path[0] === 'sitemap' && path[1] === 'regenerate') {
      const metadata = await db.seoMetadata.findMany({ where: { robotsIndex: true } });
      const entries = await Promise.all(metadata.map((item) => db.seoSitemapEntry.upsert({
        where: { url: `/${item.slug}` },
        create: { url: `/${item.slug}`, entityType: item.entityType, entityId: item.entityId, lastModified: item.updatedAt },
        update: { entityType: item.entityType, entityId: item.entityId, lastModified: item.updatedAt, includeInSitemap: true },
      })));
      return Response.json({ entries });
    }
    if (path[0] === 'image-alts') {
      if (path[1] === 'generate-ai') {
        return Response.json(await generateAIContent('IMAGE_ALT_TEXT', body));
      }
      return Response.json(await db.seoImageAlt.create({
        data: {
          entityType: String(body.entityType || 'CUSTOM'),
          entityId: String(body.entityId || 'custom'),
          imageUrl: String(body.imageUrl || ''),
          altText: String(body.altText || ''),
          titleText: typeof body.titleText === 'string' ? body.titleText : null,
        },
      }), { status: 201 });
    }
    if (path.length >= 3 && path[2] === 'audit') {
      const entityType = path[0].toUpperCase();
      const entityId = path[1];
      const metadata = await db.seoMetadata.findFirst({ where: { entityType, entityId } });
      const imageAlts = await db.seoImageAlt.findMany({ where: { entityType, entityId } });
      const internalLinks = await db.seoInternalLink.findMany({ where: { sourceEntityType: entityType, sourceEntityId: entityId } });
      const result = auditSeo({ ...metadata, imageAlts, internalLinks });
      const audit = await db.seoAudit.create({
        data: {
          entityType,
          entityId,
          score: result.score,
          status: result.status,
          issuesJson: JSON.stringify(result.issues),
          suggestionsJson: JSON.stringify(result.suggestions),
        },
      });
      if (metadata) {
        await db.seoMetadata.update({ where: { id: metadata.id }, data: { seoScore: result.score, lastAuditedAt: new Date() } });
      }
      return Response.json({ audit, result });
    }
    if (path.length >= 3 && path[2] === 'generate-ai-suggestions') {
      return Response.json(await generateAIContent('PRODUCT_SEO', { ...body, entityType: path[0], entityId: path[1] }));
    }
    if (path.length >= 3 && path[2] === 'apply-ai-suggestions') {
      return Response.json({ ok: true, message: 'Review required before applying AI suggestions. Use PATCH metadata with selected fields.' });
    }
    if (path[0] === 'audit' && path[1] === 'bulk') {
      const metadata = await db.seoMetadata.findMany();
      const results = await Promise.all(metadata.map(async (item) => {
        const result = auditSeo(item);
        return db.seoAudit.create({
          data: {
            entityType: item.entityType,
            entityId: item.entityId,
            score: result.score,
            status: result.status,
            issuesJson: JSON.stringify(result.issues),
            suggestionsJson: JSON.stringify(result.suggestions),
          },
        });
      }));
      return Response.json({ results });
    }
    return jsonError('SEO POST endpoint not found', 404);
  } catch (error) {
    console.error('SEO POST error:', error);
    return jsonError(error instanceof Error ? error.message : 'SEO request failed', 400);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path[0] === 'redirects' ? 'seo.manage_redirects' : path[0] === 'robots' ? 'seo.manage_robots' : path[0] === 'settings' ? 'seo.manage_settings' : 'seo.update');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (path[0] === 'settings') return Response.json(await db.seoSetting.upsert({ where: { id: 'default' }, create: { id: 'default' }, update: body }));
    if (path[0] === 'robots') {
      const robotsTxt = String(body.robotsTxt || '');
      if (!robotsTxt.includes('User-agent')) return jsonError('robots.txt must include User-agent', 400);
      return Response.json(await db.seoSetting.upsert({ where: { id: 'default' }, create: { id: 'default', robotsTxt }, update: { robotsTxt } }));
    }
    if (path[0] === 'metadata' && path[1]) return Response.json(await db.seoMetadata.update({ where: { id: path[1] }, data: metadataData(body) }));
    if (path[0] === 'redirects' && path[1]) return Response.json(await db.seoRedirect.update({ where: { id: path[1] }, data: body }));
    if (path[0] === 'sitemap' && path[1] === 'entries' && path[2]) return Response.json(await db.seoSitemapEntry.update({ where: { id: path[2] }, data: body }));
    if (path[0] === 'image-alts' && path[1]) return Response.json(await db.seoImageAlt.update({ where: { id: path[1] }, data: body }));
    if (path[0] === 'products' || path[0] === 'categories') {
      const entityType = path[0] === 'products' ? 'PRODUCT' : 'CATEGORY';
      const entityId = path[1];
      if (!entityId) return jsonError('Entity id is required', 400);
      const data = metadataData({ ...body, entityType, entityId });
      return Response.json(await db.seoMetadata.upsert({
        where: { entityType_entityId: { entityType, entityId } },
        create: {
          entityType,
          entityId,
          seoTitle: String(body.seoTitle || ''),
          metaDescription: String(body.metaDescription || ''),
          slug: String(body.slug || entityId),
          metaKeywords: data.metaKeywords,
          canonicalUrl: data.canonicalUrl,
          robotsIndex: data.robotsIndex,
          robotsFollow: data.robotsFollow,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          twitterTitle: data.twitterTitle,
          twitterDescription: data.twitterDescription,
          twitterImage: data.twitterImage,
          focusKeyword: data.focusKeyword,
          secondaryKeywordsJson: data.secondaryKeywordsJson,
          schemaType: data.schemaType,
          schemaJson: data.schemaJson,
          hreflangJson: data.hreflangJson,
        },
        update: data,
      }));
    }
    return jsonError('SEO PATCH endpoint not found', 404);
  } catch (error) {
    console.error('SEO PATCH error:', error);
    return jsonError(error instanceof Error ? error.message : 'SEO update failed', 400);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path[0] === 'redirects' ? 'seo.manage_redirects' : 'seo.update');
  if (forbidden) return forbidden;

  try {
    if (path[0] === 'metadata' && path[1]) await db.seoMetadata.delete({ where: { id: path[1] } });
    else if (path[0] === 'redirects' && path[1]) await db.seoRedirect.delete({ where: { id: path[1] } });
    else return jsonError('SEO DELETE endpoint not found', 404);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('SEO DELETE error:', error);
    return jsonError('SEO delete failed', 400);
  }
}
