'use client';

import { useEffect, useRef, useState } from 'react';
import { List, X } from 'lucide-react';
import type { HomepageSectionNavItem } from './HomepageSectionNav';

export function SectionContents({ items, onJump }: { items: HomepageSectionNavItem[]; onJump: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = items.map((item) => ({ id: item.id, top: document.getElementById(item.id)?.getBoundingClientRect().top }))
        .filter((item): item is { id: string; top: number } => item.top !== undefined);
      const passed = sections.filter((item) => item.top <= 180);
      setActive(passed.at(-1)?.id || sections[0]?.id || '');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed right-0 top-1/2 z-[60] hidden -translate-y-1/2 sm:block"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button ref={toggle} type="button" aria-label="Table of contents" title="Table of contents"
        aria-expanded={open} aria-controls="homepage-contents" onClick={() => setOpen(true)}
        className="flex min-h-11 w-11 flex-col items-center gap-2.5 rounded-l-lg border-y border-l border-slate-200 bg-white/95 py-4 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-white/15 dark:bg-night-950/95">
        <List size={16} className="mb-1 text-slate-500" aria-hidden="true" />
        <span aria-hidden="true" className="flex max-h-[55dvh] flex-col items-start gap-2.5 overflow-hidden">
          {items.map((item, index) => <span key={item.id} className={`block h-[3px] rounded-full transition-colors ${active === item.id ? 'w-6 bg-slate-950 dark:bg-white' : `${index % 3 === 0 ? 'w-5' : 'w-3.5'} bg-slate-200 dark:bg-slate-600`}`} />)}
        </span>
      </button>
      {open ? (
        <nav id="homepage-contents" aria-label="Table of contents" className="absolute right-full top-1/2 max-h-[75dvh] w-[min(22rem,calc(100vw-4rem))] -translate-y-1/2 overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-white p-5 shadow-xl dark:border-white/15 dark:bg-night-950">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Table of contents</p>
            <button type="button" aria-label="Close table of contents" title="Close" onClick={() => { setOpen(false); toggle.current?.focus(); }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-slate-300 dark:hover:bg-white/10"><X size={16} /></button>
          </div>
          <ol className="space-y-1">
            {items.map((item) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}
              onClick={(event) => { event.preventDefault(); onJump(item.id); setOpen(false); toggle.current?.focus(); }}
              className={`block min-h-11 break-words rounded px-2 py-2.5 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${active === item.id ? 'bg-slate-100 font-semibold text-slate-950 dark:bg-white/10 dark:text-white' : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'}`}>{item.label}</a></li>)}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
