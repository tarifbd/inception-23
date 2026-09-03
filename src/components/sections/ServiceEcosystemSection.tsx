'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveEcosystemServiceDescription, serviceEcosystemCategories } from '@/lib/constants/service-ecosystem';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { ServiceCategoryTabs } from './service-ecosystem/ServiceCategoryTabs';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { ServiceEcosystemPanel } from './service-ecosystem/ServiceEcosystemPanel';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

function normalizeEcosystemCategories(records?: CollectionRecord[]) {
  if (!records?.length) return serviceEcosystemCategories;

  return records.map((record) => {
    const servicesText = Array.isArray(record.servicesText) ? record.servicesText : [];
    const key = String(record.key || 'it') as ServiceKey;

    return {
      ...record,
      key,
      services: servicesText
        .map((item) => {
          const [title, ...description] = String(item).split('::');
          const serviceTitle = title.trim();
          return {
            title: serviceTitle,
            description: resolveEcosystemServiceDescription(serviceTitle, key, description.join('::')),
          };
        })
        .filter((item) => item.title),
    } as unknown as EcosystemCategory;
  });
}

export function ServiceEcosystemSection({
  content,
  categories,
}: {
  content: HomepageSectionContent;
  categories?: CollectionRecord[];
}) {
  const ecosystemCategories = useMemo(
    () => normalizeEcosystemCategories(categories),
    [categories],
  );
  const [activeKey, setActiveKey] = useState<ServiceKey>(
    ecosystemCategories[0]?.key ?? 'it',
  );
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const mobileSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeCategory =
    ecosystemCategories.find((category) => category.key === activeKey) ??
    ecosystemCategories[0];

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewMode = () => setViewMode(desktopQuery.matches ? 'desktop' : 'mobile');

    updateViewMode();
    desktopQuery.addEventListener('change', updateViewMode);
    return () => desktopQuery.removeEventListener('change', updateViewMode);
  }, []);

  useEffect(() => {
    if (!ecosystemCategories.some((category) => category.key === activeKey)) {
      setActiveKey(ecosystemCategories[0]?.key ?? 'it');
    }
  }, [activeKey, ecosystemCategories]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 1023px)');
    let frame = 0;

    const updateActiveCategory = () => {
      frame = 0;
      if (!mobileQuery.matches) return;

      let currentKey = ecosystemCategories[0]?.key;
      const activationLine = Math.min(220, window.innerHeight * 0.34);

      ecosystemCategories.forEach((category) => {
        const element = mobileSectionRefs.current[category.key];
        if (element && element.getBoundingClientRect().top <= activationLine) {
          currentKey = category.key;
        }
      });

      if (currentKey) setActiveKey(currentKey);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveCategory);
    };

    updateActiveCategory();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ecosystemCategories]);

  const handleMobileCategoryChange = (key: ServiceKey) => {
    setActiveKey(key);
    const element = mobileSectionRefs.current[key];
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = element.getBoundingClientRect().top + window.scrollY - 164;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="ecosystem"
      data-native-reveal
      data-motion-variant="editorial"
      className="ambient-mesh border-y border-slate-200 bg-slate-50 py-20 dark:border-white/10 dark:bg-[#111018] md:py-28"
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(20rem,0.42fr)] lg:items-end lg:gap-16">
          <div>
            <p data-motion-eyebrow className="mb-4 border-l-2 border-support-600 pl-3 text-xs font-semibold text-support-700 dark:text-support-300">
              {content.eyebrow}
            </p>
            <h2 data-motion-heading className="max-w-4xl font-serif text-[clamp(2.15rem,5vw,4.75rem)] font-semibold leading-[0.98] text-brand-950 dark:text-white">
              <GradientTitle text={content.title} accentWords={2} tone="brand" />
            </h2>
          </div>
          <p data-motion-description className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg md:leading-8">
            {content.description}
          </p>
        </header>

        {viewMode === 'mobile' ? (
        <div>
          <div className="sticky top-16 z-30 -mx-5 mt-8 border-y border-slate-200 bg-slate-50/92 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#111018]/92 sm:-mx-6 sm:px-6">
            <ServiceCategoryTabs
              categories={ecosystemCategories}
              activeKey={activeCategory.key}
              onChange={handleMobileCategoryChange}
              idPrefix="ecosystem-mobile"
            />
          </div>

          <div className="mt-8 space-y-14 md:space-y-20">
            {ecosystemCategories.map((category, index) => (
              <div
                key={category.key}
                ref={(element) => {
                  mobileSectionRefs.current[category.key] = element;
                }}
                className="scroll-mt-44"
              >
                <ServiceEcosystemPanel
                  category={category}
                  index={index}
                  idPrefix="ecosystem-mobile"
                />
              </div>
            ))}
          </div>
        </div>
        ) : (
        <div>
          <div className="mt-10">
            <ServiceCategoryTabs
              categories={ecosystemCategories}
              activeKey={activeCategory.key}
              onChange={setActiveKey}
              idPrefix="ecosystem-desktop"
            />
          </div>

          <div className="mt-5 min-h-[560px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCategory.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceEcosystemPanel
                  category={activeCategory}
                  index={ecosystemCategories.findIndex(
                    (category) => category.key === activeCategory.key,
                  )}
                  idPrefix="ecosystem-desktop"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
