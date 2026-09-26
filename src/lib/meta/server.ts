import { isIP } from 'node:net';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getTrackingSettings, providerSupportsEvent, type TrackingEventPayload, type TrackingSettings } from '@/lib/tracking';
import { buildMetaEvent, cleanMetaCookie, publicEventUrl, transmitMeta, type MetaEvent } from './core';
import { seal, unseal } from './secrets';

export function requestTracking(request: NextRequest, input: unknown) {
  const data = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const ip = process.env.TRACKING_TRUST_PROXY === 'true' ? (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() : '';
  return {
    consent: data.consent === 'granted',
    url: publicEventUrl(data.url, `${request.nextUrl.protocol}//${request.headers.get('host') || request.nextUrl.host}`),
    userAgent: request.headers.get('user-agent')?.slice(0, 512),
    clientIp: isIP(ip) ? ip : undefined,
    fbp: cleanMetaCookie(request.cookies.get('_fbp')?.value, 'fbp'),
    fbc: cleanMetaCookie(request.cookies.get('_fbc')?.value, 'fbc'),
  };
}

export async function enqueueMeta(settings: TrackingSettings, payload: TrackingEventPayload) {
  const provider = settings.providers.facebook;
  if (!settings.enabled || !settings.serverSideEnabled || settings.consentMode === 'denied'
    || !provider.enabled || !provider.capiEnabled || !providerSupportsEvent(provider, payload.eventName || '')
    || !provider.publicId || !provider.accessToken) return false;
  const event = buildMetaEvent(payload);
  await db.metaDelivery.upsert({ where: { id: event.event_id }, update: {},
    create: { id: event.event_id, eventName: event.event_name!, datasetId: provider.publicId,
      payload: seal(JSON.stringify(event)), testCode: provider.testEventCode } });
  return true;
}

// Durable outbox with database leases. Retry the original event ID and timestamp.
export async function drainMeta(limit = 10) {
  const settings = await getTrackingSettings();
  const provider = settings.providers.facebook;
  const now = new Date();
  await db.metaDelivery.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 7 * 86400000) } } });
  if (!settings.enabled || !settings.serverSideEnabled || settings.consentMode === 'denied' || !provider.enabled || !provider.capiEnabled) {
    await db.metaDelivery.updateMany({ where: { status: { in: ['pending', 'sending'] } }, data: { status: 'cancelled', payload: '', summary: 'Tracking disabled before delivery.' } });
    return;
  }
  if (!provider.accessToken) return;
  const rows = await db.metaDelivery.findMany({ where: { status: { in: ['pending', 'sending'] }, nextAttempt: { lte: now } }, take: limit, orderBy: { createdAt: 'asc' } });
  for (const row of rows) {
    if (row.datasetId !== provider.publicId || !providerSupportsEvent(provider, row.eventName) || (provider.debugMode && !row.testCode)) {
      await db.metaDelivery.update({ where: { id: row.id }, data: { status: 'cancelled', payload: '', summary: 'Tracking configuration changed before delivery.' } });
      continue;
    }
    const claimed = await db.metaDelivery.updateMany({ where: { id: row.id, status: { in: ['pending', 'sending'] }, nextAttempt: { lte: now } },
      data: { status: 'sending', attempts: { increment: 1 }, nextAttempt: new Date(Date.now() + 120000) } });
    if (!claimed.count) continue;
    let result;
    try { result = await transmitMeta(row.datasetId, provider.accessToken, JSON.parse(unseal(row.payload)) as MetaEvent, row.testCode); }
    catch { result = { accepted: false, retryable: false, summary: 'Stored event could not be decrypted. Check the tracking encryption key.', status: undefined, code: undefined }; }
    const retry = !result.accepted && result.retryable && row.attempts < 4;
    const status = result.accepted ? 'accepted' : retry ? 'pending' : 'failed';
    await db.metaDelivery.update({ where: { id: row.id }, data: { status, httpStatus: result.status, errorCode: result.code, summary: result.summary,
      nextAttempt: new Date(Date.now() + Math.min(3600000, 60000 * 2 ** row.attempts)), ...(!retry ? { payload: '' } : {}) } });
    console.info('meta_capi', { eventName: row.eventName, eventId: row.id, status, httpStatus: result.status, code: result.code });
  }
}

export async function safeDrainMeta() {
  try { await drainMeta(); } catch { console.error('meta_capi: outbox processing failed; check database and encryption configuration.'); }
}

export async function recordLead(request: NextRequest, tracking: unknown, id: string, email: string, kind: 'inquiry' | 'newsletter', permitted = true, createdAt = new Date()) {
  try {
    const context = requestTracking(request, tracking);
    if (!context.consent || !context.url || !permitted || Date.now() - createdAt.getTime() > 86400000) return undefined;
    const settings = await getTrackingSettings();
    const provider = settings.providers.facebook;
    if (!settings.enabled || settings.consentMode === 'denied' || !provider.enabled || !provider.sendLead) return undefined;
    const event = { eventName: 'Lead', eventId: `${kind}:${id}`, customData: { content_name: kind } };
    try { await enqueueMeta(settings, { ...event, ...context, email, eventTime: Math.floor(createdAt.getTime() / 1000) }); }
    catch { console.error('meta_capi: lead could not be queued; business submission is saved.'); }
    return event;
  } catch { console.error('meta_capi: lead tracking unavailable; business submission is saved.'); return undefined; }
}
