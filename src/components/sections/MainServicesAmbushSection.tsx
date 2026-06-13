'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainServicesAmbush, type MainServicesAmbushItem } from '@/lib/constants/main-services-ambush';
import type { HomepageSectionContent } from '@/lib/homepage-content';

const sectionBackgrounds = ['#f1fbfe', '#f1fbf6', '#f7f3ff', '#fff6ef'];

export function MainServicesAmbushSection({ content: _content }: { content: HomepageSectionContent }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const storyRefs = useRef<HTMLElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const stories = storyRefs.current.filter(Boolean);
    const images = imageRefs.current.filter(Boolean);
    if (!section || stories.length !== mainServicesAmbush.length || images.length !== mainServicesAmbush.length) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(images, {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          yPercent: 0,
        });

        images.forEach((image, index) => {
          image.style.zIndex = String(images.length - index);
        });

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

        return () => transitions.forEach((timeline) => timeline.kill());
      });

      media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const reveals = stories.map((story, index) =>
          gsap.fromTo(
            story,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: story,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
                onEnter: () => gsap.to(section, { backgroundColor: sectionBackgrounds[index], duration: 0.5 }),
                onEnterBack: () => gsap.to(section, { backgroundColor: sectionBackgrounds[index], duration: 0.5 }),
              },
            },
          ),
        );

        return () => reveals.forEach((reveal) => reveal.kill());
      });

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="main-services-ambush"
      ref={sectionRef}
      className="relative isolate overflow-clip bg-[#f1fbfe] text-brand-950 transition-colors duration-500"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="mx-auto grid w-full max-w-[92rem] px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:gap-10 lg:px-8">
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
