'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import { serviceCategories, type ServiceCategory } from '@/lib/constants/service-categories';
import { solutions, type Solution } from '@/lib/constants/solutions';
import { serviceThemes, type ServiceKey } from '@/lib/constants/theme';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { SolutionCard } from './SolutionCard';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function FeaturedSolutionsSection({
  content,
  solutions: cmsSolutions,
  categories,
}: {
  content: HomepageSectionContent;
  solutions?: CollectionRecord[];
  categories?: CollectionRecord[];
}) {
  const [activeService, setActiveService] = useState<ServiceKey>('it');
  const displaySolutions = (cmsSolutions?.length ? cmsSolutions : solutions) as Solution[];
  const displayCategories = (categories?.length ? categories : serviceCategories) as ServiceCategory[];
  const filteredSolutions = useMemo(
    () => displaySolutions.filter((solution) => solution.serviceKey === activeService),
    [activeService, displaySolutions],
  );
  const solutionCounts = useMemo(
    () =>
      displaySolutions.reduce<Record<ServiceKey, number>>(
        (counts, solution) => {
          counts[solution.serviceKey] += 1;
          return counts;
        },
        { it: 0, consultancy: 0, legal: 0, creative: 0 },
      ),
    [displaySolutions],
  );
  const visibleSolutions = [...filteredSolutions].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))).slice(0, 2);
  const activeTheme = serviceThemes[activeService];

  return (
    <AnimatedSection
      id="solutions"
      motionVariant="from-left"
      className="bg-white dark:bg-[#090e17]"
    >
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <p className="max-w-sm text-sm font-bold leading-7 text-slate-500 dark:text-slate-300">
          {content.supportingText}
        </p>
      </div>

      <div className="mt-10 border-y border-slate-200/90 bg-white/60 dark:border-white/[0.09] dark:bg-white/[0.015]">
        <div className="-mx-5 snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="grid min-w-[760px] grid-cols-4 divide-x divide-slate-200/90 dark:divide-white/[0.09]">
            {displayCategories.map((category, index) => {
              const theme = serviceThemes[category.key];
              const selected = activeService === category.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveService(category.key)}
                  className={`group relative min-h-[148px] snap-start overflow-hidden px-5 py-5 text-left transition-colors duration-300 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400/70 ${
                    selected
                      ? `${theme.bg} dark:bg-white/[0.04]`
                      : 'bg-transparent hover:bg-slate-50/80 dark:hover:bg-white/[0.025]'
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="featured-solution-category"
                      className={`absolute inset-x-5 bottom-0 h-[3px] ${theme.dot}`}
                      transition={{ type: 'spring', stiffness: 430, damping: 38 }}
                    />
                  ) : null}

                  <span className="flex items-start justify-between gap-4">
                    <span className={`pt-1 text-[10px] font-black tracking-[0.18em] ${selected ? theme.text : 'text-slate-400 dark:text-slate-500'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition duration-300 group-hover:-translate-y-0.5 ${
                        selected
                          ? theme.icon
                          : `${theme.bgSoft} ${theme.text} shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] dark:bg-white/[0.04]`
                      }`}
                    >
                      <LandingIcon name={category.icon} size={19} strokeWidth={1.9} />
                    </span>
                  </span>

                  <span className="mt-5 block text-[15px] font-black leading-snug text-brand-950 dark:text-slate-100">
                    {category.shortTitle}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${selected ? theme.dot : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <span className="tabular-nums">{String(solutionCounts[category.key]).padStart(2, '0')} systems</span>
                  </span>
                </button>
              );
            })}
          </div>
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
