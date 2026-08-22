'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { aboutMenu, eventManagementMenu, industriesMenu, insightsMenu, mainNav, resourcesMenu, servicesMenu, solutionMenu } from '@/lib/constants/navigation';
import { serviceThemes } from '@/lib/constants/theme';
import { HeaderCTA } from './HeaderCTA';
import { HeaderToggles } from './HeaderToggles';
import { MobileAccordionMenu, MobileMenuLink } from './MobileAccordionMenu';
import type { CmsMenuItem, MenuKind } from './MegaMenu';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  navItems?: ReadonlyArray<{ label: string; href: string; menu?: string }>;
  menuItems?: Partial<Record<MenuKind, CmsMenuItem[]>>;
};

export function MobileNav({ open, onClose, navItems, menuItems }: MobileNavProps) {
  const items = navItems ?? mainNav;
  const mobileMenus: Record<MenuKind, CmsMenuItem[]> = {
    services: menuItems?.services ?? servicesMenu.map((item) => ({ id: item.key, title: item.title, href: item.href, description: item.description, theme: item.key })),
    events: menuItems?.events ?? eventManagementMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description })),
    solutions: menuItems?.solutions ?? solutionMenu.map((item) => ({ id: item.title, title: item.title, href: item.href, description: item.description })),
    industries: menuItems?.industries ?? industriesMenu.map((item) => ({ id: item.label, title: item.label, href: item.href })),
    insights: menuItems?.insights ?? insightsMenu.map((item) => ({ id: item.label, title: item.label, href: item.href })),
    resources: menuItems?.resources ?? resourcesMenu.map((item) => ({ id: item.label, title: item.label, href: item.href })),
    about: menuItems?.about ?? aboutMenu.map((item) => ({ id: item.label, title: item.label, href: item.href })),
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.setAttribute('data-mobile-nav-open', 'true');

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.removeAttribute('data-mobile-nav-open');
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] overflow-hidden bg-[#f7f9f8] dark:bg-[#090d12] 2xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="absolute inset-x-0 top-0 grid h-1 grid-cols-4" aria-hidden="true">
            <span className="bg-cyan-500" />
            <span className="bg-emerald-500" />
            <span className="bg-violet-500" />
            <span className="bg-orange-500" />
          </div>
          <motion.div
            initial={{ y: -18 }}
            animate={{ y: 0 }}
            exit={{ y: -18 }}
            transition={{ duration: 0.24 }}
            className="relative mx-auto flex h-[100svh] w-full max-w-3xl flex-col overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8"
          >
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-white/10">
              <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center overflow-hidden bg-white p-1.5 ring-1 ring-slate-200 dark:ring-white/15">
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
                  <span className="block truncate text-sm font-black uppercase tracking-[0.18em] text-brand-950 dark:text-white min-[380px]:text-base min-[380px]:tracking-[0.22em]">
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
                className="flex h-11 w-11 items-center justify-center border border-slate-300 bg-white text-brand-950 transition hover:border-brand-950 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/40"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Navigation index</p>
                <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Seven capability groups</p>
              </div>
              <HeaderToggles className="shrink-0" />
            </div>

            <div className="mb-5 grid grid-cols-2 border-y border-slate-200 dark:border-white/10">
              <Link href={items.find((item) => item.label.toLowerCase() === 'home')?.href ?? '/'} onClick={onClose} className="flex min-h-12 items-center justify-between border-r border-slate-200 pr-4 text-sm font-bold text-brand-950 dark:border-white/10 dark:text-white">
                Home <ArrowUpRight size={15} className="text-cyan-600 dark:text-cyan-300" />
              </Link>
              <Link href={items.find((item) => item.label.toLowerCase() === 'contact')?.href ?? '/contact'} onClick={onClose} className="flex min-h-12 items-center justify-between pl-4 text-sm font-bold text-brand-950 dark:text-white">
                Contact <ArrowUpRight size={15} className="text-orange-600 dark:text-orange-300" />
              </Link>
            </div>

            <nav aria-label="Mobile navigation categories">
              <MobileAccordionMenu title="Services" index="01" count={mobileMenus.services.length} accentClass="text-cyan-700 dark:text-cyan-300" defaultOpen>
                {mobileMenus.services.map((item, index) => {
                  const theme = serviceThemes[(item.theme || 'it') as keyof typeof serviceThemes];
                  return (
                    <MobileMenuLink
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      description={item.description}
                      index={index}
                      accentClass={theme.text}
                    >
                      {item.title}
                    </MobileMenuLink>
                  );
                })}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Events" index="02" count={mobileMenus.events.length} accentClass="text-emerald-700 dark:text-emerald-300">
                {mobileMenus.events.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-emerald-700 dark:text-emerald-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Solutions" index="03" count={mobileMenus.solutions.length} accentClass="text-blue-700 dark:text-blue-300">
                {mobileMenus.solutions.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-blue-700 dark:text-blue-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Industries" index="04" count={mobileMenus.industries.length} accentClass="text-orange-700 dark:text-orange-300">
                {mobileMenus.industries.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-orange-700 dark:text-orange-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Insights" index="05" count={mobileMenus.insights.length} accentClass="text-violet-700 dark:text-violet-300">
                {mobileMenus.insights.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-violet-700 dark:text-violet-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="Resources" index="06" count={mobileMenus.resources.length} accentClass="text-teal-700 dark:text-teal-300">
                {mobileMenus.resources.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-teal-700 dark:text-teal-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>

              <MobileAccordionMenu title="About" index="07" count={mobileMenus.about.length} accentClass="text-rose-700 dark:text-rose-300">
                {mobileMenus.about.map((item, index) => (
                  <MobileMenuLink key={item.id} href={item.href} onClick={onClose} description={item.description} index={index} accentClass="text-rose-700 dark:text-rose-300">{item.title}</MobileMenuLink>
                ))}
              </MobileAccordionMenu>
            </nav>

            <div className="mt-auto pt-8">
              <HeaderCTA onClick={onClose} className="w-full rounded-none py-4" />
              <p className="mt-5 text-center font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Advisory / Consulting / Solutions
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
