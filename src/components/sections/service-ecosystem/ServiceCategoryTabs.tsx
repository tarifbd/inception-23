'use client';

import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type ServiceCategoryTabsProps = {
  categories: EcosystemCategory[];
  activeKey: ServiceKey;
  onChange: (key: ServiceKey) => void;
  idPrefix?: string;
};

const activeBackgrounds: Record<ServiceKey, string> = {
  it: 'linear-gradient(90deg, #06b6d4 0%, #2563eb 52%, #020617 100%)',
  consultancy: 'linear-gradient(90deg, #020617 0%, #115e59 52%, #14b8a6 100%)',
  legal: 'linear-gradient(90deg, #4c0519 0%, #9f1239 52%, #f59e0b 100%)',
  creative: 'linear-gradient(90deg, #6b21a8 0%, #c026d3 52%, #fb7185 100%)',
};

export function ServiceCategoryTabs({ categories, activeKey, onChange, idPrefix = 'ecosystem' }: ServiceCategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Service categories"
      className="grid w-full gap-1 rounded-lg border border-slate-200 bg-white/75 p-1.5 shadow-sm backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-night-900/80"
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
            onClick={() => onChange(category.key)}
            onFocus={() => {
              if (!selected) onChange(category.key);
            }}
            style={{ backgroundImage: selected ? activeBackgrounds[category.key] : undefined }}
            className={`relative isolate flex min-h-12 w-full items-center justify-between overflow-hidden rounded-md px-4 py-3 text-left transition-[color,background-color,box-shadow] duration-300 focus:outline-none focus:ring-4 ${theme.ring} ${
              selected
                ? 'text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-brand-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10 text-sm font-semibold">
              {label}
            </span>
            <span
              aria-hidden="true"
              className={`relative z-10 ml-3 h-2 w-2 shrink-0 rounded-full bg-white transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0'}`}
            />
          </button>
        );
      })}
    </div>
  );
}
