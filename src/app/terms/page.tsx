import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.terms);

const sections = [
  {
    title: 'Website information',
    body: 'The material on this website is general information about Inception 23 and its service areas. It is not a substitute for advice based on your specific legal, tax, financial, technical, or business circumstances.',
  },
  {
    title: 'Service engagements',
    body: 'Submitting a form or contacting Inception 23 does not by itself create a professional engagement. Scope, responsibilities, fees, and delivery terms must be agreed separately.',
  },
  {
    title: 'Responsible use',
    body: 'Do not misuse the website, interfere with its operation, attempt unauthorized access, or submit unlawful or harmful material.',
  },
  {
    title: 'Questions',
    body: 'Questions about these website terms can be sent to hello@inception23.com.',
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white text-brand-950 dark:bg-night-950">
      <Header />
      <section className="pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-brand-700">Website terms</p>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.02]">Terms of Use</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
            These terms apply to use of the public Inception 23 website and the information published on it.
          </p>
          <div className="mt-12 space-y-10 border-t border-slate-200 pt-10 dark:border-white/10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl font-bold">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
