import { db } from '@/lib/db';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await db.seoSetting.findUnique({ where: { id: 'default' } }).catch(() => null);
  const configured = settings?.robotsTxt?.trim();
  const normalizedConfigured = configured
    ?.split(/\r?\n/)
    .filter((line) => !/^\s*(sitemap|host)\s*:/i.test(line))
    .join('\n')
    .trim();
  const requiredDirectives = [
    'Disallow: /admin/',
    'Disallow: /api/',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    `Host: ${siteConfig.url}`,
  ];
  const body = [
    normalizedConfigured || 'User-agent: *\nAllow: /',
    ...requiredDirectives.filter((directive) => !normalizedConfigured?.includes(directive)),
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
