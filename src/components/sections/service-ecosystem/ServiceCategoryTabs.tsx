'use client';

import { useEffect, useRef } from 'react';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';
import { ContextIcon } from '@/components/ui/ContextIcon';

type ServiceCategoryTabsProps = {
  categories: EcosystemCategory[];
  activeKey: ServiceKey;
  onChange: (key: ServiceKey) => void;
  idPrefix?: string;
  compact?: boolean;
};

const activeBackgrounds: Record<ServiceKey, string> = {
  it: 'linear-gradient(90deg, #06b6d4 0%, #2563eb 52%, #020617 100%)',
  consultancy: 'linear-gradient(90deg, #020617 0%, #115e59 52%, #14b8a6 100%)',
  legal: 'linear-gradient(90deg, #4c0519 0%, #9f1239 52%, #f59e0b 100%)',
  creative: 'linear-gradient(90deg, #6b21a8 0%, #c026d3 52%, #fb7185 100%)',
};

export function ServiceCategoryTabs({ categories, activeKey, onChange, idPrefix = 'ecosystem', compact = false }: ServiceCategoryTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!compact) return;
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !selected) return;
    const container = list.getBoundingClientRect();
    const tab = selected.getBoundingClientRect();
    if (tab.left < container.left || tab.right > container.right) {
      list.scrollTo({ left: list.scrollLeft + tab.left - container.left - (container.width - tab.width) / 2, behavior: 'auto' });
    }
  }, [activeKey, compact]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Service categories"
      className={`w-full gap-1 rounded-lg border border-slate-200 bg-white/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-night-900/80 ${compact ? 'flex overflow-x-auto overscroll-x-contain p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'grid p-1.5 sm:grid-cols-2 lg:grid-cols-4'}`}
    >
      {categories.map((category) => {
        const theme = serviceThemes[category.key];
        const selected = category.key === activeKey;
        const label = category.label || theme.shortLabel;

        return (
          <button
            key={category.key}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${category.key}`}
            aria-controls={`${idPrefix}-panel-${category.key}`}
            aria-selected={selected}
            aria-label={label}
            onClick={() => onChange(category.key)}
            onFocus={() => {
              if (!compact && !selected) onChange(category.key);
            }}
            style={{ backgroundImage: selected ? activeBackgrounds[category.key] : undefined }}
            className={`relative isolate flex items-center justify-between overflow-hidden rounded-md text-left transition-[color,background-color,box-shadow] duration-300 focus:outline-none focus:ring-2 focus:ring-inset ${compact ? 'h-10 shrink-0 px-2.5 py-1' : 'min-h-12 w-full px-4 py-3'} ${theme.ring} ${
              selected
                ? 'text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-brand-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <span className={`relative z-10 flex min-w-0 items-center font-semibold ${compact ? 'gap-1.5 whitespace-nowrap text-xs' : 'gap-2.5 text-sm'}`}>
              <ContextIcon context={`${category.title} ${category.eyebrow}`} size={compact ? 15 : 17} />
              <span>{compact && category.key === 'consultancy' ? 'Business Advisory' : label}</span>
            </span>
            <span
              aria-hidden="true"
              className={`relative z-10 ml-3 h-2 w-2 shrink-0 rounded-full bg-white transition-opacity duration-200 ${compact ? 'hidden' : ''} ${selected ? 'opacity-100' : 'opacity-0'}`}
            />
          </button>
        );
      })}
    </div>
  );
}
