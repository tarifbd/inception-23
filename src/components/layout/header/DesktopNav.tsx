'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { mainNav } from '@/lib/constants/navigation';
import type { MenuKind } from './MegaMenu';

type DesktopNavProps = {
  activeMenu: MenuKind | null;
  setActiveMenu: (menu: MenuKind | null) => void;
};

export function DesktopNav({ activeMenu, setActiveMenu }: DesktopNavProps) {
  return (
    <nav aria-label="Primary navigation" className="hidden min-w-0 items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/75 p-1 shadow-sm backdrop-blur-xl xl:flex">
      {mainNav.map((item) => {
        const menu = 'menu' in item ? item.menu : undefined;
        const isActive = menu && activeMenu === menu;

        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => (menu ? setActiveMenu(menu) : setActiveMenu(null))}
            onFocus={() => (menu ? setActiveMenu(menu) : setActiveMenu(null))}
            className={`relative inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition focus:outline-none focus:ring-4 focus:ring-brand-700/15 min-[1480px]:px-3 min-[1480px]:text-[11px] 2xl:px-4 2xl:text-xs 2xl:tracking-[0.1em] ${
              isActive ? 'text-brand-950' : 'text-slate-600 hover:text-brand-950'
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId="desktop-nav-pill"
                className="absolute inset-0 rounded-full bg-brand-50 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {menu ? <ChevronDown size={13} className={`relative transition ${isActive ? 'rotate-180 text-brand-700' : 'text-slate-400'}`} /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
