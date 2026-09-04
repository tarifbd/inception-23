'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpToLine, ChevronRight, MessageCircle, X } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const actions = [
  {
    label: 'Chat on WhatsApp',
    href: siteConfig.whatsappHref,
    icon: '/brands/whatsapp.svg',
    className: 'hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800',
    newTab: true,
  },
  {
    label: 'Send Email',
    href: `mailto:${siteConfig.email}`,
    icon: '/brands/gmail.svg',
    className: 'hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800',
    newTab: false,
  },
  {
    label: 'Book Appointment',
    href: siteConfig.appointmentHref,
    icon: '/brands/google-calendar.svg',
    className: 'hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800',
    newTab: false,
  },
] as const;

export function FloatingContactBar() {
  const pathname = usePathname();
  const [edgeVisibility, setEdgeVisibility] = useState({ top: false, bottom: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollControlVisible, setScrollControlVisible] = useState(false);
  const lastScrollTop = useRef(0);
  const mobileBarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!mobileBarRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePress);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let frame = 0;
    let hideTimer = 0;

    const updateVisibility = (event?: Event) => {
      if (event?.type === 'scroll') {
        setScrollControlVisible(true);
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => setScrollControlVisible(false), 1800);
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const remaining = document.documentElement.scrollHeight - window.innerHeight - scrollTop;
        const delta = scrollTop - lastScrollTop.current;
        const atTop = scrollTop <= 80;
        const atBottom = remaining <= 80;

        if (atTop) {
          setEdgeVisibility({ top: false, bottom: true });
        } else if (atBottom) {
          setEdgeVisibility({ top: true, bottom: false });
        } else if (delta > 4) {
          setEdgeVisibility({ top: true, bottom: false });
        } else if (delta < -4) {
          setEdgeVisibility({ top: false, bottom: true });
        }

        lastScrollTop.current = scrollTop;
      });
    };

    lastScrollTop.current = window.scrollY;
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  const scrollToEdge = (position: 'top' | 'bottom') => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: position === 'top' ? 0 : document.documentElement.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const scrollButtonClass = 'group relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-400/10 dark:hover:text-blue-200';
  const tooltipClass = 'pointer-events-none absolute right-[calc(100%+0.65rem)] hidden translate-x-1 whitespace-nowrap rounded-md bg-brand-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block';

  return (
    <>
      <aside
        ref={mobileBarRef}
        aria-label="Quick contact"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-[70] lg:hidden"
      >
        <div
          id="mobile-contact-actions"
          aria-hidden={!mobileMenuOpen}
          className={`absolute bottom-[calc(100%+0.65rem)] right-0 w-[min(20rem,calc(100vw-1.5rem))] origin-bottom-right overflow-hidden rounded-lg border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-200 dark:border-white/10 dark:bg-night-900/95 ${
            mobileMenuOpen ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible translate-y-2 scale-[0.98] opacity-0'
          }`}
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-black text-brand-950 dark:text-white">Contact us</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close contact options"
              title="Close contact options"
              className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-brand-950 focus:outline-none focus:ring-4 focus:ring-support-500/20 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-1 grid gap-1">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.newTab ? '_blank' : undefined}
                rel={action.newTab ? 'noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-12 items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-bold text-slate-700 transition focus:outline-none focus:ring-4 focus:ring-support-500/20 dark:text-slate-100 ${action.className}`}
              >
                <Image src={action.icon} alt="" width={24} height={24} aria-hidden="true" className="h-6 w-6 shrink-0 object-contain" />
                <span className="min-w-0 flex-1">{action.label}</span>
                <ChevronRight size={17} aria-hidden="true" className="shrink-0 text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToEdge(edgeVisibility.top ? 'top' : 'bottom')}
          aria-label={edgeVisibility.top ? 'Go to top' : 'Go to bottom'}
          title={edgeVisibility.top ? 'Go to top' : 'Go to bottom'}
          className={`absolute bottom-[calc(100%+0.5rem)] right-2 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-lg backdrop-blur-xl transition duration-200 after:absolute after:-inset-1.5 after:content-[''] focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-white/15 dark:bg-night-900/95 dark:text-slate-100 ${
            scrollControlVisible && !mobileMenuOpen
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-1 scale-90 opacity-0'
          }`}
        >
          {edgeVisibility.top ? <ArrowUpToLine size={13} aria-hidden="true" /> : <ArrowDownToLine size={13} aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-contact-actions"
          className="mobile-contact-trigger flex h-10 items-center gap-1.5 rounded-full border border-cyan-300/70 bg-gradient-to-r from-cyan-600 to-teal-600 px-3.5 text-xs font-black text-white shadow-[0_9px_22px_rgba(8,145,178,0.25)] transition hover:from-cyan-500 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/25 active:scale-[0.98] dark:border-cyan-300/30"
        >
          {mobileMenuOpen ? <X size={16} aria-hidden="true" /> : <MessageCircle size={16} aria-hidden="true" />}
          <span>{mobileMenuOpen ? 'Close' : 'Contact'}</span>
        </button>
      </aside>

      <aside
        aria-label="Quick contact"
        className="fixed bottom-6 right-5 z-[70] hidden w-fit flex-col items-center gap-1 rounded-lg border border-white/80 bg-white/82 p-1.5 shadow-xl backdrop-blur-2xl lg:flex dark:border-white/10 dark:bg-night-900/84"
      >
        {scrollControlVisible && edgeVisibility.top ? (
          <>
            <button type="button" onClick={() => scrollToEdge('top')} aria-label="Go to top" title="Go to top" className={scrollButtonClass}>
              <ArrowUpToLine size={14} aria-hidden="true" />
              <span className={tooltipClass}>Go to top</span>
            </button>
            <span aria-hidden="true" className="my-0.5 h-px w-6 bg-slate-200 dark:bg-white/10" />
          </>
        ) : null}

        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            target={action.newTab ? '_blank' : undefined}
            rel={action.newTab ? 'noreferrer' : undefined}
            aria-label={action.label}
            title={action.label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-support-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 ${action.className}`}
          >
            <Image src={action.icon} alt="" width={25} height={25} aria-hidden="true" className="h-[25px] w-[25px] object-contain" />
            <span className={tooltipClass}>{action.label}</span>
          </a>
        ))}

        {scrollControlVisible && edgeVisibility.bottom ? (
          <>
            <span aria-hidden="true" className="my-0.5 h-px w-6 bg-slate-200 dark:bg-white/10" />
            <button type="button" onClick={() => scrollToEdge('bottom')} aria-label="Go to bottom" title="Go to bottom" className={scrollButtonClass}>
              <ArrowDownToLine size={14} aria-hidden="true" />
              <span className={tooltipClass}>Go to bottom</span>
            </button>
          </>
        ) : null}
      </aside>
    </>
  );
}
