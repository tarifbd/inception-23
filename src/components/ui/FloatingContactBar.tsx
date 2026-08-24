'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const actions = [
  {
    label: 'Chat on WhatsApp',
    href: '/contact?channel=whatsapp',
    icon: '/brands/whatsapp.svg',
    className: 'hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800',
  },
  {
    label: 'Send Email',
    href: `mailto:${siteConfig.email}`,
    icon: '/brands/gmail.svg',
    className: 'hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800',
  },
  {
    label: 'Book Appointment',
    href: '/contact',
    icon: '/brands/google-calendar.svg',
    className: 'hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800',
  },
] as const;

export function FloatingContactBar() {
  const pathname = usePathname();
  const [edgeVisibility, setEdgeVisibility] = useState({ top: false, bottom: true });
  const lastScrollTop = useRef(0);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
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

  const scrollButtonClass = 'group relative flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-400/10 dark:hover:text-blue-200';
  const tooltipClass = 'pointer-events-none absolute right-[calc(100%+0.65rem)] hidden translate-x-1 whitespace-nowrap rounded-md bg-brand-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block';

  return (
    <aside
      aria-label="Quick contact"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-2 z-[70] flex w-fit flex-col items-center gap-1 rounded-lg border border-white/80 bg-white/82 p-1.5 shadow-xl backdrop-blur-2xl sm:right-3 md:bottom-6 md:right-5 dark:border-white/10 dark:bg-night-900/84"
    >
      {edgeVisibility.top ? (
        <>
          <button type="button" onClick={() => scrollToEdge('top')} aria-label="Go to top" title="Go to top" className={scrollButtonClass}>
            <ArrowUpToLine size={14} aria-hidden="true" />
            <span className={tooltipClass}>Go to top</span>
          </button>
          <span aria-hidden="true" className="my-0.5 h-px w-6 bg-slate-200 dark:bg-white/10" />
        </>
      ) : null}

      {actions.map((action) => {
        return (
          <Link
            key={action.label}
            href={action.href}
            aria-label={action.label}
            title={action.label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-support-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 ${action.className}`}
          >
            <Image src={action.icon} alt="" width={25} height={25} aria-hidden="true" className="h-[25px] w-[25px] object-contain" />
            <span className={tooltipClass}>
              {action.label}
            </span>
          </Link>
        );
      })}

      {edgeVisibility.bottom ? (
        <>
          <span aria-hidden="true" className="my-0.5 h-px w-6 bg-slate-200 dark:bg-white/10" />
          <button type="button" onClick={() => scrollToEdge('bottom')} aria-label="Go to bottom" title="Go to bottom" className={scrollButtonClass}>
            <ArrowDownToLine size={14} aria-hidden="true" />
            <span className={tooltipClass}>Go to bottom</span>
          </button>
        </>
      ) : null}
    </aside>
  );
}
