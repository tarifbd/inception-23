'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainServicesAmbush, type MainServicesAmbushItem } from '@/lib/constants/main-services-ambush';
import type { HomepageSectionContent } from '@/lib/homepage-content';

const sectionBackgrounds = ['#ecfeff', '#f1fbf6', '#f7f3ff', '#fff6ef'];

export function MainServicesAmbushSection({ content: _content }: { content: HomepageSectionContent }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const storyRefs = useRef<HTMLElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const mobileStageRef = useRef<HTMLDivElement | null>(null);
  const mobileCardRefs = useRef<HTMLElement[]>([]);
  const mobileImageRefs = useRef<HTMLDivElement[]>([]);
  const mobileDotRefs = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    let cleanupAnimation = () => {};

    const setupAnimation = () => {
      cleanupAnimation();
      cleanupAnimation = () => {};

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const stories = storyRefs.current.filter(Boolean);
      const images = imageRefs.current.filter(Boolean);
      const mobileStage = mobileStageRef.current;
      const mobileCards = mobileCardRefs.current.filter(Boolean);
      const mobileImages = mobileImageRefs.current.filter(Boolean);
      const mobileDots = mobileDotRefs.current.filter(Boolean);

      if (isDesktop) {
        if (stories.length !== mainServicesAmbush.length || images.length !== mainServicesAmbush.length) return;

        gsap.set(section, { backgroundColor: sectionBackgrounds[0] });
        gsap.set(images, {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          yPercent: 0,
        });

        images.forEach((image, index) => {
          image.style.zIndex = String(images.length - index);
        });

        const colorTriggers = stories.map((story, index) =>
          ScrollTrigger.create({
            trigger: story,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => gsap.to(section, { backgroundColor: sectionBackgrounds[index], duration: 0.35, overwrite: 'auto' }),
            onEnterBack: () => gsap.to(section, { backgroundColor: sectionBackgrounds[index], duration: 0.35, overwrite: 'auto' }),
          }),
        );

        const transitions = stories.slice(0, -1).map((story, index) => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: story,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              images[index],
              {
                clipPath: 'inset(0% 0% 100% 0%)',
                scale: 1.08,
                yPercent: -4,
                ease: 'none',
              },
              0,
            )
            .to(
              section,
              {
                backgroundColor: sectionBackgrounds[index + 1],
                ease: 'none',
              },
              0,
            );

          return timeline;
        });

        cleanupAnimation = () => {
          colorTriggers.forEach((trigger) => trigger.kill());
          transitions.forEach((timeline) => timeline.kill());
        };

        ScrollTrigger.refresh();
        return;
      }

      if (!mobileStage || mobileCards.length !== mainServicesAmbush.length || mobileImages.length !== mainServicesAmbush.length) return;

      gsap.set(section, { backgroundColor: sectionBackgrounds[0] });
      gsap.set(mobileCards, { autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(mobileCards[0], { autoAlpha: 1, pointerEvents: 'auto' });
      gsap.set(mobileImages, {
        clipPath: 'inset(0% 0% 0% 0% round 1.35rem)',
        scale: 1,
        yPercent: 0,
        transformOrigin: '50% 50%',
      });

      mobileImages.forEach((image, index) => {
        image.style.zIndex = String(mobileImages.length - index);
      });

      gsap.set(mobileDots, { autoAlpha: 0.28, scaleX: 1 });
      if (mobileDots[0]) gsap.set(mobileDots[0], { autoAlpha: 1, scaleX: 1.8 });

      const mobileTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: mobileStage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      mobileCards.slice(0, -1).forEach((card, index) => {
        const nextCard = mobileCards[index + 1];
        const image = mobileImages[index];
        const currentDot = mobileDots[index];
        const nextDot = mobileDots[index + 1];

        mobileTimeline
          .to(
            image,
            {
              clipPath: 'inset(0% 0% 100% 0% round 1.35rem)',
              scale: 1.08,
              yPercent: -4,
              duration: 0.78,
              ease: 'none',
            },
            index,
          )
          .to(
            card,
            {
              autoAlpha: 0,
              pointerEvents: 'none',
              duration: 0.38,
              ease: 'none',
            },
            index,
          )
          .fromTo(
            nextCard,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              pointerEvents: 'auto',
              duration: 0.44,
              ease: 'none',
            },
            index + 0.1,
          )
          .to(
            section,
            {
              backgroundColor: sectionBackgrounds[index + 1],
              duration: 0.42,
              ease: 'none',
            },
            index + 0.1,
          );

        if (currentDot && nextDot) {
          mobileTimeline
            .to(currentDot, { autoAlpha: 0.28, scaleX: 1, duration: 0.22, ease: 'power2.out' }, index)
            .to(nextDot, { autoAlpha: 1, scaleX: 1.8, duration: 0.22, ease: 'power2.out' }, index + 0.1);
        }
      });

      cleanupAnimation = () => {
        mobileTimeline.scrollTrigger?.kill();
        mobileTimeline.kill();
      };

      ScrollTrigger.refresh();
    };

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setupAnimation();

    setupAnimation();
    desktopQuery.addEventListener('change', handleChange);
    motionQuery.addEventListener('change', handleChange);

    return () => {
      cleanupAnimation();
      desktopQuery.removeEventListener('change', handleChange);
      motionQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <section
      id="main-services-ambush"
      ref={sectionRef}
      className="relative isolate overflow-clip bg-[#ecfeff] text-brand-950 transition-colors duration-500"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div ref={mobileStageRef} className="relative h-[400svh] px-4 sm:px-6 lg:hidden">
        <div className="sticky top-0 mx-auto flex min-h-[100svh] max-w-[42rem] items-center py-5">
          <div className="relative h-[calc(100svh-2.5rem)] w-full overflow-hidden">
            {mainServicesAmbush.map((service, index) => (
              <MobileServiceStory
                key={service.key}
                service={service}
                index={index}
                setRef={(node) => {
                  if (node) mobileCardRefs.current[index] = node;
                }}
              />
            ))}

            <div className="pointer-events-none absolute left-0 right-0 top-[13.25rem] z-0 mx-auto aspect-[16/10] w-full max-w-[22.5rem] overflow-hidden rounded-[1.35rem] border border-white/90 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
              {mainServicesAmbush.map((service, index) => (
                <MobileServiceImage
                  key={service.key}
                  service={service}
                  index={index}
                  setRef={(node) => {
                    if (node) mobileImageRefs.current[index] = node;
                  }}
                />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2">
              {mainServicesAmbush.map((service, index) => (
                <span
                  key={service.key}
                  ref={(node) => {
                    if (node) mobileDotRefs.current[index] = node;
                  }}
                  className="h-1.5 w-5 origin-center rounded-full"
                  style={{ backgroundColor: service.accent }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[92rem] px-4 sm:px-6 lg:grid lg:grid-cols-[0.76fr_1.24fr] lg:gap-10 lg:px-8">
        <div>
          {mainServicesAmbush.map((service, index) => (
            <ServiceStory
              key={service.key}
              service={service}
              index={index}
              setRef={(node) => {
                if (node) storyRefs.current[index] = node;
              }}
            />
          ))}
        </div>

        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center py-12">
            <div className="relative h-[min(74vh,760px)] w-full overflow-hidden rounded-[2rem] border border-white/90 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.16)]">
              {mainServicesAmbush.map((service, index) => (
                <ServiceImage
                  key={service.key}
                  service={service}
                  index={index}
                  setRef={(node) => {
                    if (node) imageRefs.current[index] = node;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStory({
  service,
  index,
  setRef,
}: {
  service: MainServicesAmbushItem;
  index: number;
  setRef: (node: HTMLElement | null) => void;
}) {
  return (
    <article ref={setRef} className="flex min-h-[auto] items-center py-16 sm:py-20 lg:min-h-screen lg:py-24">
      <div className="w-full">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: service.accent }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: service.accent }} />
          Main service - 0{index + 1} / 04
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{service.eyebrow}</p>
        <h3 className="mt-4 max-w-2xl font-serif text-[clamp(2.8rem,6vw,5.8rem)] font-black leading-[0.96] text-brand-950">
          {service.title}
        </h3>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">{service.description}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {service.services.slice(0, 4).map((item) => (
            <div key={item} className="flex items-start gap-3 border-t border-slate-200 py-3 text-sm font-bold leading-6 text-slate-700">
              <CheckCircle2 className="mt-1 shrink-0" size={16} style={{ color: service.accent }} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-l-2 pl-5" style={{ borderColor: service.accent }}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{service.proof}</p>
          <p className="mt-2 max-w-lg text-sm font-bold leading-6 text-slate-700">{service.outcome}</p>
        </div>

        <Link
          href={service.href}
          className="group mt-8 inline-flex items-center gap-3 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg transition hover:-translate-y-1"
          style={{ backgroundColor: service.accent, boxShadow: `0 16px 34px ${service.softAccent}` }}
        >
          Explore service
          <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] lg:hidden">
          <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 1023px) 92vw, 1px" className="object-cover" />
        </div>
      </div>
    </article>
  );
}

function MobileServiceStory({
  service,
  index,
  setRef,
}: {
  service: MainServicesAmbushItem;
  index: number;
  setRef: (node: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={setRef}
      className="absolute inset-x-0 top-0 z-10 h-[calc(100svh-3.5rem)] pb-8 pt-5"
      style={{
        opacity: index === 0 ? 1 : 0,
        visibility: index === 0 ? 'visible' : 'hidden',
        pointerEvents: index === 0 ? 'auto' : 'none',
      }}
    >
      <div className="grid h-full w-full grid-rows-[12rem_14.6rem_minmax(0,1fr)_3.25rem]">
        <div className="min-h-0">
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: service.accent }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: service.accent }} />
            Main service - 0{index + 1} / 04
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{service.eyebrow}</p>
          <h3 className="mt-2 max-w-[21rem] font-serif text-[clamp(1.85rem,9.6vw,2.65rem)] font-black leading-[0.95] text-brand-950">
            {service.title}
          </h3>
        </div>

        <div aria-hidden="true" />

        <div className="min-h-0 overflow-hidden">
          <p className="max-w-[22rem] text-[13px] leading-6 text-slate-600">{service.description}</p>

          <div className="mt-3 grid grid-cols-1 gap-1">
            {service.services.slice(0, 4).map((item) => (
              <div key={item} className="flex min-h-7 items-start gap-2 border-t border-slate-200 py-1 text-[11px] font-bold leading-5 text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0" size={14} style={{ color: service.accent }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 border-l-2 pl-4" style={{ borderColor: service.accent }}>
            <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">{service.proof}</p>
            <p className="mt-1 max-w-[21rem] text-[12px] font-bold leading-5 text-slate-700">{service.outcome}</p>
          </div>
        </div>

        <div className="flex items-end justify-center">
          <Link
            href={service.href}
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-4 text-[11px] font-black uppercase tracking-[0.13em] text-white shadow-lg transition"
            style={{ backgroundColor: service.accent, boxShadow: `0 16px 34px ${service.softAccent}` }}
          >
            Explore
            <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function MobileServiceImage({
  service,
  index,
  setRef,
}: {
  service: MainServicesAmbushItem;
  index: number;
  setRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={setRef} className="absolute inset-0 overflow-hidden bg-white">
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        sizes="(max-width: 1023px) 92vw, 1px"
        className="object-cover"
        priority={index === 0}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_18%,rgba(255,255,255,0.42),transparent_36%),linear-gradient(180deg,transparent_62%,rgba(15,23,42,0.08))]" />
    </div>
  );
}

function ServiceImage({
  service,
  index,
  setRef,
}: {
  service: MainServicesAmbushItem;
  index: number;
  setRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={setRef} className="absolute inset-0 overflow-hidden bg-white">
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        priority={index === 0}
        sizes="(min-width: 1024px) 62vw, 1px"
        className="object-cover"
      />
    </div>
  );
}
