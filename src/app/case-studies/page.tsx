import type { Metadata } from 'next';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { caseStudies, services } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Case Studies',
  description: 'Selected advisory, technology, legal, management, finance, and creative project highlights with measurable intent.',
  path: '/case-studies',
});

export const revalidate = 300;

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
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white dark:bg-night-950">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Case studies" title="Project highlights with measurable intent." description="Prepared as a content-managed portfolio with service filters and detail pages." headingLevel="h1" />
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((service) => (
              <span key={service.slug} className={`rounded px-4 py-2 text-xs font-semibold ${service.theme.soft} ${service.theme.text}`}>
                {service.title}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {displayCaseStudies.map((study) => {
              const service = services.find((item) => item.slug === study.serviceSlug);
              return (
                <article key={study.slug} className={`ui-card-interactive rounded-lg border ${service?.theme.border} bg-white p-5 shadow-sm dark:bg-night-900 sm:p-7 lg:p-8`}>
                  {study.image ? (
                    <div className="ui-media mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                      <Image src={study.image} alt={study.title} width={720} height={450} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <p className={`text-xs font-semibold ${service?.theme.text}`}>{study.service}</p>
                  <h2 className="mt-6 break-words font-serif text-2xl font-bold leading-tight text-brand-950 sm:mt-8 sm:text-3xl">{study.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{study.summary}</p>
                  <p className="mt-8 border-l-2 border-support-500 bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-950 dark:bg-night-800">{study.metric}</p>
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
