import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resourceDestination } from '@/lib/resources';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const rateLimit = checkRateLimit(request, {
    key: 'resource-access',
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many download requests. Please try again shortly.' },
      { status: 429, headers: rateLimit.headers },
    );
  }

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
    const response = NextResponse.redirect(new URL(`/resources/${slug}`, request.url));
    Object.entries(rateLimit.headers).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }

  const source = (request.headers.get('x-resource-source') || 'resource-page')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .slice(0, 50) || 'resource-page';

  await db.$transaction([
    db.resource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } },
    }),
    db.resourceAccessEvent.create({
      data: {
        resourceId: resource.id,
        source,
        referrer: request.headers.get('referer')?.slice(0, 500) || null,
        userAgent: request.headers.get('user-agent')?.slice(0, 500) || null,
      },
    }),
  ]);

  const response = NextResponse.redirect(new URL(destination, request.url));
  Object.entries(rateLimit.headers).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}
