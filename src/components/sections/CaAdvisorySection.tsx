import { ContextIcon } from '@/components/ui/ContextIcon';
import { GradientTitle } from '@/components/ui/GradientTitle';
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
    dot: 'bg-blue-600 dark:bg-blue-400',
    icon: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-50/70 dark:hover:bg-blue-400/[0.06]',
  },
  {
    dot: 'bg-amber-500 dark:bg-amber-300',
    icon: 'text-amber-700 dark:text-amber-300',
    hover: 'hover:bg-amber-50/70 dark:hover:bg-amber-400/[0.06]',
  },
  {
    dot: 'bg-rose-600 dark:bg-rose-400',
    icon: 'text-rose-700 dark:text-rose-300',
    hover: 'hover:bg-rose-50/70 dark:hover:bg-rose-400/[0.06]',
  },
  {
    dot: 'bg-cyan-600 dark:bg-cyan-300',
    icon: 'text-cyan-700 dark:text-cyan-300',
    hover: 'hover:bg-cyan-50/70 dark:hover:bg-cyan-400/[0.06]',
  },
];

export function CaAdvisorySection({ content, focusItems }: { content: HomepageSectionContent; focusItems?: CollectionRecord[] }) {
  const displayFocus = focusItems?.length ? focusItems.map((item) => String(item.title || '')).filter(Boolean) : caAdvisoryFocus;

  return (
    <AnimatedSection
      id="ca-advisory"
      motionVariant="focus"
      className="border-y border-slate-200 bg-[#f7f8fb] dark:border-white/10 dark:bg-[#0a0d13]"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-28 lg:py-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-amber-500 to-rose-500" aria-hidden="true" />
            <p data-motion-eyebrow className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
              {content.eyebrow}
            </p>
          </div>
          <h3 data-motion-heading className="mt-6 max-w-xl font-serif text-[clamp(2.5rem,4.2vw,4.7rem)] font-black leading-[0.98] text-brand-950 dark:text-white">
            <GradientTitle text={content.title} accentWords={2} tone="management" />
          </h3>
          <p data-motion-description className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {content.description}
          </p>
          <div data-motion-grid className="mt-9 grid border-y border-slate-300 dark:border-white/15 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {advisorySignals.map((signal) => (
              <div key={signal.label} className={`min-w-0 border-l-2 px-3 py-4 first:border-l-0 lg:border-l-0 lg:border-t lg:first:border-t-0 xl:border-l-2 xl:border-t-0 xl:first:border-l-0 ${signal.accent}`}>
                <span className="block font-mono text-[9px] font-bold opacity-60">{signal.index}</span>
                <span className="mt-1.5 block text-xs font-black leading-5">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_26px_70px_-54px_rgba(15,23,42,0.55)] dark:border-white/15 dark:bg-[#10141d] dark:shadow-none">
          <div className="grid gap-5 bg-[#111b2b] px-5 py-5 text-white sm:grid-cols-[1fr_auto] sm:items-end sm:px-7 sm:py-6 dark:bg-[#151b27]">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">Advisory register</p>
              <h4 className="mt-2 font-serif text-2xl font-bold leading-tight !text-white sm:text-3xl">Coverage built around business decisions.</h4>
            </div>
            <div className="border-l border-white/20 pl-4 text-right">
              <span className="block font-mono text-2xl font-bold leading-none">{String(displayFocus.length).padStart(2, '0')}</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">capabilities</span>
            </div>
          </div>

          <ol data-motion-grid className="grid sm:grid-cols-2">
            {displayFocus.map((item, index) => {
              const accent = focusAccentStyles[index % focusAccentStyles.length];
              const lastDesktopRowStart = displayFocus.length - (displayFocus.length % 2 || 2);
              const isLastDesktopRow = index >= lastDesktopRowStart;

              return (
                <li
                  key={item}
                  className={`group relative grid min-h-[5.75rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-slate-200 px-5 py-4 transition-colors duration-300 last:border-b-0 dark:border-white/10 sm:even:border-l ${isLastDesktopRow ? 'sm:border-b-0' : ''} ${accent.hover}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${accent.icon}`}>
                    <ContextIcon context={item} size={17} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">{item}</span>
                  <span className="self-start pt-0.5 font-mono text-[9px] font-bold text-slate-400 dark:text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${accent.dot}`} aria-hidden="true" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </AnimatedSection>
  );
}
