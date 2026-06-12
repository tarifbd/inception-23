import { AnimatedSection } from './AnimatedSection';
import { ProcessTimeline } from './ProcessTimeline';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';

export function ProcessSection({ content }: { content: HomepageSectionContent }) {
  return (
    <AnimatedSection id="process" className="bg-white">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        align="center"
      />
      <div className="mt-14">
        <ProcessTimeline />
      </div>
    </AnimatedSection>
  );
}
