'use client';

import { useMemo, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, ClipboardCheck, Layers3, SearchCheck } from 'lucide-react';
import { flushSync } from 'react-dom';
import { LandingIcon } from '@/components/landing/icons';
import { serviceCategories, type ServiceCategory } from '@/lib/constants/service-categories';
import { solutions, type Solution } from '@/lib/constants/solutions';
import { serviceThemes, type ServiceKey } from '@/lib/constants/theme';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { StatBadge } from '@/components/ui/StatBadge';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

type Metric = {
  value: string;
  label: string;
};

type ServiceNarrative = {
  challenge: string;
  approach: string;
  result: string;
  metrics: Metric[];
};

const sectionCopy = {
  eyebrow: 'Case studies',
  title: 'Real work examples, grouped by service.',
  description:
    'Select a service track to preview the featured brief, related examples, the work handled, and the outcome pattern before opening the full library.',
  supportingText: 'This section previews the selected track inline; the full archive stays on the dedicated case-study page.',
};

const previewFallbacks: Record<ServiceKey, string> = {
  it: '/solutions/nexus-crm.webp',
  consultancy: '/main-services/management-finance-photo.webp',
  legal: '/solutions/legal-document-intelligence.jpeg',
  creative: '/main-services/creative-execution-photo.webp',
};

const libraryGradients: Record<ServiceKey, string> = {
  it: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 54%, #020617 100%)',
  consultancy: 'linear-gradient(135deg, #0f172a 0%, #0f766e 54%, #14b8a6 100%)',
  legal: 'linear-gradient(135deg, #4c0519 0%, #9f1239 56%, #f59e0b 100%)',
  creative: 'linear-gradient(135deg, #6b21a8 0%, #c026d3 56%, #fb7185 100%)',
};

const relatedGridColumns = {
  0: 'md:grid-cols-1',
  1: 'md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.72fr)]',
  2: 'md:grid-cols-[repeat(2,minmax(0,1fr))_minmax(12rem,0.72fr)]',
  3: 'md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(12rem,0.72fr)]',
} as const;

const serviceNarratives: Record<ServiceKey, ServiceNarrative> = {
  it: {
    challenge: 'Teams were relying on scattered spreadsheets, manual follow-ups, and reports that arrived too late.',
    approach: 'We designed the workflow, data model, access roles, dashboard views, and rollout plan around daily operations.',
    result: 'A clearer operating system for tracking work, clients, documents, and decisions in one place.',
    metrics: [
      { value: '1 system', label: 'operational source' },
      { value: 'Daily', label: 'team visibility' },
    ],
  },
  consultancy: {
    challenge: 'Leadership needed stronger management rhythm, finance control, and clear ownership across recurring work.',
    approach: 'We mapped the operating cadence, clarified owners, shaped KPI reporting, and installed review workflows.',
    result: 'Monthly review packs made priorities, owners, and follow-up decisions easier to track.',
    metrics: [
      { value: 'Named', label: 'owner model' },
      { value: 'Monthly', label: 'reporting rhythm' },
    ],
  },
  legal: {
    challenge: 'Documents, compliance obligations, deadlines, and risk notes were difficult to monitor consistently.',
    approach: 'We structured the document library, compliance tracker, risk register, and review notes for repeatable use.',
    result: 'A versioned register gave managers one place to review obligations, gaps, and next actions.',
    metrics: [
      { value: '1 register', label: 'priority gaps' },
      { value: 'Versioned', label: 'document control' },
    ],
  },
  creative: {
    challenge: 'The offer, visuals, website, pitch assets, and campaign message did not feel connected enough.',
    approach: 'We clarified positioning, built the visual language, shaped content hierarchy, and prepared market assets.',
    result: 'Website, proposal, and campaign touchpoints used one offer narrative from first visit to inquiry.',
    metrics: [
      { value: '1 story', label: 'brand signal' },
      { value: 'Clear', label: 'inquiry path' },
    ],
  },
};

