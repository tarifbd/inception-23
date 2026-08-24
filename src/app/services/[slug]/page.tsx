import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LottieStage } from '@/components/animations/LottieStage';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Checklist, FinalCTA, SectionHeader, ServiceCard } from '@/components/common/PremiumSections';
import { getService, services } from '@/lib/constants/services';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Inception 23`,
    description: service.summary,
    openGraph: {
      title: `${service.title} | Inception 23`,
      description: service.summary,
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const Icon = service.icon;
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className={`relative overflow-hidden pt-40 pb-24 ${service.theme.soft}`}>
        <div className={`absolute right-0 top-20 h-80 w-80 rounded-full ${service.theme.surface} blur-[70px]`} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
          <div>
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border ${service.theme.border} bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] ${service.theme.text}`}>
              <Icon size={16} /> {service.eyebrow}
            </div>
            <h1 className="font-serif text-5xl font-black leading-tight text-brand-950 md:text-7xl">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{service.description}</p>
            <Link href="/contact" className={`mt-10 inline-flex items-center gap-3 rounded-2xl px-7 py-4 font-black transition hover:-translate-y-1 ${service.theme.button}`}>
              Discuss this service <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative aspect-square">
            <LottieStage src={service.lottie} />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Problems we solve" title="Where the work begins." />
            <div className="mt-8">
              <Checklist items={service.problems} service={service} />
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Solutions" title="What we build with you." />
            <div className="mt-8">
              <Checklist items={service.solutions} service={service} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader eyebrow="Delivery process" title="Structured for execution." />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {service.process.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <div className="font-serif text-4xl font-black text-white/35">{String(index + 1).padStart(2, '0')}</div>
                <p className="mt-8 text-sm font-bold leading-7 text-white/75">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Deliverables" title="Concrete outputs." />
            <div className="mt-8">
              <Checklist items={service.deliverables} service={service} />
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Use cases" title="Built around real work." />
            <div className="mt-8">
              <Checklist items={service.useCases} service={service} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader eyebrow="Related services" title="Connected capabilities." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}
