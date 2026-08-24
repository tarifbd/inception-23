import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactForm } from '@/components/common/ContactForm';
import { SectionHeader } from '@/components/common/PremiumSections';

export const metadata: Metadata = {
  title: 'Contact | Inception 23',
  description: 'Start a confidential inquiry with Inception 23 for advisory, consulting, legal, AI, and creative solutions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <section className="pt-40 pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Start with a confidential brief."
              description="Share the business context, desired outcome, and the service area that feels most relevant. We will review it as a strategic conversation, not a generic lead."
            />
            <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
              <strong className="text-brand-950">Response-ready structure:</strong> submissions are stored through the API and prepared for future email integration.
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
