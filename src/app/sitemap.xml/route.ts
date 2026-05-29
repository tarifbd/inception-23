import { db } from '@/lib/db';

export async function GET() {
  const settings = await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  if (!settings.enableAutoSitemap) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  const entries = await db.seoSitemapEntry.findMany({ where: { includeInSitemap: true }, orderBy: { url: 'asc' } });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006';
  const urls = entries.map((entry) => {
    const loc = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url.startsWith('/') ? entry.url : `/${entry.url}`}`;
    return `<url><loc>${loc}</loc><priority>${entry.priority.toFixed(1)}</priority><changefreq>${entry.changeFrequency}</changefreq>${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ''}</url>`;
  });

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
