import type { Metadata } from 'next';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { caseStudies, services } from '@/lib/constants/services';
import { solutions as solutionBriefs } from '@/lib/constants/solutions';
import type { ServiceKey } from '@/lib/constants/theme';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.caseStudies);

export const revalidate = 300;

type CmsCaseStudy = CollectionRecord & {
  slug: string;
  title: string;
  service: string;
  serviceSlug: string;
  summary: string;
  metric: string;
  image?: string;
  badge?: string;
  modules?: string[] | string;
  isPublished?: string | boolean;
};

const serviceSlugByKey: Record<ServiceKey, CmsCaseStudy['serviceSlug']> = {
  it: 'it-ai-solutions',
  consultancy: 'management-consultancy',
  legal: 'legal-support',
  creative: 'creative-others',
};

const servicePreviewImages: Record<ServiceKey, string> = {
  it: '/solutions/nexus-crm.webp',
  consultancy: '/main-services/management-finance-photo.webp',
  legal: '/solutions/legal-document-intelligence.jpeg',
  creative: '/main-services/creative-execution-photo.webp',
};

function fallbackSolutionCaseStudies(): CmsCaseStudy[] {
  return solutionBriefs.map((solution) => {
    const serviceSlug = serviceSlugByKey[solution.serviceKey];
    const service = services.find((item) => item.slug === serviceSlug);

    return {
      id: solution.id,
      slug: solution.id,
      title: solution.title,
      service: service?.title ?? solution.serviceKey,
      serviceSlug,
      summary: solution.description,
      metric: solution.outcome,
      image: solution.image ?? servicePreviewImages[solution.serviceKey],
      badge: solution.badge,
      modules: solution.modules,
    };
  });
}

function normalizeModules(value: CmsCaseStudy['modules']) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

export default async function CaseStudiesPage() {
  const cmsCaseStudies = await getWebsiteCollection<CmsCaseStudy>('caseStudies');
  const solutionCaseStudies = fallbackSolutionCaseStudies();
  const fallbackCaseStudies = solutionCaseStudies.length ? solutionCaseStudies : caseStudies as CmsCaseStudy[];
  const displayCaseStudies = (cmsCaseStudies.length ? cmsCaseStudies : fallbackCaseStudies)
    .filter((study) => study.isPublished !== 'false' && study.isPublished !== false);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white dark:bg-night-950">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Case studies" title="Project highlights with measurable intent." description="Browse image-led work briefs across technology, management, legal support, and creative delivery." headingLevel="h1" />
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((service) => (
              <span key={service.slug} className={`rounded px-4 py-2 text-xs font-semibold ${service.theme.soft} ${service.theme.text}`}>
                {service.title}
              </span>
            ))}
          </div>
          <div id="case-study-library" className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {displayCaseStudies.map((study) => {
              const service = services.find((item) => item.slug === study.serviceSlug);
              const modules = normalizeModules(study.modules).slice(0, 4);

              return (
                <article key={study.slug} className={`ui-card-interactive rounded-lg border ${service?.theme.border} bg-white p-5 shadow-sm dark:bg-night-900 sm:p-7 lg:p-8`}>
                  {study.image ? (
                    <div className="ui-media mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                      <Image src={study.image} alt={study.title} width={720} height={450} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-xs font-semibold ${service?.theme.text}`}>{study.service}</p>
                    {study.badge ? (
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${service?.theme.soft} ${service?.theme.text}`}>
                        {study.badge}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-6 break-words font-serif text-2xl font-bold leading-tight text-brand-950 sm:mt-8 sm:text-3xl">{study.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{study.summary}</p>
                  {modules.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {modules.map((module) => (
                        <span key={module} className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {module}
                        </span>
                      ))}
                    </div>
                  ) : null}
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
