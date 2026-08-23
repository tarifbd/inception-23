'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

type Language = 'en' | 'bn';
type Theme = 'light' | 'dark';

interface AppState {
  lang: Language;
  theme: Theme;
  activeSlide: number;
  toggleLang: () => void;
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
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        return { theme: newTheme };
      }),
      setSlide: (index) => set({ activeSlide: index }),
    }),
    { 
      name: 'inception-storage',
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

// Safe hook to prevent hydration mismatch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppStore = ((selector: any) => {
  const store = useStoreBase(selector);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Force re-hydration on mount to ensure client matches local storage
    useStoreBase.persist.rehydrate();
    setHydrated(true);
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
