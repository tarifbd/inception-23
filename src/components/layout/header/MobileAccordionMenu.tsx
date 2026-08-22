'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type MobileAccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  index: string;
  count?: number;
  accentClass?: string;
};

export function MobileAccordionMenu({ title, children, defaultOpen = false, index, count, accentClass = 'text-cyan-700 dark:text-cyan-300' }: MobileAccordionMenuProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden border-b border-slate-200 bg-white/55 first:border-t dark:border-white/10 dark:bg-white/[0.025]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex min-h-[4.4rem] w-full items-center gap-4 px-1 py-3 text-left text-brand-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/15 dark:text-white"
        aria-expanded={open}
      >
        <span className={`font-mono text-[9px] font-bold tabular-nums ${accentClass}`}>{index}</span>
        <span className="min-w-0 flex-1 font-serif text-[1.35rem] font-black leading-none">{title}</span>
        {typeof count === 'number' ? <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">{String(count).padStart(2, '0')}</span> : null}
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 transition group-hover:border-slate-300 dark:border-white/10 ${open ? 'bg-brand-950 text-white dark:bg-white dark:text-night-950' : 'text-slate-500 dark:text-slate-300'}`}>
          <ChevronDown size={16} className={`transition duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid border-t border-slate-200 dark:border-white/10">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function MobileMenuLink({ href, children, onClick, description, index, accentClass = 'text-cyan-700 dark:text-cyan-300' }: { href: string; children: React.ReactNode; onClick?: () => void; description?: string; index?: number; accentClass?: string }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group grid min-h-14 grid-cols-[1.5rem_1fr_auto] items-start gap-2 border-b border-slate-200 px-1 py-3.5 text-slate-700 transition last:border-b-0 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/15 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.04]"
    >
      <span className={`pt-0.5 font-mono text-[8px] font-bold tabular-nums ${accentClass}`}>{typeof index === 'number' ? String(index + 1).padStart(2, '0') : '—'}</span>
      <span>
        <span className="block text-sm font-bold leading-5 text-brand-950 dark:text-white">{children}</span>
        {description ? <span className="mt-1 block text-[11px] leading-[1.15rem] text-slate-500 dark:text-slate-400">{description}</span> : null}
      </span>
      <span className={`mt-1 h-1.5 w-1.5 bg-current transition-transform group-hover:scale-150 ${accentClass}`} aria-hidden="true" />
    </Link>
  );
}
