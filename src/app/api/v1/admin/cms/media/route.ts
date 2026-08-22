import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { db } from '@/lib/db';

const maxUploadBytes = 4 * 1024 * 1024;

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['video/mp4', 'mp4'],
  ['video/webm', 'webm'],
  ['video/quicktime', 'mov'],
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

  const declaredLength = Number.parseInt(request.headers.get('content-length') || '0', 10);
  if (Number.isFinite(declaredLength) && declaredLength > maxUploadBytes + 256 * 1024) {
    return Response.json({ error: 'Media must be smaller than 4 MB' }, { status: 413 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const altText = String(formData.get('altText') || '').trim().slice(0, 250);
  if (!(file instanceof File)) return Response.json({ error: 'Media file is required' }, { status: 400 });
  if (file.size > maxUploadBytes) return Response.json({ error: 'Media must be smaller than 4 MB' }, { status: 413 });

  const extension = allowedTypes.get(file.type);
  if (!extension) return Response.json({ error: 'Use JPG, PNG, WebP, GIF, MP4, WebM, or MOV media' }, { status: 400 });

  const baseName = path.basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'media';
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  let fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;
  let url: string;

  if (token) {
    const blob = await put(`cms/${baseName}.${extension}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });
    url = blob.url;
    fileName = path.posix.basename(new URL(blob.url).pathname);
  } else {
    if (process.env.NODE_ENV === 'production') {
      return Response.json(
        { error: 'Media storage is not configured. Set BLOB_READ_WRITE_TOKEN.' },
        { status: 503 },
      );
    }

    const directory = path.join(process.cwd(), 'public', 'uploads', 'cms');
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));
    url = `/uploads/cms/${fileName}`;
  }

  const asset = await db.mediaAsset.create({
    data: { name: file.name.slice(0, 180), fileName, url, mimeType: file.type, size: file.size, altText },
  });
  return Response.json({ data: asset }, { status: 201 });
}
