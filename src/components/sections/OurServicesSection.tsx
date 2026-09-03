import { serviceCategories, type ServiceCategory } from '@/lib/constants/service-categories';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { ServiceCategoryCard } from './ServiceCategoryCard';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function OurServicesSection({ content, categories }: { content: HomepageSectionContent; categories?: CollectionRecord[] }) {
  const displayCategories = (categories?.length ? categories : serviceCategories) as ServiceCategory[];

  return (
    <AnimatedSection id="services" aria-label={content.label} motionVariant="editorial" className="bg-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        {content.supportingText ? (
          <p className="max-w-sm text-sm font-bold leading-7 text-slate-500">
            {content.supportingText}
          </p>
        ) : null}
      </div>
      <div data-motion-grid className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-y-0">
        {displayCategories.map((category, index) => (
          <ServiceCategoryCard key={category.key} category={category} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
}
