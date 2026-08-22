'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LandingSolution } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';
import { LandingIcon } from './icons';

type SolutionCardProps = {
  solution: LandingSolution;
  index?: number;
};

export function SolutionCard({ solution, index = 0 }: SolutionCardProps) {
  const theme = landingThemes[solution.serviceKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-night-900 ${theme.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-sm ${theme.icon}`}>
          <LandingIcon name={solution.icon} size={20} />
        </div>
        <span className={`rounded border px-3 py-1 text-xs font-semibold ${theme.border} ${theme.soft} ${theme.text}`}>
          {solution.badge}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold leading-tight text-brand-950">{solution.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{solution.description}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {solution.modules.map((module) => (
          <div key={module} className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 size={15} className={theme.textSoft} />
            {module}
          </div>
        ))}
      </div>
      <p className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold leading-6 ${theme.soft} ${theme.text}`}>{solution.outcome}</p>
      <Link href={solution.href} className={`ui-action mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm ${theme.button}`}>
        Start this build
        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
