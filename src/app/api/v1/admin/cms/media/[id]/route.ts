import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { del } from '@vercel/blob';
import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { db } from '@/lib/db';

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  const { id } = await context.params;
  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return Response.json({ error: 'Media asset not found' }, { status: 404 });

  if (asset.url.startsWith('https://') && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(asset.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } else if (asset.url.startsWith('/uploads/cms/')) {
    const uploadsDirectory = path.resolve(process.cwd(), 'public', 'uploads', 'cms');
    const targetPath = path.resolve(uploadsDirectory, asset.fileName);
    if (targetPath.startsWith(`${uploadsDirectory}${path.sep}`)) {
      await unlink(targetPath).catch(() => undefined);
    }
  }

  await db.mediaAsset.delete({ where: { id } });
  return Response.json({ success: true });
}
