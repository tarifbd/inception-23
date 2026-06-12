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

  return (
    <div className={`flex shrink-0 items-center gap-1 rounded-full border border-white/80 bg-white/92 p-1 shadow-[0_14px_36px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl ${className}`}>
      <span
        aria-hidden="true"
        className={`grid ${iconSize} place-items-center rounded-full border border-slate-200/80 bg-white text-slate-400 shadow-sm`}
      >
        <Languages size={15} />
      </span>

      <button
        type="button"
        onClick={toggleLang}
        aria-label="Toggle language"
        className={`relative grid ${toggleSize} grid-cols-2 overflow-hidden rounded-full border border-slate-200/80 bg-slate-50/90 p-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500 transition hover:border-brand-700/20 hover:bg-white focus:outline-none focus:ring-4 focus:ring-brand-700/15`}
      >
        <span
          className={`absolute left-1 top-1 ${thumbSize} rounded-full bg-brand-950 shadow-[0_8px_18px_rgba(15,0,34,0.24)] transition-transform duration-300 ${
            lang === 'bn' ? languageShift : 'translate-x-0'
          }`}
        />
        <span className={`relative z-10 grid place-items-center rounded-full transition ${lang === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</span>
        <span className={`relative z-10 grid place-items-center rounded-full transition ${lang === 'bn' ? 'text-white' : 'text-slate-500'}`}>BN</span>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`relative flex ${toggleSize} items-center rounded-full border border-violet-200/80 bg-violet-50/80 p-1 transition hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-700/15`}
      >
        <span
          className={`absolute ${themeThumbSize} rounded-full bg-gradient-to-br shadow-[0_10px_20px_rgba(76,29,149,0.2)] transition-transform duration-300 ${
            isDark ? `${themeShift} from-brand-950 to-violet-700` : 'translate-x-0 from-orange-400 to-amber-300'
          }`}
        />
        <span className="relative z-10 grid w-full grid-cols-2 place-items-center">
          <Sun size={15} className={isDark ? 'text-slate-400' : 'text-white'} />
          <Moon size={15} className={isDark ? 'text-white' : 'text-slate-500'} />
        </span>
      </button>
    </div>
  );
}
