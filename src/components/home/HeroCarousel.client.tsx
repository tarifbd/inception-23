'use client';

import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BriefcaseBusiness, Cpu, Palette, Scale } from 'lucide-react';

type HeroIconName = 'BriefcaseBusiness' | 'Cpu' | 'Palette' | 'Scale';

export type HeroCarouselSlide = {
  id: string;
  label: string;
  icon: HeroIconName;
  dot: string;
  accentHex: string;
  lottie: string;
  lottieClass: string;
  visualType?: 'lottie' | 'image' | 'video';
  visualUrl?: string;
  visualAlt?: string;
};

const iconMap = { BriefcaseBusiness, Cpu, Palette, Scale };
const HeroLottie = dynamic(
  () => import('@/components/home/HeroLottie.client').then((module) => module.HeroLottie),
  { ssr: false },
);
const HERO_ROTATION_MS = 5000;

function StableLottie({
  src,
  label,
  className,
  paused,
  accent,
  staticOnly,
}: {
  src: string;
  label: string;
  className: string;
  paused: boolean;
  accent: string;
  staticOnly: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="hero-lottie-player relative h-full w-full" role="img" aria-label={label}>
      <div
        aria-hidden="true"
        className={`hero-lottie-fallback absolute inset-[18%] rounded-full blur-3xl transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-30'}`}
        style={{ background: `radial-gradient(circle, color-mix(in srgb, ${accent} 22%, transparent), transparent 68%)` }}
      />
      {!staticOnly ? (
        <HeroLottie src={src} paused={paused} className={className} onReady={() => setLoaded(true)} />
      ) : null}
    </div>
  );
}

function HeroVisual({ slide, paused, staticOnly }: { slide: HeroCarouselSlide; paused: boolean; staticOnly: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused]);

  if (slide.visualType === 'image' && slide.visualUrl) {
    return (
      <div className="ui-media relative h-full w-full overflow-hidden border border-white/80 bg-white dark:border-white/10 dark:bg-night-900">
        <Image
          src={slide.visualUrl}
          alt={slide.visualAlt || slide.label}
          fill
          priority
          sizes="(max-width: 1023px) 90vw, 46vw"
          className="object-cover"
        />
      </div>
    );
  }

  if (slide.visualType === 'video' && slide.visualUrl) {
    return (
      <div className="ui-media h-full w-full overflow-hidden border border-white/80 bg-white dark:border-white/10 dark:bg-night-900">
        <video
          ref={videoRef}
          src={slide.visualUrl}
          className="h-full w-full object-cover"
          autoPlay={!paused}
          muted
          loop
          playsInline
          aria-label={slide.visualAlt || slide.label}
        />
      </div>
    );
  }

  return (
    <StableLottie
      src={slide.visualUrl || slide.lottie}
      label={slide.visualAlt || `${slide.label} illustration`}
      className={slide.lottieClass}
      paused={paused}
      accent={slide.accentHex}
      staticOnly={staticOnly}
    />
  );
}

export function HeroCarousel({
  slides,
  copyPanels,
  footerLabel,
}: {
  slides: HeroCarouselSlide[];
  copyPanels: ReactNode[];
  footerLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pageActive, setPageActive] = useState(true);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const safeSlide = activeSlide >= 0 && activeSlide < slides.length ? activeSlide : 0;
  const current = slides[safeSlide];
  const paperStyle = { '--hero-accent': current.accentHex } as CSSProperties;
  const paused = reduceMotion || !pageActive || !sectionVisible;

  useEffect(() => {
    const updatePageActivity = () => setPageActive(!document.hidden);
    updatePageActivity();
    document.addEventListener('visibilitychange', updatePageActivity);
    return () => {
      document.removeEventListener('visibilitychange', updatePageActivity);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(motionQuery.matches);
    updatePreference();
    motionQuery.addEventListener('change', updatePreference);
    return () => motionQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.06 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setTimeout(() => {
      setActiveSlide((value) => (value + 1) % slides.length);
    }, HERO_ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeSlide, paused, slides.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Inception 23 services overview"
      style={paperStyle}
      className="ambient-mesh relative min-h-[100svh] overflow-hidden bg-[#f7f9fa] pt-20 text-brand-950 dark:bg-night-950 sm:pt-24 lg:pt-28"
    >
      <div className="absolute inset-0 bg-paper-grid bg-[size:64px_64px] opacity-60 dark:opacity-20" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-2 px-4 pb-6 sm:gap-5 sm:px-6 sm:pb-10 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[minmax(0,0.96fr)_minmax(31rem,1.04fr)] lg:gap-8 lg:px-8 lg:pb-4">
        <div className="relative order-2 pt-1 lg:order-1 lg:pt-3 lg:pl-4 xl:pl-8">
          <div key={current.id} className="transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none">
            {copyPanels[safeSlide]}
          </div>
        </div>

        <div
          className="relative order-1 flex min-h-[250px] items-center justify-center sm:min-h-[330px] md:min-h-[360px] lg:order-2 lg:min-h-[590px]"
        >
          <div aria-hidden="true" className="absolute inset-[9%] bg-white/55 blur-3xl" />
          <div className="relative h-[min(280px,74vw)] w-[min(280px,74vw)] max-w-full sm:h-[340px] sm:w-[340px] md:h-[380px] md:w-[380px] lg:h-[min(700px,70svh)] lg:w-[min(700px,100%)]">
            {slides.map((slide, index) => {
              const isActive = index === safeSlide;
              const isNext = index === (safeSlide + 1) % slides.length;
              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
                    isActive ? 'z-10 opacity-100 scale-100' : 'pointer-events-none z-0 opacity-0 scale-[0.985]'
                  }`}
                >
                  {isActive || isNext ? (
                    <HeroVisual
                      slide={slide}
                      paused={paused || !isActive}
                      staticOnly={Boolean(reduceMotion)}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-4 pb-7 sm:px-6 lg:px-8">
        <nav aria-label="Hero service disciplines" className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, index) => {
            const SlideIcon = iconMap[slide.icon];
            const isActive = index === safeSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setActiveSlide(index);
                }}
                aria-label={`Show ${slide.label}`}
                aria-pressed={isActive}
                style={{ '--tab-accent': slide.accentHex } as CSSProperties}
                className={`group relative inline-flex min-h-11 min-w-max items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-[color:color-mix(in_srgb,var(--tab-accent)_28%,transparent)] bg-white/82 text-slate-600 shadow-sm hover:text-brand-950'
                }`}
              >
                {isActive ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -inset-[90%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--tab-accent)_85deg,rgba(255,255,255,.72)_145deg,var(--tab-accent)_215deg,transparent_300deg)] opacity-45 motion-safe:animate-[spin_7.5s_linear_infinite]"
                    />
                    <span aria-hidden="true" className="absolute inset-[2px] rounded-full bg-[linear-gradient(115deg,color-mix(in_srgb,var(--tab-accent)_82%,#07111f),var(--tab-accent))]" />
                  </>
                ) : null}
                <SlideIcon size={16} aria-hidden="true" className="relative z-10 shrink-0" style={{ color: isActive ? 'white' : slide.accentHex }} />
                <span className="relative z-10 whitespace-nowrap">{slide.label}</span>
                {isActive ? (
                  <span aria-hidden="true" className="absolute inset-x-3 bottom-0.5 z-10 h-px bg-white/75" />
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 xl:block">{footerLabel}</div>
      </div>
    </section>
  );
}
