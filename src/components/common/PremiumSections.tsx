import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { caseStudies, insights, services, testimonials, type ServiceDefinition } from '@/lib/constants/services';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-brand-600">{eyebrow}</p>
      <h2 className="break-words font-serif text-[clamp(2rem,5vw,3.75rem)] font-black leading-[1.06] text-brand-950 sm:leading-tight">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">{description}</p> : null}
    </div>
  );
}

export function ServiceCard({ service }: { service: ServiceDefinition }) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative overflow-hidden rounded-[1.75rem] border ${service.theme.border} bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10`}
    >
      <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full ${service.theme.surface}`} />
      <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.theme.gradient} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <p className={`mb-3 text-xs font-black uppercase tracking-[0.22em] ${service.theme.text}`}>{service.eyebrow}</p>
      <h3 className="font-serif text-3xl font-black text-brand-950">{service.title}</h3>
      <p className="mt-4 min-h-24 text-sm leading-7 text-slate-600">{service.summary}</p>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-black text-brand-950">
        Explore service <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function ServicesGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}

export function ProcessBand() {
  const steps = [
    ['01', 'Diagnose', 'Map the business context, risks, systems, and growth constraints.'],
    ['02', 'Design', 'Build the strategy, operating model, experience, or technical architecture.'],
    ['03', 'Deploy', 'Implement in focused increments with clear ownership and measurable outcomes.'],
    ['04', 'Improve', 'Review performance, optimize execution, and prepare the next growth cycle.'],
  ];

  return (
    <section className="bg-brand-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Operating model"
          title="From advisory to execution."
          description="We do not stop at recommendations. We build the systems, artifacts, and cadence required to make the work operational."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {steps.map(([number, title, copy]) => (
            <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <div className="mb-8 font-serif text-4xl font-black text-white/40">{number}</div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseStudyPreview() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Selected work"
            title="Proof of disciplined execution."
            description="Representative project structures prepared for future database-driven case studies."
          />
          <Link href="/case-studies" className="inline-flex items-center gap-2 font-black text-brand-950">
            View case studies <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {caseStudies.map((study) => {
            const service = services.find((item) => item.slug === study.serviceSlug);
            return (
              <Link key={study.slug} href={`/case-studies?case=${study.slug}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${service?.theme.soft} ${service?.theme.text}`}>
                  {study.service}
                </span>
                <h3 className="mt-8 font-serif text-3xl font-black text-brand-950">{study.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{study.summary}</p>
                <p className="mt-8 text-sm font-black text-brand-950">{study.metric}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function InsightPreview() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Insights" title="Thinking for decisive leaders." align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {insights.map((post) => (
            <Link key={post.slug} href={`/insights?post=${post.slug}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">{post.category}</p>
              <h3 className="mt-6 font-serif text-3xl font-black text-brand-950">{post.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{post.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialBand() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {testimonials.map((item) => (
          <figure key={item.name} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <blockquote className="font-serif text-3xl font-black leading-tight text-brand-950">&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className="mt-8 text-sm font-bold text-slate-600">
              {item.name} / {item.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-brand-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-brand-300">Confidential inquiry</p>
        <h2 className="font-serif text-4xl font-black leading-tight md:text-6xl">Build the next operating advantage.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Tell us where the business needs clarity, control, or acceleration. We will help shape the right next move.
        </p>
        <Link href="/contact" className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-black text-brand-950 transition hover:-translate-y-1">
          Start a brief <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function Checklist({ items, service }: { items: string[]; service: ServiceDefinition }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <CheckCircle2 className={service.theme.text} size={18} />
          <span className="text-sm font-bold leading-6 text-slate-700">{item}</span>
        </div>
      ))}
    </div>
  );
}
