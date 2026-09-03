import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroWrapper } from '@/components/home/HeroWrapper';
import { HomepageDeferredSections } from '@/components/sections/HomepageDeferredSections.client';
import { HomepageSectionNav, type HomepageSectionNavItem } from '@/components/sections/HomepageSectionNav';
import { OurServicesSection } from '@/components/sections/OurServicesSection';
import type { HomepageSectionKey } from '@/lib/homepage-content';
import { getHomepageContent } from '@/lib/homepage-content.server';
import { getWebsiteCollections } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const revalidate = 300;

export const metadata: Metadata = {
  ...createPageMetadata(staticPageMetadata.home),
};

const sectionIdByKey: Record<HomepageSectionKey, string> = {
  services: 'services',
  events: 'event-management',
  ecosystem: 'ecosystem',
  ai: 'ai-solutions',
  caAdvisory: 'ca-advisory',
  why: 'why',
  industries: 'industries',
  process: 'process',
  solutions: 'solutions',
  team: 'team',
  technology: 'technology',
  mainServices: 'main-services-ambush',
  contact: 'inquiry',
};

export default async function Home() {
  const [content, collections] = await Promise.all([getHomepageContent(), getWebsiteCollections()]);
  const servicesSection = content.sections.find((section) => section.key === 'services');
  const homepageSections = content.sections.filter((section) => section.key !== 'services');
  const sectionNavItems: HomepageSectionNavItem[] = content.sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order)
    .flatMap((section) => section.key === 'contact'
      ? [
          { id: 'inquiry', label: 'Contact Form' },
          { id: 'contact', label: 'Contact' },
        ]
      : [{ id: sectionIdByKey[section.key], label: section.label }]);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[var(--color-canvas)] text-brand-950">
      <Header navigation={collections.navigation} />
      {content.hero.enabled ? <HeroWrapper content={content.hero} /> : null}
      <HomepageSectionNav items={sectionNavItems} />
      {servicesSection?.enabled ? (
        <div className="homepage-deferred-section">
          <OurServicesSection content={servicesSection} categories={collections.serviceCategories} />
        </div>
      ) : null}
      <HomepageDeferredSections sections={homepageSections} collections={collections} />
      <Footer />
    </main>
  );
}
