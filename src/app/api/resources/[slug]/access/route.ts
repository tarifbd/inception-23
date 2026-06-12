import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resourceDestination } from '@/lib/resources';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const resource = await db.resource.findFirst({
    where: { slug, isPublished: true },
    select: { id: true, fileUrl: true, externalUrl: true },
  });

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }

  const destination = resourceDestination(resource);
  if (!destination) {
    return NextResponse.redirect(new URL(`/resources/${slug}`, request.url));
  }

  await db.$transaction([
    db.resource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } },
    }),
    db.resourceAccessEvent.create({
      data: {
        resourceId: resource.id,
        source: request.headers.get('x-resource-source') || 'resource-page',
        referrer: request.headers.get('referer')?.slice(0, 500) || null,
        userAgent: request.headers.get('user-agent')?.slice(0, 500) || null,
      },
    }),
  ]);

  return NextResponse.redirect(new URL(destination, request.url));
}
