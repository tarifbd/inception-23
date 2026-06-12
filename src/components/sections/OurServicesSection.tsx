import { serviceCategories } from '@/lib/constants/service-categories';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { ServiceCategoryCard } from './ServiceCategoryCard';
import type { HomepageSectionContent } from '@/lib/homepage-content';

export function OurServicesSection({ content }: { content: HomepageSectionContent }) {
  return (
    <AnimatedSection id="services" className="bg-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <p className="max-w-sm text-sm font-bold leading-7 text-slate-500">
          {content.supportingText}
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {serviceCategories.map((category, index) => (
          <ServiceCategoryCard key={category.key} category={category} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
}
