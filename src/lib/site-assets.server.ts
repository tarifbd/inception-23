import 'server-only';

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import type { SiteAsset, SiteAssetKind } from '@/lib/site-asset-types';

const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.lottie': 'application/zip',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

function getAssetKind(extension: string, relativePath: string): SiteAssetKind {
  if (['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp'].includes(extension)) return 'image';
  if (['.mp4', '.mov', '.webm'].includes(extension)) return 'video';
  if (extension === '.lottie' || (extension === '.json' && relativePath.startsWith('animations/'))) return 'animation';
  if (['.woff', '.woff2'].includes(extension)) return 'font';
  if (extension === '.pdf') return 'document';
  if (['.wasm', '.webmanifest'].includes(extension)) return 'system';
  return 'other';
}

async function walk(directory: string, root: string): Promise<SiteAsset[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = await Promise.all(entries.map(async (entry): Promise<SiteAsset[]> => {
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) return [];
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolutePath, root);
    if (!entry.isFile()) return [];

    const file = await stat(absolutePath);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join('/');
    const extension = path.extname(entry.name).toLowerCase();
    return [{
      id: `built-in:${relativePath}`,
      name: path.basename(entry.name, extension),
      fileName: entry.name,
      url: `/${relativePath}`,
      mimeType: mimeTypes[extension] || 'application/octet-stream',
      extension: extension.slice(1) || 'file',
      size: file.size,
      altText: '',
      kind: getAssetKind(extension, relativePath),
      source: 'built-in',
      readOnly: true,
      usage: [],
      createdAt: file.mtime.toISOString(),
    }];
  }));

  return assets.flat();
}

export async function getBuiltInSiteAssets() {
  const publicDirectory = path.join(process.cwd(), 'public');
  return (await walk(publicDirectory, publicDirectory)).sort((left, right) => left.url.localeCompare(right.url));
}

