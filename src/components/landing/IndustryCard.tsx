'use client';

import { motion } from 'framer-motion';
import type { LandingIndustry, LandingServiceKey } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';
import { LandingIcon } from './icons';

type IndustryCardProps = {
  industry: LandingIndustry;
  themeKey?: LandingServiceKey;
  index?: number;
};

export function IndustryCard({ industry, themeKey = 'consultancy', index = 0 }: IndustryCardProps) {
  const theme = landingThemes[themeKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.38, delay: index * 0.035 }}
      whileHover={{ y: -4 }}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-night-900"
    >
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${theme.soft} ${theme.text}`}>
        <LandingIcon name={industry.icon} size={19} />
      </div>
      <h3 className="font-bold leading-tight text-brand-950">{industry.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{industry.value}</p>
    </motion.article>
  );
}
