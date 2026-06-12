'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { serviceCategories } from '@/lib/constants/service-categories';
import { solutions } from '@/lib/constants/solutions';
import { serviceThemes, type ServiceKey } from '@/lib/constants/theme';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { SolutionCard } from './SolutionCard';
import type { HomepageSectionContent } from '@/lib/homepage-content';

export function FeaturedSolutionsSection({ content }: { content: HomepageSectionContent }) {
  const [activeService, setActiveService] = useState<ServiceKey>('it');
  const filteredSolutions = useMemo(
    () => solutions.filter((solution) => solution.serviceKey === activeService),
    [activeService],
  );
  const visibleSolutions = [...filteredSolutions].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))).slice(0, 2);
  const activeTheme = serviceThemes[activeService];

  return (
    <AnimatedSection id="solutions" className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <p className="max-w-sm text-sm font-bold leading-7 text-slate-500">
          {content.supportingText}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/82 p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="grid gap-2 md:grid-cols-4">
          {serviceCategories.map((category) => {
            const theme = serviceThemes[category.key];
            const selected = activeService === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveService(category.key)}
                className={`group relative overflow-hidden rounded-[1.45rem] border px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 ${
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeService}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24 }}
          className="mt-8 grid gap-7"
        >
          {visibleSolutions.map((solution, index) => (
            <SolutionCard key={solution.id} solution={solution} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-9 flex justify-center">
        <Link
          href="/featured-solutions"
          className={`inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.14em] shadow-xl transition hover:-translate-y-1 ${activeTheme.button}`}
        >
          View all featured solutions
          <ArrowRight size={18} />
        </Link>
      </div>
    </AnimatedSection>
  );
}
