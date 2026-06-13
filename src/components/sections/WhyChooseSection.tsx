import { whyChooseItems } from '@/lib/constants/why-choose';
import { LandingIcon } from '@/components/landing/icons';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';

const whyAccentStyles = [
  {
    card: 'border-cyan-200/80 bg-gradient-to-br from-cyan-50/80 via-white to-white hover:shadow-cyan-950/10',
    icon: 'from-cyan-500 via-blue-500 to-slate-950 shadow-cyan-500/25',
    glow: 'bg-cyan-300/25',
    text: 'text-cyan-700',
  },
  {
    card: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white hover:shadow-emerald-950/10',
    icon: 'from-emerald-500 via-teal-500 to-slate-950 shadow-emerald-500/25',
    glow: 'bg-emerald-300/25',
    text: 'text-emerald-700',
  },
  {
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50/80 via-white to-white hover:shadow-violet-950/10',
    icon: 'from-violet-600 via-purple-600 to-slate-950 shadow-violet-600/25',
    glow: 'bg-violet-300/25',
    text: 'text-violet-700',
  },
  {
    card: 'border-orange-200/80 bg-gradient-to-br from-orange-50/80 via-white to-white hover:shadow-orange-950/10',
    icon: 'from-orange-500 via-rose-500 to-fuchsia-600 shadow-orange-500/25',
    glow: 'bg-orange-300/25',
    text: 'text-orange-700',
  },
];

export function WhyChooseSection({ content }: { content: HomepageSectionContent }) {
  return (
    <AnimatedSection id="why" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyChooseItems.map((item, index) => {
            const accent = whyAccentStyles[index % whyAccentStyles.length];

            return (
              <article key={item.title} className={`group relative overflow-hidden rounded-[1.45rem] border p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl ${accent.card}`}>
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125 ${accent.glow}`} />
                <div className="relative mb-6 inline-flex rounded-[1.35rem] border border-white/70 bg-white/55 p-1.5 shadow-inner shadow-white/80 backdrop-blur">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl ${accent.icon}`}>
                    <LandingIcon name={item.icon} size={21} strokeWidth={1.9} />
                  </div>
                </div>
                <p className={`relative text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>0{index + 1}</p>
                <h3 className="mt-2 text-xl font-black leading-tight text-brand-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
