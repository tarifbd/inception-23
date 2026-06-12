'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { teamCategories, teamMembers, type TeamCategory } from '@/lib/constants/team';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { TeamCard } from './TeamCard';
import { defaultHomepageContent, type HomepageSectionContent } from '@/lib/homepage-content';

export function TeamSection({
  content = defaultHomepageContent.sections.find((section) => section.key === 'team')!,
}: {
  content?: HomepageSectionContent;
}) {
  const [active, setActive] = useState<TeamCategory>('management');
  const members = useMemo(() => teamMembers.filter((member) => member.category === active), [active]);
  const activeCategory = teamCategories.find((category) => category.id === active) ?? teamCategories[0];
  const activeThemeClass = {
    management: 'from-emerald-50 via-white to-teal-50 border-emerald-200/80 text-emerald-700',
    'advisor-consultant': 'from-violet-50 via-white to-amber-50 border-violet-200/80 text-violet-700',
    executive: 'from-cyan-50 via-white to-blue-50 border-cyan-200/80 text-cyan-700',
  }[activeCategory.id];

  return (
    <AnimatedSection id="team" className="bg-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <div className="grid w-full max-w-2xl grid-cols-1 gap-1.5 rounded-[1.5rem] border border-slate-200 bg-white p-1.5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] min-[480px]:grid-cols-3 md:w-auto md:rounded-[2rem]">
          {teamCategories.map((category) => {
            const selected = active === category.id;
            const categoryClass = {
              management: 'text-emerald-700 hover:bg-emerald-50',
              'advisor-consultant': 'text-violet-700 hover:bg-violet-50',
              executive: 'text-cyan-700 hover:bg-cyan-50',
            }[category.id];
            const selectedClass = {
              management: 'bg-emerald-600 text-white shadow-emerald-700/20',
              'advisor-consultant': 'bg-violet-700 text-white shadow-violet-700/20',
              executive: 'bg-cyan-600 text-white shadow-cyan-700/20',
            }[category.id];
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(category.id)}
                className={`relative min-h-12 rounded-full px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.14em] transition focus:outline-none focus:ring-4 focus:ring-brand-700/15 ${
                  selected ? selectedClass : categoryClass
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-8 rounded-[1.75rem] border bg-gradient-to-br p-5 ${activeThemeClass}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em]">{activeCategory.label}</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{activeCategory.summary}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {members.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </AnimatedSection>
  );
}
