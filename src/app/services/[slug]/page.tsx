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
      <section className={`relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40 ${service.theme.soft}`}>
        <div className={`absolute right-0 top-20 h-80 w-80 rounded-full ${service.theme.surface} blur-[70px]`} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className={`mb-5 inline-flex max-w-full items-center gap-2 rounded-full border ${service.theme.border} bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] sm:mb-6 sm:text-xs sm:tracking-[0.2em] ${service.theme.text}`}>
              <Icon size={16} /> {service.eyebrow}
            </div>
            <h1 className="break-words font-serif text-[clamp(2.35rem,6vw,4.5rem)] font-black leading-[1.06] text-brand-950">{service.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg sm:leading-8">{service.description}</p>
            <Link href="/contact" className={`mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-4 font-black transition hover:-translate-y-1 sm:mt-10 sm:w-auto ${service.theme.button}`}>
              Discuss this service <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
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
