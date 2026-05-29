'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import { aboutMenu, industriesMenu, insightsMenu, servicesMenu, solutionMenu } from '@/lib/constants/navigation';
import { serviceThemes } from '@/lib/constants/theme';
import { MegaMenuPanel } from './MegaMenuPanel';

type MenuKind = 'services' | 'solutions' | 'industries' | 'insights' | 'about';

type MegaMenuProps = {
  activeMenu: MenuKind;
  onNavigate: () => void;
};

const dropdownMap = {
  industries: industriesMenu,
  insights: insightsMenu,
  about: aboutMenu,
};

export function MegaMenu({ activeMenu, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 top-[calc(100%+0.7rem)] z-50 max-h-[calc(100vh-120px)] w-[min(1180px,calc(100vw-32px))] overflow-y-auto rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-orange-400" />

      {activeMenu === 'services' ? (
        <div className="relative grid items-stretch gap-3 lg:grid-cols-4">
          {servicesMenu.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="h-full"
            >
              <MegaMenuPanel item={item} onNavigate={onNavigate} />
            </motion.div>
          ))}
        </div>
      ) : null}

      {activeMenu === 'solutions' ? (
        <div className="relative grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {solutionMenu.map((item, index) => {
            const theme = serviceThemes[item.serviceKey];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`group block h-full rounded-[1.25rem] border bg-white p-4 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10 ${theme.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${theme.bg} ${theme.text}`}>
                      <LandingIcon name={item.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${theme.bg} ${theme.text}`}>
                        {item.badge}
                      </span>
                      <h3 className="mt-3 text-sm font-black leading-snug text-brand-950">{item.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-slate-600">{item.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : null}

      {activeMenu === 'industries' || activeMenu === 'insights' || activeMenu === 'about' ? (
        <div className="relative grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {dropdownMap[activeMenu].map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-700/30 hover:bg-brand-50 hover:text-brand-950"
              >
                {item.label}
                <ArrowRight size={15} className="text-brand-600 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export type { MenuKind };
