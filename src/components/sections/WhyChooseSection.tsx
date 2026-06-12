import { whyChooseItems } from '@/lib/constants/why-choose';
import { LandingIcon } from '@/components/landing/icons';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';

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
          {whyChooseItems.map((item, index) => (
            <article key={item.title} className="rounded-[1.45rem] border border-slate-200 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-950/10">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-950 text-white shadow-lg shadow-brand-950/15">
                <LandingIcon name={item.icon} size={19} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-black leading-tight text-brand-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
