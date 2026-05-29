import { AiSolutionsSection } from './AiSolutionsSection';
import { CaAdvisorySection } from './CaAdvisorySection';
import { ContactBriefSection } from './ContactBriefSection';
import { FeaturedSolutionsSection } from './FeaturedSolutionsSection';
import { IndustriesSection } from './IndustriesSection';
import { OurServicesSection } from './OurServicesSection';
import { ProcessSection } from './ProcessSection';
import { ServiceEcosystemSection } from './ServiceEcosystemSection';
import { TeamSection } from './TeamSection';
import { TechStackSection } from './TechStackSection';
import { WhyChooseSection } from './WhyChooseSection';

export function LandingPageSections() {
  return (
    <>
      <OurServicesSection />
      <ServiceEcosystemSection />
      <AiSolutionsSection />
      <CaAdvisorySection />
      <WhyChooseSection />
      <IndustriesSection />
      <ProcessSection />
      <FeaturedSolutionsSection />
      <TeamSection />
      <TechStackSection />
      <ContactBriefSection />
    </>
  );
}
