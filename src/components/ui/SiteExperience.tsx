'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import { ScrollProgressBar } from './HyperEffects';
import { translateToBengali } from '@/lib/i18n';

export function SiteExperience() {
  const pathname = usePathname();
  const theme = useAppStore((state) => state.theme);
  const lang = useAppStore((state) => state.lang);
  const isAdmin = pathname.startsWith('/admin');
  const originalText = useRef(new Map<Text, string>());
  const originalAttributes = useRef(new Map<Element, Map<string, string>>());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.language = lang;
    if (isAdmin) return;

    const attributes = ['placeholder', 'title', 'aria-label'] as const;
    let applying = false;

    const translateElement = (element: Element) => {
      if (element.closest('[data-no-translate], script, style, code, pre, textarea')) return;
      for (const attribute of attributes) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const translated = translateToBengali(value);
        if (!translated) continue;
        if (!originalAttributes.current.has(element)) originalAttributes.current.set(element, new Map());
        const saved = originalAttributes.current.get(element)!;
        if (!saved.has(attribute)) saved.set(attribute, value);
        element.setAttribute(attribute, translated);
      }
    };

    const translateTree = (scope: Node) => {
      applying = true;
      if (scope instanceof Element) translateElement(scope);
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let current: Node | null = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.ELEMENT_NODE) translateElement(current as Element);
        if (current.nodeType === Node.TEXT_NODE) {
          const text = current as Text;
          const parent = text.parentElement;
          if (parent && !parent.closest('[data-no-translate], script, style, code, pre, textarea')) {
            const translated = translateToBengali(text.data);
            if (translated) {
              if (!originalText.current.has(text)) originalText.current.set(text, text.data);
              const leading = text.data.match(/^\s*/)?.[0] ?? '';
              const trailing = text.data.match(/\s*$/)?.[0] ?? '';
              text.data = `${leading}${translated}${trailing}`;
            }
          }
        }
        current = walker.nextNode();
      }
      applying = false;
    };

    if (lang === 'en') {
      applying = true;
      originalText.current.forEach((value, node) => { if (node.isConnected) node.data = value; });
      originalAttributes.current.forEach((values, element) => {
        if (!element.isConnected) return;
        values.forEach((value, attribute) => element.setAttribute(attribute, value));
      });
      originalText.current.clear();
      originalAttributes.current.clear();
      applying = false;
      return;
    }

    let observer: MutationObserver | null = null;
    translateTree(document.body);
    observer = new MutationObserver((mutations) => {
      if (applying) return;
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => translateTree(node));
        if (mutation.type === 'characterData') translateTree(mutation.target);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });

    return () => {
      observer?.disconnect();
    };
  }, [isAdmin, lang]);

  if (isAdmin) return null;

  return (
    <>
      <ScrollProgressBar />
    </>
  );
}

export function MotionPreferences({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
