'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { mainNav } from '@/lib/constants/navigation';
import type { MenuKind } from './MegaMenu';

type NavItem = { label: string; href: string; menu?: string };

type DesktopNavProps = {
  activeMenu: MenuKind | null;
  setActiveMenu: (menu: MenuKind | null) => void;
  navItems?: readonly NavItem[];
};

export function DesktopNav({ activeMenu, setActiveMenu, navItems }: DesktopNavProps) {
  const items = navItems ?? mainNav;

  return (
    <nav data-desktop-nav aria-label="Primary navigation" className="hidden min-w-0 items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/75 p-1 shadow-sm backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ease-entrance dark:border-white/10 dark:bg-[#0d1118]/72 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_10px_30px_rgba(0,0,0,0.18)] 2xl:flex">
      {items.map((item) => {
        const menu = ('menu' in item ? item.menu : undefined) as MenuKind | undefined;
        const isActive = menu && activeMenu === menu;

        return (
          <Link
            data-desktop-nav-link
            key={item.label}
            href={item.href}
            onMouseEnter={() => (menu ? setActiveMenu(menu) : setActiveMenu(null))}
            onFocus={() => (menu ? setActiveMenu(menu) : setActiveMenu(null))}
            aria-haspopup={menu ? 'menu' : undefined}
            aria-expanded={menu ? Boolean(isActive) : undefined}
            className={`relative inline-flex items-center gap-1 rounded-full px-2 py-2 text-[9px] font-black uppercase tracking-[0.06em] transition-[color,transform] duration-500 ease-entrance focus:outline-none focus:ring-4 focus:ring-brand-700/15 dark:focus:ring-cyan-300/15 min-[1400px]:px-2.5 min-[1400px]:text-[10px] min-[1700px]:px-3 min-[1700px]:text-[11px] min-[1900px]:px-4 min-[1900px]:tracking-[0.1em] ${
              isActive ? 'text-brand-950 dark:text-white' : 'text-slate-600 hover:text-brand-950 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {isActive ? (
              <motion.span
                data-desktop-nav-pill
                layoutId="desktop-nav-pill"
                className="absolute inset-0 rounded-full bg-brand-50 shadow-sm ring-1 ring-brand-950/5 will-change-transform dark:bg-[#121b24]/95 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_24px_rgba(0,0,0,0.16)] dark:ring-white/10"
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {menu ? <ChevronDown size={13} className={`relative transition-[color,transform] duration-500 ease-entrance ${isActive ? 'rotate-180 text-brand-700 dark:text-cyan-200' : 'text-slate-400 dark:text-slate-500'}`} /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
