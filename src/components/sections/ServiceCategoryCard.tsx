'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import type { ServiceCategory } from '@/lib/constants/service-categories';
import type { ServiceKey } from '@/lib/constants/theme';

type ServiceCategoryCardProps = {
  category: ServiceCategory;
  index?: number;
};

const cardThemes: Record<ServiceKey, { border: string; surface: string; gradient: string; text: string; textSoft: string; ring: string; shadow: string; button: string }> = {
  it: {
    border: 'border-cyan-200/80',
    surface: 'bg-cyan-500/10',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    text: 'text-cyan-700',
    textSoft: 'text-cyan-600',
    ring: 'ring-cyan-500/20',
    shadow: 'shadow-cyan-950/10',
    button: 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/25',
  },
  consultancy: {
    border: 'border-emerald-200/80',
    surface: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    text: 'text-emerald-700',
    textSoft: 'text-emerald-600',
    ring: 'ring-emerald-500/20',
    shadow: 'shadow-emerald-950/10',
    button: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25',
  },
  legal: {
    border: 'border-violet-200/80',
    surface: 'bg-violet-500/10',
    gradient: 'from-violet-700 via-purple-700 to-amber-500',
    text: 'text-violet-700',
    textSoft: 'text-violet-600',
    ring: 'ring-violet-500/20',
    shadow: 'shadow-violet-950/10',
    button: 'bg-violet-700 text-white hover:bg-violet-600 shadow-violet-700/25',
  },
  creative: {
    border: 'border-orange-200/80',
    surface: 'bg-orange-500/10',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    text: 'text-orange-700',
    textSoft: 'text-orange-600',
    ring: 'ring-orange-500/20',
    shadow: 'shadow-orange-950/10',
    button: 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/25',
  },
};

const cardTitles: Partial<Record<ServiceKey, string>> = {
  it: 'IT & AI Solutions',
};

export function ServiceCategoryCard({ category, index = 0 }: ServiceCategoryCardProps) {
  const theme = cardThemes[category.key];

  return (
    <motion.article
      data-interactive-surface
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.42, delay: index * 0.045 }}
      whileHover={{ y: -8 }}
      className={`group relative flex min-h-full flex-col overflow-hidden rounded-lg border bg-white/95 p-6 shadow-sm transition hover:shadow-xl hover:ring-4 ${theme.border} ${theme.shadow} ${theme.ring}`}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${theme.gradient} text-white shadow-md`}>
          <LandingIcon name={category.icon} size={24} />
        </div>
        <span className={`border-l-2 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${theme.text} ${theme.border}`}>
          {category.shortTitle}
        </span>
      </div>
      <p className={`relative mt-7 text-[10px] font-black uppercase tracking-[0.22em] ${theme.text}`}>{category.eyebrow}</p>
      <h3 className="relative mt-3 font-serif text-2xl font-black leading-tight text-brand-950 md:text-3xl">
        {cardTitles[category.key] ?? category.title}
      </h3>
      <p className="relative mt-4 text-sm leading-7 text-slate-600">{category.description}</p>
      <div className="relative mt-6 grid gap-2">
        {category.highlights.slice(0, 8).map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm font-bold leading-5 text-slate-700">
            <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${theme.textSoft}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-auto pt-8">
        <Link href={category.href} className={`ui-action inline-flex w-fit items-center gap-2 rounded-md px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-md transition ${theme.button}`}>
          Explore service
          <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
