import { aiCapabilities } from '@/lib/constants/solutions';
import { AnimatedSection } from './AnimatedSection';
import { FeatureCard } from './FeatureCard';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';

export function AiSolutionsSection({ content }: { content: HomepageSectionContent }) {
  return (
    <AnimatedSection id="ai-solutions" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.3fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <div className="mt-8 rounded-[1.75rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">Innovation with control</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {content.supportingText}
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {aiCapabilities.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} serviceKey="it" index={index} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
