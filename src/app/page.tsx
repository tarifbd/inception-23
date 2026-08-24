import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Target, Workflow } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CaseStudyPreview, FinalCTA, InsightPreview, ProcessBand, SectionHeader, ServicesGrid, TestimonialBand } from '@/components/common/PremiumSections';

export const metadata: Metadata = {
  title: 'Inception 23 | Advisory, Consulting & Solution Company',
  description:
    'Premium advisory, consulting, IT, legal, management, and creative solution company for decisive business transformation.',
  openGraph: {
    title: 'Inception 23 | Advisory, Consulting & Solution Company',
    description: 'Strategic advisory, AI systems, management consultancy, legal support, and creative solution design.',
    type: 'website',
  },
};

const differentiators = [
  {
    icon: Target,
    title: 'Strategic clarity',
    copy: 'We define the commercial, operational, legal, and technical decisions that matter most.',
  },
  {
    icon: Workflow,
    title: 'Execution systems',
    copy: 'We turn recommendations into workflows, assets, platforms, and measurable operating cadence.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted control',
    copy: 'We design for security, compliance, governance, and leadership confidence from the start.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white selection:bg-brand-700 selection:text-white">
      <Header />

      <section className="bg-white pb-24 pt-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Core capabilities"
              title="One firm for strategy, systems, risk, and market presence."
              description="Four integrated service pillars, each with its own operating discipline, visual system, and business outcome."
            />
            <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-brand-950 transition hover:border-brand-500">
              All services <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12">
            <ServicesGrid />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader
            eyebrow="Why choose us"
            title="A premium partner for complex business moves."
            description="The work is built for leaders who need decisions to become systems, not just slides."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-8">
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-950 text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-serif text-3xl font-black text-brand-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessBand />
      <CaseStudyPreview />
      <TestimonialBand />
      <InsightPreview />
      <FinalCTA />
      <Footer />
    </main>
  );
}
