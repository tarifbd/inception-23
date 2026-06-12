import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { assertString, optionalString, readJson } from '@/lib/api/http';
import { db } from '@/lib/db';
import { createResourceSlug, estimateReadingMinutes, serializeResourceTags } from '@/lib/resources';

type ResourceInput = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  content?: unknown;
  category?: unknown;
  resourceType?: unknown;
  audience?: unknown;
  tags?: unknown;
  coverImage?: unknown;
  fileUrl?: unknown;
  externalUrl?: unknown;
  accessLabel?: unknown;
  readingMinutes?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  isFeatured?: unknown;
  isPublished?: unknown;
};

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'resources.view');
  if (forbidden) return forbidden;

  const search = request.nextUrl.searchParams.get('search')?.trim() || '';
  const category = request.nextUrl.searchParams.get('category')?.trim() || '';
  const type = request.nextUrl.searchParams.get('type')?.trim() || '';
  const status = request.nextUrl.searchParams.get('status')?.trim() || '';

  const where = {
    ...(category ? { category } : {}),
    ...(type ? { resourceType: type } : {}),
    ...(status === 'published' ? { isPublished: true } : {}),
    ...(status === 'draft' ? { isPublished: false } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { slug: { contains: search } },
            { excerpt: { contains: search } },
            { tagsJson: { contains: search } },
          ],
        }
      : {}),
  };

  const [resources, total, published, totalAccesses, recentAccesses] = await Promise.all([
    db.resource.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
    }),
    db.resource.count(),
    db.resource.count({ where: { isPublished: true } }),
    db.resource.aggregate({ _sum: { downloadCount: true } }),
    db.resourceAccessEvent.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        source: true,
        createdAt: true,
        resource: { select: { title: true, slug: true } },
      },
    }),
  ]);

  return Response.json({
    data: resources,
    meta: {
      total,
      published,
      drafts: total - published,
      totalAccesses: totalAccesses._sum.downloadCount || 0,
      recentAccesses,
    },
  });
}

export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'resources.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<ResourceInput>(request);
    const title = assertString(body.title, 'title', 180);
    const requestedSlug = optionalString(body.slug, 120);
    const slug = createResourceSlug(requestedSlug || title);
    if (!slug) return Response.json({ error: 'A valid slug is required' }, { status: 400 });

    const isPublished = body.isPublished === true;
    const content = assertString(body.content, 'content', 20000);
    const requestedReadingMinutes =
      typeof body.readingMinutes === 'number' && Number.isInteger(body.readingMinutes) && body.readingMinutes > 0
        ? Math.min(body.readingMinutes, 240)
        : null;
    const resource = await db.resource.create({
      data: {
        slug,
        title,
        excerpt: assertString(body.excerpt, 'excerpt', 500),
        content,
        category: assertString(body.category, 'category', 80),
        resourceType: assertString(body.resourceType, 'resourceType', 80),
        audience: optionalString(body.audience, 180),
        tagsJson: serializeResourceTags(body.tags),
        coverImage: optionalString(body.coverImage, 500),
        fileUrl: optionalString(body.fileUrl, 500),
        externalUrl: optionalString(body.externalUrl, 500),
        accessLabel: optionalString(body.accessLabel, 80),
        readingMinutes: requestedReadingMinutes || estimateReadingMinutes(content),
        seoTitle: optionalString(body.seoTitle, 180),
        seoDescription: optionalString(body.seoDescription, 320),
        isFeatured: body.isFeatured === true,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return Response.json({ data: resource }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create resource';
    const status = message.includes('Unique constraint') ? 409 : 400;
    return Response.json({ error: status === 409 ? 'That resource slug already exists' : message }, { status });
  }
}
