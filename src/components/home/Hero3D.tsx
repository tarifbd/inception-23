'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Cpu, Palette, Scale } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAppStore } from '@/lib/store';

const heroSlides = [
  {
    id: 'it',
    label: 'IT & AI Solutions',
    eyebrow: 'Enterprise AI systems',
    title: 'Transform your business with',
    highlight: 'IT, AI & digital innovation',
    copy: 'Production-grade AI automation, custom software, data platforms, and secure web systems built for measurable business outcomes.',
    lottie: '/animations/it-new.json',
    Icon: Cpu,
    accent: 'text-cyan-700',
    dot: 'bg-cyan-500',
    glow: 'bg-cyan-500/14',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    chips: ['AI Agents', 'Custom Software', 'Data Platforms', 'Cloud & DevOps'],
    lottieClass: 'scale-100',
  },
  {
    id: 'consultancy',
    label: 'Management Consultancy',
    eyebrow: 'Operating model advisory',
    title: 'Scale your company with',
    highlight: 'management intelligence',
    copy: 'Strategy, operating cadence, KPI systems, process redesign, and governance structures for leadership teams that need control while scaling.',
    lottie: '/animations/consultancy-new.json',
    Icon: BriefcaseBusiness,
    accent: 'text-emerald-700',
    dot: 'bg-emerald-500',
    glow: 'bg-emerald-500/14',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    chips: ['Corporate Strategy', 'Operational Scaling', 'Process Design', 'Growth Systems'],
    lottieClass: 'scale-[1.16]',
  },
  {
    id: 'legal',
    label: 'Legal Support',
    eyebrow: 'Risk and compliance control',
    title: 'Protect your enterprise with',
    highlight: 'legal precision',
    copy: 'Corporate legal support, compliance readiness, governance documents, and practical risk mitigation frameworks for serious operators.',
    lottie: '/animations/legal-new.json',
    Icon: Scale,
    accent: 'text-violet-700',
    dot: 'bg-violet-600',
    glow: 'bg-violet-500/14',
    gradient: 'from-violet-700 via-purple-700 to-amber-500',
    chips: ['Compliance', 'Corporate Law', 'Governance', 'Risk Mitigation'],
    lottieClass: 'scale-100',
  },
  {
    id: 'creative',
    label: 'Creative & Others',
    eyebrow: 'Brand and market systems',
    title: 'Shape your market with',
    highlight: 'creative systems',
    copy: 'Brand strategy, visual direction, campaign architecture, premium interface design, and market-facing assets that make complex offers easier to trust.',
    lottie: '/animations/creative-new.json',
    Icon: Palette,
    accent: 'text-orange-700',
    dot: 'bg-orange-500',
    glow: 'bg-orange-500/14',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    chips: ['Brand Strategy', 'Campaign Systems', 'Digital Experience', 'Creative Direction'],
    lottieClass: 'scale-100',
  },
] as const;

export default function Hero3D() {
  const { activeSlide, setSlide } = useAppStore();
  const safeSlide = activeSlide >= 0 && activeSlide < heroSlides.length ? activeSlide : 0;
  const current = heroSlides[safeSlide];
  const Icon = current.Icon;

  useEffect(() => {
    if (typeof document !== 'undefined' && document.hidden) return;

    const interval = window.setInterval(() => {
      setSlide((safeSlide + 1) % heroSlides.length);
    }, 12000);

    return () => window.clearInterval(interval);
  }, [safeSlide, setSlide]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8fafc] pt-28 text-brand-950">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(90deg,rgba(248,250,252,0.98),rgba(248,250,252,0.78)_48%,rgba(248,250,252,0.22))]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`absolute right-[4%] top-[18%] h-[38rem] w-[38rem] rounded-full ${current.glow} blur-[72px]`}
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-8 px-5 pb-14 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div className={`mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm ${current.accent}`}>
                <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                <Icon size={15} />
                <span className="truncate">{current.eyebrow}</span>
              </div>

              <h1 className="max-w-[720px] break-words font-serif text-[clamp(2.35rem,4.7vw,4.9rem)] font-black leading-[1.05] tracking-normal text-brand-950">
                <span className="block max-w-full">{current.title}</span>
                <span className={`block max-w-full bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
                  {current.highlight}
                </span>
              </h1>

              <p className="mt-5 max-w-[680px] text-base leading-8 text-slate-600 sm:text-lg">
                {current.copy}
              </p>

              <div className="mt-6 flex max-w-[680px] flex-wrap gap-2.5">
                {current.chips.map((chip) => (
                  <span key={chip} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm">
                    <CheckCircle2 size={15} className={current.accent} />
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex max-w-[680px] flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900">
                  Start a confidential brief <ArrowRight size={18} />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white/55 px-7 py-4 text-sm font-black text-brand-950 transition hover:-translate-y-0.5 hover:border-brand-500">
                  Explore services
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex min-h-[340px] items-center justify-center lg:col-span-6 lg:min-h-[560px]">
          <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${current.gradient} opacity-[0.08] blur-2xl`} />
          <div className="absolute inset-x-10 bottom-12 h-12 rounded-full bg-brand-950/10 blur-2xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative h-[min(74vw,600px)] w-[min(74vw,600px)]"
            >
              <DotLottieReact
                src={current.lottie}
                loop
                autoplay
                className={`h-full w-full object-contain drop-shadow-[0_30px_52px_rgba(13,1,33,0.16)] ${current.lottieClass}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 pb-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {heroSlides.map((slide, index) => {
            const SlideIcon = slide.Icon;
            const isActive = index === safeSlide;
            return (
              <button
                key={slide.id}
                onClick={() => setSlide(index)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition ${
                  isActive
                    ? `border-transparent bg-brand-950 text-white`
                    : 'border-slate-200 bg-white/70 text-slate-500 hover:border-brand-500 hover:text-brand-950'
                }`}
              >
                <SlideIcon size={13} />
                {slide.label}
              </button>
            );
          })}
        </div>
        <div className="hidden text-xs font-black uppercase tracking-[0.22em] text-slate-400 sm:block">
          Advisory / Consulting / Solutions
        </div>
      </div>
    </section>
  );
}
