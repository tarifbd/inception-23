'use client';

import { Languages, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/lib/store';

type HeaderTogglesProps = {
  className?: string;
  compact?: boolean;
};

export function HeaderToggles({ className = '', compact = false }: HeaderTogglesProps) {
  const { lang, theme, toggleLang, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';
  const iconSize = compact ? 'h-9 w-9' : 'h-10 w-10';
  const toggleSize = compact ? 'h-9 w-[72px]' : 'h-10 w-[82px]';
  const thumbSize = compact ? 'h-7 w-[31px]' : 'h-8 w-[36px]';
  const languageShift = compact ? 'translate-x-[33px]' : 'translate-x-[38px]';
  const themeThumbSize = compact ? 'h-7 w-7' : 'h-8 w-8';
  const themeShift = compact ? 'translate-x-[34px]' : 'translate-x-[40px]';
  const handleThemeToggle = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    if (reduceMotion || !transitionDocument.startViewTransition) {
      toggleTheme();
      return;
    }

    transitionDocument.startViewTransition(toggleTheme);
  };

  return (
    <div
      data-header-toggles
      className={`flex shrink-0 items-center gap-1 rounded-full border border-white/80 bg-white/92 p-1 shadow-[0_14px_36px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl dark:border-white/15 dark:bg-[#0b1020]/92 dark:ring-white/10 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`grid ${iconSize} place-items-center rounded-full border border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-white to-violet-50 text-cyan-700 shadow-sm dark:border-cyan-300/20 dark:from-cyan-400/15 dark:via-white/5 dark:to-violet-400/15 dark:text-cyan-200`}
      >
        <Languages size={15} />
      </span>

      <button
        type="button"
        onClick={toggleLang}
        aria-label={`Language: ${lang === 'en' ? 'English' : 'Bengali'}. Switch language`}
        aria-pressed={lang === 'bn'}
        className={`relative grid ${toggleSize} grid-cols-2 overflow-hidden rounded-full border border-cyan-200/80 bg-gradient-to-r from-cyan-50 via-white to-fuchsia-50 p-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 transition hover:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:border-white/15 dark:from-cyan-400/10 dark:via-white/5 dark:to-fuchsia-400/10 dark:text-slate-300`}
      >
        <span
          className={`absolute left-1 top-1 ${thumbSize} rounded-full bg-gradient-to-br shadow-[0_8px_20px_rgba(14,116,144,0.3)] transition-[transform,background-color] duration-300 ${
            lang === 'bn' ? languageShift : 'translate-x-0'
          } ${lang === 'bn' ? 'from-violet-600 to-fuchsia-500' : 'from-cyan-500 to-blue-600'}`}
        />
        <span className={`relative z-10 grid place-items-center rounded-full transition ${lang === 'en' ? 'text-white' : 'text-cyan-800 dark:text-cyan-200'}`}>EN</span>
        <span className={`relative z-10 grid place-items-center rounded-full transition ${lang === 'bn' ? 'text-white' : 'text-fuchsia-700 dark:text-fuchsia-200'}`}>BN</span>
      </button>

      <button
        type="button"
        onClick={handleThemeToggle}
        aria-label={`Theme: ${isDark ? 'dark' : 'light'}. Switch to ${isDark ? 'light' : 'dark'} theme`}
        aria-pressed={isDark}
        className={`relative flex ${toggleSize} items-center rounded-full border border-violet-200/80 bg-gradient-to-r from-amber-50 via-white to-violet-50 p-1 transition hover:border-violet-400/60 focus:outline-none focus:ring-4 focus:ring-violet-500/20 dark:border-violet-300/20 dark:from-amber-300/10 dark:via-white/5 dark:to-violet-400/15`}
      >
        <span
          className={`absolute ${themeThumbSize} rounded-full bg-gradient-to-br shadow-[0_10px_22px_rgba(76,29,149,0.28)] transition-transform duration-300 ${
            isDark ? `${themeShift} from-violet-600 via-indigo-600 to-cyan-500` : 'translate-x-0 from-orange-500 to-amber-300'
          }`}
        />
        <span className="relative z-10 grid w-full grid-cols-2 place-items-center">
          <Sun size={15} className={isDark ? 'text-amber-300' : 'text-white'} />
          <Moon size={15} className={isDark ? 'text-white' : 'text-violet-700'} />
        </span>
      </button>
    </div>
  );
}
