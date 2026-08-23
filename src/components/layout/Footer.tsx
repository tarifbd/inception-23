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
      className="relative overflow-hidden border-t border-white/15 bg-[#09111d] text-white"
    >
      <div className="absolute inset-x-0 top-0 grid h-1 grid-cols-4" aria-hidden="true">
        <span className="bg-cyan-500" />
        <span className="bg-emerald-500" />
        <span className="bg-violet-500" />
        <span className="bg-orange-500" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between lg:py-8">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3 focus:outline-none focus:ring-4 focus:ring-cyan-400/20">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
              <Image src="/inception23-mark.png" alt="Inception 23 mark" width={88} height={88} className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase tracking-[0.16em] sm:text-base">Inception 23</span>
              <span className="mt-1 block font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Advisory / Consulting / Solutions</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em]">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />Dhaka, Bangladesh</span>
            <span className="border-l border-white/20 pl-6">UTC +06</span>
            <span className="border-l border-white/20 pl-6">Worldwide engagements</span>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-20 lg:py-20">
          <div data-footer-reveal>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
              <span className="h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-violet-400" aria-hidden="true" />
              Start with the consequential question
            </p>
            <h2 className="mt-7 max-w-4xl text-balance font-serif text-[clamp(2.8rem,5.4vw,5.8rem)] font-bold leading-[0.94]">
              Clear decisions.<br />Accountable delivery.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 sm:text-lg">
              Inception 23 connects technology, management, finance, legal support, compliance, and creative execution through one accountable working relationship.
            </p>
          </div>

          <div data-footer-reveal className="border-t border-white/15 pt-8 lg:self-end lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">Confidential advisory intake</p>
            <h3 className="mt-5 max-w-lg font-serif text-3xl font-bold leading-[1.08] sm:text-4xl">
              Bring us the decision, constraint, or opportunity.
            </h3>
            <p className="mt-5 max-w-md text-sm leading-7">
              We will help define the right advisory path and the practical next step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/contact" className="ui-action group inline-flex min-h-[3.25rem] flex-1 items-center justify-between border border-cyan-300/30 bg-gradient-to-r from-cyan-700 to-teal-600 px-5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(8,145,178,0.2)] hover:from-cyan-600 hover:to-teal-500">
                Start a confidential brief
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/services" className="ui-action inline-flex min-h-[3.25rem] flex-1 items-center justify-between border border-white/20 bg-white/[0.04] px-5 text-sm font-bold hover:border-cyan-300/60 hover:bg-white/[0.08]">
                Explore services
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid border-y border-white/15 sm:grid-cols-3">
          {trustPoints.slice(0, 3).map((point, index) => (
            <div key={point} data-footer-reveal className={`grid grid-cols-[2.25rem_1fr] gap-3 py-5 sm:px-6 sm:py-6 ${index === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-white/15'} ${index === 2 ? 'sm:pr-0' : ''}`}>
              <span className="flex h-8 w-8 items-center justify-center border border-white/20 bg-white/[0.05] font-mono text-[9px] font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="self-center text-xs font-semibold leading-5">{point}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16 lg:py-16">
          <div data-footer-reveal className="lg:border-r lg:border-white/15 lg:pr-12">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">Direct contact</p>
            <a href="mailto:hello@inception23.com" className="mt-5 inline-flex break-all font-serif text-2xl font-bold transition hover:text-cyan-300 sm:text-3xl">
              hello@inception23.com
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold"><MapPin size={15} />Dhaka, Bangladesh</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {visibleSocialLinks.map(({ label, href, icon }) => {
                const Icon = iconMap[icon as keyof typeof iconMap] ?? Linkedin;
                return (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="ui-action flex h-11 w-11 items-center justify-center border border-white/20 bg-white/[0.04] hover:border-cyan-300/60 hover:bg-white/[0.08]">
                    <Icon size={17} />
                  </a>
                );
              })}
              <a href="mailto:hello@inception23.com" aria-label="Email" className="ui-action flex h-11 w-11 items-center justify-center border border-white/20 bg-white/[0.04] hover:border-cyan-300/60 hover:bg-white/[0.08]">
                <Mail size={17} />
              </a>
            </div>

            <NewsletterForm />
          </div>

          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">Explore Inception 23</p>
            <div className="mt-7 grid gap-x-8 gap-y-10 min-[480px]:grid-cols-2 xl:grid-cols-4">
              <FooterColumn title="Services" links={serviceCategories.map((item) => ({ label: item.shortTitle, href: item.href }))} />
              <FooterColumn title="Industries" links={industriesMenu.slice(0, 5)} />
              <FooterColumn title="Solutions" links={solutionMenu.slice(0, 5).map((item) => ({ label: item.title, href: item.href }))} />
              <FooterColumn title="Company" links={[...companyLinks, ...insightsMenu.slice(0, 1)]} />
            </div>
          </div>
        </div>

        <div className="grid border-t border-white/15 sm:grid-cols-3">
          {contactHighlights.slice(0, 3).map(({ label, value, icon }, index) => {
            const Icon = iconMap[icon as keyof typeof iconMap] ?? Clock3;
            return (
              <div key={label} className={`flex gap-4 border-b border-white/15 py-6 last:border-b-0 sm:border-b-0 ${index > 0 ? 'sm:border-l sm:border-white/15 sm:pl-6' : ''} ${index < 2 ? 'sm:pr-6' : ''}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 bg-white/[0.05]"><Icon size={16} aria-hidden="true" /></span>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em]">{label}</p>
                  <p className="mt-2 text-xs font-semibold leading-5">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div data-footer-reveal className="flex flex-col gap-5 border-t border-white/15 py-7 text-xs font-semibold md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Inception 23. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-cyan-300">Privacy</Link>
            <Link href="/terms" className="transition hover:text-cyan-300">Terms</Link>
            <span className="inline-flex items-center gap-2">
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
      <h3 className="border-b border-white/15 pb-3 font-mono text-[9px] font-bold uppercase tracking-[0.15em]">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link href={link.href} className="group inline-flex items-start gap-2 text-sm font-semibold leading-6 transition duration-300 hover:translate-x-1 hover:text-cyan-300">
              <span className="mt-[0.68rem] h-px w-0 shrink-0 bg-cyan-300 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
