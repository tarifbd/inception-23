'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { serviceCategories } from '@/lib/constants/service-categories';
import { solutions } from '@/lib/constants/solutions';
import { serviceThemes, type ServiceKey } from '@/lib/constants/theme';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { SolutionCard } from './SolutionCard';

export function FeaturedSolutionsSection() {
  const [activeService, setActiveService] = useState<ServiceKey>('it');
  const activeTheme = serviceThemes[activeService];
  const filteredSolutions = useMemo(
    () => solutions.filter((solution) => solution.serviceKey === activeService),
    [activeService],
  );

  return (
    <AnimatedSection id="solutions" className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Featured solutions"
          title="Packaged systems for recurring business problems."
          description="These are not generic products. They are modular operating systems shaped around your process, compliance needs, data, team, and growth model."
        />
        <p className="max-w-sm text-sm font-bold leading-7 text-slate-500">
          Each solution can start as a focused implementation and later expand into a full internal business operating system.
        </p>
      </div>

      <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="grid gap-2 md:grid-cols-4">
          {serviceCategories.map((category) => {
            const theme = serviceThemes[category.key];
            const selected = activeService === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveService(category.key)}
                className={`group relative overflow-hidden rounded-[1.45rem] border px-4 py-4 text-left transition focus:outline-none focus:ring-4 ${theme.ring} ${
                  selected ? `${theme.borderStrong} ${theme.bg}` : 'border-transparent bg-slate-50 hover:bg-white'
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${selected ? theme.gradient : 'from-transparent to-transparent'}`} />
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${selected ? theme.icon : 'bg-white text-slate-500'}`}>
                  {category.shortTitle.slice(0, 2)}
                </span>
                <span className="mt-3 block text-sm font-black leading-tight text-brand-950">{category.shortTitle}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">{solutions.filter((solution) => solution.serviceKey === category.key).length} featured systems</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-8 rounded-[2rem] border bg-gradient-to-br p-5 ${activeTheme.border} ${activeTheme.gradientSoft}`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.text}`}>{activeTheme.label}</p>
            <h3 className="mt-2 text-2xl font-black text-brand-950">Featured solution library</h3>
          </div>
          <p className="max-w-xl text-sm font-bold leading-7 text-slate-600">
            Browse production-ready starting points by service category. Every card can be adapted into a focused project or a wider operating system.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeService}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24 }}
          className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredSolutions.map((solution, index) => (
            <SolutionCard key={solution.id} solution={solution} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </AnimatedSection>
  );
}
