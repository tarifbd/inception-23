'use client';

import '@/lib/configure-lottie';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Cpu, Palette, Scale } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAppStore } from '@/lib/store';
import type { HomepageContent } from '@/lib/homepage-content';

const heroDesign = [
  {
    id: 'it',
    label: 'IT & AI Solutions',
    eyebrow: 'Enterprise AI systems',
    title: 'Transform your business with',
    highlight: 'IT, AI & digital innovation',
    copy: 'Production-grade AI automation, custom software, data platforms, and secure web systems built for measurable business outcomes.',
    lottie: '/animations/consultancy-new.json',
    Icon: Cpu,
    accent: 'text-cyan-700',
    dot: 'bg-cyan-500',
    glow: 'bg-cyan-500/14',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    tabGradient: 'from-cyan-400 via-blue-600 to-indigo-700',
    tabBorder: 'border-cyan-200',
    tabText: 'text-cyan-700',
    tabHover: 'hover:border-cyan-400 hover:bg-cyan-50',
    tabShadow: 'shadow-cyan-600/25',
    chips: ['AI Agents', 'Custom Software', 'Data Platforms', 'Cloud & DevOps'],
    lottieClass: 'scale-[1.12]',
  },
  {
    id: 'consultancy',
    label: 'Management Consultancy',
    eyebrow: 'Operating model advisory',
    title: 'Scale your company with',
    highlight: 'management intelligence',
    copy: 'Strategy, operating cadence, KPI systems, process redesign, and governance structures for leadership teams that need control while scaling.',
    lottie: '/animations/business-operations.json',
    Icon: BriefcaseBusiness,
    accent: 'text-emerald-700',
    dot: 'bg-emerald-500',
    glow: 'bg-emerald-500/14',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    tabGradient: 'from-emerald-400 via-teal-600 to-cyan-700',
    tabBorder: 'border-emerald-200',
    tabText: 'text-emerald-700',
    tabHover: 'hover:border-emerald-400 hover:bg-emerald-50',
    tabShadow: 'shadow-emerald-600/25',
    chips: ['Corporate Strategy', 'Operational Scaling', 'Process Design', 'Growth Systems'],
    lottieClass: 'scale-100',
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
    tabGradient: 'from-violet-600 via-purple-700 to-amber-500',
    tabBorder: 'border-violet-200',
    tabText: 'text-violet-700',
    tabHover: 'hover:border-violet-400 hover:bg-violet-50',
    tabShadow: 'shadow-violet-700/25',
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
    tabGradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    tabBorder: 'border-orange-200',
    tabText: 'text-orange-700',
    tabHover: 'hover:border-orange-400 hover:bg-orange-50',
    tabShadow: 'shadow-rose-600/25',
    chips: ['Brand Strategy', 'Campaign Systems', 'Digital Experience', 'Creative Direction'],
    lottieClass: 'scale-100',
  },
] as const;

const heroSlides = heroDesign.map((slide) => ({
  ...slide,
  visualType: 'lottie' as 'lottie' | 'image' | 'video',
  visualUrl: undefined as string | undefined,
  visualAlt: undefined as string | undefined,
}));

