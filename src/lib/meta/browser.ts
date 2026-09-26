'use client';

import type { PublicTrackingSettings } from '@/lib/tracking';

let settings: PublicTrackingSettings | null = null;
let granted = false;
const sent = new Set<string>();
export function setBrowserTracking(value: PublicTrackingSettings | null, consent: boolean) {
  settings = value;
  granted = consent;
}
export function trackingContext() {
  if (!settings?.enabled || !granted || /^\/(admin|api|auth)(\/|$)/.test(location.pathname)) return undefined;
  const url = `${location.origin}${location.pathname}`;
  return { consent: 'granted', url };
}
export function captureMetaClick() {
  if (!trackingContext() || !settings?.providers.some(p => p.id === 'facebook')) return;
  const click = new URL(location.href).searchParams.get('fbclid');
  if (click && /^[A-Za-z0-9_-]{1,400}$/.test(click)) {
    const previous = document.cookie.split('; ').find(c => c.startsWith('_fbc='))?.slice(5);
    if (!previous?.endsWith(`.${click}`)) document.cookie = `_fbc=fb.1.${Date.now()}.${click}; Path=/; Max-Age=7776000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }
}
export function fireMetaBrowser(eventName: string, eventId: string, customData: Record<string, unknown> = {}) {
  if (!trackingContext()) return;
  const provider = settings?.providers.find(p => p.id === 'facebook');
  if (!provider?.browserEnabled || !provider.publicId || !window.fbq) return;
  if (eventName === 'Lead' && !provider.sendLead || eventName === 'Contact' && !provider.sendContact || eventName === 'PageView' && !provider.sendPageView) return;
  const key = `${eventName}:${eventId}`;
  if (sent.has(key)) return;
  sent.add(key);
  if (sent.size > 1000) sent.delete(sent.values().next().value!);
  window.fbq('trackSingle', provider.publicId, eventName, customData, { eventID: eventId });
}
export function trackPublicAction(eventName: 'PageView' | 'Contact', channel?: string) {
  try {
    const context = trackingContext();
    if (!context) return;
    captureMetaClick();
    const eventId = crypto.randomUUID();
    fireMetaBrowser(eventName, eventId, channel ? { content_name: channel } : {});
    if (!settings?.serverSideEnabled) return;
    const body = JSON.stringify({ ...context, eventName, eventId, channel });
    const beacon = navigator.sendBeacon?.('/api/tracking/event', new Blob([body], { type: 'application/json' }));
    if (!beacon) void fetch('/api/tracking/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  } catch { /* Analytics must never interrupt navigation or business actions. */ }
}

// Keep one request key for the same form data across network retries and refreshes.
export async function submitTrackedForm(url: '/api/contact' | '/api/newsletter', payload: Record<string, unknown>) {
  let requestKey: string | undefined;
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
    const key = `inception23:submission:${url}:${Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')}`;
    requestKey = sessionStorage.getItem(key) || crypto.randomUUID();
    sessionStorage.setItem(key, requestKey);
  } catch { requestKey = crypto.randomUUID(); }
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, requestKey, tracking: trackingContext() }) });
  if (response.ok) {
    try {
      const { tracking } = await response.clone().json();
      if (tracking?.eventName === 'Lead' && typeof tracking.eventId === 'string') {
        const key = `inception23:conversion:${tracking.eventId}`;
        if (!sessionStorage.getItem(key)) {
          fireMetaBrowser('Lead', tracking.eventId, tracking.customData);
          sessionStorage.setItem(key, 'sent');
        }
      }
    } catch { /* The successful form response remains successful. */ }
  }
  return response;
}
