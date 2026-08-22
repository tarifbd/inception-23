import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GradientBackground } from './GradientBackground';

export function CTASection() {
  return (
    <section id="inquiry" className="relative overflow-hidden bg-white py-20 md:py-28">
      <GradientBackground />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/82 p-7 text-center shadow-2xl shadow-slate-950/10 backdrop-blur-xl md:p-14">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <p className="relative text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Confidential consultation</p>
          <h2 className="relative mx-auto mt-4 max-w-4xl font-serif text-[clamp(2.2rem,5vw,5rem)] font-black leading-[1.02] text-brand-950">
            Start your next practical move with Inception 23.
          </h2>
          <p className="relative mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Bring the problem, ambition, or operating bottleneck. We will help shape the advisory path, system design, and execution roadmap.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900">
              Book a Consultation <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white/70 px-7 py-4 text-sm font-black text-brand-950 transition hover:-translate-y-0.5 hover:border-brand-700/40 hover:bg-brand-50">
              Explore services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
