import { industries } from '@/lib/constants/industries';
import { AnimatedSection } from './AnimatedSection';
import { IndustryCard } from './IndustryCard';
import { SectionHeader } from './SectionHeader';

export function IndustriesSection() {
  return (
    <AnimatedSection id="industries" className="bg-slate-50">
      <SectionHeader
        eyebrow="Industries we serve"
        title="Built for operators, founders, and professional teams."
        description="The same integrated model adapts to different sectors: business control, digital systems, compliance awareness, and market clarity."
        align="center"
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {industries.map((industry, index) => (
          <IndustryCard key={industry.id} industry={industry} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
}
