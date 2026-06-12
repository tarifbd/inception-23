'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrainCircuit, BriefcaseBusiness, CircleDot, FileText, Layers3, Network, Palette, Scale, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { mainServicesAmbush, type MainServicesAmbushItem } from '@/lib/constants/main-services-ambush';
import type { ServiceKey } from '@/lib/constants/theme';
import type { HomepageSectionContent } from '@/lib/homepage-content';

type AmbushIcon = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

const icons: Record<ServiceKey, AmbushIcon> = {
  it: BrainCircuit,
  consultancy: BriefcaseBusiness,
  legal: Scale,
  creative: Palette,
};

export function MainServicesAmbushSection({ content }: { content: HomepageSectionContent }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || cards.length === 0) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(cards, {
          autoAlpha: 0,
          yPercent: 86,
          xPercent: 0,
          rotate: 0,
          scale: 0.9,
          transformOrigin: '50% 70%',
        });

        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${cards.length * 560}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          if (index > 0) {
            timeline.to(cards[index - 1], {
              autoAlpha: 0,
              yPercent: -22,
              scale: 0.94,
              duration: 0.45,
              ease: 'power2.in',
            });
          }

          timeline.to(card, {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.72,
          });

          if (index < cards.length - 1) {
            timeline.to(card, {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration: 0.2,
            });
          }
        });

        return undefined;
      });

      media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(cards, {
          autoAlpha: 0,
          y: 84,
          scale: 0.94,
          transformOrigin: '50% 85%',
        });

        cards.forEach((card) => {
          gsap.to(card, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'bottom 18%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        return undefined;
      });

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="main-services-ambush"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#f8fbff] py-16 text-brand-950 sm:py-20 lg:min-h-[100svh] lg:py-0"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-[6%] top-[12%] -z-10 h-56 w-56 rounded-full bg-cyan-300/18 blur-3xl" />
      <div className="absolute bottom-[12%] right-[7%] -z-10 h-64 w-64 rounded-full bg-orange-300/16 blur-3xl" />

      <div className="mx-auto grid min-h-full w-full max-w-7xl gap-10 px-4 sm:px-6 lg:min-h-[100svh] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8">
        <aside className="max-w-xl lg:py-24">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            {content.eyebrow}
          </div>

          <h2 className="mt-7 max-w-[620px] font-serif text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.98] tracking-normal text-brand-950 lg:text-[clamp(4.6rem,6.3vw,7.2rem)]">
            {content.title}
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex items-center gap-3">
            {mainServicesAmbush.map((service, index) => (
              <span
                key={service.key}
                aria-hidden="true"
                className="h-2 flex-1 rounded-full"
                style={{ backgroundColor: service.accent, opacity: 0.22 + index * 0.12 }}
              />
            ))}
          </div>
        </aside>

        <div className="relative min-h-[520px] lg:h-[min(720px,76svh)]">
          <div className="absolute inset-x-6 top-8 hidden h-24 rounded-full bg-brand-950/10 blur-3xl lg:block" />
          {mainServicesAmbush.map((service, index) => (
            <AmbushServiceCard
              key={service.key}
              service={service}
              index={index}
              setRef={(node) => {
                if (node) cardRefs.current[index] = node;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AmbushServiceCard({
  service,
  index,
  setRef,
}: {
  service: MainServicesAmbushItem;
  index: number;
  setRef: (node: HTMLDivElement | null) => void;
}) {
  const Icon = icons[service.key];
  const satellites = getSatelliteIcons(service.key);

  return (
    <div
      ref={setRef}
      role="img"
      aria-label={`${service.title} visual system`}
      className={`mb-5 overflow-hidden rounded-[2rem] border bg-white/88 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-6 lg:absolute lg:inset-0 lg:mb-0 lg:p-8 ${service.borderClass}`}
      style={{
        boxShadow: `0 32px 100px ${service.softAccent}, 0 24px 80px rgba(15,23,42,0.10)`,
      }}
    >
      <div className="relative min-h-[520px] rounded-[1.6rem] border border-white/80 bg-white/70 p-4 sm:min-h-[620px] sm:p-6 lg:h-full">
        <span
          className="absolute right-5 top-5 z-20 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm"
        >
          0{index + 1} / 04
        </span>

        <div
          className="absolute inset-0 rounded-[1.6rem]"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${service.softAccent}, transparent 34%), radial-gradient(circle at 82% 18%, ${service.softAccent}, transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.68))`,
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-[min(78%,34rem)] w-[min(78%,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/80" />
        <div className="absolute left-1/2 top-1/2 h-[min(58%,25rem)] w-[min(58%,25rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300/80" />
        <div
          className="absolute left-1/2 top-1/2 h-[min(36%,16rem)] w-[min(36%,16rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{ backgroundColor: service.softAccent }}
        />

        <div
          className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] text-white shadow-2xl sm:h-36 sm:w-36 sm:rounded-[2.5rem]"
          style={{ backgroundColor: service.accent, boxShadow: `0 28px 60px ${service.softAccent}` }}
        >
          <Icon size={54} strokeWidth={1.9} />
        </div>

        <div className="absolute left-[12%] top-[17%] h-24 w-24 rounded-[2rem] border border-white/70 bg-white/80 shadow-lg sm:h-32 sm:w-32" />
        <div className="absolute bottom-[14%] right-[13%] h-24 w-24 rounded-full border border-white/70 bg-white/80 shadow-lg sm:h-32 sm:w-32" />
        <div className="absolute right-[12%] top-[22%] h-14 w-32 rotate-6 rounded-full border border-white/70 bg-white/80 shadow-lg sm:h-16 sm:w-40" />
        <div className="absolute bottom-[18%] left-[11%] h-14 w-36 -rotate-6 rounded-full border border-white/70 bg-white/80 shadow-lg sm:h-16 sm:w-44" />

        {satellites.map((SatelliteIcon, satelliteIndex) => (
          <div
            key={satelliteIndex}
            className={satellitePositionClasses[satelliteIndex]}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl sm:h-16 sm:w-16"
              style={{ backgroundColor: service.accent, boxShadow: `0 20px 42px ${service.softAccent}` }}
            >
              <SatelliteIcon size={24} strokeWidth={2} />
            </div>
          </div>
        ))}

        <div className="absolute left-[17%] top-[43%] hidden h-px w-[24%] origin-left rotate-[18deg] bg-slate-300 sm:block" />
        <div className="absolute right-[18%] top-[42%] hidden h-px w-[24%] origin-right -rotate-[18deg] bg-slate-300 sm:block" />
        <div className="absolute bottom-[32%] left-[24%] hidden h-px w-[22%] origin-left -rotate-[23deg] bg-slate-300 sm:block" />
        <div className="absolute bottom-[31%] right-[24%] hidden h-px w-[22%] origin-right rotate-[23deg] bg-slate-300 sm:block" />

        <div className="absolute inset-x-8 bottom-7 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, barIndex) => (
            <span
              key={barIndex}
              className="h-2 rounded-full bg-slate-200"
              style={{ opacity: 0.45 + ((barIndex + index) % 4) * 0.12 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const satellitePositionClasses = [
  'absolute left-[11%] top-[28%] z-10',
  'absolute right-[13%] top-[30%] z-10',
  'absolute bottom-[24%] left-[18%] z-10',
  'absolute bottom-[23%] right-[19%] z-10',
];

function getSatelliteIcons(serviceKey: ServiceKey) {
  const iconMap: Record<ServiceKey, AmbushIcon[]> = {
    it: [Workflow, Network, BrainCircuit, CircleDot],
    consultancy: [BriefcaseBusiness, Layers3, Workflow, CircleDot],
    legal: [Scale, ShieldCheck, FileText, CircleDot],
    creative: [Palette, Sparkles, Layers3, CircleDot],
  };

  return iconMap[serviceKey];
}
