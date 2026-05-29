'use client';

import { motion } from 'framer-motion';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type ServiceCategoryTabsProps = {
  categories: EcosystemCategory[];
  activeKey: ServiceKey;
  onChange: (key: ServiceKey) => void;
};

export function ServiceCategoryTabs({ categories, activeKey, onChange }: ServiceCategoryTabsProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      {categories.map((category) => {
        const theme = serviceThemes[category.key];
        const selected = category.key === activeKey;

        return (
          <button
            key={category.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category.key)}
            className={`relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus:outline-none focus:ring-4 ${theme.ring} ${
              selected
                ? `${theme.borderStrong} bg-white shadow-lg shadow-slate-950/10`
                : 'border-slate-200 bg-white/60 hover:bg-white hover:shadow-md hover:shadow-slate-950/5'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="ecosystem-active-tab"
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className={`relative z-10 text-sm font-black ${selected ? theme.text : 'text-slate-700'}`}>
              {category.label}
            </span>
            <span className={`relative z-10 ml-3 h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`} />
          </button>
        );
      })}
    </div>
  );
}