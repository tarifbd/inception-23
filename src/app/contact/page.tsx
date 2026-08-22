import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactBriefSection } from '@/components/sections';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: 'Start a confidential inquiry for business advisory, technology, management, finance, legal, event, or creative support.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden bg-white text-brand-950">
      <Header />
      <div className="pt-16 sm:pt-20 md:pt-24">
        <ContactBriefSection headingLevel="h1" />
      </div>
      <Footer />
    </main>
  );
}
