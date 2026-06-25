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
import type { WebsiteCollections } from '@/lib/website-collections';

const sectionComponents: Record<HomepageSectionKey, (content: HomepageSectionContent, collections?: WebsiteCollections) => React.ReactNode> = {
  services: (content, collections) => <OurServicesSection content={content} categories={collections?.serviceCategories} />,
  ecosystem: (content, collections) => <ServiceEcosystemSection content={content} categories={collections?.serviceEcosystem} />,
  ai: (content, collections) => <AiSolutionsSection content={content} capabilities={collections?.aiCapabilities} />,
  caAdvisory: (content, collections) => <CaAdvisorySection content={content} focusItems={collections?.caAdvisory} />,
  why: (content, collections) => <WhyChooseSection content={content} items={collections?.whyChoose} />,
  industries: (content, collections) => <IndustriesSection content={content} industries={collections?.industries} />,
  process: (content, collections) => <ProcessSection content={content} steps={collections?.process} />,
  solutions: (content, collections) => <FeaturedSolutionsSection content={content} solutions={collections?.solutions} categories={collections?.serviceCategories} />,
  team: (content, collections) => <TeamSection content={content} members={collections?.team} />,
  technology: (content, collections) => <TechStackSection content={content} groups={collections?.techStack} />,
  contact: (content) => <ContactBriefSection content={content} />,
  mainServices: (content, collections) => <MainServicesAmbushSection content={content} services={collections?.mainServices} />,
};

export function LandingPageSections({ sections, collections }: { sections: HomepageSectionContent[]; collections?: WebsiteCollections }) {
  return sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order)
    .map((section) => <div key={section.key}>{sectionComponents[section.key](section, collections)}</div>);
}
