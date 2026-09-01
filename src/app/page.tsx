import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroWrapper } from '@/components/home/HeroWrapper';
import { LandingPageSections } from '@/components/sections';
import { OurServicesSection } from '@/components/sections/OurServicesSection';
import { getHomepageContent } from '@/lib/homepage-content.server';
import { getWebsiteCollections } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const revalidate = 300;

export const metadata: Metadata = {
  ...createPageMetadata(staticPageMetadata.home),
};

export default async function Home() {
  const [content, collections] = await Promise.all([getHomepageContent(), getWebsiteCollections()]);
  const servicesSection = content.sections.find((section) => section.key === 'services');
  const homepageSections = content.sections.filter((section) => section.key !== 'services');

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[var(--color-canvas)] text-brand-950">
      <Header navigation={collections.navigation} />
      {content.hero.enabled ? <HeroWrapper content={content.hero} /> : null}
      {servicesSection?.enabled ? <OurServicesSection content={servicesSection} categories={collections.serviceCategories} /> : null}
      <LandingPageSections sections={homepageSections} collections={collections} />
      <Footer />
    </main>
  );
}
