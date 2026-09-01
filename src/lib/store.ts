'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'inception-storage';

export function readStoredThemePreference(): Theme | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { state?: { theme?: unknown } }) : null;
    const theme = parsed?.state?.theme;
    return theme === 'dark' || theme === 'light' ? theme : null;
  } catch {
    return null;
  }
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

interface AppState {
  lang: Language;
  theme: Theme;
  activeSlide: number;
  toggleLang: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSlide: (index: number) => void;
}

const useStoreBase = create<AppState>()(
  persist(
    (set) => ({
      lang: 'en',
      theme: 'light',
      activeSlide: 0,
      toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'bn' : 'en' })),
      setTheme: (theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        applyThemeToDocument(newTheme);
        return { theme: newTheme };
      }),
      setSlide: (index) => set({ activeSlide: index }),
    }),
    { 
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<AppState> | undefined;
        return {
          ...current,
          theme: saved?.theme === 'dark' ? 'dark' : 'light',
        };
      },
      skipHydration: true,
    }
  )
);

let storeHydration: Promise<void> | null = null;

function ensureStoreHydrated(): Promise<void> {
  storeHydration ??= Promise.resolve(useStoreBase.persist.rehydrate());
  return storeHydration;
}

// Safe hook to prevent hydration mismatch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppStore = ((selector: any) => {
  const store = useStoreBase(selector);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    void ensureStoreHydrated().finally(() => {
      applyThemeToDocument(readStoredThemePreference() ?? useStoreBase.getState().theme);
      if (mounted) setHydrated(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Return default state during server render to match HTML, 
  // then switch to real state after hydration
  if (!hydrated) {
      const defaultState = useStoreBase.getInitialState();
      // If the selector is a function, apply it to default state
      return typeof selector === 'function' ? selector(defaultState) : defaultState;
  }

  return store;
}) as typeof useStoreBase;
