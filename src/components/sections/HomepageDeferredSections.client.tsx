'use client';

import { useEffect, type ReactNode } from 'react';
import { prepareHomepageJump, scrollToHomepageTargetWhenReady } from '@/lib/homepage-jump';

export function HomepageDeferredSections({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (!window.location.hash) return;
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    prepareHomepageJump();
    return scrollToHomepageTargetWhenReady(id, false);
  }, []);

  return (
    <div>{children}</div>
  );
}
