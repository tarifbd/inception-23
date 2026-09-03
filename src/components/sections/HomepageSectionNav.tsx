'use client';

import { useMemo } from 'react';
import { Compass } from 'lucide-react';

export type HomepageSectionNavItem = {
  id: string;
  label: string;
};

export function HomepageSectionNav({ items }: { items: HomepageSectionNavItem[] }) {
  const sectionItems = useMemo(
    () => items.filter((item) => item.id && item.label),
    [items],
  );

  if (!sectionItems.length) return null;

  const handleJump = (id: string) => {
    if (!id) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.history.replaceState(null, '', `#${id}`);
    window.dispatchEvent(new Event('homepage:jump-request'));

    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Homepage sections"
      className="sticky top-[5.25rem] z-[55] border-y border-slate-200 bg-white/90 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-night-950/88 sm:top-[5.75rem]"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div data-homepage-jump-label className="hidden shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-700 dark:text-cyan-300 sm:flex">
          <Compass size={15} aria-hidden="true" />
          Jump to
        </div>

        <label className="relative flex min-w-0 flex-1 sm:hidden">
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

        <div className="hidden min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex">
          {sectionItems.map((item) => (
            <a
              data-homepage-jump-link
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                handleJump(item.id);
              }}
              className="ui-nav-link inline-flex min-h-10 shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-brand-950 focus:outline-none focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-200 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-300/10"
            >
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
