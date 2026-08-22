import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCTA, SectionHeader, ServicesGrid } from '@/components/common/PremiumSections';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Business Advisory & Solution Services',
  description: 'Explore technology, management consultancy, finance advisory, legal support, event management, and creative services.',
  path: '/services',
  keywords: ['business consultancy services', 'technology consulting', 'finance and legal support'],
});

export default function ServicesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Services"
            title="Advisory and solution systems."
            description="Each service area has a clear operating purpose, designed to help leadership teams move with clarity."
            headingLevel="h1"
          />
          <div className="mt-10 sm:mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <FinalCTA />
      <Footer />
    </main>
  );
}
