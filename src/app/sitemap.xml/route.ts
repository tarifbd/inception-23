import { db } from '@/lib/db';
import { services } from '@/lib/constants/services';
import { siteConfig } from '@/lib/site';
import { canonicalPageUrl } from '@/lib/seo/indexing';

export const dynamic = 'force-dynamic';

type SitemapItem = {
  url: string;
  priority: number;
  changeFrequency: string;
  lastModified?: Date | null;
};

const allowedFrequencies = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeSitemapUrl(value: string) {
  return canonicalPageUrl(value, siteConfig.url);
}

export async function GET() {
  const corePaths: SitemapItem[] = [
    { url: '/', priority: 1, changeFrequency: 'weekly' },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/featured-solutions', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/case-studies', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/insights', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/resources', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    ...services.map((service) => ({
      url: `/services/${service.slug}`,
      priority: 0.85,
      changeFrequency: 'monthly',
    })),
  ];

  let databaseItems: SitemapItem[] = [];
  const excluded = new Set<string>();
  try {
    const [settings, resources, pages, entries, metadata, redirects] = await Promise.all([
      db.seoSetting.findUnique({ where: { id: 'default' } }),
      db.resource.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      db.cmsPage.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      db.seoSitemapEntry.findMany({
        orderBy: { url: 'asc' },
      }),
      db.seoMetadata.findMany({ orderBy: { updatedAt: 'desc' }, select: { slug: true, robotsIndex: true, canonicalUrl: true } }),
      db.seoRedirect.findMany({ where: { isActive: true }, select: { sourcePath: true } }),
    ]);

    for (const entry of entries.filter((entry) => !entry.includeInSitemap)) {
      const url = normalizeSitemapUrl(entry.url);
      if (url) excluded.add(url);
    }
    const seenMetadata = new Set<string>();
    for (const entry of metadata) {
      if (!entry.slug.trim()) continue;
      const url = normalizeSitemapUrl(entry.slug);
      if (!url || seenMetadata.has(url)) continue;
      seenMetadata.add(url);
      const canonical = entry.canonicalUrl && normalizeSitemapUrl(entry.canonicalUrl);
      if (!entry.robotsIndex || (canonical && canonical !== url)) excluded.add(url);
    }
    for (const entry of redirects) {
      const url = normalizeSitemapUrl(entry.sourcePath);
      if (url) excluded.add(url);
    }
    const knownUrls = new Set([
      ...corePaths.map((item) => normalizeSitemapUrl(item.url)),
      ...resources.map((item) => normalizeSitemapUrl(`/resources/${item.slug}`)),
      ...pages.map((item) => normalizeSitemapUrl(`/${item.slug}`)),
    ]);

    if (settings?.enableAutoSitemap !== false) {
      databaseItems = [
        ...resources.map((resource) => ({
          url: `/resources/${resource.slug}`,
          priority: 0.7,
          changeFrequency: 'monthly',
          lastModified: resource.updatedAt,
        })),
        ...pages.map((page) => ({
          url: `/${page.slug}`,
          priority: 0.65,
          changeFrequency: 'monthly',
          lastModified: page.updatedAt,
        })),
        ...entries.filter((entry) => entry.includeInSitemap && knownUrls.has(normalizeSitemapUrl(entry.url))).map((entry) => ({
          url: entry.url,
          priority: Math.min(1, Math.max(0, entry.priority)),
          changeFrequency: allowedFrequencies.has(entry.changeFrequency) ? entry.changeFrequency : 'weekly',
          lastModified: entry.lastModified,
        })),
      ];
    }
  } catch (error) {
    console.error('Sitemap database entries unavailable:', error);
  }

  const deduplicated = new Map<string, SitemapItem>();
  [...corePaths, ...databaseItems].forEach((item) => {
    const url = normalizeSitemapUrl(item.url);
    if (!url || excluded.has(url)) return;
    const previous = deduplicated.get(url);
    if (!previous || item.priority >= previous.priority) deduplicated.set(url, { ...item, url });
  });

  const urls = Array.from(deduplicated.values())
    .sort((a, b) => a.url.localeCompare(b.url))
    .map(
      (item) =>
        `<url><loc>${escapeXml(item.url)}</loc><priority>${item.priority.toFixed(1)}</priority><changefreq>${item.changeFrequency}</changefreq>${item.lastModified ? `<lastmod>${item.lastModified.toISOString()}</lastmod>` : ''}</url>`,
    );

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
