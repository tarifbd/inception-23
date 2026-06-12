'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Linkedin, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { serviceCategories } from '@/lib/constants/service-categories';
import { industriesMenu, insightsMenu, solutionMenu } from '@/lib/constants/navigation';

const footerCompanyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/#team' },
  { label: 'Process', href: '/#process' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

const trustPoints = [
  'Confidential advisory intake',
  'Strategy, systems, legal, finance, and creative under one roof',
  'Bangladesh-aware execution with global-grade structure',
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Newsletter request failed');
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      window.setTimeout(() => setStatus('idle'), 3600);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_42%,#eef7fb_100%)] text-brand-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <Link href="/" className="inline-flex min-w-0 items-center gap-3 focus:outline-none focus:ring-4 focus:ring-brand-700/15 sm:gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-slate-950/10 ring-1 ring-slate-200 sm:h-16 sm:w-16 sm:rounded-3xl">
                    <Image
                      src="/inception23-mark.png"
                      alt="Inception 23 mark"
                      width={112}
                      height={112}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="min-w-0 leading-none">
                    <span className="block truncate text-base font-black uppercase tracking-[0.18em] text-brand-950 min-[380px]:text-lg sm:text-2xl sm:tracking-[0.28em]">
                      Inception 23
                    </span>
                    <span className="mt-2 block truncate text-[0.45rem] font-black uppercase tracking-[0.12em] text-slate-500 min-[380px]:text-[0.5rem] sm:text-[0.62rem] sm:tracking-[0.2em]">
                      Where <span className="text-orange-600">new beginnings</span> create the future
                    </span>
                  </span>
                </Link>

                <h2 className="mt-8 max-w-3xl break-words font-serif text-[clamp(2.15rem,5vw,3.75rem)] font-black leading-[1.06] text-brand-950 sm:mt-10 sm:leading-[1.02]">
                  Advisory clarity for companies ready to move with discipline.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Inception 23 brings technology, management, finance, documentation, legal support, and creative execution into one premium operating partner.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <CheckCircle2 className="mb-3 text-emerald-600" size={18} />
                    <p className="text-sm font-bold leading-6 text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-brand-950 p-5 text-white shadow-2xl shadow-brand-950/15 sm:rounded-[1.6rem] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Start a confidential brief</p>
              <h3 className="mt-5 font-serif text-3xl font-black leading-tight sm:text-4xl">
                Tell us where the business needs clarity, control, or acceleration.
              </h3>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-950 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
                >
                  Book a Consultation
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  Explore Services
                </Link>
              </div>

              <form onSubmit={handleSubscribe} className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                <label htmlFor="footer-email" className="mb-3 block px-2 text-xs font-black uppercase tracking-[0.2em] text-white/55">
                  Insight dispatch
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={status === 'submitting'}
                  className="min-h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-white px-5 text-sm font-bold text-brand-950 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 text-sm font-black uppercase tracking-[0.12em] text-brand-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === 'submitting' ? 'Sending' : 'Subscribe'}
                    <Send size={15} />
                  </button>
                </div>
                {status === 'success' ? <p className="mt-3 px-2 text-sm font-bold text-emerald-300">Subscribed. Thank you.</p> : null}
                {status === 'error' ? <p className="mt-3 px-2 text-sm font-bold text-rose-300">Could not subscribe. Please try again.</p> : null}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-lg border border-slate-200 bg-white/78 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">Contact</p>
            <div className="mt-5 grid gap-4 text-sm font-bold text-slate-600">
              <a href="mailto:hello@inception23.com" className="flex items-center gap-3 transition hover:text-brand-950">
                <Mail size={18} className="text-cyan-600" />
                hello@inception23.com
              </a>
              <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-3 transition hover:text-brand-950">
                <Phone size={18} className="text-emerald-600" />
                +880 1XXX-XXXXXX
              </a>
              <span className="flex items-center gap-3">
                <MapPin size={18} className="text-purple-600" />
                Dhaka, Bangladesh
              </span>
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-1 hover:border-cyan-300 hover:text-brand-950">
                <Linkedin size={18} />
              </a>
              <a href="mailto:hello@inception23.com" aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-1 hover:border-cyan-300 hover:text-brand-950">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            <FooterColumn title="Services" links={serviceCategories.map((item) => ({ label: item.shortTitle, href: item.href }))} />
            <FooterColumn title="Solutions" links={solutionMenu.slice(0, 5).map((item) => ({ label: item.title, href: item.href }))} />
            <FooterColumn title="Industries" links={industriesMenu.slice(0, 5)} />
            <FooterColumn title="Company" links={[...footerCompanyLinks, ...insightsMenu.slice(0, 1)]} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:text-xs sm:tracking-[0.16em] md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Inception 23. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-brand-950">Privacy</Link>
            <Link href="/terms" className="transition hover:text-brand-950">Terms</Link>
            <span className="inline-flex items-center gap-2 text-emerald-700">
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
    <nav className="rounded-lg border border-slate-200 bg-white/78 p-6 shadow-sm backdrop-blur" aria-label={title}>
      <h3 className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link href={link.href} className="group inline-flex items-start gap-2 text-sm font-bold leading-6 text-slate-600 transition hover:text-brand-950">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition group-hover:bg-cyan-500" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
