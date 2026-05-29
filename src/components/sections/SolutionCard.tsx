'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import type { Solution } from '@/lib/constants/solutions';
import { serviceThemes } from '@/lib/constants/theme';

type SolutionCardProps = {
  solution: Solution;
  index?: number;
};

export function SolutionCard({ solution, index = 0 }: SolutionCardProps) {
  const theme = serviceThemes[solution.serviceKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -7 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.65rem] border bg-white p-6 shadow-sm transition hover:shadow-2xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      <div className={`absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl ${theme.surface}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${theme.icon}`}>
          <LandingIcon name={solution.icon} size={20} />
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${theme.border} ${theme.bg} ${theme.text}`}>
          {solution.badge}
        </span>
      </div>
      <h3 className="relative mt-6 text-xl font-black leading-tight text-brand-950">{solution.title}</h3>
      <p className="relative mt-3 text-sm leading-7 text-slate-600">{solution.description}</p>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {solution.metrics.map((metric) => (
          <div key={`${metric.value}-${metric.label}`} className={`rounded-2xl border px-4 py-3 ${theme.border} ${theme.bgSoft}`}>
            <p className={`text-lg font-black ${theme.text}`}>{metric.value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-5 space-y-4 text-sm leading-7 text-slate-600">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${theme.text}`}>Challenge</p>
          <p className="mt-1">{solution.challenge}</p>
        </div>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${theme.text}`}>Solution</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {solution.modules.map((module) => (
          <div key={module} className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 size={15} className={theme.textSoft} />
            {module}
          </div>
        ))}
          </div>
        </div>
      </div>
      <p className={`relative mt-5 rounded-2xl px-4 py-3 text-sm font-bold leading-6 ${theme.bg} ${theme.text}`}>{solution.outcome}</p>
      <Link href={solution.href} className={`relative mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg transition ${theme.button}`}>
        Start this build
        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
