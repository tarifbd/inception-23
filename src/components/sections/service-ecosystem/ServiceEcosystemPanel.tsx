'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import { serviceThemes } from '@/lib/constants/theme';
import { SubServiceCard } from './SubServiceCard';

type ServiceEcosystemPanelProps = {
  category: EcosystemCategory;
  index: number;
  idPrefix?: string;
};

export function ServiceEcosystemPanel({
  category,
  index,
  idPrefix = 'ecosystem',
}: ServiceEcosystemPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(panelRef, { once: true, margin: '-72px' });
  const theme = serviceThemes[category.key];

  return (
    <motion.article
      ref={panelRef}
      data-native-reveal
      data-motion-state={reduceMotion || isInView ? 'visible' : 'hidden'}
      id={`${idPrefix}-panel-${category.key}`}
      role="tabpanel"
      aria-labelledby={`${idPrefix}-tab-${category.key}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-md sm:p-7 lg:grid-cols-[minmax(15rem,0.32fr)_minmax(0,1fr)] lg:gap-12 dark:border-white/10 dark:bg-night-900"
    >
      <header className="self-start">
        <span className={`font-mono text-xs font-semibold ${theme.text}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className={`mt-5 text-xs font-semibold ${theme.text}`}>
          {category.eyebrow}
        </p>
        <h3 className="mt-2 max-w-md font-serif text-[clamp(1.75rem,3vw,2.8rem)] font-semibold leading-[1.05] text-brand-950 dark:text-white">
          {category.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
          {category.description}
        </p>
        <p className={`mt-6 inline-flex rounded-md border px-3 py-1.5 text-xs font-semibold ${theme.border} ${theme.bg} ${theme.text}`}>
          {category.services.length} areas of support
        </p>
      </header>

      <div data-motion-grid className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {category.services.map((service) => (
          <SubServiceCard
            key={service.title}
            service={service}
            serviceKey={category.key}
          />
        ))}
      </div>
    </motion.article>
  );
}
