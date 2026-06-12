import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { assertCmsSlug, getVideoEmbedUrl, sanitizeCmsHtml } from '@/lib/cms';
import { assertString, optionalString, readJson } from '@/lib/api/http';
import { db } from '@/lib/db';

type PageInput = {
  title?: unknown;
  slug?: unknown;
  navigationLabel?: unknown;
  excerpt?: unknown;
  bodyHtml?: unknown;
  heroImage?: unknown;
  videoUrl?: unknown;
  template?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  isPublished?: unknown;
};

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.view');
  if (forbidden) return forbidden;

  const pages = await db.cmsPage.findMany({ orderBy: { updatedAt: 'desc' } });
  return Response.json({ data: pages });
}

export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<PageInput>(request);
    const title = assertString(body.title, 'title', 180);
    const slug = assertCmsSlug(assertString(body.slug, 'slug', 180));
    const videoUrl = optionalString(body.videoUrl, 500);
    const isPublished = body.isPublished === true;
    const page = await db.cmsPage.create({
      data: {
        title,
        slug,
        navigationLabel: optionalString(body.navigationLabel, 100),
        excerpt: typeof body.excerpt === 'string' ? body.excerpt.trim().slice(0, 500) : '',
        bodyHtml: sanitizeCmsHtml(typeof body.bodyHtml === 'string' ? body.bodyHtml.slice(0, 100000) : ''),
        heroImage: optionalString(body.heroImage, 500),
        videoUrl,
        videoEmbedUrl: getVideoEmbedUrl(videoUrl),
        template: typeof body.template === 'string' ? body.template : 'standard',
        seoTitle: optionalString(body.seoTitle, 180),
        seoDescription: optionalString(body.seoDescription, 320),
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    return Response.json({ data: page }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create page';
    return Response.json(
      { error: message.includes('Unique constraint') ? 'That page URL already exists' : message },
      { status: message.includes('Unique constraint') ? 409 : 400 },
    );
  }
}