export default function Hero3D({ content }: { content: HomepageContent['hero'] }) {
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
    <section className="hero-aurora-stage relative min-h-[100svh] overflow-hidden bg-[#f8fafc] pt-24 text-brand-950 dark:text-white sm:pt-28">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(90deg,rgba(248,250,252,0.98),rgba(248,250,252,0.78)_48%,rgba(248,250,252,0.22))]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`absolute right-[2%] top-[18%] h-[min(38rem,85vw)] w-[min(38rem,85vw)] rounded-full ${current.glow} blur-[72px]`}
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-8 px-4 pb-8 sm:px-6 sm:pb-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-14">
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div className={`mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm dark:border-white/15 dark:bg-white/[0.07] ${current.accent}`}>
                <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                <Icon size={15} />
                <span className="truncate">{current.eyebrow}</span>
              </div>

              <h1 className="max-w-[720px] break-words font-serif text-[clamp(2.15rem,4.7vw,4.9rem)] font-black leading-[1.08] tracking-normal text-brand-950 dark:text-white sm:leading-[1.05]">
                <span className="block max-w-full">{current.title}</span>
                <span className={`block max-w-full bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
                  {current.highlight}
                </span>
              </h1>

              <p className="mt-5 max-w-[680px] text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
                {current.copy}
              </p>

              <div className="mt-6 grid max-w-[680px] grid-cols-1 gap-2.5 min-[360px]:flex min-[360px]:flex-wrap">
                {current.chips.map((chip) => (
                  <span key={chip} className="inline-flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200">
                    <CheckCircle2 size={15} className={current.accent} />
                    <span className="min-w-0 break-words">{chip}</span>
                  </span>
                ))}
              </div>

              <div className="mt-7 flex max-w-[680px] flex-col gap-3 sm:flex-row">
                <Link href={content.primaryCtaHref} className="inline-flex items-center justify-center gap-3 rounded-[1rem] bg-brand-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900">
                  {content.primaryCtaLabel} <ArrowRight size={18} />
                </Link>
                <Link href={content.secondaryCtaHref} className="inline-flex items-center justify-center gap-3 rounded-[1rem] border border-slate-300 bg-white/55 px-7 py-4 text-sm font-black text-brand-950 transition hover:-translate-y-0.5 hover:border-brand-500 dark:border-white/20 dark:bg-white/[0.07] dark:text-white dark:hover:border-cyan-300/60 dark:hover:bg-white/10">
                  {content.secondaryCtaLabel}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[440px] lg:col-span-7 lg:min-h-[640px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative h-[clamp(320px,82vw,680px)] w-[clamp(320px,82vw,680px)] max-w-full lg:h-[min(740px,78svh)] lg:w-[min(740px,100%)]"
            >
              {current.visualType === 'image' && current.visualUrl ? (
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_70px_rgba(13,1,33,0.16)]">
                  <Image
                    src={current.visualUrl}
                    alt={current.visualAlt || current.label}
                    fill
                    priority
                    sizes="(max-width: 1023px) 90vw, 46vw"
                    className="object-cover"
                  />
                </div>
              ) : current.visualType === 'video' && current.visualUrl ? (
                <div className="h-full w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_70px_rgba(13,1,33,0.16)]">
                  <video
                    src={current.visualUrl}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={current.visualAlt || current.label}
                  />
                </div>
              ) : (
                <DotLottieReact
                  src={current.visualUrl || current.lottie}
                  loop
                  autoplay
                  layout={{ fit: 'contain', align: [0.5, 0.5] }}
                  renderConfig={{ autoResize: true, devicePixelRatio: 1.5, freezeOnOffscreen: true, quality: 92 }}
                  className={`h-full w-full bg-transparent object-contain mix-blend-multiply dark:mix-blend-normal ${current.lottieClass}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 pb-8 sm:-mt-6 sm:px-6 sm:pb-10 lg:px-8">
        <div className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
          {heroSlides.map((slide, index) => {
            const SlideIcon = slide.Icon;
            const isActive = index === safeSlide;
            return (
              <button
                key={slide.id}
                onClick={() => setSlide(index)}
                aria-pressed={isActive}
                className={`relative inline-flex shrink-0 items-center overflow-hidden rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition duration-300 ${
                  isActive
                    ? `border-transparent text-white shadow-lg ${slide.tabShadow}`
                    : `bg-white/75 dark:bg-white/[0.07] ${slide.tabBorder} ${slide.tabText} ${slide.tabHover}`
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="active-hero-service"
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-r ${slide.tabGradient}`}
                    style={{ backgroundSize: '220% 100%' }}
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ backgroundPosition: { duration: 5, ease: 'easeInOut', repeat: Infinity } }}
                  />
                ) : null}
                <span className="relative z-10 inline-flex items-center gap-2">
                  <SlideIcon size={13} />
                  {slide.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="hidden text-xs font-black uppercase tracking-[0.22em] text-slate-400 sm:block">
          {content.footerLabel}
        </div>
      </div>
    </section>
  );
}
