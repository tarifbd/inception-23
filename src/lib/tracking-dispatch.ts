import { createHash } from 'crypto';
import { safeExternalHttpsUrl } from '@/lib/security/url';
import type { TrackingEventPayload, TrackingProviderConfig, TrackingSettings } from '@/lib/tracking';
import { providerSupportsEvent, trackingProviders } from '@/lib/tracking';

type DispatchResult = {
  provider: string;
  sent: boolean;
  status?: number;
  error?: string;
};

function hashValue(value?: string) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? createHash('sha256').update(normalized).digest('hex') : undefined;
}

function eventNameForProvider(eventName: string, providerId: string) {
  if (providerId === 'tiktok') {
    if (eventName === 'PageView') return 'Pageview';
    if (eventName === 'Lead') return 'SubmitForm';
  }
  return eventName;
}

function parseHeaders(headersJson: string) {
  const forbiddenHeaders = new Set([
    'connection',
    'content-length',
    'cookie',
    'host',
    'origin',
    'referer',
    'transfer-encoding',
  ]);
  if (!headersJson.trim()) return {};
  try {
    const parsed = JSON.parse(headersJson);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([key, value]) => (
          typeof value === 'string'
          && key.length <= 100
          && !forbiddenHeaders.has(key.toLowerCase())
        ))
        .map(([key, value]) => [key, String(value).slice(0, 2000)]),
    ) as Record<string, string>;
  } catch {
    return {};
  }
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(6000),
  });
  return response;
}

async function sendGoogle(provider: TrackingProviderConfig, payload: TrackingEventPayload, eventName: string) {
  if (!provider.publicId || !provider.apiSecret) return { provider: provider.id, sent: false, error: 'Missing Google ID or API secret' };
  const clientId = payload.clientId || payload.eventId || `${Date.now()}.${Math.floor(Math.random() * 100000)}`;
  const response = await postJson(
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(provider.publicId)}&api_secret=${encodeURIComponent(provider.apiSecret)}`,
    {
      client_id: clientId,
      events: [
        {
          name: eventName.toLowerCase(),
          params: {
            engagement_time_msec: 100,
            page_location: payload.url,
            page_referrer: payload.referrer,
            value: payload.value,
            currency: payload.currency,
            ...(payload.customData || {}),
          },
        },
      ],
    },
  );
  return { provider: provider.id, sent: response.ok, status: response.status };
}

async function sendFacebook(provider: TrackingProviderConfig, payload: TrackingEventPayload, eventName: string) {
  if (!provider.publicId || !provider.accessToken) return { provider: provider.id, sent: false, error: 'Missing Meta Pixel ID or CAPI token' };
  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: 'website',
    event_source_url: payload.url,
    user_data: {
      client_user_agent: payload.userAgent,
      em: hashValue(payload.email),
      ph: hashValue(payload.phone),
    },
    custom_data: {
      value: payload.value,
      currency: payload.currency,
      ...(payload.customData || {}),
    },
  };
  const body: Record<string, unknown> = { data: [event] };
  if (provider.testEventCode) body.test_event_code = provider.testEventCode;
  const response = await postJson(
    `https://graph.facebook.com/v20.0/${encodeURIComponent(provider.publicId)}/events?access_token=${encodeURIComponent(provider.accessToken)}`,
    body,
  );
  return { provider: provider.id, sent: response.ok, status: response.status };
}

async function sendTikTok(provider: TrackingProviderConfig, payload: TrackingEventPayload, eventName: string) {
  if (!provider.publicId || !provider.accessToken) return { provider: provider.id, sent: false, error: 'Missing TikTok Pixel ID or Events API token' };
  const response = await postJson(
    'https://business-api.tiktok.com/open_api/v1.3/event/track/',
    {
      event_source: 'web',
      event_source_id: provider.eventSourceId || provider.publicId,
      data: [
        {
          event: eventNameForProvider(eventName, provider.id),
          event_time: Math.floor(Date.now() / 1000),
          event_id: payload.eventId,
          page: { url: payload.url, referrer: payload.referrer },
          user: {
            email: hashValue(payload.email),
            phone: hashValue(payload.phone),
            user_agent: payload.userAgent,
          },
          properties: {
            value: payload.value,
            currency: payload.currency,
            ...(payload.customData || {}),
          },
        },
      ],
    },
    { 'Access-Token': provider.accessToken },
  );
  return { provider: provider.id, sent: response.ok, status: response.status };
}

async function sendCustom(provider: TrackingProviderConfig, payload: TrackingEventPayload, eventName: string) {
  if (!provider.customEndpoint) return { provider: provider.id, sent: false, error: 'No custom endpoint configured' };
  const endpoint = safeExternalHttpsUrl(provider.customEndpoint);
  if (!endpoint) return { provider: provider.id, sent: false, error: 'Custom endpoint must be a public HTTPS URL' };
  const response = await postJson(
    endpoint.toString(),
    {
      provider: provider.id,
      eventName,
      eventId: payload.eventId,
      url: payload.url,
      referrer: payload.referrer,
      userAgent: payload.userAgent,
      userData: {
        emailSha256: hashValue(payload.email),
        phoneSha256: hashValue(payload.phone),
      },
      value: payload.value,
      currency: payload.currency,
      customData: payload.customData || {},
    },
    parseHeaders(provider.customHeadersJson),
  );
  return { provider: provider.id, sent: response.ok, status: response.status };
}

export async function dispatchTrackingEvent(settings: TrackingSettings, payload: TrackingEventPayload): Promise<DispatchResult[]> {
  if (!settings.enabled || !settings.serverSideEnabled) return [];
  const eventName = payload.eventName || 'PageView';
  const results = await Promise.all(
    trackingProviders.map(async ({ id }) => {
      const provider = settings.providers[id];
      if (!provider.enabled || !providerSupportsEvent(provider, eventName)) return { provider: id, sent: false, error: 'Disabled or event not enabled' };
      try {
        if (provider.id === 'google') return await sendGoogle(provider, payload, eventName);
        if (provider.id === 'facebook') return await sendFacebook(provider, payload, eventName);
        if (provider.id === 'tiktok') return await sendTikTok(provider, payload, eventName);
        if (provider.customEndpoint) return await sendCustom(provider, payload, eventName);
        return { provider: provider.id, sent: false, error: 'Client pixel only unless custom endpoint is added' };
      } catch (error) {
        return { provider: provider.id, sent: false, error: error instanceof Error ? error.message : 'Dispatch failed' };
      }
    }),
  );
  return results.filter((result) => result.sent || result.error !== 'Disabled or event not enabled');
}
