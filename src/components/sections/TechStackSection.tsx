import {
  BarChart3,
  CloudCog,
  Code2,
  Database,
  Landmark,
  PenTool,
  Scale,
  ServerCog,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { techStackGroups } from '@/lib/constants/tech-stack';
import { AnimatedSection } from './AnimatedSection';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

const groupIcons: Record<string, LucideIcon> = {
  frontend: Code2,
  backend: ServerCog,
  database: Database,
  'automation-search': Workflow,
  'cloud-devops': CloudCog,
  'design-creative': PenTool,
  'analytics-bi': BarChart3,
  'legal-compliance-tools': Scale,
  'finance-tools': Landmark,
};

export function TechStackSection({ content, groups }: { content: HomepageSectionContent; groups?: CollectionRecord[] }) {
  const displayGroups = (groups?.length ? groups : techStackGroups) as typeof techStackGroups;
  const capabilityCount = displayGroups.reduce((total, group) => total + group.tools.length, 0);

  return (
    <AnimatedSection
      id="technology"
      motionVariant="focus"
      className="border-y border-slate-200 bg-[#f4f5f7] dark:border-white/10 dark:bg-[#090b11]"
    >
      <header className="grid gap-8 border-b border-slate-300 pb-10 dark:border-white/15 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.65fr)] lg:items-end lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-violet-600 dark:bg-violet-400" aria-hidden="true" />
            <p data-motion-eyebrow className="font-utility text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-300">
              {content.eyebrow}
            </p>
          </div>
          <h2 data-motion-heading className="mt-5 max-w-4xl break-words font-serif text-[clamp(2.6rem,6vw,5.7rem)] font-bold leading-[0.96] text-brand-950 dark:text-white">
            {content.title}
          </h2>
        </div>

        <div className="lg:pb-1">
          <p data-motion-description className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {content.description}
          </p>
          <dl className="mt-7 grid grid-cols-2 border-y border-slate-300 py-4 dark:border-white/15">
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                Disciplines
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-brand-950 dark:text-white">
                {String(displayGroups.length).padStart(2, '0')}
              </dd>
            </div>
            <div className="border-l border-slate-300 pl-5 dark:border-white/15">
              <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                Capabilities
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-brand-950 dark:text-white">
                {String(capabilityCount).padStart(2, '0')}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div data-motion-grid className="mt-8 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_28px_70px_-56px_rgba(15,23,42,0.8)] dark:border-white/15 dark:bg-[#10131b]">
        <div className="hidden grid-cols-[4.5rem_minmax(13rem,0.68fr)_minmax(0,1.5fr)] border-b border-slate-200 bg-slate-100/80 px-6 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-500 md:grid">
          <span>Index</span>
          <span>Discipline</span>
          <span>Working capabilities</span>
        </div>

        {displayGroups.map((group, index) => {
          const Icon = groupIcons[group.id] ?? Code2;

          return (
            <article
              key={group.id}
              className="group relative grid gap-5 border-b border-slate-200 px-5 py-6 transition-colors duration-300 last:border-b-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.025] md:grid-cols-[4.5rem_minmax(13rem,0.68fr)_minmax(0,1.5fr)] md:gap-0 md:px-6 md:py-7"
            >
              <span
                className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                style={{ backgroundColor: group.accent }}
                aria-hidden="true"
              />

              <div className="flex items-center justify-between md:block">
                <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                  {String(group.tools.length).padStart(2, '0')} capabilities
                </span>
              </div>

              <div className="flex min-w-0 items-start gap-4 md:pr-8">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-white shadow-sm dark:bg-[#151924]"
                  style={{ borderColor: group.border, color: group.accent }}
                >
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-black leading-6 text-brand-950 dark:text-white md:text-lg">
                    {group.title}
                  </h3>
                  <p className="mt-1 hidden font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 md:block dark:text-slate-600">
                    {String(group.tools.length).padStart(2, '0')} capabilities
                  </p>
                </div>
              </div>

              <ul className="grid gap-x-7 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3" aria-label={`${group.title} capabilities`}>
                {group.tools.map((tool) => (
                  <li key={tool} className="flex min-w-0 items-start gap-2.5 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
                    <span
                      className="mt-[0.43rem] h-1.5 w-1.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: group.accent }}
                      aria-hidden="true"
                    />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
