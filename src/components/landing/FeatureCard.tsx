'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { LandingFeature, LandingServiceKey } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';
import { LandingIcon } from './icons';

type FeatureCardProps = {
  feature: LandingFeature;
  themeKey?: LandingServiceKey;
  index?: number;
};

export function FeatureCard({ feature, themeKey = 'it', index = 0 }: FeatureCardProps) {
  const theme = landingThemes[themeKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.42, delay: index * 0.045 }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-950/10 ${theme.softHover}`}
    >
      <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg ${theme.icon}`}>
        <LandingIcon name={feature.icon} size={20} />
      </div>
      <h3 className="text-lg font-black leading-tight text-brand-950">{feature.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
      <div className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${theme.soft} ${theme.text}`}>
        {feature.benefit}
        <ArrowUpRight size={13} />
      </div>
    </motion.article>
  );
}
