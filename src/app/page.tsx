import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroWrapper } from '@/components/home/HeroWrapper';
import { LandingPageSections } from '@/components/sections';
import { OurServicesSection } from '@/components/sections/OurServicesSection';
import { getHomepageContent } from '@/lib/homepage-content.server';
import { getWebsiteCollections } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Advisory, Consulting & Business Solutions',
    description:
      'Technology solutions, management consultancy, finance advisory, legal support, event management, and creative services for practical business execution.',
    path: '/',
    keywords: ['business consulting Dhaka', 'business solutions Bangladesh'],
  }),
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
