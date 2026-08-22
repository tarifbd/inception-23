import { whyChooseItems } from '@/lib/constants/why-choose';
import { LandingIcon } from '@/components/landing/icons';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

const whyAccentStyles = [
  {
    card: 'border-cyan-200/80 bg-gradient-to-br from-cyan-50/80 via-white to-white hover:shadow-cyan-950/10 dark:border-cyan-300/20 dark:from-[#0b1b25] dark:via-[#0d1724] dark:to-[#111827] dark:hover:from-[#0d2330] dark:hover:via-[#101c2b] dark:hover:to-[#141d2d]',
    icon: 'from-cyan-500 via-blue-500 to-slate-950 shadow-cyan-500/25',
    glow: 'bg-cyan-300/25',
    text: 'text-cyan-700',
  },
  {
    card: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white hover:shadow-emerald-950/10 dark:border-emerald-300/20 dark:from-[#0b211d] dark:via-[#0d1b21] dark:to-[#111827] dark:hover:from-[#0d2a24] dark:hover:via-[#102229] dark:hover:to-[#141d2d]',
    icon: 'from-emerald-500 via-teal-500 to-slate-950 shadow-emerald-500/25',
    glow: 'bg-emerald-300/25',
    text: 'text-emerald-700',
  },
  {
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50/80 via-white to-white hover:shadow-violet-950/10 dark:border-violet-300/20 dark:from-[#1b142c] dark:via-[#151728] dark:to-[#111827] dark:hover:from-[#24183a] dark:hover:via-[#1b1a31] dark:hover:to-[#141d2d]',
    icon: 'from-violet-600 via-purple-600 to-slate-950 shadow-violet-600/25',
    glow: 'bg-violet-300/25',
    text: 'text-violet-700',
  },
  {
    card: 'border-orange-200/80 bg-gradient-to-br from-orange-50/80 via-white to-white hover:shadow-orange-950/10 dark:border-orange-300/20 dark:from-[#291812] dark:via-[#211522] dark:to-[#111827] dark:hover:from-[#351d14] dark:hover:via-[#2a192b] dark:hover:to-[#141d2d]',
    icon: 'from-orange-500 via-rose-500 to-fuchsia-600 shadow-orange-500/25',
    glow: 'bg-orange-300/25',
    text: 'text-orange-700',
  },
];

export function WhyChooseSection({ content, items }: { content: HomepageSectionContent; items?: CollectionRecord[] }) {
  const displayItems = (items?.length ? items : whyChooseItems) as typeof whyChooseItems;

  return (
    <AnimatedSection id="why" motionVariant="from-left" className="bg-white dark:bg-[#080c16]">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>
        <div data-motion-grid className="grid gap-4 sm:grid-cols-2">
          {displayItems.map((item, index) => {
            const accent = whyAccentStyles[index % whyAccentStyles.length];

            return (
              <article data-interactive-surface key={item.title} className={`group relative overflow-hidden rounded-lg border p-5 transition hover:-translate-y-1 hover:shadow-xl ${accent.card}`}>
                <div className="relative mb-6 inline-flex border border-white/70 bg-white/65 p-1 shadow-sm dark:border-white/10 dark:bg-[#080d17]/80">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-md ${accent.icon}`}>
                    <LandingIcon name={item.icon} size={21} strokeWidth={1.9} />
                  </div>
                </div>
                <p className={`relative text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>0{index + 1}</p>
                <h3 className="mt-2 text-xl font-black leading-tight text-brand-950 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
