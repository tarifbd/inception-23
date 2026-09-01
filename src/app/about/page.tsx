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
import { getWebsiteCollections } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.about);

const values = [
  'Clarity before complexity',
  'Execution over theater',
  'Trust through disciplined systems',
  'Design with commercial purpose',
];

const expertiseAreas = [
  'Technology and software systems',
  'Management consulting and process control',
  'Finance, tax, VAT, customs, and business advisory support',
  'Legal documentation and compliance coordination',
  'Brand, communication, and market experience',
  'Dashboards, operating models, and implementation governance',
];

export const revalidate = 300;

export default async function AboutPage() {
  const collections = await getWebsiteCollections();
  const cmsValues = collections.aboutValues;
  const cmsExpertise = collections.aboutExpertise;
  const displayValues = cmsValues.length ? cmsValues.map((item) => String(item.label || '')).filter(Boolean) : values;
  const displayExpertiseAreas = cmsExpertise.length ? cmsExpertise.map((item) => String(item.label || '')).filter(Boolean) : expertiseAreas;
  const displayServiceCategories = collections.serviceCategories.length ? collections.serviceCategories as unknown as typeof serviceCategories : serviceCategories;
  const displayWhyChoose = collections.whyChoose.length ? collections.whyChoose as unknown as typeof whyChooseItems : whyChooseItems;
  const displayTeamCategories = collections.team.length ? teamCategories.map((group) => ({
    ...group,
    summary: `${collections.team.filter((member) => String(member.category) === group.id).length} active profiles managed through the team CMS.`,
  })) : teamCategories;
  const displayProcess = collections.process.length ? collections.process as unknown as typeof processSteps : processSteps;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden bg-white text-brand-950 dark:bg-night-950">
      <Header />

      <section className="relative overflow-hidden bg-slate-50 pb-16 pt-28 dark:bg-night-950 sm:pb-20 sm:pt-36 md:pb-28 md:pt-44">
        <div className="absolute inset-0 bg-paper-grid bg-[size:64px_64px] opacity-70 dark:opacity-20" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">About Inception 23</p>
            <h1 className="max-w-5xl break-words font-serif text-[clamp(2.25rem,5.5vw,6rem)] font-black leading-[1.06] tracking-normal text-brand-950 sm:leading-[1.02]">
              Advisory, systems, and market execution for growing companies.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              Inception 23 helps leadership teams turn complex business needs into clearer systems, advisory support, compliance readiness, digital infrastructure, and market-facing trust.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="ui-action inline-flex items-center justify-center gap-3 rounded-lg bg-brand-950 px-7 py-4 text-sm font-semibold text-white shadow-md hover:bg-brand-900">
                Book a Consultation <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="ui-action inline-flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white/70 px-7 py-4 text-sm font-semibold text-brand-950 hover:border-brand-700/40 hover:bg-brand-50 dark:border-white/10 dark:bg-night-900">
                Explore services
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {displayServiceCategories.map((category) => {
              const theme = serviceThemes[category.key];
              return (
                <article key={category.key} className={`ui-card-interactive rounded-lg border bg-white/86 p-5 shadow-sm backdrop-blur-xl dark:bg-night-900/86 ${theme.border}`}>
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${theme.gradient} text-white shadow-sm`}>
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

      <section id="mission" className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-7 md:rounded-[2rem] md:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Mission</p>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,4.4rem)] font-black leading-[1.04] text-brand-950">
              Turn advisory into practical operating support.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Our mission is to help organizations install the strategy, systems, documents, dashboards, and creative assets required to move faster with control.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/6 sm:p-7 md:rounded-[2rem] md:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Vision</p>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,4.4rem)] font-black leading-[1.04] text-brand-950">
              A trusted execution partner.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              We aim to become the advisory and solution partner leaders call when the work needs careful thinking and reliable follow-through.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Values</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              How we operate.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {displayValues.map((value, index) => {
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

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.15fr] lg:items-start lg:px-8">
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
            {displayExpertiseAreas.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-bold leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-700" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Why Inception 23</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              Built for serious operating conversations.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {displayWhyChoose.map((item) => (
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

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Team model</p>
              <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
                Leadership, advisory, and execution capacity.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Team profiles are structured for admin-managed expansion while keeping the consulting-firm hierarchy clear.
              </p>
            </div>
            <Link href="/#team" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-brand-950 transition hover:border-brand-700/40 hover:bg-brand-50">
              View team <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {displayTeamCategories.map((group) => (
              <article key={group.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-7 shadow-sm">
                <h3 className="font-serif text-3xl font-black text-brand-950">{group.label}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{group.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Process</p>
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[1.02] text-brand-950">
              From discovery to scale.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayProcess.slice(0, 4).map((step) => (
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
