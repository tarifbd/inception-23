import { createHash } from 'node:crypto';
import type { TrackingEventPayload } from '../tracking';

// Matches the current version in Meta's official Business SDK (September 2026).
export const META_API_VERSION = 'v26.0';
export const metaEvents = ['PageView', 'Contact', 'Lead'] as const;

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function cleanMetaCookie(value: unknown, kind: 'fbp' | 'fbc') {
  if (typeof value !== 'string' || value.length > 500) return undefined;
  const pattern = kind === 'fbp' ? /^fb\.\d\.\d{13}\.\d+$/ : /^fb\.\d\.\d{13}\.[A-Za-z0-9_-]+$/;
  return pattern.test(value) ? value : undefined;
}

export function publicEventUrl(value: unknown, origin: string) {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value, origin);
    if (url.origin !== new URL(origin).origin || !/^https?:$/.test(url.protocol)
      || /^\/(admin|api|auth)(\/|$)/.test(url.pathname)) return undefined;
    // Never forward query strings, fragments, credentials or submitted form text.
    return `${url.origin}${url.pathname}`;
  } catch { return undefined; }
}

export function buildMetaEvent(payload: TrackingEventPayload) {
  if (!metaEvents.includes(payload.eventName as typeof metaEvents[number]) || !payload.eventId || !payload.url) {
    throw new Error('Invalid Meta event');
  }
  const email = payload.email?.trim().toLowerCase();
  // The site does not collect a phone country code reliably. Omit ambiguous local numbers.
  const phone = payload.phone?.startsWith('+') ? payload.phone.replace(/\D/g, '') : undefined;
  return {
    event_name: payload.eventName,
    event_id: payload.eventId,
    event_time: payload.eventTime || Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: payload.url,
    user_data: {
      ...(email ? { em: [sha256(email)] } : {}),
      ...(phone && phone.length >= 8 && phone.length <= 15 ? { ph: [sha256(phone)] } : {}),
      ...(payload.clientIp ? { client_ip_address: payload.clientIp } : {}),
      ...(payload.userAgent ? { client_user_agent: payload.userAgent } : {}),
      ...(cleanMetaCookie(payload.fbp, 'fbp') ? { fbp: payload.fbp } : {}),
      ...(cleanMetaCookie(payload.fbc, 'fbc') ? { fbc: payload.fbc } : {}),
    },
    custom_data: payload.customData || {},
  };
}

export type MetaEvent = ReturnType<typeof buildMetaEvent>;
export type MetaResult = { accepted: boolean; status?: number; code?: number; retryable: boolean; summary: string };

export async function transmitMeta(pixelId: string, token: string, event: MetaEvent, testCode = '', transport = fetch): Promise<MetaResult> {
  try {
    const response = await transport(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(pixelId)}/events`, {
      method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(6000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: [event], ...(testCode ? { test_event_code: testCode } : {}) }),
    });
    const data = await response.json().catch(() => ({}));
    const accepted = response.ok && data.events_received === 1 && !data.error;
    const code = typeof data.error?.code === 'number' ? data.error.code : undefined;
    // Do not retain Meta's free-form message: it can echo credentials or customer data.
    return { accepted, status: response.status, code,
      retryable: response.status === 429 || response.status >= 500 || data.error?.is_transient === true,
      summary: accepted ? 'Meta accepted one server event; deduplication requires Events Manager verification.'
        : code === 190 ? 'Meta rejected the access token. Replace it in tracking settings.'
        : `Meta did not accept the event (HTTP ${response.status}${code ? `, code ${code}` : ''}). Check dataset permissions and event configuration.` };
  } catch {
    return { accepted: false, retryable: true, summary: 'Meta request timed out or the network request failed.' };
  }
}
