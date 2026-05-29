import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactBriefSection } from '@/components/sections';
import { processSteps } from '@/lib/constants/process';
import { serviceCategories } from '@/lib/constants/service-categories';
import { teamCategories } from '@/lib/constants/team';
import { serviceThemes } from '@/lib/constants/theme';
import { whyChooseItems } from '@/lib/constants/why-choose';

export const metadata: Metadata = {
  title: 'About | Inception 23',
  description: 'Learn about Inception 23, a premium advisory and solution company built for strategic execution.',
};

const values = [
  'Clarity before complexity',
  'Execution over theater',
  'Trust through disciplined systems',
  'Design with commercial purpose',
];

const expertiseAreas = [
  'Technology and AI systems',
  'Management consulting and process control',
  'Finance, tax, VAT, customs, and business advisory support',
  'Legal documentation and compliance coordination',
  'Brand, communication, and market experience',
  'Dashboards, operating models, and implementation governance',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-brand-950">
      <Header />

      <section className="relative overflow-hidden bg-[#f8fafc] pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(16,185,129,0.1),transparent_28%),radial-gradient(circle_at_76%_86%,rgba(124,58,237,0.09),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">About Inception 23</p>
            <h1 className="max-w-5xl font-serif text-[clamp(2.6rem,5.5vw,6rem)] font-black leading-[1.02] tracking-normal text-brand-950">
              Advisory, systems, and market execution for decisive companies.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              Inception 23 helps leadership teams turn complex business moves into operating systems, advisory clarity, compliance readiness, digital infrastructure, and market-facing trust.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900">
                Book a Consultation <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white/70 px-7 py-4 text-sm font-black text-brand-950 transition hover:-translate-y-0.5 hover:border-brand-700/40 hover:bg-brand-50">
                Explore services
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCategories.map((category) => {
              const theme = serviceThemes[category.key];
              return (
                <article key={category.key} className={`rounded-[1.5rem] border bg-white/86 p-5 shadow-xl shadow-slate-950/6 backdrop-blur-xl ${theme.border}`}>
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg`}>
                    <LandingIcon name={category.icon} size={21} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${theme.text}`}>{category.shortTitle}</p>
                  <h2 className="mt-2 text-lg font-black leading-tight text-brand-950">{category.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="mission" className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50/70 p-7 shadow-sm md:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Mission</p>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,4.4rem)] font-black leading-[1.04] text-brand-950">
              Turn advisory into operating advantage.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Our mission is to help organizations install the strategy, systems, documents, dashboards, and creative assets required to move faster with control.
            </p>
          </article>
          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/6 md:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Vision</p>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,4.4rem)] font-black leading-[1.04] text-brand-950">
              A trusted transformation partner.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              We aim to become the advisory and solution partner leaders call when the work is too important for generic execution.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Values</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              How we operate.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {values.map((value, index) => {
              const theme = serviceThemes[index % 4 === 0 ? 'it' : index % 4 === 1 ? 'consultancy' : index % 4 === 2 ? 'legal' : 'creative'];
              return (
                <div key={value} className={`rounded-[1.5rem] border bg-white p-6 shadow-sm ${theme.border}`}>
                  <span className={`mb-7 flex h-11 w-11 items-center justify-center rounded-2xl font-black ${theme.bg} ${theme.text}`}>
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-black leading-tight text-brand-950">{value}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Expertise areas</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              One operating view across advisory and implementation.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The firm is designed for leaders who need connected decisions, not isolated services.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {expertiseAreas.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-bold leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-700" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Why Inception 23</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              Built for serious operating conversations.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {whyChooseItems.map((item) => (
              <article key={item.title} className="rounded-[1.45rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-950 text-white shadow-lg shadow-brand-950/15">
                  <LandingIcon name={item.icon} size={19} />
                </div>
                <h3 className="text-xl font-black leading-tight text-brand-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Team model</p>
              <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
                Leadership, advisory, and execution capacity.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Team profiles are structured for future admin-managed expansion while keeping the consulting-firm hierarchy clear.
              </p>
            </div>
            <Link href="/#team" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-brand-950 transition hover:border-brand-700/40 hover:bg-brand-50">
              View team <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {teamCategories.map((group) => (
              <article key={group.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-7 shadow-sm">
                <h3 className="font-serif text-3xl font-black text-brand-950">{group.label}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{group.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Process</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              From discovery to scale.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.slice(0, 4).map((step) => (
              <article key={step.id} className="rounded-[1.45rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-700">{step.number}</p>
                <h3 className="mt-3 text-xl font-black text-brand-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBriefSection />
      <Footer />
    </main>
  );
}
