'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type SubServiceCardProps = {
  title: string;
  summary?: string;
  serviceKey: ServiceKey;
  index?: number;
};

export function SubServiceCard({ title, summary, serviceKey, index = 0 }: SubServiceCardProps) {
  const theme = serviceThemes[serviceKey];

  return (
    <motion.article
      data-interactive-surface
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.36, delay: index * 0.025 }}
      whileHover={{ y: -4 }}
      className={`group min-h-[118px] rounded-lg border bg-white/82 p-4 shadow-sm backdrop-blur-xl transition hover:shadow-lg dark:bg-night-900/82 ${theme.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold leading-snug text-brand-950">{title}</h3>
        <ArrowUpRight size={15} className={`${theme.text} opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100`} />
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-600">{summary ?? 'Structured advisory, documentation, system design, and implementation support.'}</p>
    </motion.article>
  );
}
