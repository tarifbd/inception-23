import { after, type NextRequest } from 'next/server';
import { readJson } from '@/lib/api/http';
import { isSameOriginMutation } from '@/lib/admin/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { dispatchTrackingEvent } from '@/lib/tracking-dispatch';
import { getTrackingSettings } from '@/lib/tracking';
import { requestTracking, safeDrainMeta } from '@/lib/meta/server';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return new Response(null, { status: 403 });
  const rate = checkRateLimit(request, { key: 'tracking-event', limit: 120, windowMs: 60000 });
  if (!rate.allowed) return new Response(null, { status: 429, headers: rate.headers });
  try {
    const input = await readJson<Record<string, unknown>>(request, 4096);
    const context = requestTracking(request, input);
    const settings = await getTrackingSettings();
    if (!context.consent || settings.consentMode === 'denied') return new Response(null, { status: 204 });
    // Conversions originate only from successful business API operations.
    if (!['PageView', 'Contact'].includes(String(input.eventName)) || !context.url
      || typeof input.eventId !== 'string' || !/^[a-zA-Z0-9:_-]{16,128}$/.test(input.eventId)) {
      return Response.json({ error: 'Invalid tracking event' }, { status: 400 });
    }
    const channel = typeof input.channel === 'string' && ['email', 'phone', 'whatsapp'].includes(input.channel) ? input.channel : undefined;
    if (input.eventName === 'Contact' && !channel) return new Response(null, { status: 400 });
    await dispatchTrackingEvent(settings, { ...context, eventName: String(input.eventName), eventId: input.eventId,
      customData: channel ? { content_name: channel } : undefined });
    after(safeDrainMeta);
    return Response.json({ ok: true, status: 'triggered' }, { headers: rate.headers });
  } catch {
    console.error('meta_capi: public tracking request failed');
    return Response.json({ error: 'Tracking unavailable' }, { status: 400 });
  }
}
