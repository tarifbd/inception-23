'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { PublicTrackingProvider, PublicTrackingSettings, TrackingProviderId } from '@/lib/tracking';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    lintrk?: (...args: unknown[]) => void;
    ttq?: Record<string, unknown> & { page?: () => void; track?: (event: string, data?: Record<string, unknown>) => void };
    twq?: (...args: unknown[]) => void;
    uetq?: unknown[];
    pintrk?: (...args: unknown[]) => void;
    snaptr?: (...args: unknown[]) => void;
    rdt?: (...args: unknown[]) => void;
    qp?: (...args: unknown[]) => void;
    clarity?: QueuedTracker;
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    TiktokAnalyticsObject?: string;
  }
}

function injectScript(id: string, src: string, onLoad?: () => void) {
  if (document.getElementById(id)) {
    onLoad?.();
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  script.referrerPolicy = 'strict-origin-when-cross-origin';
  if (onLoad) script.onload = onLoad;
  document.head.appendChild(script);
}

type QueuedTracker = ((...args: unknown[]) => void) & Record<string, unknown>;

function makeQueuedTracker(queueKey: string) {
  const tracker = ((...args: unknown[]) => {
    const queue = Array.isArray(tracker[queueKey]) ? tracker[queueKey] as unknown[] : [];
    queue.push(args);
    tracker[queueKey] = queue;
  }) as QueuedTracker;
  return tracker;
}

function initGoogle(provider: PublicTrackingProvider) {
  injectScript(`tracking-google-${provider.publicId}`, `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(provider.publicId)}`);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', provider.publicId, { send_page_view: false });
}

function initFacebook(provider: PublicTrackingProvider) {
  if (!window.fbq) {
    const fbq = makeQueuedTracker('queue') as QueuedTracker & { loaded?: boolean; version?: string; queue?: unknown[] };
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    window._fbq = fbq;
    injectScript('tracking-facebook-sdk', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  window.fbq?.('init', provider.publicId);
}

function initLinkedIn(provider: PublicTrackingProvider) {
  window._linkedin_partner_id = provider.publicId;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  if (!window._linkedin_data_partner_ids.includes(provider.publicId)) {
    window._linkedin_data_partner_ids.push(provider.publicId);
  }
  injectScript('tracking-linkedin-sdk', 'https://snap.licdn.com/li.lms-analytics/insight.min.js');
}

function initTikTok(provider: PublicTrackingProvider) {
  window.TiktokAnalyticsObject = 'ttq';
  const ttq = (window.ttq || []) as unknown as QueuedTracker & {
    methods?: string[];
    push?: (value: unknown) => number;
  };
  if (!window.ttq) window.ttq = ttq;
  ttq.methods = ttq.methods || [
    'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once',
    'ready', 'alias', 'group', 'enableCookie', 'disableCookie',
  ];
  ttq.methods.forEach((method) => {
    if (typeof ttq[method] !== 'function') {
      ttq[method] = (...args: unknown[]) => ttq.push?.([method, ...args]);
    }
  });
  injectScript(
    `tracking-tiktok-sdk-${encodeURIComponent(provider.publicId)}`,
    `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(provider.publicId)}&lib=ttq`,
  );
}

function initX(provider: PublicTrackingProvider) {
  if (!window.twq) {
    window.twq = makeQueuedTracker('exe');
    injectScript('tracking-x-sdk', 'https://static.ads-twitter.com/uwt.js');
  }
  window.twq('config', provider.publicId);
}

function initClarity(provider: PublicTrackingProvider) {
  window.clarity = window.clarity || makeQueuedTracker('q');
  injectScript(
    `tracking-clarity-${encodeURIComponent(provider.publicId)}`,
    `https://www.clarity.ms/tag/${encodeURIComponent(provider.publicId)}`,
  );
}

function initBing(provider: PublicTrackingProvider) {
  window.uetq = window.uetq || [];
  window.uetq.push('config', provider.publicId);
  injectScript('tracking-bing-sdk', 'https://bat.bing.com/bat.js');
}

function initPinterest(provider: PublicTrackingProvider) {
  if (!window.pintrk) {
    window.pintrk = makeQueuedTracker('queue');
    injectScript('tracking-pinterest-sdk', 'https://s.pinimg.com/ct/core.js');
  }
  window.pintrk('load', provider.publicId);
}

function initSnapchat(provider: PublicTrackingProvider) {
  if (!window.snaptr) {
    window.snaptr = makeQueuedTracker('handleRequest');
    injectScript('tracking-snapchat-sdk', 'https://sc-static.net/scevent.min.js');
  }
  window.snaptr('init', provider.publicId);
}

function initReddit(provider: PublicTrackingProvider) {
  if (!window.rdt) {
    window.rdt = makeQueuedTracker('sendEvent');
    injectScript('tracking-reddit-sdk', 'https://www.redditstatic.com/ads/pixel.js');
  }
  window.rdt('init', provider.publicId);
}

function initQuora(provider: PublicTrackingProvider) {
  if (!window.qp) {
    window.qp = makeQueuedTracker('q');
    injectScript('tracking-quora-sdk', 'https://a.quora.com/qevents.js');
  }
  window.qp('init', provider.publicId);
}

const initializers: Record<TrackingProviderId, (provider: PublicTrackingProvider) => void> = {
  google: initGoogle,
  facebook: initFacebook,
  linkedin: initLinkedIn,
  tiktok: initTikTok,
  x: initX,
  clarity: initClarity,
  bing: initBing,
  pinterest: initPinterest,
  snapchat: initSnapchat,
  reddit: initReddit,
  quora: initQuora,
};

function fireClientPageView(provider: PublicTrackingProvider) {
  if (!provider.sendPageView) return;
  if (provider.id === 'google') window.gtag?.('event', 'page_view', { page_location: window.location.href });
  if (provider.id === 'facebook') window.fbq?.('track', 'PageView');
  if (provider.id === 'linkedin') window.lintrk?.('track');
  if (provider.id === 'tiktok') window.ttq?.page?.();
  if (provider.id === 'x') window.twq?.('event', 'PageView');
  if (provider.id === 'bing') window.uetq?.push('event', 'page_view', {});
  if (provider.id === 'pinterest') window.pintrk?.('page');
  if (provider.id === 'snapchat') window.snaptr?.('track', 'PAGE_VIEW');
  if (provider.id === 'reddit') window.rdt?.('track', 'PageVisit');
  if (provider.id === 'quora') window.qp?.('track', 'ViewContent');
}

export function TrackingScripts() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<PublicTrackingSettings | null>(null);
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  const loadedProviderIds = useRef(new Set<string>());
  const previousUrl = useRef('');

  useEffect(() => {
    let mounted = true;
    fetch('/api/tracking/config', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (mounted) setSettings(payload.data);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!settings) return;
    if (settings.consentMode === 'granted') {
      setConsent('granted');
      return;
    }
    if (settings.consentMode === 'denied') {
      setConsent('denied');
      return;
    }
    const saved = window.localStorage.getItem('inception23:analytics-consent');
    setConsent(saved === 'granted' || saved === 'denied' ? saved : null);
  }, [settings]);

  useEffect(() => {
    if (!settings?.enabled || consent !== 'granted') return;
    settings.providers.forEach((provider) => {
      if (loadedProviderIds.current.has(provider.id)) return;
      initializers[provider.id](provider);
      loadedProviderIds.current.add(provider.id);
    });
  }, [consent, settings]);

  useEffect(() => {
    if (!settings?.enabled || consent !== 'granted') return;
    const url = window.location.href;
    if (previousUrl.current === url) return;
    previousUrl.current = url;

    settings.providers.forEach(fireClientPageView);
    if (settings.serverSideEnabled) {
      const beaconSent = navigator.sendBeacon?.(
        '/api/tracking/event',
        new Blob([
          JSON.stringify({
            eventName: 'PageView',
            eventId: crypto.randomUUID?.() || `${Date.now()}`,
            url,
            referrer: document.referrer,
            consent: 'granted',
          }),
        ], { type: 'application/json' }),
      ) ?? false;
      if (!beaconSent) {
        void fetch('/api/tracking/event', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'PageView',
            eventId: `${Date.now()}`,
            url,
            referrer: document.referrer,
            consent: 'granted',
          }),
        });
      }
    }
  }, [consent, pathname, settings]);

  if (!settings?.enabled || settings.consentMode !== 'manual' || consent !== null) return null;

  const updateConsent = (choice: 'granted' | 'denied') => {
    window.localStorage.setItem('inception23:analytics-consent', choice);
    setConsent(choice);
  };

  return (
    <section
      aria-label="Privacy preferences"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-4xl flex-col gap-4 border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 text-[var(--color-text)] shadow-[var(--shadow-xl)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="max-w-2xl">
        <p className="m-0 text-sm font-semibold text-[var(--color-ink)]">Your privacy, your choice</p>
        <p className="mb-0 mt-1 text-sm leading-6">
          We use optional analytics to understand site performance. Necessary site functions work either way.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => updateConsent('denied')}
          className="min-h-11 border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-support)]"
        >
          Necessary only
        </button>
        <button
          type="button"
          onClick={() => updateConsent('granted')}
          className="min-h-11 bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-support)] dark:text-[var(--color-canvas)]"
        >
          Accept analytics
        </button>
      </div>
    </section>
  );
}
