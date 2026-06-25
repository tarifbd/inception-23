'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { aboutMenu, industriesMenu, insightsMenu, mainNav, servicesMenu, solutionMenu } from '@/lib/constants/navigation';
import { serviceThemes } from '@/lib/constants/theme';
import { HeaderCTA } from './HeaderCTA';
import { HeaderToggles } from './HeaderToggles';
import { MobileAccordionMenu, MobileMenuLink } from './MobileAccordionMenu';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  navItems?: ReadonlyArray<{ label: string; href: string; menu?: string }>;
};

export function MobileNav({ open, onClose, navItems }: MobileNavProps) {
  const items = navItems ?? mainNav;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] overflow-hidden bg-white/95 backdrop-blur-2xl xl:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.15),transparent_32%),radial-gradient(circle_at_88%_14%,rgba(16,185,129,0.13),transparent_28%),radial-gradient(circle_at_70%_95%,rgba(244,63,94,0.1),transparent_30%)]" />
          <motion.div
            initial={{ y: -18 }}
            animate={{ y: 0 }}
            exit={{ y: -18 }}
            transition={{ duration: 0.24 }}
            className="relative flex h-[100svh] flex-col overflow-y-auto overscroll-contain px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
                  <Image
                    src="/inception23-mark.png"
                    alt="Inception 23 mark"
                    width={96}
                    height={96}
                    priority
                    className="h-full w-full object-contain"
                    sizes="48px"
                  />
                </span>
                <span className="min-w-0 overflow-hidden leading-none">
                  <span className="block truncate text-sm font-black uppercase tracking-[0.18em] text-brand-950 min-[380px]:text-base min-[380px]:tracking-[0.22em]">
                    Inception 23
                  </span>
                  <span className="mt-1 block truncate text-[0.4rem] font-black uppercase tracking-[0.12em] text-slate-500 min-[380px]:text-[0.44rem]">
                    Where <span className="text-orange-600">new beginnings</span> create the future
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-950 shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-700/15"
              >
                <X size={20} />
              </button>
            </div>

            <HeaderToggles className="mb-4 w-fit" />

            <div className="grid gap-3">
              <MobileMenuLink href="/" onClick={onClose}>Home</MobileMenuLink>

              <MobileAccordionMenu title="Services" defaultOpen>
                {servicesMenu.map((item) => {
                  const theme = serviceThemes[item.key];
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      className={`rounded-2xl border px-4 py-3 transition ${theme.border} ${theme.bg} ${theme.text}`}
                    >
                      <span className="block text-sm font-black">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">{item.description}</span>
                    </Link>
                  );
                })}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Solutions">
                {solutionMenu.map((item) => (
                  <MobileMenuLink key={item.title} href={item.href} onClick={onClose}>{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Industries">
                {industriesMenu.map((item) => (
                  <MobileMenuLink key={item.label} href={item.href} onClick={onClose}>{item.label}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Insights">
                {insightsMenu.map((item) => (
                  <MobileMenuLink key={item.label} href={item.href} onClick={onClose}>{item.label}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="About">
                {aboutMenu.map((item) => (
                  <MobileMenuLink key={item.label} href={item.href} onClick={onClose}>{item.label}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              {items.filter((item) => !('menu' in item && item.menu) && item.label.toLowerCase() !== 'home').map((item) => (
                <MobileMenuLink key={item.label} href={item.href} onClick={onClose}>{item.label}</MobileMenuLink>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <HeaderCTA onClick={onClose} className="w-full py-4" />
              <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Advisory / Consulting / Solutions
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
