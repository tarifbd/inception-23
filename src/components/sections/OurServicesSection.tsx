import { serviceCategories } from '@/lib/constants/service-categories';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import { ServiceCategoryCard } from './ServiceCategoryCard';

export function OurServicesSection() {
  return (
    <AnimatedSection id="services" className="bg-white">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Our services"
          title="Four advisory pillars, one operating intelligence."
          description="Inception 23 combines technology, business control, legal support, and market experience into one integrated transformation partner."
        />
        <p className="max-w-sm text-sm font-bold leading-7 text-slate-500">
          Each pillar has its own color system and delivery discipline, but every engagement stays connected to the same business outcome.
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
