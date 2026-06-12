import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactBriefSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Contact | Inception 23',
  description: 'Start a confidential inquiry with Inception 23 for advisory, consulting, legal, AI, and creative solutions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-brand-950">
      <Header />
      <div className="pt-16 sm:pt-20 md:pt-24">
        <ContactBriefSection />
      </div>
      <Footer />
    </main>
  );
}
