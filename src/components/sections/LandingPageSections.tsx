import { AiSolutionsSection } from './AiSolutionsSection';
import { CaAdvisorySection } from './CaAdvisorySection';
import { ContactBriefSection } from './ContactBriefSection';
import { FeaturedSolutionsSection } from './FeaturedSolutionsSection';
import { IndustriesSection } from './IndustriesSection';
import { MainServicesAmbushSection } from './MainServicesAmbushSection';
import { OurServicesSection } from './OurServicesSection';
import { ProcessSection } from './ProcessSection';
import { ServiceEcosystemSection } from './ServiceEcosystemSection';
import { TeamSection } from './TeamSection';
import { TechStackSection } from './TechStackSection';
import { WhyChooseSection } from './WhyChooseSection';
import type { HomepageSectionContent, HomepageSectionKey } from '@/lib/homepage-content';

const sectionComponents: Record<HomepageSectionKey, (content: HomepageSectionContent) => React.ReactNode> = {
  services: (content) => <OurServicesSection content={content} />,
  ecosystem: (content) => <ServiceEcosystemSection content={content} />,
  ai: (content) => <AiSolutionsSection content={content} />,
  caAdvisory: (content) => <CaAdvisorySection content={content} />,
  why: (content) => <WhyChooseSection content={content} />,
  industries: (content) => <IndustriesSection content={content} />,
  process: (content) => <ProcessSection content={content} />,
  solutions: (content) => <FeaturedSolutionsSection content={content} />,
  team: (content) => <TeamSection content={content} />,
  technology: (content) => <TechStackSection content={content} />,
  contact: (content) => <ContactBriefSection content={content} />,
  mainServices: (content) => <MainServicesAmbushSection content={content} />,
};

export function LandingPageSections({ sections }: { sections: HomepageSectionContent[] }) {
  return sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order)
    .map((section) => <div key={section.key}>{sectionComponents[section.key](section)}</div>);
}
