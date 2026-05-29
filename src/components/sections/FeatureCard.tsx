'use client';

import { motion } from 'framer-motion';
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
};

export function FeatureCard({ title, description, benefit, icon, serviceKey = 'it', index = 0 }: FeatureCardProps) {
  const theme = serviceThemes[serviceKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-[1.45rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-950/10`}
    >
      <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg ${theme.icon}`}>
        <LandingIcon name={icon} size={20} />
      </div>
      <h3 className="text-lg font-black leading-tight text-brand-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${theme.bg} ${theme.text}`}>
        {benefit}
        <ArrowUpRight size={13} />
      </div>
    </motion.article>
  );
}
