import { AnimatedSection } from './AnimatedSection';
import { ProcessTimeline } from './ProcessTimeline';
import { SectionHeader } from './SectionHeader';

export function ProcessSection() {
  return (
    <AnimatedSection id="process" className="bg-white">
      <SectionHeader
        eyebrow="Our process"
        title="A disciplined path from uncertainty to operating advantage."
        description="Every engagement follows a clear rhythm: understand, diagnose, design, implement, improve, and scale."
        align="center"
      />
      <div className="mt-14">
        <ProcessTimeline />
      </div>
    </AnimatedSection>
  );
}
