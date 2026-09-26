'use client';

import { useEffect, useRef, useState } from 'react';
import { setBrowserTracking, captureMetaClick, trackPublicAction } from '@/lib/meta/browser';
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
  window.gtag = window.gtag || function gtag() {
    // Google expects an Arguments object, not an array of command parameters.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', provider.publicId, { send_page_view: false });
}

function initFacebook(provider: PublicTrackingProvider) {
  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as QueuedTracker & {
      callMethod?: (...args: unknown[]) => void;
      loaded?: boolean;
      version?: string;
      queue: unknown[][];
      push?: unknown;
    };
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    window._fbq = fbq;
    injectScript('tracking-facebook-sdk', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  window.fbq?.('set', 'autoConfig', false, provider.publicId);
  window.fbq?.('consent', 'grant');
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
  if (provider.id === 'linkedin') window.lintrk?.('track');
  if (provider.id === 'tiktok') window.ttq?.page?.();
  if (provider.id === 'x') window.twq?.('event', 'PageView');
  if (provider.id === 'bing') window.uetq?.push('event', 'page_view', {});
  if (provider.id === 'pinterest') window.pintrk?.('page');
  if (provider.id === 'snapchat') window.snaptr?.('track', 'PAGE_VIEW');
  if (provider.id === 'reddit') window.rdt?.('track', 'PageVisit');
  if (provider.id === 'quora') window.qp?.('track', 'ViewContent');
}

const initializedProviders = new Set<string>();

export function TrackingScripts() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<PublicTrackingSettings | null>(null);
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);

  const previousUrl = useRef('');

  useEffect(() => {
    let mounted = true;
    let timer = 0;
    const loadSettings = () => {
      timer = window.setTimeout(() => {
        fetch('/api/tracking/config', { cache: 'no-store' })
          .then((response) => response.json())
          .then((payload) => {
            if (mounted) setSettings(payload.data);
          })
          .catch(() => undefined);
      }, 1200);
    };
    if (document.readyState === 'complete') loadSettings();
    else window.addEventListener('load', loadSettings, { once: true });
    return () => {
      mounted = false;
      window.removeEventListener('load', loadSettings);
      window.clearTimeout(timer);
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
    let saved: string | null = null;
    try { saved = window.localStorage.getItem('inception23:analytics-consent'); } catch {}
    setConsent(saved === 'granted' || saved === 'denied' ? saved : null);
  }, [settings]);

  useEffect(() => {
    const isPublic = !/^\/(admin|api|auth)(\/|$)/.test(pathname);
    setBrowserTracking(settings, consent === 'granted' && isPublic);
    if (!settings?.enabled || consent !== 'granted' || !isPublic) {
      window.fbq?.('consent', 'revoke');
      return;
    }
    captureMetaClick();
    settings.providers.forEach((provider) => {
      if (!provider.browserEnabled) return;
      const key = `${provider.id}:${provider.publicId}`;
      if (initializedProviders.has(key)) return;
      initializers[provider.id](provider);
      initializedProviders.add(key);
    });
    window.fbq?.('consent', 'grant');
  }, [consent, settings, pathname]);

  useEffect(() => {
    if (!settings?.enabled || consent !== 'granted' || /^\/(admin|api|auth)(\/|$)/.test(pathname)) return;
    const url = `${location.origin}${pathname}`;
    if (previousUrl.current === url) return;
    previousUrl.current = url;
    settings.providers.filter(p => p.browserEnabled).forEach(fireClientPageView);
    trackPublicAction('PageView');
  }, [consent, pathname, settings]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'inception23:analytics-consent' && settings?.consentMode === 'manual') {
        const choice = event.newValue === 'granted' ? 'granted' : 'denied';
        setBrowserTracking(settings, choice === 'granted');
        setConsent(choice);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [settings]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted) return;
      const anchor = (event.target as Element)?.closest?.('a[href]');
      const href = anchor?.getAttribute('href') || '';
      if (href.startsWith('mailto:')) trackPublicAction('Contact', 'email');
      else if (href.startsWith('tel:')) trackPublicAction('Contact', 'phone');
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackPublicAction('Contact', 'whatsapp');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const updateConsent = (choice: 'granted' | 'denied') => {
    try { window.localStorage.setItem('inception23:analytics-consent', choice); } catch {}
    setBrowserTracking(settings, choice === 'granted');
    if (choice === 'denied') {
      window.fbq?.('consent', 'revoke');
      for (const name of ['_fbp', '_fbc']) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
    setConsent(choice);
  };

  if (!settings?.enabled || settings.consentMode !== 'manual' || pathname.startsWith('/admin')) return null;
  if (consent !== null) return <button type="button" className="fixed bottom-2 left-2 z-[90] rounded bg-white px-3 py-2 text-xs text-slate-800 shadow" onClick={() => { updateConsent('denied'); setConsent(null); }}>Privacy preferences</button>;

  return (
    <section
      aria-label="Privacy preferences"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-4xl flex-col gap-4 border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 text-[var(--color-text)] shadow-[var(--shadow-xl)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="max-w-2xl">
        <p className="m-0 text-sm font-semibold text-[var(--color-ink)]">Your privacy, your choice</p>
        <p className="mb-0 mt-1 text-sm leading-6">
          With your permission, we use analytics and Meta advertising measurement, including hashed email after successful forms. Necessary site functions work either way.
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
