import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const resource = await db.resource.findFirst({
    where: { slug, isPublished: true },
  });

  if (!resource) {
    return Response.json({ error: 'Resource not found' }, { status: 404 });
  }

  return Response.json({ data: resource });
}
