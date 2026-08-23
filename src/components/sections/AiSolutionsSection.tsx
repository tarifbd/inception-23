import { aiCapabilities } from '@/lib/constants/solutions';
import { AnimatedSection } from './AnimatedSection';
import { FeatureCard } from './FeatureCard';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function AiSolutionsSection({ content, capabilities }: { content: HomepageSectionContent; capabilities?: CollectionRecord[] }) {
  const displayCapabilities = (capabilities?.length ? capabilities : aiCapabilities) as typeof aiCapabilities;

  return (
    <AnimatedSection id="ai-solutions" motionVariant="from-right" className="bg-white dark:bg-night-950">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.3fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <div className="mt-8 border-l-2 border-cyan-500 bg-cyan-50/55 px-6 py-5 dark:bg-cyan-400/[0.06]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Innovation with control</p>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {content.supportingText}
            </p>
          </div>
        </div>
        <div data-motion-grid className="grid gap-4 sm:grid-cols-2">
          {displayCapabilities.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} serviceKey="it" index={index} visualStyle="fabric" />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
