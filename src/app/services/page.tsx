import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCTA, SectionHeader, ServicesGrid } from '@/components/common/PremiumSections';

export const metadata: Metadata = {
  title: 'Services | Inception 23',
  description: 'Explore IT and AI solutions, management consultancy, legal support, and creative advisory services.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader
            eyebrow="Services"
            title="Premium advisory and solution systems."
            description="Each service pillar has a distinct operating purpose and visual language, designed to help leadership teams move with clarity."
          />
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <FinalCTA />
      <Footer />
    </main>
  );
}
