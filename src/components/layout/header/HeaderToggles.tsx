'use client';

import { Languages, Moon, Sun } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useAppStore } from '@/lib/store';

type HeaderTogglesProps = {
  className?: string;
  compact?: boolean;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearThemeTransition(root: HTMLElement) {
  root.classList.remove('theme-view-transition', 'theme-transition');
  delete root.dataset.themeTransition;
  delete root.dataset.uiTransition;
}

export function HeaderToggles({ className = '', compact = false }: HeaderTogglesProps) {
  const { lang, theme, toggleLang, setTheme } = useAppStore();
  const languageTimers = useRef<number[]>([]);
  const themeTimer = useRef<number | null>(null);
  const languageTransitioning = useRef(false);
  const themeTransitioning = useRef(false);
  const isDark = theme === 'dark';
  const iconSize = compact ? 'h-9 w-9' : 'h-10 w-10';
  const toggleSize = compact ? 'h-9 w-[72px]' : 'h-10 w-[82px]';
  const thumbSize = compact ? 'h-7 w-[31px]' : 'h-8 w-[36px]';
  const languageShift = compact ? 'translate-x-[33px]' : 'translate-x-[38px]';
  const themeThumbSize = compact ? 'h-7 w-7' : 'h-8 w-8';
  const themeShift = compact ? 'translate-x-[34px]' : 'translate-x-[40px]';

  useEffect(() => () => {
    languageTimers.current.forEach((timer) => window.clearTimeout(timer));
    if (themeTimer.current) window.clearTimeout(themeTimer.current);
  }, []);

  const handleLanguageToggle = () => {
    const root = document.documentElement;
    if (languageTransitioning.current || root.dataset.uiTransition) return;
    const reduceMotion = prefersReducedMotion();
    const transitionDocument = document as ViewTransitionDocument;
    languageTimers.current.forEach((timer) => window.clearTimeout(timer));
    languageTimers.current = [];

    if (reduceMotion) {
      flushSync(toggleLang);
      return;
    }

    languageTransitioning.current = true;
    root.dataset.uiTransition = 'language';

    const applyLanguage = () => flushSync(toggleLang);
    const finish = () => {
      languageTimers.current.forEach((timer) => window.clearTimeout(timer));
      languageTimers.current = [];
      root.classList.remove('language-view-transition', 'language-transition');
      delete root.dataset.languageTransition;
      delete root.dataset.uiTransition;
      languageTransitioning.current = false;
    };

    if (transitionDocument.startViewTransition) {
      root.classList.add('language-view-transition');
      languageTimers.current.push(window.setTimeout(finish, 900));
      transitionDocument.startViewTransition(applyLanguage).finished.finally(finish);
      return;
    }

    root.classList.add('language-transition');
    root.dataset.languageTransition = 'out';
    languageTimers.current.push(window.setTimeout(() => {
      applyLanguage();
      root.dataset.languageTransition = 'in';
    }, 160));
    languageTimers.current.push(window.setTimeout(() => {
      root.classList.remove('language-transition');
      delete root.dataset.languageTransition;
      delete root.dataset.uiTransition;
      languageTransitioning.current = false;
    }, 500));
  };

  const handleThemeToggle = () => {
    const root = document.documentElement;
    if (themeTransitioning.current || root.dataset.uiTransition) return;
    const reduceMotion = prefersReducedMotion();
    const nextTheme = isDark ? 'light' : 'dark';
    const transitionDocument = document as ViewTransitionDocument;
    const applyTheme = () => flushSync(() => setTheme(nextTheme));

    if (reduceMotion) {
      applyTheme();
      return;
    }

    themeTransitioning.current = true;
    root.dataset.uiTransition = 'theme';
    root.dataset.themeTransition = nextTheme;

    if (!transitionDocument.startViewTransition) {
      root.classList.add('theme-transition');
      applyTheme();
      themeTimer.current = window.setTimeout(() => {
        clearThemeTransition(root);
        themeTransitioning.current = false;
      }, 760);
      return;
    }

    root.classList.add('theme-view-transition');
    const finish = () => {
      if (themeTimer.current) window.clearTimeout(themeTimer.current);
      clearThemeTransition(root);
      themeTransitioning.current = false;
    };
    themeTimer.current = window.setTimeout(finish, 980);

    try {
      transitionDocument.startViewTransition(applyTheme).finished.finally(finish);
    } catch {
      applyTheme();
      finish();
    }
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
        onClick={handleLanguageToggle}
        aria-label={`Language: ${lang === 'en' ? 'English' : 'Bengali'}. Switch language`}
        aria-pressed={lang === 'bn'}
        className={`relative grid ${toggleSize} grid-cols-2 overflow-hidden rounded-full border border-cyan-200/80 bg-gradient-to-r from-cyan-50 via-white to-fuchsia-50 p-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 transition hover:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:border-white/15 dark:from-cyan-400/10 dark:via-white/5 dark:to-fuchsia-400/10 dark:text-slate-300`}
      >
        <span
          className={`absolute left-1 top-1 ${thumbSize} rounded-full bg-gradient-to-br shadow-[0_8px_20px_rgba(14,116,144,0.3)] transition-[transform,background-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
        data-theme-switch
        data-state={isDark ? 'dark' : 'light'}
        className={`relative flex ${toggleSize} items-center overflow-hidden rounded-full border border-violet-200/80 bg-gradient-to-r from-amber-50 via-white to-violet-50 p-1 transition-[background-color,border-color,box-shadow,filter] duration-500 ease-entrance hover:border-violet-400/60 hover:shadow-[0_10px_24px_rgba(124,58,237,0.12)] focus:outline-none focus:ring-4 focus:ring-violet-500/20 active:scale-[0.985] dark:border-violet-300/20 dark:from-amber-300/10 dark:via-white/5 dark:to-violet-400/15 dark:hover:border-cyan-300/45 dark:hover:shadow-[0_10px_28px_rgba(34,211,238,0.11)]`}
      >
        <span
          className={`absolute ${themeThumbSize} rounded-full bg-gradient-to-br shadow-[0_10px_22px_rgba(76,29,149,0.28)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isDark ? `${themeShift} from-violet-600 via-indigo-600 to-cyan-500` : 'translate-x-0 from-orange-500 to-amber-300'
          }`}
        />
        <span className="relative z-10 grid w-full grid-cols-2 place-items-center">
          <Sun size={15} className={`transition-[color,opacity,transform] duration-500 ease-entrance ${isDark ? 'scale-90 text-amber-300/75 opacity-75' : 'scale-100 text-white opacity-100'}`} />
          <Moon size={15} className={`transition-[color,opacity,transform] duration-500 ease-entrance ${isDark ? 'scale-100 text-white opacity-100' : 'scale-90 text-violet-700 opacity-80'}`} />
        </span>
      </button>
    </div>
  );
}
