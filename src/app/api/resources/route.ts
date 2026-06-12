import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search')?.trim() || '';
  const category = request.nextUrl.searchParams.get('category')?.trim() || '';
  const type = request.nextUrl.searchParams.get('type')?.trim() || '';
  const featured = request.nextUrl.searchParams.get('featured') === 'true';
  const requestedPage = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const requestedLimit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '12', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 12;

  const where = {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(type ? { resourceType: type } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { excerpt: { contains: search } },
              { category: { contains: search } },
              { resourceType: { contains: search } },
              { audience: { contains: search } },
              { tagsJson: { contains: search } },
            ],
          }
        : {}),
  };

  const [resources, total] = await Promise.all([
    db.resource.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      resourceType: true,
      audience: true,
      tagsJson: true,
      coverImage: true,
      fileUrl: true,
      externalUrl: true,
      isFeatured: true,
      publishedAt: true,
      downloadCount: true,
      readingMinutes: true,
    },
    }),
    db.resource.count({ where }),
  ]);

  return Response.json({
    data: resources,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
