'use client';

import { ArrowUpRight, BriefcaseBusiness, CircleDashed, ShieldCheck, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { teamCategories, teamMembers, type TeamCategory, type TeamMember } from '@/lib/constants/team';
import { AnimatedSection } from './AnimatedSection';
import { TeamCard } from './TeamCard';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { defaultHomepageContent, type HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

const rosterTargets: Record<TeamCategory, number> = {
  management: 4,
  'advisor-consultant': 8,
  associates: 4,
};

const categoryStyles: Record<TeamCategory, { index: string; accent: string; text: string; border: string; surface: string }> = {
  management: {
    index: '01',
    accent: '#0f766e',
    text: 'text-teal-800 dark:text-teal-300',
    border: 'border-teal-300/70 dark:border-teal-300/20',
    surface: 'bg-teal-50/55 dark:bg-teal-300/[0.035]',
  },
  'advisor-consultant': {
    index: '02',
    accent: '#9f1239',
    text: 'text-rose-900 dark:text-rose-300',
    border: 'border-rose-300/70 dark:border-rose-300/20',
    surface: 'bg-rose-50/45 dark:bg-rose-300/[0.035]',
  },
  associates: {
    index: '03',
    accent: '#2563eb',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-300/70 dark:border-blue-300/20',
    surface: 'bg-blue-50/45 dark:bg-blue-300/[0.035]',
  },
};

function isPlaceholderMember(member: TeamMember) {
  return member.isPending || member.id.includes('-seat-') || /\bseat\s+\d+/i.test(member.name);
}

function isRemovedMember(member: TeamMember) {
  return /ga?izi\s+faisal/i.test(member.name) || member.id === 'gaizi-faisal' || member.id === 'gazi-faisal';
}

function normalizeCategory(category: unknown): TeamCategory {
  if (category === 'executive' || category === 'associate') return 'associates';
  if (category === 'advisor-consultant') return 'advisor-consultant';
  return category === 'management' ? 'management' : 'associates';
}

export function TeamSection({
  content = defaultHomepageContent.sections.find((section) => section.key === 'team')!,
  members: cmsMembers,
}: {
  content?: HomepageSectionContent;
  members?: CollectionRecord[];
}) {
  const confirmedMembers = ((cmsMembers?.length ? cmsMembers : teamMembers) as TeamMember[])
    .filter((member) => !isPlaceholderMember(member) && !isRemovedMember(member))
    .map((member) => ({ ...member, category: normalizeCategory(member.category) }));
  const confirmedCount = confirmedMembers.length;
  const totalCapacity = Object.values(rosterTargets).reduce((total, count) => total + count, 0);

  return (
    <AnimatedSection id="team" motionVariant="editorial" className="border-y border-slate-300 bg-[#f3f5f5] dark:border-white/10 dark:bg-[#090d12]">
      <header className="grid gap-10 border-b border-slate-300 pb-12 dark:border-white/15 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.58fr)] lg:items-end lg:gap-20 lg:pb-16">
        <div>
          <p data-motion-eyebrow className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
            <span className="h-px w-10 bg-orange-500" aria-hidden="true" />
            {content.eyebrow}
          </p>
          <h2 data-motion-heading className="mt-6 max-w-4xl font-serif text-[clamp(2.8rem,5.4vw,5.4rem)] font-bold leading-[0.92] text-brand-950 dark:text-white">
            <GradientTitle text={content.title} accentWords={2} tone="management" />
          </h2>
        </div>
        <div className="border-l border-slate-300 pl-5 dark:border-white/15 sm:pl-7">
          <p data-motion-description className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {content.description}
          </p>
          <div className="mt-7 grid grid-cols-2 border-y border-slate-300 dark:border-white/15">
            <div className="py-4 pr-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">Verified profiles</p>
              <p className="mt-2 font-serif text-3xl font-bold text-brand-950 dark:text-white">{String(confirmedCount).padStart(2, '0')}</p>
            </div>
            <div className="border-l border-slate-300 py-4 pl-4 dark:border-white/15">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">Team capacity</p>
              <p className="mt-2 font-serif text-3xl font-bold text-brand-950 dark:text-white">{String(totalCapacity).padStart(2, '0')}</p>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Team categories" className="grid border-b border-slate-300 dark:border-white/15 sm:grid-cols-3">
        {teamCategories.map((category, index) => {
          const style = categoryStyles[category.id];
          const categoryConfirmed = confirmedMembers.filter((member) => member.category === category.id).length;
          return (
            <a
              key={category.id}
              href={`#team-${category.id}`}
              className={`group relative flex min-h-28 items-center justify-between gap-4 overflow-hidden px-5 py-5 transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-500/15 dark:hover:bg-white/[0.04] ${index > 0 ? 'border-t border-slate-300 dark:border-white/15 sm:border-l sm:border-t-0' : ''}`}
            >
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: style.accent }} aria-hidden="true" />
              <div>
                <span className={`font-mono text-[9px] font-bold ${style.text}`}>{style.index}</span>
                <p className="mt-2 text-sm font-bold text-brand-950 dark:text-white">{category.label}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl font-bold text-brand-950 dark:text-white">{categoryConfirmed}/{rosterTargets[category.id]}</p>
                <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">confirmed</p>
              </div>
            </a>
          );
        })}
      </nav>

      <div className="divide-y divide-slate-300 dark:divide-white/15">
        {teamCategories.map((category) => {
          const members = confirmedMembers
            .filter((member) => member.category === category.id)
            .slice(0, rosterTargets[category.id]);
          const openCount = Math.max(0, rosterTargets[category.id] - members.length);
          const style = categoryStyles[category.id];

          return (
            <section id={`team-${category.id}`} key={category.id} className="scroll-mt-28 py-14 lg:py-20">
              <div className="grid gap-9 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-16">
                <header className="lg:sticky lg:top-32 lg:self-start">
                  <div className="flex items-center justify-between gap-4 border-t pt-4" style={{ borderColor: style.accent }}>
                    <p className={`font-mono text-[10px] font-bold ${style.text}`}>{style.index} / {String(rosterTargets[category.id]).padStart(2, '0')}</p>
                    <UsersRound size={16} className={style.text} aria-hidden="true" />
                  </div>
                  <h3 className="mt-7 font-serif text-3xl font-bold leading-none text-brand-950 dark:text-white sm:text-4xl">{category.label}</h3>
                  <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">{category.summary}</p>
                  <div className="mt-7 grid grid-cols-2 border-y border-slate-300 dark:border-white/15">
                    <div className="py-3 pr-3">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Verified</p>
                      <p className="mt-2 font-serif text-2xl font-bold text-brand-950 dark:text-white">{String(members.length).padStart(2, '0')}</p>
                    </div>
                    <div className="border-l border-slate-300 py-3 pl-3 dark:border-white/15">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Open</p>
                      <p className="mt-2 font-serif text-2xl font-bold text-brand-950 dark:text-white">{String(openCount).padStart(2, '0')}</p>
                    </div>
                  </div>
                </header>

                <div className="min-w-0">
                  {members.length ? (
                    <div data-motion-grid className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),22rem))] items-stretch justify-start gap-5">
                      {members.map((member, index) => (
                        <TeamCard key={member.id} member={member} index={index} slotNumber={index + 1} categoryAccent={style.accent} />
                      ))}
                      {members.length === 1 && openCount ? (
                        <aside className={`flex min-h-64 w-full max-w-[22rem] flex-col justify-between border border-t-[3px] p-7 lg:h-[42rem] ${style.border} ${style.surface}`} style={{ borderTopColor: style.accent }}>
                          <div className="flex items-center justify-between">
                            <ShieldCheck size={25} className={style.text} strokeWidth={1.5} aria-hidden="true" />
                            <span className={`font-mono text-[9px] font-bold ${style.text}`}>ROSTER / OPEN</span>
                          </div>
                          <div>
                            <p className="font-serif text-6xl font-bold leading-none text-brand-950 dark:text-white">{String(openCount).padStart(2, '0')}</p>
                            <p className="mt-4 font-serif text-2xl font-bold leading-tight text-brand-950 dark:text-white">Specialist appointments remain open.</p>
                            <p className="mt-4 text-xs leading-6 text-slate-600 dark:text-slate-400">Profiles publish only after role, identity, and contact details are verified.</p>
                          </div>
                          <Link href="/contact?subject=team-appointment" className="group flex min-h-12 items-center justify-between border-t border-current/15 pt-4 text-xs font-bold text-brand-950 dark:text-white">
                            Discuss an appointment
                            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </aside>
                      ) : null}
                    </div>
                  ) : (
                    <div className={`grid min-h-72 border border-t-[3px] p-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-9 ${style.border} ${style.surface}`} style={{ borderTopColor: style.accent }}>
                      <div>
                        <CircleDashed size={25} className={style.text} aria-hidden="true" />
                        <p className="mt-10 max-w-xl font-serif text-3xl font-bold leading-tight text-brand-950 dark:text-white">The associate network is being appointed with verification first.</p>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">No placeholder people are published. Confirmed profiles will appear here with direct professional contact details.</p>
                      </div>
                      <Link href="/contact?subject=team-appointment" className="group mt-8 inline-flex min-h-12 items-center gap-4 border-b border-brand-950 pb-2 text-xs font-bold text-brand-950 dark:border-white dark:text-white sm:mt-0">
                        Discuss an appointment
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  )}

                  {openCount && members.length > 1 ? (
                    <div className={`mt-5 grid border ${style.border} ${style.surface} sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center`}>
                      <div className="flex items-start gap-4 p-5 sm:p-6">
                        <CircleDashed size={20} className={`mt-0.5 shrink-0 ${style.text}`} aria-hidden="true" />
                        <div>
                          <p className="text-sm font-bold text-brand-950 dark:text-white">{String(openCount).padStart(2, '0')} open {openCount === 1 ? 'appointment' : 'appointments'}</p>
                          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">Capacity is shown transparently without publishing fictional profiles.</p>
                        </div>
                      </div>
                      <Link href="/contact?subject=team-appointment" className="group flex min-h-14 items-center justify-between gap-5 border-t border-inherit px-5 text-xs font-bold text-brand-950 transition hover:bg-white/70 dark:text-white dark:hover:bg-white/[0.05] sm:min-h-full sm:border-l sm:border-t-0 sm:px-6">
                        Discuss an appointment
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-col gap-5 border-t border-slate-300 py-8 dark:border-white/15 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BriefcaseBusiness size={17} className="text-orange-600 dark:text-orange-300" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Specialist collaboration and leadership appointments are reviewed confidentially.</p>
        </div>
        <Link href="/contact?subject=team" className="inline-flex items-center gap-3 text-sm font-bold text-brand-950 dark:text-white">
          Contact the management team <ArrowUpRight size={16} />
        </Link>
      </div>
    </AnimatedSection>
  );
}
