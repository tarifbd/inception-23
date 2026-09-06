import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { siteConfig } from '@/lib/site';
import { canonicalPageUrl } from './indexing';
import { createPageMetadata, type PageMetadataInput } from './metadata';

const getOverrides = unstable_cache(
  () => db.seoMetadata.findMany({ orderBy: { updatedAt: 'desc' } }),
  ['public-seo-metadata-v1'],
  { revalidate: 300, tags: ['public-seo-metadata'] },
);

export async function createManagedMetadata(input: PageMetadataInput) {
  const canonical = canonicalPageUrl(input.path, siteConfig.url);
  const records = await getOverrides().catch(() => []);
  const record = records.find((item) => item.slug.trim() && canonicalPageUrl(item.slug, siteConfig.url) === canonical);
  if (!record || input.noIndex) return createPageMetadata(input);
  const metadata = createPageMetadata({
    ...input,
    title: record.seoTitle.trim() || input.title,
    description: record.metaDescription.trim() || input.description,
    image: record.ogImage || input.image,
    noIndex: !record.robotsIndex,
  });
  const managedCanonical = record.canonicalUrl && canonicalPageUrl(record.canonicalUrl, siteConfig.url);
  if (managedCanonical) metadata.alternates = { canonical: managedCanonical };
  metadata.robots = {
    index: record.robotsIndex,
    follow: record.robotsFollow,
    googleBot: { index: record.robotsIndex, follow: record.robotsFollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  };
  metadata.openGraph = {
    ...metadata.openGraph,
    url: managedCanonical || canonical || undefined,
    title: record.ogTitle || record.seoTitle || input.title,
    description: record.ogDescription || record.metaDescription || input.description,
  };
  metadata.twitter = {
    ...metadata.twitter,
    title: record.twitterTitle || record.seoTitle || input.title,
    description: record.twitterDescription || record.metaDescription || input.description,
    ...(record.twitterImage ? { images: [record.twitterImage] } : {}),
  };
  return metadata;
}
