import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { db } from '@/lib/db';
import { getHomepageContent } from '@/lib/homepage-content.server';
import { getBuiltInSiteAssets } from '@/lib/site-assets.server';
import { collectionDefinitions, getWebsiteCollections } from '@/lib/website-collections';

type ReferenceSource = { label: string; content: unknown };

function isReferenced(content: unknown, url: string) {
  const serialized = JSON.stringify(content);
  if (!serialized) return false;
  let decodedUrl = url;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    // Public filenames can contain a literal percent sign.
  }
  return serialized.includes(url) || serialized.includes(decodedUrl);
}

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.view');
  if (forbidden) return forbidden;

  const [assets, homepage, collections, pages, uploadedAssets] = await Promise.all([
    getBuiltInSiteAssets(),
    getHomepageContent(),
    getWebsiteCollections(),
    db.cmsPage.findMany({
      select: { title: true, heroImage: true, videoUrl: true, bodyHtml: true },
    }),
    db.mediaAsset.findMany({ select: { url: true } }),
  ]);

  const references: ReferenceSource[] = [
    { label: 'Homepage layout', content: homepage },
    ...Object.entries(collections).map(([id, content]) => ({
      label: collectionDefinitions[id as keyof typeof collectionDefinitions].title,
      content,
    })),
    ...pages.map((page) => ({ label: `Page: ${page.title}`, content: page })),
  ];
  const urls = [...new Set([...assets.map((asset) => asset.url), ...uploadedAssets.map((asset) => asset.url)])];
  const usage = Object.fromEntries(urls.map((url) => [
    url,
    references.filter((reference) => isReferenced(reference.content, url)).map((reference) => reference.label),
  ]));

  return Response.json({
    data: assets.map((asset) => ({ ...asset, usage: usage[asset.url] || [] })),
    usage,
  });
}
