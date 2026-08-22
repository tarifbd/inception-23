import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Youtube,
} from 'lucide-react';
import { NewsletterForm } from '@/components/layout/NewsletterForm.client';
import { serviceCategories } from '@/lib/constants/service-categories';
import { industriesMenu, insightsMenu, solutionMenu } from '@/lib/constants/navigation';
import {
  contactHighlights as defaultContactHighlights,
  footerCompanyLinks as defaultFooterCompanyLinks,
  footerSocialLinks as defaultFooterSocialLinks,
  footerTrustPoints as defaultFooterTrustPoints,
} from '@/lib/constants/site-content';
import { getWebsiteCollections } from '@/lib/website-collections';

const iconMap = { Clock3, Facebook, Globe2, Instagram, Linkedin, Mail, MapPin, MessageCircle, Youtube };

function isSpecificSocialUrl(href: string) {
  if (!href || href === '#') return false;
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && url.pathname !== '/' && url.pathname !== '';
  } catch {
    return false;
  }
}

export async function Footer() {
  const collections = await getWebsiteCollections();
  const companyLinks = collections.footerCompanyLinks.length
    ? collections.footerCompanyLinks.map((item) => ({ label: String(item.label ?? ''), href: String(item.href ?? '') }))
    : defaultFooterCompanyLinks;
  const socialLinks = collections.footerSocialLinks.length
    ? collections.footerSocialLinks.map((item) => ({ label: String(item.label ?? ''), href: String(item.href ?? ''), icon: String(item.icon ?? 'Linkedin') }))
    : defaultFooterSocialLinks;
  const trustPoints = collections.footerTrustPoints.length
    ? collections.footerTrustPoints.map((item) => String(item.label ?? '')).filter(Boolean)
    : defaultFooterTrustPoints;
  const contactHighlights = collections.footerContactHighlights.length
    ? collections.footerContactHighlights.map((item) => ({ label: String(item.label ?? ''), value: String(item.value ?? ''), icon: String(item.icon ?? 'Clock3') }))
    : defaultContactHighlights;
  const visibleSocialLinks = socialLinks.filter((link) => isSpecificSocialUrl(link.href));

  return (
    <footer
      id="site-footer"
      data-site-footer
      className="relative overflow-hidden border-t border-slate-300 bg-[#e8eff2] text-brand-950"
    >
      <div className="absolute inset-x-0 top-0 grid h-1 grid-cols-4" aria-hidden="true">
        <span className="bg-cyan-500" />
        <span className="bg-emerald-500" />
        <span className="bg-violet-500" />
        <span className="bg-orange-500" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-slate-300 py-7 sm:flex-row sm:items-center sm:justify-between lg:py-9">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3 focus:outline-none focus:ring-4 focus:ring-cyan-400/20">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden bg-white p-1.5">
              <Image src="/inception23-mark.png" alt="Inception 23 mark" width={88} height={88} className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase tracking-[0.16em] text-brand-950 sm:text-base">Inception 23</span>
              <span className="mt-1 block font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Advisory / Consulting / Solutions</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 bg-emerald-400" />Dhaka, Bangladesh</span>
            <span>UTC +06</span>
            <span className="text-cyan-800">Worldwide engagements</span>
          </div>
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)] lg:gap-20 lg:py-24">
          <div data-footer-reveal>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-orange-800">
              <span className="h-px w-10 bg-orange-600" aria-hidden="true" />
              Start with the consequential question
            </p>
            <h2 className="mt-7 max-w-5xl font-serif text-[clamp(3rem,6.3vw,6.8rem)] font-bold leading-[0.91] text-brand-950">
              Clear decisions.<br />Accountable delivery.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Inception 23 connects technology, management, finance, legal support, compliance, and creative execution through one accountable working relationship.
            </p>
            <div className="mt-10 grid max-w-4xl border-t border-slate-300 sm:grid-cols-3">
              {trustPoints.slice(0, 3).map((point, index) => (
                <div key={point} className={`grid grid-cols-[2rem_1fr] gap-3 py-5 sm:pr-5 ${index > 0 ? 'sm:border-l sm:border-slate-300 sm:pl-5' : ''}`}>
                  <span className={index === 0 ? 'font-mono text-[9px] font-bold text-cyan-800' : index === 1 ? 'font-mono text-[9px] font-bold text-emerald-800' : 'font-mono text-[9px] font-bold text-orange-800'}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs font-semibold leading-5 text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-footer-reveal className="border-l border-slate-300 pl-6 lg:mr-12 lg:self-end lg:pl-9 2xl:mr-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-800">Confidential advisory intake</p>
            <h3 className="mt-5 font-serif text-3xl font-bold leading-[1.05] text-brand-950 sm:text-4xl">
              Bring us the decision, constraint, or opportunity.
            </h3>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              We will help define the right advisory path and the practical next step.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/contact" className="ui-action group inline-flex min-h-14 items-center justify-between bg-brand-950 px-6 text-sm font-bold text-white hover:bg-[#32193a]">
                Start a confidential brief
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/services" className="ui-action inline-flex min-h-12 items-center justify-between border-b border-slate-400 px-1 text-sm font-bold text-brand-950 hover:border-cyan-700 hover:text-cyan-800">
                Explore services
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid border-y border-slate-300 lg:grid-cols-[0.72fr_1.28fr]">
          <div data-footer-reveal className="border-b border-slate-300 py-12 lg:border-b-0 lg:border-r lg:pr-12">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">Direct contact / 01</p>
            <a href="mailto:hello@inception23.com" className="mt-5 inline-flex break-all font-serif text-2xl font-bold text-brand-950 transition hover:text-cyan-800 sm:text-3xl">
              hello@inception23.com
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600"><MapPin size={15} className="text-orange-700" />Dhaka, Bangladesh</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {visibleSocialLinks.map(({ label, href, icon }) => {
                const Icon = iconMap[icon as keyof typeof iconMap] ?? Linkedin;
                return (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="ui-action flex h-10 w-10 items-center justify-center border border-slate-400 text-slate-600 hover:border-cyan-700 hover:text-cyan-800">
                    <Icon size={17} />
                  </a>
                );
              })}
              <a href="mailto:hello@inception23.com" aria-label="Email" className="ui-action flex h-10 w-10 items-center justify-center border border-slate-400 text-slate-600 hover:border-cyan-700 hover:text-cyan-800">
                <Mail size={17} />
              </a>
            </div>

            <NewsletterForm />
          </div>

          <div className="grid gap-y-10 py-12 min-[480px]:grid-cols-2 min-[480px]:gap-x-8 lg:pl-12 xl:grid-cols-4">
            <FooterColumn title="Services" links={serviceCategories.map((item) => ({ label: item.shortTitle, href: item.href }))} />
            <FooterColumn title="Industries" links={industriesMenu.slice(0, 5)} />
            <FooterColumn title="Solutions" links={solutionMenu.slice(0, 5).map((item) => ({ label: item.title, href: item.href }))} />
            <FooterColumn title="Company" links={[...companyLinks, ...insightsMenu.slice(0, 1)]} />
          </div>
        </div>

        <div className="grid border-b border-slate-300 sm:grid-cols-3">
          {contactHighlights.map(({ label, value, icon }, index) => {
            const Icon = iconMap[icon as keyof typeof iconMap] ?? Clock3;
            return (
              <div key={label} className={`flex gap-3 border-b border-slate-300 py-7 last:border-b-0 sm:border-b-0 ${index > 0 ? 'sm:border-l sm:border-slate-300 sm:pl-6' : ''} ${index < contactHighlights.length - 1 ? 'sm:pr-6' : ''}`}>
                <Icon size={17} className={index === 0 ? 'text-emerald-800' : index === 1 ? 'text-orange-800' : 'text-violet-800'} aria-hidden="true" />
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">{label}</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden border-b border-slate-300 py-7" aria-hidden="true">
          <p className="whitespace-nowrap font-serif text-[clamp(4rem,12.5vw,12rem)] font-bold leading-[0.78] text-brand-950/[0.055]">
            INCEPTION <span className="text-brand-950/[0.14]">23</span>
          </p>
        </div>

        <div data-footer-reveal className="flex flex-col gap-5 py-7 text-xs font-semibold text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Inception 23. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-brand-950">Privacy</Link>
            <Link href="/terms" className="transition hover:text-brand-950">Terms</Link>
            <span className="inline-flex items-center gap-2 text-emerald-800">
              <ShieldCheck size={14} />
              Confidential by design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav data-footer-reveal aria-label={title}>
      <h3 className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">{title}</h3>
      <ul className="mt-5 space-y-3.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link href={link.href} className="group inline-flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600 transition hover:text-brand-950">
              <span className="mt-[0.68rem] h-px w-0 shrink-0 bg-cyan-700 transition-all group-hover:w-3" aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
