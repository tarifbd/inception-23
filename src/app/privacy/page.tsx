import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'How Inception 23 handles information submitted through this website.',
  path: '/privacy',
});

const sections = [
  {
    title: 'Information you provide',
    body: 'When you submit a contact brief or newsletter request, the website receives the information entered in that form. Please avoid sending confidential or sensitive material until an appropriate engagement process is agreed.',
  },
  {
    title: 'Website measurement',
    body: 'The site may use enabled analytics and advertising measurement tools. Their operation depends on the site configuration and any consent controls presented to you.',
  },
  {
    title: 'How information is used',
    body: 'Submitted information is used to respond to inquiries, assess requested services, operate the website, and maintain relevant business communication.',
  },
  {
    title: 'Privacy questions',
    body: 'For questions about information submitted through this website, contact hello@inception23.com.',
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white text-brand-950 dark:bg-night-950">
      <Header />
      <section className="pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-brand-700">Website policy</p>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.02]">Privacy Policy</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
            This page explains the website-level handling of information visitors choose to submit to Inception 23.
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
