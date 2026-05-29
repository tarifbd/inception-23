import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LottieStage } from '@/components/animations/LottieStage';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCTA } from '@/components/common/PremiumSections';
import { ServiceDetailExperience } from '@/components/services/ServiceDetailExperience';
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

      <ServiceDetailExperience service={{ shortId: service.shortId }} />
      <FinalCTA />
      <Footer />
    </main>
  );
}
