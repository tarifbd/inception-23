'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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

  if (pathname.startsWith('/admin')) return null;

  const scrollToEdge = (position: 'top' | 'bottom') => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: position === 'top' ? 0 : document.documentElement.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const scrollButtonClass = 'group relative flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:scale-105 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-400/10 dark:hover:text-blue-200';
  const tooltipClass = 'pointer-events-none absolute right-[calc(100%+0.65rem)] hidden translate-x-1 whitespace-nowrap rounded-md bg-brand-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block';

  return (
    <aside
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-3 z-[70] mx-auto flex w-fit items-center gap-1 rounded-lg border border-white/80 bg-white/82 p-1.5 shadow-xl backdrop-blur-2xl md:inset-x-auto md:bottom-6 md:right-5 md:flex-col dark:border-white/10 dark:bg-night-900/84"
    >
      <button type="button" onClick={() => scrollToEdge('top')} aria-label="Go to top" title="Go to top" className={scrollButtonClass}>
        <ArrowUpToLine size={23} aria-hidden="true" />
        <span className={tooltipClass}>Go to top</span>
      </button>

      <span aria-hidden="true" className="mx-1 h-7 w-px bg-slate-200 md:mx-0 md:h-px md:w-7 dark:bg-white/10" />

      {actions.map((action) => {
        return (
          <Link
            key={action.label}
            href={action.href}
            aria-label={action.label}
            title={action.label}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-support-500/20 dark:border-white/10 dark:bg-night-800 dark:text-slate-200 ${action.className}`}
          >
            <Image src={action.icon} alt="" width={27} height={27} aria-hidden="true" className="h-[27px] w-[27px] object-contain" />
            <span className={tooltipClass}>
              {action.label}
            </span>
          </Link>
        );
      })}

      <span aria-hidden="true" className="mx-1 h-7 w-px bg-slate-200 md:mx-0 md:h-px md:w-7 dark:bg-white/10" />

      <button type="button" onClick={() => scrollToEdge('bottom')} aria-label="Go to bottom" title="Go to bottom" className={scrollButtonClass}>
        <ArrowDownToLine size={23} aria-hidden="true" />
        <span className={tooltipClass}>Go to bottom</span>
      </button>
    </aside>
  );
}
