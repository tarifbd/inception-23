import { AnimatedSection } from './AnimatedSection';
import { ProcessTimeline } from './ProcessTimeline';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function ProcessSection({ content, steps }: { content: HomepageSectionContent; steps?: CollectionRecord[] }) {
  return (
    <AnimatedSection id="process" motionVariant="editorial" className="bg-white">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        align="center"
      />
      <div data-motion-grid className="mt-14">
        <ProcessTimeline steps={steps} />
      </div>
    </AnimatedSection>
  );
}
