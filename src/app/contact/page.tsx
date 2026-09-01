import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactBriefSection } from '@/components/sections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.contact);

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
