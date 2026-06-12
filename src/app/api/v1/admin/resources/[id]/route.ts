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

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const forbidden = requirePermission(request, 'resources.manage');
  if (forbidden) return forbidden;

  try {
    const { id } = await context.params;
    const body = await readJson<ResourceInput>(request);
    const current = await db.resource.findUnique({ where: { id } });
    if (!current) return Response.json({ error: 'Resource not found' }, { status: 404 });

    const title = assertString(body.title, 'title', 180);
    const requestedSlug = optionalString(body.slug, 120);
    const slug = createResourceSlug(requestedSlug || title);
    const isPublished = body.isPublished === true;
    const content = assertString(body.content, 'content', 20000);
    const requestedReadingMinutes =
      typeof body.readingMinutes === 'number' && Number.isInteger(body.readingMinutes) && body.readingMinutes > 0
        ? Math.min(body.readingMinutes, 240)
        : null;

    const resource = await db.resource.update({
      where: { id },
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
        publishedAt: isPublished ? current.publishedAt || new Date() : null,
      },
    });

    return Response.json({ data: resource });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update resource';
    const status = message.includes('Unique constraint') ? 409 : 400;
    return Response.json({ error: status === 409 ? 'That resource slug already exists' : message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const forbidden = requirePermission(request, 'resources.manage');
  if (forbidden) return forbidden;

  const { id } = await context.params;
  const existing = await db.resource.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return Response.json({ error: 'Resource not found' }, { status: 404 });

  await db.resource.delete({ where: { id } });
  return Response.json({ success: true });
}
