import type { NextRequest } from 'next/server';
import { readJson } from '@/lib/api/http';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { dispatchTrackingEvent } from '@/lib/tracking-dispatch';
import { getTrackingSettings, type TrackingEventPayload } from '@/lib/tracking';

export const dynamic = 'force-dynamic';

function cleanEventPayload(input: unknown, request: NextRequest): TrackingEventPayload {
  const body = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const asString = (value: unknown, maxLength = 500) => (
    typeof value === 'string' ? value.trim().slice(0, maxLength) || undefined : undefined
  );
  const asNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined);
  const rawCustomData = body.customData && typeof body.customData === 'object' && !Array.isArray(body.customData)
    ? body.customData as Record<string, unknown>
    : {};
  const customData: Record<string, string | number | boolean | null> = {};
  Object.entries(rawCustomData).slice(0, 30).forEach(([key, value]) => {
    const safeKey = key.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 64);
    if (!safeKey) return;
    if (typeof value === 'string') customData[safeKey] = value.slice(0, 500);
    if (typeof value === 'number' && Number.isFinite(value)) customData[safeKey] = value;
    if (typeof value === 'boolean' || value === null) customData[safeKey] = value;
  });
  const eventName = (asString(body.eventName, 64) || 'PageView')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .slice(0, 64) || 'PageView';

  return {
    eventName,
    eventId: asString(body.eventId, 128),
    url: asString(body.url, 2048),
    referrer: asString(body.referrer, 2048),
    userAgent: asString(body.userAgent, 512) || request.headers.get('user-agent')?.slice(0, 512) || undefined,
    clientId: asString(body.clientId, 128),
    email: asString(body.email, 254),
    phone: asString(body.phone, 40),
    value: asNumber(body.value),
    currency: asString(body.currency, 8)?.toUpperCase(),
    customData: Object.keys(customData).length ? customData : undefined,
  };
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    key: 'tracking-event',
    limit: 120,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return Response.json(
      { ok: false, error: 'Rate limit exceeded.' },
      { status: 429, headers: rateLimit.headers },
    );
  }

  try {
    const input = await readJson<Record<string, unknown>>(request, 32 * 1024);
    if (input.consent !== 'granted') {
      return new Response(null, { status: 204, headers: rateLimit.headers });
    }
    const payload = cleanEventPayload(input, request);
    const results = await dispatchTrackingEvent(await getTrackingSettings(), payload);
    return Response.json(
      { ok: true, deliveredTo: results.filter((result) => result.sent).map((result) => result.provider) },
      { headers: rateLimit.headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body';
    if (!clientError) console.error('Tracking event dispatch failed:', error);
    return Response.json(
      { ok: false, error: clientError ? message : 'Could not dispatch tracking event.' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500, headers: rateLimit.headers },
    );
  }
}
