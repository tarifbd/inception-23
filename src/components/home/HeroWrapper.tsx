import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Cpu, Palette, Scale } from 'lucide-react';
import { HeroCarousel, type HeroCarouselSlide } from '@/components/home/HeroCarousel.client';
import type { HomepageContent, HomepageHeroSlideTheme } from '@/lib/homepage-content';

const slideDesign: Record<HomepageHeroSlideTheme, Omit<HeroCarouselSlide, 'label' | 'visualType' | 'visualUrl' | 'visualAlt'>> = {
  it: { id: 'it', icon: 'Cpu', dot: 'bg-cyan-500', accentHex: '#08789a', lottie: '/animations/consultancy.lottie', lottieClass: 'scale-[1.2]' },
  consultancy: { id: 'consultancy', icon: 'BriefcaseBusiness', dot: 'bg-emerald-500', accentHex: '#087866', lottie: '/animations/business-operations.json', lottieClass: 'scale-[1.08]' },
  legal: { id: 'legal', icon: 'Scale', dot: 'bg-violet-600', accentHex: '#7c3aed', lottie: '/animations/legal.json', lottieClass: 'scale-[1.08]' },
  creative: { id: 'creative', icon: 'Palette', dot: 'bg-orange-500', accentHex: '#ea580c', lottie: '/animations/creative.lottie', lottieClass: 'scale-[1.08]' },
};

const iconMap = { Cpu, BriefcaseBusiness, Scale, Palette };

export function HeroWrapper({ content }: { content: HomepageContent['hero'] }) {
  const secondaryCtaLabel = content.secondaryCtaLabel.trim().toLowerCase() === 'explore services'
    ? 'View service map'
    : content.secondaryCtaLabel;
  const secondaryCtaHref = content.secondaryCtaHref === '/services' ? '#services' : content.secondaryCtaHref;
  const slides: HeroCarouselSlide[] = content.slides.map((slide) => {
    const theme = slide.theme ?? (slide.id in slideDesign ? slide.id as HomepageHeroSlideTheme : 'it');
    const visualUrl = theme === 'legal' && (!slide.visualUrl || slide.visualUrl === '/animations/legal.lottie')
      ? '/animations/legal.json'
      : slide.visualUrl;

    return {
      ...slideDesign[theme],
      id: slide.id,
      label: slide.label,
      visualType: slide.visualType,
      visualUrl,
      visualAlt: slide.visualAlt,
    };
  });

  const copyPanels = content.slides.map((slide) => {
    const design = slideDesign[slide.theme ?? (slide.id in slideDesign ? slide.id as HomepageHeroSlideTheme : 'it')];
    const Icon = iconMap[design.icon];

    return (
      <div key={slide.id} className="max-w-4xl">
        <div className="mb-3 flex max-w-full items-center gap-3 border-l-2 pl-3 font-utility text-xs font-bold uppercase sm:mb-5 lg:mb-6" style={{ color: design.accentHex, borderColor: design.accentHex }}>
          <span className={`h-2 w-2 rounded-full ${design.dot}`} aria-hidden="true" />
          <Icon size={15} aria-hidden="true" />
          <span className="truncate">{slide.eyebrow}</span>
        </div>

        <h1 className="max-w-[720px] break-words font-serif text-[2.05rem] font-black leading-[1.08] text-brand-950 dark:text-white sm:text-[2.8rem] sm:leading-[1.05] lg:text-[4rem] xl:text-[4.75rem]">
          <span className="block">{slide.title}</span>
          <span className="block" style={{ color: design.accentHex }}>{slide.highlight}</span>
        </h1>

        <p className="mt-4 max-w-[680px] text-[0.95rem] leading-6 text-slate-600 dark:text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">{slide.copy}</p>

        <div className="mt-5 grid max-w-[680px] grid-cols-2 border-y border-slate-200 py-1.5 dark:border-white/15 sm:mt-7 sm:grid-cols-4 sm:py-2">
          {slide.chips.map((chip) => (
            <span key={chip} className="inline-flex min-w-0 items-center gap-2 px-2 py-2 text-xs font-bold text-slate-700 first:pl-0 dark:text-slate-200 sm:border-l sm:border-slate-200 sm:first:border-l-0 sm:dark:border-white/15">
              <CheckCircle2 size={14} className="shrink-0" aria-hidden="true" style={{ color: design.accentHex }} />
              <span className="min-w-0 break-words">{chip}</span>
            </span>
          ))}
        </div>

        <div className="mt-5 flex max-w-[680px] flex-col gap-2 sm:mt-7 sm:flex-row sm:gap-3">
          <Link href={content.primaryCtaHref} className="ui-action inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-brand-950 px-7 py-4 text-sm font-black text-white">
            {content.primaryCtaLabel}<ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={secondaryCtaHref} className="ui-nav-link inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-black text-brand-950 dark:text-white">
            <span>{secondaryCtaLabel}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  });

  const firstAnimation = slides.find((slide) => !slide.visualType || slide.visualType === 'lottie');

  return (
    <>
      <link rel="preload" href="/wasm/dotlottie-player.wasm" as="fetch" type="application/wasm" crossOrigin="anonymous" />
      {firstAnimation ? <link rel="preload" href={firstAnimation.visualUrl || firstAnimation.lottie} as="fetch" crossOrigin="anonymous" /> : null}
      <HeroCarousel slides={slides} copyPanels={copyPanels} footerLabel={content.footerLabel} />
    </>
  );
}
