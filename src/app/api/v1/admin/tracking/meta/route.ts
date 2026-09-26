import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { db } from '@/lib/db';
import { getTrackingSettings } from '@/lib/tracking';
import { drainMeta } from '@/lib/meta/server';
import { META_API_VERSION } from '@/lib/meta/core';
import { readJson } from '@/lib/api/http';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.view');
  if (forbidden) return forbidden;
  const events = await db.metaDelivery.findMany({ take: 20, orderBy: { updatedAt: 'desc' },
    select: { id: true, eventName: true, status: true, attempts: true, httpStatus: true, errorCode: true, summary: true, updatedAt: true, testCode: true } });
  const lastTest = await db.siteSetting.findUnique({ where: { key: 'tracking.meta.connection' } });
  return Response.json({ events: events.map(({ testCode, ...event }) => ({ ...event, test: Boolean(testCode) })),
    lastTest: lastTest ? JSON.parse(lastTest.value) : null });
}
export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.manage');
  if (forbidden) return forbidden;
  const rate = checkRateLimit(request, { key: 'meta-admin', limit: 12, windowMs: 60000 });
  if (!rate.allowed) return new Response(null, { status: 429, headers: rate.headers });
  const input = await readJson<{ action?: string }>(request, 1024).catch(() => ({} as { action?: string }));
  if (input.action === 'drain') {
    try { await drainMeta(5); return Response.json({ message: 'Pending delivery processing completed. Refresh diagnostics for results.' }); }
    catch { return Response.json({ error: 'Delivery processing failed. Check server configuration.' }, { status: 500 }); }
  }
  if (input.action !== 'test') return new Response(null, { status: 400 });
  const { providers } = await getTrackingSettings();
  const meta = providers.facebook;
  if (!meta.publicId || !meta.accessToken) return Response.json({ error: 'Save a Pixel / Dataset ID and access token first.' }, { status: 400 });
  let result;
  try {
    const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(meta.publicId)}?fields=id`, {
      headers: { Authorization: `Bearer ${meta.accessToken}` }, signal: AbortSignal.timeout(6000), cache: 'no-store', redirect: 'error',
    });
    const data = await response.json().catch(() => ({}));
    const ok = response.ok && data.id === meta.publicId;
    result = { ok, httpStatus: response.status, timestamp: new Date().toISOString(),
      message: ok ? 'Dataset read connection accepted. No conversion was sent. Real CAPI delivery and deduplication remain unverified.'
        : 'Dataset read check failed. Check credentials and read permissions; this alone does not establish whether event publishing is allowed.' };
  } catch { result = { ok: false, timestamp: new Date().toISOString(), message: 'Connection timed out or network failed.' }; }
  await db.siteSetting.upsert({ where: { key: 'tracking.meta.connection' }, create: { key: 'tracking.meta.connection', group: 'tracking', value: JSON.stringify(result) }, update: { value: JSON.stringify(result) } });
  return Response.json(result);
}
