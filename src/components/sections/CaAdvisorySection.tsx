import { ContextIcon } from '@/components/ui/ContextIcon';
import { caAdvisoryFocus } from '@/lib/constants/solutions';
import { AnimatedSection } from './AnimatedSection';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

const advisorySignals = [
  {
    label: 'Compliance',
    index: '01',
    accent: 'border-amber-400 text-amber-800 dark:border-amber-400/70 dark:text-amber-300',
  },
  {
    label: 'Reporting',
    index: '02',
    accent: 'border-blue-500 text-blue-800 dark:border-blue-400/70 dark:text-blue-300',
  },
  {
    label: 'Growth control',
    index: '03',
    accent: 'border-rose-500 text-rose-900 dark:border-rose-400/70 dark:text-rose-300',
  },
];

const focusAccentStyles = [
  {
    line: 'bg-blue-700 dark:bg-blue-400',
    icon: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300',
    hover: 'hover:border-blue-300 dark:hover:border-blue-400/40',
  },
  {
    line: 'bg-amber-500 dark:bg-amber-400',
    icon: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300',
    hover: 'hover:border-amber-300 dark:hover:border-amber-400/40',
  },
  {
    line: 'bg-rose-700 dark:bg-rose-400',
    icon: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300',
    hover: 'hover:border-rose-300 dark:hover:border-rose-400/40',
  },
  {
    line: 'bg-cyan-700 dark:bg-cyan-400',
    icon: 'border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300',
    hover: 'hover:border-cyan-300 dark:hover:border-cyan-400/40',
  },
];

export function CaAdvisorySection({ content, focusItems }: { content: HomepageSectionContent; focusItems?: CollectionRecord[] }) {
  const displayFocus = focusItems?.length ? focusItems.map((item) => String(item.title || '')).filter(Boolean) : caAdvisoryFocus;

  return (
    <AnimatedSection
      id="ca-advisory"
      motionVariant="focus"
      className="border-y border-slate-200 bg-[#f7f8fb] dark:border-white/10 dark:bg-[#0b0d14]"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-16">
        <div className="border-y border-slate-300 py-8 dark:border-white/15 lg:sticky lg:top-28 lg:py-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-amber-500" aria-hidden="true" />
            <p data-motion-eyebrow className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
              {content.eyebrow}
            </p>
          </div>
          <h3 data-motion-heading className="mt-5 max-w-xl font-serif text-[clamp(2.35rem,4vw,4.35rem)] font-black leading-[1.02] text-brand-950 dark:text-white">
            {content.title}
          </h3>
          <p data-motion-description className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {content.description}
          </p>
          <div data-motion-grid className="mt-9 grid grid-cols-3 gap-3">
            {advisorySignals.map((signal) => (
              <div key={signal.label} className={`min-w-0 border-t-2 pt-3 ${signal.accent}`}>
                <span className="block font-mono text-[10px] font-bold opacity-65">{signal.index}</span>
                <span className="mt-1 block text-xs font-black leading-5 sm:text-sm">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between border-b border-slate-300 pb-3 dark:border-white/15">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              Advisory coverage
            </p>
            <p className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
              {String(displayFocus.length).padStart(2, '0')} capabilities
            </p>
          </div>
          <div data-motion-grid className="grid gap-2.5 sm:grid-cols-2">
            {displayFocus.map((item, index) => {
              const accent = focusAccentStyles[index % focusAccentStyles.length];

              return (
                <div
                  key={item}
                  className={`group relative flex min-h-[4.5rem] items-center gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-22px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[#121620] ${accent.hover}`}
                >
                  <span className={`absolute inset-y-0 left-0 w-0.5 ${accent.line}`} aria-hidden="true" />
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${accent.icon}`}>
                    <ContextIcon context={item} size={17} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">
                    {item}
                  </span>
                  <span className="ml-auto self-start font-mono text-[9px] font-bold text-slate-400 transition group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
