import { db } from '@/lib/db';
import { siteConfig } from '@/lib/site';
import { buildRobots } from '@/lib/seo/indexing';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await db.seoSetting.findUnique({ where: { id: 'default' } }).catch(() => null);
  const body = buildRobots(settings?.robotsTxt?.trim(), siteConfig.url);

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
