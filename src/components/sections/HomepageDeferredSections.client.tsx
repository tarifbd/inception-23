'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { WebsiteCollections } from '@/lib/website-collections';

const DeferredLandingPageSections = dynamic(
  () => import('./LandingPageSections').then((module) => module.LandingPageSections),
  { ssr: false },
);

export function HomepageDeferredSections({
  sections,
  collections,
}: {
  sections: HomepageSectionContent[];
  collections: WebsiteCollections;
}) {
  const [ready, setReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ready) return;

    let timer = 0;
    let idleHandle = 0;
    let observer: IntersectionObserver | undefined;
    const reveal = () => setReady(true);
    const revealForJump = () => reveal();
    const revealForHash = () => {
      if (window.location.hash) reveal();
    };
    const scheduleIdleReveal = () => {
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleHandle = window.requestIdleCallback(reveal, { timeout: 3200 });
          return;
        }
        reveal();
      }, 2600);
    };

    if ('IntersectionObserver' in window && sentinelRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { rootMargin: '900px 0px' },
      );
      observer.observe(sentinelRef.current);
    }

    if (document.readyState === 'complete') scheduleIdleReveal();
    else window.addEventListener('load', scheduleIdleReveal, { once: true });
    window.addEventListener('homepage:jump-request', revealForJump);
    window.addEventListener('hashchange', revealForHash);
    revealForHash();

    return () => {
      observer?.disconnect();
      window.removeEventListener('load', scheduleIdleReveal);
      window.removeEventListener('homepage:jump-request', revealForJump);
      window.removeEventListener('hashchange', revealForHash);
      window.clearTimeout(timer);
      if (idleHandle) window.cancelIdleCallback?.(idleHandle);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || !window.location.hash) return;

    const id = decodeURIComponent(window.location.hash.slice(1));
    let attempts = 0;
    let timer = 0;
    const alignTarget = () => {
      const target = document.getElementById(id);
      if (target) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        root.style.scrollBehavior = previousScrollBehavior;
      }

      attempts += 1;
      if (attempts < 32) timer = window.setTimeout(alignTarget, 120);
    };

    alignTarget();
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <div ref={sentinelRef}>
      {ready ? <DeferredLandingPageSections sections={sections} collections={collections} /> : null}
    </div>
  );
}
