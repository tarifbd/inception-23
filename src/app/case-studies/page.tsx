import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { caseStudies, services } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';

export const metadata: Metadata = {
  title: 'Case Studies | Inception 23',
  description: 'Selected advisory, technology, legal, management, and creative project highlights.',
};

export const dynamic = 'force-dynamic';

type CmsCaseStudy = CollectionRecord & {
  slug: string;
  title: string;
  service: string;
  serviceSlug: string;
  summary: string;
  metric: string;
  image?: string;
  isPublished?: string | boolean;
};

export default async function CaseStudiesPage() {
  const cmsCaseStudies = await getWebsiteCollection<CmsCaseStudy>('caseStudies');
  const displayCaseStudies = (cmsCaseStudies.length ? cmsCaseStudies : caseStudies as CmsCaseStudy[])
    .filter((study) => study.isPublished !== 'false' && study.isPublished !== false);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Case studies" title="Project highlights with measurable intent." description="Prepared as a future database-driven portfolio with service filters and detail pages." />
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((service) => (
              <span key={service.slug} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${service.theme.soft} ${service.theme.text}`}>
                {service.title}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {displayCaseStudies.map((study) => {
              const service = services.find((item) => item.slug === study.serviceSlug);
              return (
                <article key={study.slug} className={`rounded-[1.5rem] border ${service?.theme.border} bg-white p-5 shadow-sm sm:p-7 lg:rounded-[1.75rem] lg:p-8`}>
                  {study.image ? (
                    <div className="mb-5 aspect-[16/10] overflow-hidden rounded-[1rem] bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={study.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <p className={`text-xs font-black uppercase tracking-[0.22em] ${service?.theme.text}`}>{study.service}</p>
                  <h2 className="mt-6 break-words font-serif text-2xl font-black leading-tight text-brand-950 sm:mt-8 sm:text-3xl">{study.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{study.summary}</p>
                  <p className="mt-8 rounded-full bg-slate-50 px-4 py-3 text-sm font-black text-brand-950">{study.metric}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
