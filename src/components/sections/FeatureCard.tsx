'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
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

function ProductGlyph({ index }: { index: number }) {
  const variant = index % 6;

  return (
    <span className="relative block h-16 w-16" aria-hidden="true">
      {variant === 0 ? (
        <>
          <span className="absolute left-2 top-2 h-9 w-11 -skew-x-12 rounded-[0.9rem_0.35rem_0.8rem_0.45rem] bg-gradient-to-br from-cyan-300 via-emerald-300 to-green-500 shadow-[0_10px_20px_-12px_rgba(16,185,129,0.9)]" />
          <span className="absolute bottom-2 left-3 h-9 w-8 -skew-x-12 rounded-[0.35rem_0.8rem_0.9rem_0.7rem] bg-gradient-to-br from-teal-400 via-emerald-600 to-teal-800 opacity-95" />
          <span className="absolute left-3 top-7 h-3 w-10 -skew-x-12 rounded-sm bg-gradient-to-r from-emerald-700 to-teal-400" />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <span className="absolute left-2 top-2 h-12 w-8 rotate-[28deg] rounded-[55%] bg-gradient-to-b from-blue-500 via-indigo-600 to-violet-600 shadow-[0_12px_22px_-12px_rgba(79,70,229,0.9)]" />
          <span className="absolute right-2 top-2 h-12 w-8 -rotate-[28deg] rounded-[55%] bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-rose-500 mix-blend-multiply" />
          <span className="absolute bottom-1 left-[1.15rem] h-5 w-7 rounded-[45%] bg-gradient-to-r from-orange-500 to-rose-500" />
        </>
      ) : null}
      {variant === 2 ? (
        <span className="absolute inset-2 flex items-end justify-center gap-1.5">
          <span className="h-7 w-3 rounded-t bg-gradient-to-b from-yellow-200 to-amber-300" />
          <span className="h-10 w-3 rounded-t bg-gradient-to-b from-amber-300 to-yellow-500" />
          <span className="h-14 w-3 rounded-t bg-gradient-to-b from-yellow-400 to-amber-600 shadow-[0_10px_18px_-10px_rgba(217,119,6,0.8)]" />
        </span>
      ) : null}
      {variant === 3 ? (
        <>
          <span className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-900 via-sky-500 to-cyan-300 shadow-[0_12px_24px_-12px_rgba(14,165,233,0.95)]" />
          <span className="absolute left-3 top-4 h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300/20 via-blue-600/75 to-indigo-950/80" />
          <span className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-gradient-to-br from-sky-100/70 to-cyan-500/25 backdrop-blur-sm" />
        </>
      ) : null}
      {variant === 4 ? (
        <>
          <span className="absolute left-2 top-2 h-6 w-10 rounded-[0.9rem_0.25rem_0.9rem_0.25rem] bg-gradient-to-r from-lime-300 to-lime-500" />
          <span className="absolute left-1 top-7 h-4 w-12 rounded-sm bg-gradient-to-r from-green-700 via-green-500 to-blue-700" />
          <span className="absolute bottom-2 left-6 h-9 w-7 -skew-x-12 rounded-[0.25rem_0.7rem_0.8rem_0.35rem] bg-gradient-to-b from-lime-500 to-emerald-800" />
        </>
      ) : null}
      {variant === 5 ? (
        <>
          <span className="absolute left-2 top-3 h-9 w-11 -skew-x-6 rounded-lg bg-gradient-to-br from-fuchsia-300 to-violet-500 opacity-80" />
          <span className="absolute left-4 top-5 h-9 w-10 -skew-x-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 opacity-90" />
          <span className="absolute bottom-2 right-2 h-9 w-8 -skew-x-6 rounded-lg bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-700 shadow-[0_12px_22px_-12px_rgba(109,40,217,0.9)]" />
        </>
      ) : null}
    </span>
  );
}

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
          className="relative mb-6 h-16 w-16 isolate drop-shadow-[0_12px_12px_rgba(15,23,42,0.12)]"
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, -2, 0], rotate: [0, 0.8, 0] }}
          transition={{ duration: 4.8 + (index % 3) * 0.7, delay: index * 0.14, ease: 'easeInOut', repeat: Infinity }}
          whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -2, y: -3 }}
        >
          <span className="absolute inset-2 rounded-full bg-sky-300/25 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <ProductGlyph index={index} />
        </motion.div>
      ) : (
        <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-lg shadow-sm ${theme.icon}`}>
          <LandingIcon name={icon} size={20} />
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
