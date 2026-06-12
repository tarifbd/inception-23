import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { db } from '@/lib/db';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.view');
  if (forbidden) return forbidden;
  const assets = await db.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ data: assets });
}

export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  const formData = await request.formData();
  const file = formData.get('file');
  const altText = String(formData.get('altText') || '').trim().slice(0, 250);
  if (!(file instanceof File)) return Response.json({ error: 'Image file is required' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: 'Image must be smaller than 8 MB' }, { status: 400 });

  const extension = allowedTypes.get(file.type);
  if (!extension) return Response.json({ error: 'Use JPG, PNG, WebP, or GIF images' }, { status: 400 });

  const baseName = path.basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'image';
  const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;
  const directory = path.join(process.cwd(), 'public', 'uploads', 'cms');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));

  const url = `/uploads/cms/${fileName}`;
  const asset = await db.mediaAsset.create({
    data: { name: file.name.slice(0, 180), fileName, url, mimeType: file.type, size: file.size, altText },
  });
  return Response.json({ data: asset }, { status: 201 });
}
