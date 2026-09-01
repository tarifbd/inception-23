import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { LottieStage } from '@/components/animations/LottieStage';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/seo/JsonLd';
import { FinalCTA } from '@/components/common/PremiumSections';
import { ServiceDetailExperience } from '@/components/services/ServiceDetailExperience';
import { getService, services, type ServiceDefinition } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { servicePageMetadata } from '@/lib/seo/page-metadata';
import { breadcrumbSchema, serviceSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/site';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

function stringList(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return fallback;
}

async function getCmsService(slug: string): Promise<(ServiceDefinition & { heroImage?: string }) | undefined> {
  const fallback = getService(slug);
  if (!fallback) return undefined;
  const records = await getWebsiteCollection<CollectionRecord>('serviceDetails');
  const record = records.find((item) => String(item.slug) === slug);
  if (!record) return fallback;
  return {
    ...fallback,
    title: String(record.title || fallback.title), eyebrow: String(record.eyebrow || fallback.eyebrow),
    summary: String(record.summary || fallback.summary), description: String(record.description || fallback.description),
    lottie: String(record.lottie || fallback.lottie), heroImage: String(record.heroImage || ''), problems: stringList(record.problems, fallback.problems),
    solutions: stringList(record.solutions, fallback.solutions), process: stringList(record.process, fallback.process),
    deliverables: stringList(record.deliverables, fallback.deliverables), useCases: stringList(record.useCases, fallback.useCases),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getCmsService(slug);
  if (!service) return {};
  const seo = servicePageMetadata[service.slug];
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/services/${service.slug}`,
    keywords: [service.title, service.eyebrow, ...seo.keywords],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getCmsService(slug);
  if (!service) notFound();
  const Icon = service.icon;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white dark:bg-night-950">
      <JsonLd
        data={[
          serviceSchema({
            name: service.title,
            description: service.description,
            url: absoluteUrl(`/services/${service.slug}`),
            providerName: siteConfig.name,
            providerUrl: siteConfig.url,
            areaServed: 'Bangladesh',
          }),
          breadcrumbSchema([
            { name: 'Home', item: absoluteUrl('/') },
            { name: 'Services', item: absoluteUrl('/services') },
            { name: service.title, item: absoluteUrl(`/services/${service.slug}`) },
          ]),
        ]}
      />
      <Header />
      <section className={`relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40 ${service.theme.soft}`}>
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className={`mb-5 inline-flex max-w-full items-center gap-2 border-l-2 ${service.theme.border} bg-white/70 py-1 pl-3 text-xs font-semibold dark:bg-transparent sm:mb-6 ${service.theme.text}`}>
              <Icon size={16} /> {service.eyebrow}
            </div>
            <h1 className="break-words font-serif text-[clamp(2.35rem,6vw,4.5rem)] font-bold leading-[1.06] text-brand-950">{service.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg sm:leading-8">{service.description}</p>
            <Link href="/contact" className={`ui-action mt-8 inline-flex w-full items-center justify-center gap-3 rounded-lg px-7 py-4 font-semibold sm:mt-10 sm:w-auto ${service.theme.button}`}>
              Discuss this service <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            {service.heroImage ? (
              <Image src={service.heroImage} alt="" fill priority className="object-contain" sizes="(min-width: 1024px) 50vw, 100vw" />
            ) : <LottieStage src={service.lottie} />}
          </div>
        </div>
      </section>

      <ServiceDetailExperience service={{
        shortId: service.shortId,
        problems: service.problems,
        solutions: service.solutions,
        process: service.process,
        deliverables: service.deliverables,
        useCases: service.useCases,
      }} />
      <FinalCTA />
      <Footer />
    </main>
  );
}
