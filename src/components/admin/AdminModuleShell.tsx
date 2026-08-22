'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ArrowLeft, BrainCircuit, Search } from 'lucide-react';

type AdminModuleShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  nav?: Array<{ href: string; label: string }>;
};

export const adminInputClass = 'ui-field min-w-0 w-full px-3 py-2.5 text-base outline-none sm:text-sm';
export const adminLabelClass = 'text-xs font-semibold text-gray-600 dark:text-gray-300';
export const adminCardClass = 'ui-card rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-900';
export const adminButtonClass = 'ui-action inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60';
export const adminSecondaryButtonClass = 'ui-action inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:border-brand-500 hover:text-brand-700 dark:border-white/10 dark:bg-night-900 dark:text-gray-200';

export function AdminModuleShell({ title, eyebrow, children, nav = [] }: AdminModuleShellProps) {
  const pathname = usePathname();

  return (
    <main className="admin-shell min-h-screen bg-gray-50 text-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-30 -mx-4 mb-6 flex flex-col gap-4 border-b border-gray-200 bg-gray-50/94 px-4 pb-5 pt-2 backdrop-blur-xl dark:border-white/10 dark:bg-night-950/94 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:flex-row lg:items-center lg:justify-between lg:bg-transparent lg:px-0 lg:pt-0 lg:backdrop-blur-none">
          <div>
            <Link href="/admin" className="ui-nav-link mb-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-gray-500 hover:text-brand-700">
              <ArrowLeft size={14} />
              Admin panel
            </Link>
            <div className="text-xs font-semibold text-brand-700">{eyebrow}</div>
            <h1 className="mt-1 break-words font-serif text-2xl font-bold text-gray-950 sm:text-3xl">{title}</h1>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:pb-0">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`${active ? `${adminButtonClass}` : adminSecondaryButtonClass} shrink-0`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

export function AdminStatCard({ label, value, tone = 'brand' }: { label: string; value: string | number; tone?: 'brand' | 'emerald' | 'rose' | 'cyan' }) {
  const toneClass = tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : tone === 'rose' ? 'bg-rose-50 text-rose-700' : tone === 'cyan' ? 'bg-cyan-50 text-cyan-700' : 'bg-brand-50 text-brand-700';
  return (
    <div className={`${adminCardClass} p-5`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-500">{label}</div>
          <div className="mt-2 text-3xl font-bold text-gray-950">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
          {tone === 'cyan' ? <BrainCircuit size={20} /> : <Search size={20} />}
        </div>
      </div>
    </div>
  );
}

export function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={adminLabelClass}>{label}</span>
      {children}
    </label>
  );
}

export function AdminLoadingSkeleton({
  rows = 4,
  framed = true,
}: {
  rows?: number;
  framed?: boolean;
}) {
  return (
    <div
      className={`${framed ? `${adminCardClass} p-5` : ""} space-y-4`}
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="ui-skeleton h-5 w-40 rounded" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid gap-3 border-t border-gray-100 pt-4 dark:border-white/10 sm:grid-cols-[1.2fr_0.8fr_0.45fr]">
          <div className="ui-skeleton h-10 rounded-lg" />
          <div className="ui-skeleton h-10 rounded-lg" />
          <div className="ui-skeleton h-10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
