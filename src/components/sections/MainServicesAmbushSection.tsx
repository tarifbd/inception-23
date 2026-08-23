'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainServicesAmbush, type MainServicesAmbushItem } from '@/lib/constants/main-services-ambush';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

const revealedClip = 'inset(0% 0% 0% 0%)';
const concealedClip = {
  desktop: 'inset(0% 0% 0% 100%)',
  mobile: 'inset(100% 0% 0% 0%)',
} as const;

const realServiceImageByLegacyPath: Record<string, string> = {
  '/main-services/it-ai-solutions.webp': '/main-services/it-ai-solutions-photo.webp',
  '/main-services/management-finance.webp': '/main-services/management-finance-photo.webp',
  '/main-services/legal-support.webp': '/main-services/legal-support-photo.webp',
  '/main-services/creative-execution.webp': '/main-services/creative-execution-photo.webp',
};

const fallbackServiceImages: Record<MainServicesAmbushItem['key'], string> = {
  it: '/main-services/it-ai-solutions-photo.webp',
  consultancy: '/main-services/management-finance-photo.webp',
  legal: '/main-services/legal-support-photo.webp',
  creative: '/main-services/creative-execution-photo.webp',
};

export function MainServicesAmbushSection({ content, services }: { content: HomepageSectionContent; services?: CollectionRecord[] }) {
  const serviceItems = useMemo(
    () => (services?.length ? services : mainServicesAmbush) as MainServicesAmbushItem[],
    [services],
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || serviceItems.length < 2) return;

    const context = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('[data-service-slide]', stage);
      const copies = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-copy]'));
      const copyParts = slides.map((slide) => gsap.utils.toArray<HTMLElement>('[data-service-copy-part]', slide));
      const media = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-media]'));
      const backplanes = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-backplane]'));
      const rails = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-rail]'));
      const viewports = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-viewport]'));
      const images = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-image]'));
      const curtains = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-curtain]'));
      const scans = slides.map((slide) => slide.querySelector<HTMLElement>('[data-service-scan]'));
      const meta = slides.map((slide) => gsap.utils.toArray<HTMLElement>('[data-service-meta]', slide));
      const indicators = gsap.utils.toArray<HTMLElement>('[data-service-indicator]', stage);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        gsap.set(slides, { clearProps: 'all' });
        gsap.set([...copies, ...copyParts.flat(), ...media, ...backplanes, ...rails, ...viewports, ...images, ...curtains, ...scans, ...meta.flat(), ...indicators].filter(Boolean), { clearProps: 'all' });
        return;
      }

      gsap.set(slides, { autoAlpha: 0, pointerEvents: 'none', zIndex: 0 });
      gsap.set(slides[0], { autoAlpha: 1, pointerEvents: 'auto', zIndex: 2 });
      gsap.set(copies.slice(1), { autoAlpha: 0 });
      gsap.set(copyParts.slice(1).flat(), { autoAlpha: 0 });
      gsap.set(media, { transformPerspective: 1200, transformOrigin: 'center center', force3D: true });
      gsap.set(media.slice(1), { autoAlpha: 0, y: 18 });
      gsap.set(backplanes, { x: 0, y: 0, rotation: 0, force3D: true });
      gsap.set(rails, { scaleY: 0.72, transformOrigin: 'center center', autoAlpha: 0.8 });
      gsap.set(viewports, { clipPath: revealedClip });
      gsap.set(images, { scale: 1.035, xPercent: 0, yPercent: 0, rotation: 0, force3D: true });
      gsap.set(images[0], { scale: 1 });
      gsap.set(curtains, { scaleX: 0, transformOrigin: 'left center', autoAlpha: 0 });
      gsap.set(scans, { autoAlpha: 0, xPercent: -120, yPercent: 0 });
      gsap.set(meta.flat(), { autoAlpha: 1, y: 0 });
      gsap.set(indicators, { autoAlpha: 0.42, scale: 0.92 });
      gsap.set(indicators[0], { autoAlpha: 1, scale: 1 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });

      const mediaQuery = gsap.matchMedia();

      const createStory = (isDesktop: boolean) => {
        const segments = slides.length - 1;
        const timeline = gsap.timeline({
          defaults: { overwrite: false },
          scrollTrigger: {
            trigger: stage,
            start: () => `top top+=${isDesktop ? 72 : 64}`,
            end: () => `+=${Math.round(window.innerHeight * segments * (isDesktop ? 1.08 : 0.96))}`,
            pin: true,
            pinSpacing: true,
            scrub: isDesktop ? 0.48 : 0.34,
            anticipatePin: 0.5,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          progressRef.current,
          {
            scaleX: 1,
            duration: segments,
            ease: 'none',
          },
          0,
        );

        for (let index = 1; index < slides.length; index += 1) {
          const previousIndex = index - 1;
          const position = previousIndex;
          const incomingClip = isDesktop ? concealedClip.desktop : concealedClip.mobile;

          timeline
            .addLabel(`service-${index + 1}`, position)
            .to(
              copyParts[previousIndex],
              {
                autoAlpha: 0,
                y: isDesktop ? -14 : -10,
                duration: 0.2,
                stagger: 0.012,
                ease: 'power2.inOut',
              },
              position,
            )
            .to(
              images[previousIndex],
              {
                scale: 1.075,
                xPercent: isDesktop ? -2.2 : 0,
                yPercent: isDesktop ? 0 : -1.5,
                duration: 0.72,
                ease: 'power1.inOut',
              },
              position,
            )
            .to(
              media[previousIndex],
              {
                autoAlpha: 0,
                y: isDesktop ? -10 : -7,
                scale: 0.992,
                rotationY: 0,
                duration: 0.56,
                ease: 'power3.inOut',
              },
              position + 0.16,
            )
            .to(
              backplanes[previousIndex],
              {
                x: isDesktop ? 6 : 3,
                y: isDesktop ? 7 : 5,
                rotation: 0,
                duration: 0.56,
                ease: 'power3.inOut',
              },
              position + 0.12,
            )
            .to(
              rails[previousIndex],
              { scaleY: 0.28, autoAlpha: 0.35, duration: 0.32, ease: 'power2.inOut' },
              position + 0.12,
            )
            .to(
              indicators[previousIndex],
              {
                autoAlpha: 0.42,
                scale: 0.92,
                duration: 0.25,
              },
              position + 0.12,
            )
            .set(slides[index], { autoAlpha: 1, pointerEvents: 'auto', zIndex: index + 3 }, position + 0.04)
            .set(copies[index], { autoAlpha: 1 }, position + 0.04)
            .fromTo(
              viewports[index],
              {
                clipPath: incomingClip,
              },
              {
                clipPath: revealedClip,
                duration: 0.66,
                ease: 'power4.inOut',
              },
              position + 0.12,
            )
            .fromTo(
              media[index],
              { autoAlpha: 0, y: isDesktop ? 14 : 11, scale: 1.008, rotationY: 0 },
              { autoAlpha: 1, y: 0, scale: 1, rotationY: 0, duration: 0.82, ease: 'power3.out' },
              position + 0.1,
            )
            .fromTo(
              backplanes[index],
              { x: isDesktop ? -8 : -4, y: isDesktop ? 18 : 12, rotation: 0 },
              { x: 0, y: 0, rotation: 0, duration: 0.92, ease: 'power3.out' },
              position + 0.08,
            )
            .fromTo(
              rails[index],
              { scaleY: 0.1, autoAlpha: 0 },
              { scaleY: 0.72, autoAlpha: 0.8, duration: 0.5, ease: 'power3.out' },
              position + 0.3,
            )
            .fromTo(
              images[index],
              {
                scale: 1.105,
                xPercent: isDesktop ? 3.2 : 0,
                yPercent: isDesktop ? 0 : 2.2,
              },
              {
                scale: 1.01,
                xPercent: 0,
                yPercent: 0,
                duration: 0.88,
                ease: 'power2.out',
              },
              position + 0.12,
            )
            .fromTo(
              curtains[index],
              {
                autoAlpha: 0.92,
                scaleX: isDesktop ? 0 : 1,
                scaleY: isDesktop ? 1 : 0,
                transformOrigin: isDesktop ? 'left center' : 'center bottom',
              },
              {
                keyframes: [
                  { scaleX: 1, scaleY: 1, autoAlpha: 0.92, duration: 0.26, ease: 'power3.in' },
                  { transformOrigin: isDesktop ? 'right center' : 'center top', duration: 0.01 },
                  { scaleX: isDesktop ? 0 : 1, scaleY: isDesktop ? 1 : 0, autoAlpha: 0, duration: 0.34, ease: 'power3.out' },
                ],
              },
              position + 0.04,
            )
            .fromTo(
              scans[index],
              {
                autoAlpha: 0,
                xPercent: isDesktop ? -120 : 0,
                yPercent: isDesktop ? 0 : -120,
              },
              {
                keyframes: [
                  { autoAlpha: 0.9, duration: 0.04 },
                  { xPercent: isDesktop ? 520 : 0, yPercent: isDesktop ? 0 : 520, autoAlpha: 0.55, duration: 0.48, ease: 'power2.inOut' },
                  { autoAlpha: 0, duration: 0.08 },
                ],
              },
              position + 0.31,
            )
            .fromTo(
              copyParts[index],
              {
                autoAlpha: 0,
                x: isDesktop ? 18 : 0,
                y: isDesktop ? 12 : 22,
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.42,
                stagger: 0.026,
                ease: 'power3.out',
              },
              position + 0.22,
            )
            .to(
              indicators[index],
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
              },
              position + 0.34,
            )
            .set(slides[previousIndex], { autoAlpha: 0, pointerEvents: 'none', zIndex: 0 }, position + 0.86);
        }

        timeline.addLabel('story-end', segments);
      };

      mediaQuery.add('(min-width: 1024px)', () => createStory(true));
      mediaQuery.add('(max-width: 1023px)', () => createStory(false));

      let refreshFrame = 0;
      const scheduleRefresh = () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const delayedRefreshes = [250, 900].map((delay) => window.setTimeout(scheduleRefresh, delay));
      window.addEventListener('load', scheduleRefresh);
      void document.fonts?.ready.then(scheduleRefresh);
      scheduleRefresh();

      return () => {
        window.removeEventListener('load', scheduleRefresh);
        window.cancelAnimationFrame(refreshFrame);
        delayedRefreshes.forEach((timeout) => window.clearTimeout(timeout));
        mediaQuery.revert();
      };
    }, section);

    return () => context.revert();
  }, [serviceItems]);

  return (
    <section
      id="main-services-ambush"
      ref={sectionRef}
      data-native-reveal
      data-motion-variant="from-left"
      className="relative border-y border-slate-300 bg-[var(--color-canvas)] text-brand-950 dark:border-white/10 dark:bg-night-950 dark:text-white"
    >
      <div className="ui-shell py-16 sm:py-20 lg:py-24">
        <header className="grid max-w-6xl gap-6 border-l border-slate-300 pl-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:pl-8">
          <div>
          <div data-motion-eyebrow className="flex items-center gap-3 font-utility text-[0.68rem] font-bold uppercase tracking-[0.16em] text-support-700 dark:text-support-300">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {content.eyebrow}
          </div>
          <h2 data-motion-heading className="mt-5 max-w-4xl font-serif text-[2.55rem] font-bold leading-[1.01] text-brand-950 sm:text-[3.75rem] lg:text-[5rem] dark:text-white">
            {content.title}
          </h2>
          </div>
          <div>
          <p data-motion-description className="mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {content.description}
          </p>
          {content.supportingText ? (
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-500 dark:text-slate-400">
              {content.supportingText}
            </p>
          ) : null}
          </div>
        </header>
      </div>

      <div
        ref={stageRef}
        className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-t border-slate-300 bg-[#edf2f1] dark:border-white/10 dark:bg-night-900 motion-reduce:min-h-0 motion-reduce:overflow-visible"
      >
        <div className="relative mx-auto min-h-[calc(100svh-4rem)] w-full max-w-[108rem] px-4 sm:px-6 lg:px-[clamp(2rem,4vw,5rem)] motion-reduce:min-h-0">
          <div className="absolute inset-x-5 top-6 z-20 sm:inset-x-8 lg:inset-x-0 lg:top-8">
            <div className="flex items-center justify-between font-utility uppercase tracking-[0.14em]">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Scroll to explore</p>
              <div className="flex items-center gap-3 sm:gap-5">
                {serviceItems.map((service, index) => (
                  <span
                    key={service.key}
                    data-service-indicator
                    className="text-[10px] font-bold tabular-nums text-brand-950 dark:text-white"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 h-px overflow-hidden bg-slate-200 dark:bg-white/15">
              <div ref={progressRef} className="h-full w-full bg-support-600 dark:bg-support-400" />
            </div>
          </div>

          <div className="relative min-h-[calc(100svh-4rem)] motion-reduce:min-h-0">
            {serviceItems.map((service, index) => (
              <ServiceStory
                key={service.key}
                service={service}
                index={index}
                total={serviceItems.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStory({
  service,
  index,
  total,
}: {
  service: MainServicesAmbushItem;
  index: number;
  total: number;
}) {
  const fallbackImageSrc = fallbackServiceImages[service.key];
  const initialImageSrc = realServiceImageByLegacyPath[service.image] ?? service.image ?? fallbackImageSrc;
  const [imageSrc, setImageSrc] = useState(initialImageSrc);

  return (
    <article
      data-service-slide
      className="invisible absolute inset-0 grid min-h-[calc(100svh-4rem)] content-center gap-5 pb-6 pt-20 opacity-0 first:visible first:opacity-100 lg:grid-cols-[minmax(26rem,0.82fr)_minmax(34rem,1.18fr)] lg:items-center lg:gap-[clamp(3rem,5vw,7rem)] lg:pb-10 lg:pt-24 motion-reduce:visible motion-reduce:static motion-reduce:min-h-0 motion-reduce:border-b motion-reduce:border-slate-200 motion-reduce:py-10 motion-reduce:opacity-100 motion-reduce:last:border-b-0 dark:motion-reduce:border-white/10"
    >
      <div
        data-service-copy
        className="relative z-10 border-l border-slate-300 pl-4 will-change-[transform,opacity] sm:pl-6"
      >
        <div data-service-copy-part className="flex items-center gap-3 font-utility text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: service.accent }}>
          <span className="h-px w-7 bg-current" />
          Main service {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        <p data-service-copy-part className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:mt-4">
          {service.eyebrow}
        </p>
        <h3 data-service-copy-part className="mt-2 max-w-2xl font-serif text-[2.25rem] font-bold leading-[1.02] text-brand-950 sm:text-[3rem] dark:text-white lg:mt-3 lg:text-[4.65rem]">
          {service.title}
        </h3>
        <p data-service-copy-part className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7 lg:mt-5 lg:text-lg lg:leading-8">
          {service.description}
        </p>

        <div data-service-copy-part className="mt-4 grid grid-cols-2 gap-x-4 lg:mt-6 lg:gap-x-6">
          {service.services.slice(0, 4).map((item) => (
            <div
              key={item}
              className="flex min-h-9 items-start gap-2 border-t border-slate-200 py-2 text-[11px] font-semibold leading-4 text-slate-700 dark:border-white/10 dark:text-slate-200 sm:text-xs lg:min-h-11 lg:gap-3 lg:py-3 lg:text-sm lg:leading-5"
            >
              <CheckCircle2 className="mt-0.5 shrink-0" size={14} style={{ color: service.accent }} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div
          data-service-copy-part
          className="mt-4 hidden border-l-2 pl-4 [@media(min-height:760px)]:block lg:mt-6 lg:block lg:pl-5"
          style={{ borderColor: service.accent }}
        >
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{service.proof}</p>
          <p className="mt-1 max-w-lg text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200 lg:mt-2 lg:text-sm lg:leading-6">
            {service.outcome}
          </p>
        </div>

        <Link
          data-service-copy-part
          href={service.href}
          className="ui-action group mt-5 inline-flex min-h-11 items-center gap-3 rounded-sm px-5 py-3 text-xs font-semibold text-white shadow-sm lg:mt-7"
          style={{ backgroundColor: service.accent }}
        >
          Explore service
          <ArrowUpRight
            size={16}
            className="motion-icon transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div
        data-service-media
        className="relative isolate h-[15rem] will-change-[transform,opacity] sm:h-[21rem] lg:order-2 lg:aspect-[8/5] lg:h-auto lg:min-h-[29rem]"
      >
        <div
          data-service-backplane
          className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 border border-slate-300/80 dark:border-white/10 lg:translate-x-5 lg:translate-y-5"
          style={{ backgroundColor: service.softAccent }}
          aria-hidden="true"
        />

        <div data-service-viewport className="absolute inset-0 overflow-hidden border border-slate-300 bg-white shadow-sm will-change-[clip-path] dark:border-white/15 dark:bg-night-800">
          <div data-service-image className="absolute inset-0 will-change-transform">
            <Image
              src={imageSrc}
              alt={service.imageAlt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : 'eager'}
              unoptimized
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="object-cover saturate-[0.9] contrast-[1.04]"
              style={{ objectPosition: service.imagePosition ?? 'center' }}
              onError={() => {
                if (imageSrc !== fallbackImageSrc) setImageSrc(fallbackImageSrc);
              }}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(7,15,28,0.46)_100%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-3 border border-white/45 dark:border-white/20 sm:inset-4" aria-hidden="true" />

          <div data-service-meta className="absolute left-0 top-0 z-20 flex h-12 items-center bg-white/92 px-4 backdrop-blur-md dark:bg-night-950/90 sm:h-14 sm:px-5">
            <span className="font-utility text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Field / {service.shortTitle}
            </span>
          </div>

          <div data-service-meta className="absolute right-0 top-0 z-20 flex h-12 w-12 items-center justify-center text-white sm:h-14 sm:w-14" style={{ backgroundColor: service.accent }}>
            <span className="font-utility text-[10px] font-black tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          </div>

          <div data-service-meta className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-5 p-4 text-white sm:p-5">
            <p className="max-w-[72%] text-[10px] font-semibold leading-4 sm:text-xs sm:leading-5">{service.proof}</p>
            <span className="font-utility text-[8px] font-bold uppercase tracking-[0.14em] text-white/75">Inception 23</span>
          </div>

          <div
            data-service-curtain
            className="pointer-events-none absolute inset-0 z-30 opacity-0 will-change-transform"
            style={{ backgroundColor: service.accent }}
            aria-hidden="true"
          />

          <div
            data-service-scan
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[14%] opacity-0 mix-blend-screen will-change-transform sm:w-[9%]"
            style={{ background: `linear-gradient(90deg, transparent, ${service.softAccent}, rgba(255,255,255,0.7), transparent)` }}
            aria-hidden="true"
          />
        </div>

        <div
          data-service-rail
          className="pointer-events-none absolute -left-3 inset-y-[16%] z-20 w-1 lg:-left-5"
          style={{ backgroundColor: service.accent }}
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
