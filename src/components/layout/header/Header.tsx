'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { DesktopNav } from './DesktopNav';
import { HeaderCTA } from './HeaderCTA';
import { HeaderToggles } from './HeaderToggles';
import { MegaMenu, type MenuKind } from './MegaMenu';
import { MobileNav } from './MobileNav';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKind | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={() => setActiveMenu(null)}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="mx-auto w-full max-w-[1780px] px-3 sm:px-4 2xl:px-6">
          <div
            className={`relative flex min-h-[68px] items-center justify-between gap-2 rounded-[1.5rem] border px-2.5 py-2 transition-all duration-300 sm:min-h-[72px] sm:gap-3 sm:rounded-[1.75rem] sm:px-4 sm:py-2.5 2xl:rounded-full 2xl:px-5 ${
              scrolled
                ? 'border-slate-200/90 bg-white/86 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-2xl'
                : 'border-white/70 bg-white/66 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl'
            }`}
          >
            <Link href="/" className="group ml-1 flex shrink-0 items-center gap-3 focus:outline-none focus:ring-4 focus:ring-brand-700/15 sm:ml-2 2xl:ml-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200/80 transition group-hover:shadow-md sm:h-11 sm:w-11 sm:rounded-2xl 2xl:h-12 2xl:w-12">
                <Image
                  src="/inception23-mark.png"
                  alt="Inception 23 mark"
                  width={96}
                  height={96}
                  priority
                  className="h-full w-full object-contain"
                  sizes="48px"
                />
              </span>
              <span className="hidden min-w-0 leading-none lg:block">
                <span className="block whitespace-nowrap text-[0.82rem] font-black uppercase tracking-[0.18em] text-brand-950 min-[1900px]:text-[1.05rem] min-[1900px]:tracking-[0.24em]">
                  Inception 23
                </span>
                <span className="mt-1 block whitespace-nowrap text-[0.38rem] font-black uppercase tracking-[0.12em] text-slate-500 min-[1500px]:text-[0.42rem] min-[1500px]:tracking-[0.16em] min-[1900px]:text-[0.46rem] min-[1900px]:tracking-[0.22em]">
                  Where <span className="text-orange-600">new beginnings</span> create the future
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="mx-1 hidden min-w-0 flex-1 flex-col items-center justify-center overflow-hidden text-center leading-none focus:outline-none focus:ring-4 focus:ring-brand-700/15 min-[360px]:flex sm:mx-2 lg:hidden"
              aria-label="Inception 23 home"
            >
              <span className="block max-w-full truncate text-[0.7rem] font-black uppercase tracking-[0.16em] text-brand-950 min-[380px]:text-[0.78rem] min-[380px]:tracking-[0.2em] sm:text-[0.9rem]">
                Inception 23
              </span>
              <span className="mt-1 hidden max-w-full truncate text-[0.4rem] font-black uppercase tracking-[0.08em] text-slate-500 min-[380px]:block sm:text-[0.48rem] sm:tracking-[0.14em]">
                Where <span className="text-orange-600">new beginnings</span> create the future
              </span>
            </Link>

            <DesktopNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

            <div className="flex shrink-0 items-center gap-2">
              <HeaderToggles className="hidden xl:flex" />
              <HeaderCTA className="hidden xl:inline-flex" />
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-950 shadow-sm transition hover:border-brand-700/30 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-700/15 sm:h-11 sm:w-11 xl:hidden"
              >
                <Menu size={20} />
              </button>
            </div>

            <AnimatePresence>
              {activeMenu ? <MegaMenu activeMenu={activeMenu} onNavigate={() => setActiveMenu(null)} /> : null}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
