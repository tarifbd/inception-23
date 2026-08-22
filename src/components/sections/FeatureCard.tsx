'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ContextIcon } from '@/components/ui/ContextIcon';
import type { LandingIconName } from '@/lib/constants/landing';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type FeatureCardProps = {
  title: string;
  description: string;
  benefit: string;
  icon: LandingIconName;
  serviceKey?: ServiceKey;
  index?: number;
  visualStyle?: 'default' | 'fabric';
};

const fabricTones = [
  'from-cyan-400 via-blue-600 to-indigo-800 shadow-blue-600/25',
  'from-emerald-400 via-teal-600 to-cyan-800 shadow-teal-600/25',
  'from-amber-300 via-orange-500 to-rose-600 shadow-orange-500/25',
  'from-violet-400 via-fuchsia-600 to-indigo-800 shadow-violet-600/25',
] as const;

export function FeatureCard({ title, description, benefit, icon, serviceKey = 'it', index = 0, visualStyle = 'default' }: FeatureCardProps) {
  const theme = serviceThemes[serviceKey];
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      data-interactive-surface
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-night-900"
    >
      {visualStyle === 'fabric' ? (
        <motion.div
          className="relative mb-6 h-[4.5rem] w-[4.5rem] isolate"
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, -2, 0], rotate: [0, 0.8, 0] }}
          transition={{ duration: 4.8 + (index % 3) * 0.7, delay: index * 0.14, ease: 'easeInOut', repeat: Infinity }}
          whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -2, y: -3 }}
        >
          <span className={`absolute inset-2 rotate-6 rounded-2xl bg-gradient-to-br opacity-35 blur-[1px] ${fabricTones[index % fabricTones.length]}`} />
          <span className={`absolute inset-1 -rotate-3 rounded-2xl bg-gradient-to-br opacity-55 ${fabricTones[(index + 1) % fabricTones.length]}`} />
          <span className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl ring-1 ring-white/50 ${fabricTones[index % fabricTones.length]}`}>
            <ContextIcon context={`${title} ${description}`} size={29} strokeWidth={1.65} />
          </span>
        </motion.div>
      ) : (
        <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-lg shadow-sm ${theme.icon}`}>
          <ContextIcon context={`${title} ${description} ${icon}`} size={20} />
        </div>
      )}
      <h3 className="text-lg font-bold leading-tight text-brand-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className={`mt-5 inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold ${theme.bg} ${theme.text}`}>
        {benefit}
        <ArrowUpRight size={13} />
      </div>
    </motion.article>
  );
}
