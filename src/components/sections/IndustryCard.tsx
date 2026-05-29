'use client';

import { motion } from 'framer-motion';
import { LandingIcon } from '@/components/landing/icons';
import type { Industry } from '@/lib/constants/industries';
import { serviceThemes } from '@/lib/constants/theme';

type IndustryCardProps = {
  industry: Industry;
  index?: number;
};

export function IndustryCard({ industry, index = 0 }: IndustryCardProps) {
  const theme = serviceThemes[index % 4 === 0 ? 'it' : index % 4 === 1 ? 'consultancy' : index % 4 === 2 ? 'legal' : 'creative'];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.38, delay: index * 0.03 }}
      whileHover={{ y: -5 }}
      className="group rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-950/10"
    >
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${theme.bg} ${theme.text}`}>
        <LandingIcon name={industry.icon} size={19} />
      </div>
      <h3 className="font-black leading-tight text-brand-950">{industry.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{industry.value}</p>
    </motion.article>
  );
}
