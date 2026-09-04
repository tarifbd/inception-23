'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import { prepareHomepageJump, scrollToHomepageTargetWhenReady } from '@/lib/homepage-jump';
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
      if (window.location.hash) {
        document.documentElement.classList.add('homepage-jump-layout');
        reveal();
      }
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
    prepareHomepageJump();
    return scrollToHomepageTargetWhenReady(id, false);
  }, [ready]);

  return (
    <div ref={sentinelRef}>
      {ready ? <DeferredLandingPageSections sections={sections} collections={collections} /> : null}
    </div>
  );
}
