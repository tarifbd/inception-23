'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type MobileAccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function MobileAccordionMenu({ title, children, defaultOpen = false }: MobileAccordionMenuProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 shadow-sm backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-xl font-black text-brand-950 focus:outline-none focus:ring-4 focus:ring-brand-700/15"
        aria-expanded={open}
      >
        {title}
        <ChevronDown size={19} className={`shrink-0 text-brand-700 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="grid gap-2 border-t border-slate-200 px-4 pb-4 pt-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function MobileMenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-950 focus:outline-none focus:ring-4 focus:ring-brand-700/15"
    >
      {children}
    </Link>
  );
}
