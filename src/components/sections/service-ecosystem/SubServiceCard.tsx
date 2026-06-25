'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { EcosystemSubService } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type SubServiceCardProps = {
  service: EcosystemSubService;
  serviceKey: ServiceKey;
  index: number;
};

export function SubServiceCard({ service, serviceKey, index }: SubServiceCardProps) {
  const theme = serviceThemes[serviceKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.018 }}
      whileHover={{ y: -4 }}
      className={`group relative min-h-[10rem] overflow-hidden rounded-[1.35rem] border bg-white/84 p-5 shadow-sm backdrop-blur-xl transition hover:shadow-xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl transition group-hover:scale-125 ${theme.surface}`} />
      <div className="relative flex items-start justify-between gap-4">
        <h4 className="text-[clamp(0.95rem,1.1vw,1.05rem)] font-black leading-snug text-brand-950">{service.title}</h4>
        <ArrowUpRight size={17} className={`${theme.textSoft} shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
      </div>
      <p className="relative mt-4 text-[0.9rem] leading-7 text-slate-600">{service.description}</p>
    </motion.article>
  );
}

