'use client';

import { motion } from 'framer-motion';
import type { LandingProcessStep, LandingServiceKey } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';
import { LandingIcon } from './icons';

type ProcessTimelineProps = {
  steps: LandingProcessStep[];
  themeKey?: LandingServiceKey;
};

export function ProcessTimeline({ steps, themeKey = 'it' }: ProcessTimelineProps) {
  const theme = landingThemes[themeKey];

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className={`absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b ${theme.gradient} opacity-25 md:left-1/2`} />
      <div className="space-y-5">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: isEven ? -22 : 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className={`relative grid gap-4 md:grid-cols-[1fr_72px_1fr] ${isEven ? '' : 'md:[&>article]:col-start-3'}`}
            >
              <article className="ml-12 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:ml-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${theme.text}`}>{step.step}</p>
                <h3 className="mt-2 text-xl font-black text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
              <div className={`absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full shadow-lg md:static md:col-start-2 md:h-12 md:w-12 ${theme.icon}`}>
                <LandingIcon name={step.icon} size={18} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
