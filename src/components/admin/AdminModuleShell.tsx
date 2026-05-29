'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, BrainCircuit, Search } from 'lucide-react';

type AdminModuleShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  nav?: Array<{ href: string; label: string }>;
};

export const adminInputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';
export const adminLabelClass = 'text-[11px] font-bold uppercase tracking-wider text-gray-500';
export const adminCardClass = 'rounded-lg border border-gray-200 bg-white shadow-sm';
export const adminButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60';
export const adminSecondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-brand-500 hover:text-brand-700';

export function AdminModuleShell({ title, eyebrow, children, nav = [] }: AdminModuleShellProps) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-brand-700">
              <ArrowLeft size={14} />
              Admin panel
            </Link>
            <div className="text-xs font-black uppercase tracking-widest text-brand-700">{eyebrow}</div>
            <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-gray-950">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={adminSecondaryButtonClass}>
                {item.label}
              </Link>
            ))}
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
          <div className="text-xs font-black uppercase tracking-wider text-gray-500">{label}</div>
          <div className="mt-2 text-3xl font-black text-gray-950">{value}</div>
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
