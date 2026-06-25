import { industries } from '@/lib/constants/industries';
import { AnimatedSection } from './AnimatedSection';
import { IndustryCard } from './IndustryCard';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function IndustriesSection({ content, industries: cmsIndustries }: { content: HomepageSectionContent; industries?: CollectionRecord[] }) {
  const displayIndustries = (cmsIndustries?.length ? cmsIndustries : industries) as typeof industries;

  return (
    <AnimatedSection id="industries" className="bg-slate-50">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        align="center"
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {displayIndustries.map((industry, index) => (
          <IndustryCard key={industry.id} industry={industry} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
}
