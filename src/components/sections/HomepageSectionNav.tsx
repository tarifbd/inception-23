'use client';

import { useEffect, useMemo, useRef } from 'react';
import { prepareHomepageJump, scrollToHomepageTargetWhenReady } from '@/lib/homepage-jump';

export type HomepageSectionNavItem = {
  id: string;
  label: string;
};

export function HomepageSectionNav({ items }: { items: HomepageSectionNavItem[] }) {
  const cancelJumpRef = useRef<null | (() => void)>(null);
  const sectionItems = useMemo(
    () => items.filter((item) => item.id && item.label),
    [items],
  );

  useEffect(() => () => cancelJumpRef.current?.(), []);

  if (!sectionItems.length) return null;

  const handleJump = (id: string) => {
    if (!id) return;
    cancelJumpRef.current?.();
    window.history.replaceState(null, '', `#${id}`);
    prepareHomepageJump();
    cancelJumpRef.current = scrollToHomepageTargetWhenReady(id);
  };

  return (
    <nav
      aria-label="Homepage sections"
      className="sticky top-[5.25rem] z-[55] border-y border-slate-200 bg-white/90 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-night-950/88 sm:hidden"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-2.5">
        <label className="relative flex min-w-0 flex-1">
          <span className="sr-only">Jump to section</span>
          <select
            data-homepage-jump-select
            defaultValue=""
            onChange={(event) => handleJump(event.currentTarget.value)}
            className="ui-field h-11 min-h-11 w-full rounded-lg bg-white px-3 text-sm font-bold text-brand-950 dark:bg-night-900 dark:text-white"
          >
            <option value="" disabled>Jump to section</option>
            {sectionItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  );
}
