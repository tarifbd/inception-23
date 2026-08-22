'use client';

import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BriefcaseBusiness, Cpu, Palette, Scale } from 'lucide-react';
import type { DotLottie } from '@lottiefiles/dotlottie-react';

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

const LazyDotLottieReact = lazy(async () => {
  const dotLottieModule = await import('@lottiefiles/dotlottie-react');
  dotLottieModule.setWasmUrl('/wasm/dotlottie-player.wasm');
  return { default: dotLottieModule.DotLottieReact };
});

function StableLottie({
  src,
  label,
  className,
  paused,
  icon,
  accent,
  staticOnly,
}: {
  src: string;
  label: string;
  className: string;
  paused: boolean;
  icon: HeroIconName;
  accent: string;
  staticOnly: boolean;
}) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (staticOnly) return;

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(() => setShouldLoad(true), { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(() => setShouldLoad(true), 250);
    }

    return () => {
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [staticOnly]);

  useEffect(() => {
    if (!player) return;
    const handleLoad = () => {
      player.setSpeed(0.9);
      player.resize();
      setLoaded(true);
    };
    const handleError = () => setFailed(true);
    player.addEventListener('load', handleLoad);
    player.addEventListener('loadError', handleError);
    player.addEventListener('renderError', handleError);
    return () => {
      player.removeEventListener('load', handleLoad);
      player.removeEventListener('loadError', handleError);
      player.removeEventListener('renderError', handleError);
    };
  }, [player]);

  useEffect(() => {
    if (!player || !loaded) return;
    if (paused) player.pause();
    else player.play();
  }, [loaded, paused, player]);

  const FallbackIcon = iconMap[icon];

  return (
    <div className="hero-lottie-player relative h-full w-full" role="img" aria-label={label}>
      <div
        aria-hidden="true"
        className={`hero-lottie-fallback absolute inset-[12%] grid place-items-center transition-opacity duration-500 ${loaded && !failed && !staticOnly ? 'opacity-0' : 'opacity-100'}`}
        style={{ color: accent }}
      >
        <span className="hero-lottie-fallback__mark">
          <FallbackIcon size={42} strokeWidth={1.35} />
        </span>
        <span className="sr-only">{label}</span>
      </div>
      {!failed && !staticOnly && shouldLoad ? (
        <Suspense fallback={null}>
          <LazyDotLottieReact
            src={src}
            loop
            autoplay={!paused}
            backgroundColor="#00000000"
            width={640}
            height={640}
            layout={{ fit: 'contain', align: [0.5, 0.5] }}
            renderConfig={{ autoResize: true, devicePixelRatio: 1.25, freezeOnOffscreen: true, quality: 88 }}
            dotLottieRefCallback={setPlayer}
            aria-hidden="true"
            className={`relative h-full w-full bg-transparent object-contain transition-[opacity,filter] duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
          />
        </Suspense>
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
      icon={slide.icon}
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
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [pageActive, setPageActive] = useState(true);
  const [sectionVisible, setSectionVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const safeSlide = activeSlide >= 0 && activeSlide < slides.length ? activeSlide : 0;
  const current = slides[safeSlide];
  const paperStyle = { '--hero-accent': current.accentHex } as CSSProperties;
  const paused = Boolean(reduceMotion) || interactionPaused || !pageActive || !sectionVisible;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  useEffect(() => {
    const updatePageActivity = () => setPageActive(!document.hidden && document.hasFocus());
    updatePageActivity();
    document.addEventListener('visibilitychange', updatePageActivity);
    window.addEventListener('focus', updatePageActivity);
    window.addEventListener('blur', updatePageActivity);
    return () => {
      document.removeEventListener('visibilitychange', updatePageActivity);
      window.removeEventListener('focus', updatePageActivity);
      window.removeEventListener('blur', updatePageActivity);
    };
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
    const interval = window.setInterval(() => {
      setActiveSlide((value) => (value + 1) % slides.length);
    }, 12000);
    return () => window.clearInterval(interval);
  }, [paused, slides.length]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Inception 23 services overview"
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={handleBlur}
      onPointerEnter={() => setInteractionPaused(true)}
      onPointerLeave={() => setInteractionPaused(false)}
      style={paperStyle}
      className="ambient-mesh relative min-h-[100svh] overflow-hidden bg-[#f7f9fa] pt-24 text-brand-950 dark:bg-night-950 sm:pt-28"
    >
      <div className="absolute inset-0 bg-paper-grid bg-[size:64px_64px] opacity-60 dark:opacity-20" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-7 px-4 pb-6 sm:px-6 sm:pb-10 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[minmax(0,0.96fr)_minmax(31rem,1.04fr)] lg:gap-8 lg:px-8 lg:pb-4">
        <div className="relative pt-3 lg:pl-4 xl:pl-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: 'easeOut' }}
            >
              {copyPanels[safeSlide]}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          style={{ y: reduceMotion ? 0 : visualY }}
          className="relative flex min-h-[290px] items-center justify-center sm:min-h-[440px] lg:min-h-[590px]"
        >
          <div aria-hidden="true" className="absolute inset-[9%] bg-white/55 blur-3xl" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.012 }}
              transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[290px] w-[290px] max-w-full sm:h-[450px] sm:w-[450px] lg:h-[min(640px,66svh)] lg:w-[min(640px,100%)]"
            >
              <HeroVisual slide={current} paused={paused} staticOnly={Boolean(reduceMotion)} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
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
                  setInteractionPaused(true);
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
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-[90%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--tab-accent)_85deg,rgba(255,255,255,.72)_145deg,var(--tab-accent)_215deg,transparent_300deg)] opacity-45"
                      animate={reduceMotion ? undefined : { rotate: 360 }}
                      transition={{ duration: 7.5, ease: 'linear', repeat: Infinity }}
                    />
                    <span aria-hidden="true" className="absolute inset-[2px] rounded-full bg-[linear-gradient(115deg,color-mix(in_srgb,var(--tab-accent)_82%,#07111f),var(--tab-accent))]" />
                  </>
                ) : null}
                <SlideIcon size={16} aria-hidden="true" className="relative z-10 shrink-0" style={{ color: isActive ? 'white' : slide.accentHex }} />
                <span className="relative z-10 whitespace-nowrap">{slide.label}</span>
                {isActive ? (
                  <motion.span
                    key={`${slide.id}-${interactionPaused ? 'paused' : 'auto'}`}
                    aria-hidden="true"
                    initial={reduceMotion || interactionPaused ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: reduceMotion || interactionPaused ? 0 : 12, ease: 'linear' }}
                    className="absolute inset-x-3 bottom-0.5 z-10 h-px origin-left bg-white/75"
                  />
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
