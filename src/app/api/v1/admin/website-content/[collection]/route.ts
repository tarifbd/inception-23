import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { readJson } from '@/lib/api/http';
import {
  collectionDefinitions,
  getDefaultCollection,
  getWebsiteCollection,
  isCollectionId,
  saveWebsiteCollection,
  type CollectionRecord,
} from '@/lib/website-collections';

export async function GET(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  const forbidden = requirePermission(request, 'cms.view');
  if (forbidden) return forbidden;
  const { collection } = await context.params;
  if (!isCollectionId(collection)) return Response.json({ error: 'Unknown content collection' }, { status: 404 });
  return Response.json({
    data: await getWebsiteCollection(collection),
    definition: collectionDefinitions[collection],
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;
  const { collection } = await context.params;
  if (!isCollectionId(collection)) return Response.json({ error: 'Unknown content collection' }, { status: 404 });
  const body = await readJson<{ records?: unknown }>(request, 512 * 1024);
  if (!Array.isArray(body.records)) return Response.json({ error: 'records must be an array' }, { status: 400 });
  if (body.records.length > 250) return Response.json({ error: 'A collection can contain at most 250 records' }, { status: 400 });
  if (body.records.some((record) => !record || typeof record !== 'object' || Array.isArray(record))) {
    return Response.json({ error: 'Every record must be an object' }, { status: 400 });
  }
  return Response.json({ data: await saveWebsiteCollection(collection, body.records as CollectionRecord[]) });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;
  const { collection } = await context.params;
  if (!isCollectionId(collection)) return Response.json({ error: 'Unknown content collection' }, { status: 404 });
  await saveWebsiteCollection(collection, getDefaultCollection(collection));
  return Response.json({ data: getDefaultCollection(collection) });
}
