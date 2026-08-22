'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LandingService } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';
import { LandingIcon } from './icons';

type ServiceCardProps = {
  service: LandingService;
  index?: number;
};

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const theme = landingThemes[service.id];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`group relative min-h-full overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg dark:bg-night-900 ${theme.border}`}
    >
      <div className={`mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${theme.gradient} text-white shadow-sm`}>
        <LandingIcon name={service.icon} size={24} />
      </div>
      <p className={`text-xs font-semibold ${theme.text}`}>{service.eyebrow}</p>
      <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-950">{service.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
      <div className="mt-6 grid gap-2">
        {service.bullets.map((bullet) => (
          <div key={bullet} className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CheckCircle2 size={16} className={theme.textSoft} />
            {bullet}
          </div>
        ))}
      </div>
      <Link href={service.href} className={`ui-action mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm ${theme.button}`}>
        {service.cta}
        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
