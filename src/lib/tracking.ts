import { revalidateTag, unstable_cache } from 'next/cache';
import { db } from '@/lib/db';

export const trackingSettingKey = 'tracking.integrations.v1';

export const trackingProviders = [
  { id: 'google', label: 'Google / GA4 / Ads', publicIdLabel: 'Measurement or Ads ID', serverSecretLabel: 'Measurement Protocol API secret' },
  { id: 'facebook', label: 'Meta / Facebook', publicIdLabel: 'Pixel ID', serverSecretLabel: 'CAPI access token' },
  { id: 'linkedin', label: 'LinkedIn Insight', publicIdLabel: 'Partner ID', serverSecretLabel: 'Conversion API token' },
  { id: 'tiktok', label: 'TikTok Pixel', publicIdLabel: 'Pixel ID', serverSecretLabel: 'Events API token' },
  { id: 'x', label: 'X / Twitter Ads', publicIdLabel: 'Pixel ID', serverSecretLabel: 'Conversion API token' },
  { id: 'clarity', label: 'Microsoft Clarity', publicIdLabel: 'Project ID', serverSecretLabel: 'Not required' },
  { id: 'bing', label: 'Microsoft Ads / UET', publicIdLabel: 'UET Tag ID', serverSecretLabel: 'Offline conversion token' },
  { id: 'pinterest', label: 'Pinterest Tag', publicIdLabel: 'Tag ID', serverSecretLabel: 'Conversion API token' },
  { id: 'snapchat', label: 'Snap Pixel', publicIdLabel: 'Pixel ID', serverSecretLabel: 'Conversions API token' },
  { id: 'reddit', label: 'Reddit Pixel', publicIdLabel: 'Pixel ID', serverSecretLabel: 'Conversions API token' },
  { id: 'quora', label: 'Quora Pixel', publicIdLabel: 'Pixel ID', serverSecretLabel: 'Conversion API token' },
] as const;

export type TrackingProviderId = (typeof trackingProviders)[number]['id'];

export type TrackingProviderConfig = {
  id: TrackingProviderId;
  label: string;
  enabled: boolean;
  publicId: string;
  accessToken: string;
  apiSecret: string;
  eventSourceId: string;
  testEventCode: string;
  sendPageView: boolean;
  sendLead: boolean;
  sendContact: boolean;
  customEndpoint: string;
  customHeadersJson: string;
};

export type TrackingSettings = {
  enabled: boolean;
  serverSideEnabled: boolean;
  consentMode: 'granted' | 'denied' | 'manual';
  providers: Record<TrackingProviderId, TrackingProviderConfig>;
};

export type PublicTrackingProvider = Pick<
  TrackingProviderConfig,
  'id' | 'label' | 'enabled' | 'publicId' | 'eventSourceId' | 'sendPageView' | 'sendLead' | 'sendContact'
>;

export type PublicTrackingSettings = {
  enabled: boolean;
  serverSideEnabled: boolean;
  consentMode: TrackingSettings['consentMode'];
  providers: PublicTrackingProvider[];
};

export type TrackingEventPayload = {
  eventName?: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  userAgent?: string;
  clientId?: string;
  email?: string;
  phone?: string;
  value?: number;
  currency?: string;
  customData?: Record<string, unknown>;
};

export const defaultTrackingSettings: TrackingSettings = {
  enabled: false,
  serverSideEnabled: true,
  consentMode: 'manual',
  providers: trackingProviders.reduce((providers, provider) => {
    providers[provider.id] = {
      id: provider.id,
      label: provider.label,
      enabled: false,
      publicId: '',
      accessToken: '',
      apiSecret: '',
      eventSourceId: '',
      testEventCode: '',
      sendPageView: true,
      sendLead: true,
      sendContact: true,
      customEndpoint: '',
      customHeadersJson: '',
    };
    return providers;
  }, {} as Record<TrackingProviderId, TrackingProviderConfig>),
};

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function isConsentMode(value: unknown): value is TrackingSettings['consentMode'] {
  return value === 'granted' || value === 'denied' || value === 'manual';
}

export function normalizeTrackingSettings(input: unknown): TrackingSettings {
  const source = input && typeof input === 'object' ? input as Partial<TrackingSettings> : {};
  const sourceProviders = source.providers && typeof source.providers === 'object' ? source.providers as Partial<Record<TrackingProviderId, Partial<TrackingProviderConfig>>> : {};
  const defaults = defaultTrackingSettings;

  const providers = trackingProviders.reduce((acc, provider) => {
    const previous = sourceProviders[provider.id] || {};
    const fallback = defaults.providers[provider.id];
    acc[provider.id] = {
      id: provider.id,
      label: provider.label,
      enabled: asBoolean(previous.enabled, fallback.enabled),
      publicId: asString(previous.publicId),
      accessToken: asString(previous.accessToken),
      apiSecret: asString(previous.apiSecret),
      eventSourceId: asString(previous.eventSourceId),
      testEventCode: asString(previous.testEventCode),
      sendPageView: asBoolean(previous.sendPageView, fallback.sendPageView),
      sendLead: asBoolean(previous.sendLead, fallback.sendLead),
      sendContact: asBoolean(previous.sendContact, fallback.sendContact),
      customEndpoint: asString(previous.customEndpoint),
      customHeadersJson: asString(previous.customHeadersJson),
    };
    return acc;
  }, {} as Record<TrackingProviderId, TrackingProviderConfig>);

  return {
    enabled: asBoolean(source.enabled, defaults.enabled),
    serverSideEnabled: asBoolean(source.serverSideEnabled, defaults.serverSideEnabled),
    consentMode: isConsentMode(source.consentMode) ? source.consentMode : defaults.consentMode,
    providers,
  };
}

const trackingCacheTag = 'tracking-settings';

export const getTrackingSettings = unstable_cache(
  async () => {
    const setting = await db.siteSetting.findUnique({ where: { key: trackingSettingKey } });
    if (!setting) return defaultTrackingSettings;

    try {
      return normalizeTrackingSettings(JSON.parse(setting.value));
    } catch {
      return defaultTrackingSettings;
    }
  },
  ['tracking-settings-v1'],
  { revalidate: 300, tags: [trackingCacheTag] },
);

export async function saveTrackingSettings(settings: TrackingSettings) {
  const payload = normalizeTrackingSettings(settings);
  await db.siteSetting.upsert({
    where: { key: trackingSettingKey },
    update: { value: JSON.stringify(payload), group: 'tracking' },
    create: { key: trackingSettingKey, value: JSON.stringify(payload), group: 'tracking' },
  });
  revalidateTag(trackingCacheTag);
  return payload;
}

export function toPublicTrackingSettings(settings: TrackingSettings): PublicTrackingSettings {
  return {
    enabled: settings.enabled,
    serverSideEnabled: settings.serverSideEnabled,
    consentMode: settings.consentMode,
    providers: trackingProviders
      .map((provider) => settings.providers[provider.id])
      .filter((provider) => provider.enabled && provider.publicId)
      .map(({ id, label, enabled, publicId, eventSourceId, sendPageView, sendLead, sendContact }) => ({
        id,
        label,
        enabled,
        publicId,
        eventSourceId,
        sendPageView,
        sendLead,
        sendContact,
      })),
  };
}

export function providerSupportsEvent(provider: TrackingProviderConfig, eventName: string) {
  const event = eventName.toLowerCase();
  if (event.includes('lead')) return provider.sendLead;
  if (event.includes('contact') || event.includes('submit')) return provider.sendContact;
  if (event.includes('page')) return provider.sendPageView;
  return true;
}