function hasImage(solution: Solution): solution is Solution & { image: string } {
  return Boolean(solution.image);
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function resolveMetrics(solution: Solution | undefined, fallback: Metric[]) {
  return solution?.metrics?.length ? solution.metrics.slice(0, 2) : fallback;
}

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
  const reduceMotion = useReducedMotion();
  const displaySolutions = (cmsSolutions?.length ? cmsSolutions : solutions) as Solution[];
  const displayCategories = (categories?.length ? categories : serviceCategories) as ServiceCategory[];
  const activeTheme = serviceThemes[activeService];
  const copy = {
    eyebrow: content.eyebrow || sectionCopy.eyebrow,
    title: content.title || sectionCopy.title,
    description: content.description || sectionCopy.description,
    supportingText: content.supportingText || sectionCopy.supportingText,
  };
  const activeCategory = displayCategories.find((category) => category.key === activeService) ?? serviceCategories[0];
  const activeStories = useMemo(
    () => displaySolutions.filter((solution) => solution.serviceKey === activeService),
    [activeService, displaySolutions],
  );
  const featuredStory = activeStories.find(hasImage) ?? activeStories[0];
  const relatedStories = activeStories.filter((story) => story.id !== featuredStory?.id).slice(0, 3);
  const teaserStories = relatedStories.length
    ? relatedStories
    : activeStories.filter((story) => story.id !== featuredStory?.id).slice(0, 3);
  const visiblePreviewCount = (featuredStory ? 1 : 0) + teaserStories.length;
  const previewImage = featuredStory?.image ?? previewFallbacks[activeService];
  const narrative = serviceNarratives[activeService];
  const metrics = resolveMetrics(featuredStory, narrative.metrics);
  const visibleModules = useMemo(() => {
    const moduleSource = featuredStory?.modules?.length
      ? featuredStory.modules
      : activeStories.flatMap((story) => story.modules ?? []);

    return uniqueItems(moduleSource.length ? moduleSource : activeCategory.highlights).slice(0, 6);
  }, [activeCategory.highlights, activeStories, featuredStory]);
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

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--solutions-cursor-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--solutions-cursor-y', `${event.clientY - rect.top}px`);
  };

  const handleServiceChange = (service: ServiceKey) => {
    if (service === activeService) return;

    const updateService = () => setActiveService(service);

    if (reduceMotion || typeof document === 'undefined') {
      updateService();
      return;
    }

    const root = document.documentElement;
    const transitionDocument = document as ViewTransitionDocument;

    if (!transitionDocument.startViewTransition || root.dataset.uiTransition) {
      updateService();
      return;
    }

    const finish = () => {
      root.classList.remove('solutions-view-transition');
      delete root.dataset.uiTransition;
    };

    root.dataset.uiTransition = 'solutions';
    root.classList.add('solutions-view-transition');
    const fallbackTimer = window.setTimeout(finish, 720);

    try {
      transitionDocument
        .startViewTransition(() => flushSync(updateService))
        .finished.finally(() => {
          window.clearTimeout(fallbackTimer);
          finish();
        });
    } catch {
      window.clearTimeout(fallbackTimer);
      updateService();
      finish();
    }
  };

  return (
    <AnimatedSection
      id="solutions"
      aria-label={content.label}
      motionVariant="from-left"
      className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_52%,#f8fafc_100%)] text-brand-950 dark:bg-[linear-gradient(180deg,#070b12_0%,#0b111d_52%,#070b12_100%)] dark:text-white"
    >
      <div
        data-featured-solutions
        onPointerMove={handlePointerMove}
        className="relative"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-8%] top-[-6rem] h-[32rem] opacity-80 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at var(--solutions-cursor-x, 70%) var(--solutions-cursor-y, 20%), rgba(14,165,233,0.24), transparent 18rem), radial-gradient(circle at 18% 34%, rgba(20,184,166,0.18), transparent 16rem), radial-gradient(circle at 86% 60%, rgba(244,63,94,0.14), transparent 18rem)',
          }}
        />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
          <div className="grid max-w-md grid-cols-2 border border-slate-200 bg-white/78 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
            <StatBadge
              label="visible briefs"
              value={visiblePreviewCount}
              size="sm"
              align="center"
              className="p-4"
              valueClassName={activeTheme.text}
            />
            <StatBadge
              label="service tracks"
              value={displayCategories.length}
              size="sm"
              align="center"
              className="border-l border-slate-200 p-4 dark:border-white/10"
              valueClassName={activeTheme.text}
            />
          </div>
        </div>

        <div
          data-solution-tabbar
          role="tablist"
          aria-label="Case study service filters"
          className="relative mt-10 grid overflow-hidden border border-slate-200 bg-white/82 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] md:grid-cols-4"
        >
          {displayCategories.map((category, index) => {
            const theme = serviceThemes[category.key];
            const selected = activeService === category.key;

            return (
              <motion.button
                key={category.key}
                type="button"
                role="tab"
                id={`solution-tab-${category.key}`}
                aria-selected={selected}
                aria-controls={`solution-panel-${category.key}`}
                onClick={() => handleServiceChange(category.key)}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                className={`group relative min-h-[112px] border-b border-slate-200 p-4 text-left transition duration-300 focus:outline-none focus-visible:z-10 focus-visible:ring-4 ${theme.ring} md:border-b-0 md:border-r md:last:border-r-0 dark:border-white/10 ${
                  selected ? 'bg-white dark:bg-white/[0.08]' : 'hover:bg-slate-50/90 dark:hover:bg-white/[0.06]'
                }`}
              >
                {selected ? (
                  <motion.span
                    layoutId="case-study-active-tab"
                    className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${theme.gradient}`}
                    transition={{ type: 'spring', stiffness: 440, damping: 38 }}
                  />
                ) : null}

                <span className="flex items-start justify-between gap-4">
                  <span className={`text-[10px] font-black tracking-[0.18em] ${selected ? theme.text : 'text-slate-400 dark:text-slate-500'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition duration-300 group-hover:-translate-y-0.5 ${selected ? theme.icon : `${theme.bgSoft} ${theme.text}`}`}>
                    <LandingIcon name={category.icon} size={18} strokeWidth={1.9} />
                  </span>
                </span>

                <span className="mt-5 block text-sm font-black leading-snug text-brand-950 dark:text-white">
                  {category.shortTitle}
                </span>
                <StatBadge
                  label="stories"
                  value={solutionCounts[category.key]}
                  size="sm"
                  className="mt-2"
                  valueClassName={`!text-sm ${selected ? theme.text : 'text-slate-500 dark:text-slate-400'}`}
                  labelClassName="!text-[10px] text-slate-500 dark:text-slate-400"
                />
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeService}
            id={`solution-panel-${activeService}`}
            role="tabpanel"
            aria-labelledby={`solution-tab-${activeService}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]"
          >
            <article
              data-solution-preview
              className={`group overflow-hidden border bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)] dark:bg-night-900 ${activeTheme.border}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-night-800">
                <div className="ui-skeleton absolute inset-0 opacity-80 dark:opacity-25" aria-hidden="true" />
                <Image
                  src={previewImage}
                  alt={`${featuredStory?.title ?? activeCategory.title} case study preview`}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  quality={82}
                  className="relative z-10 object-contain object-center transition duration-700 ease-entrance group-hover:scale-[1.012]"
                />
                <div className="absolute left-4 top-4 z-20 flex items-center gap-2 bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-brand-950 shadow-sm backdrop-blur-md dark:bg-night-950/82 dark:text-white">
                  <LandingIcon name={activeCategory.icon} size={14} className={activeTheme.text} />
                  Featured case study
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_0.72fr] lg:p-7">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${activeTheme.text}`}>
                    {activeCategory.shortTitle}
                  </p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-brand-950 dark:text-white">
                    {featuredStory?.title ?? activeCategory.title}
                  </h3>
                  <p className="mt-4 text-base font-semibold leading-8 text-slate-600 dark:text-slate-300">
                    {featuredStory?.description ?? activeCategory.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {metrics.map((metric) => (
                    <div key={`${metric.value}-${metric.label}`} className={`${activeTheme.bgSoft} p-4`}>
                      <p className={`text-2xl font-black ${activeTheme.text}`}>{metric.value}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div data-solution-copy className="grid gap-5">
              <div className="grid gap-3">
                {[
                  { label: 'Challenge', value: featuredStory?.challenge ?? narrative.challenge, icon: SearchCheck },
                  { label: 'What we did', value: narrative.approach, icon: ClipboardCheck },
                  { label: 'Outcome', value: featuredStory?.outcome ?? narrative.result, icon: BarChart3 },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="border border-slate-200 bg-white/86 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
                      <div className="flex items-start gap-4">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${activeTheme.icon}`}>
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${activeTheme.text}`}>{item.label}</p>
                          <p className="mt-2 text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border border-slate-200 bg-white/86 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
                <div className="flex items-center gap-3">
                  <Layers3 size={18} className={activeTheme.text} />
                  <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${activeTheme.text}`}>Work handled</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {visibleModules.map((module) => (
                    <span key={module} className="border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className={`grid gap-4 ${relatedGridColumns[Math.min(teaserStories.length, 3) as keyof typeof relatedGridColumns]}`}>
                {teaserStories.map((story) => (
                  <Link
                    key={story.id}
                    href="/case-studies#case-study-library"
                    className="group min-h-[150px] border border-slate-200 bg-white/86 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.045]"
                  >
                    <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${activeTheme.text}`}>{story.badge}</p>
                    <h4 className="mt-3 text-base font-black leading-snug text-brand-950 dark:text-white">{story.title}</h4>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{story.outcome}</p>
                  </Link>
                ))}

                <Link
                  href="/case-studies#case-study-library"
                  className={`group relative flex min-h-[150px] items-end overflow-hidden p-5 text-white shadow-xl transition duration-300 hover:-translate-y-1 ${activeTheme.shadow}`}
                  style={{ background: libraryGradients[activeService] }}
                >
                  <span className="absolute inset-0 translate-x-[-140%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.42),transparent)] transition duration-700 group-hover:translate-x-[140%]" />
                  <span className="relative z-10">
                    <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/78">Open library</span>
                    <span className="mt-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em]">
                      View all cases
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="relative mt-6 max-w-2xl text-sm font-semibold leading-7 text-slate-500 dark:text-slate-400">
          {copy.supportingText}
        </p>
      </div>
    </AnimatedSection>
  );
}
