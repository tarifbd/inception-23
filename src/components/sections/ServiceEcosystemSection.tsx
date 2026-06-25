'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { serviceEcosystemCategories } from '@/lib/constants/service-ecosystem';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import type { ServiceKey } from '@/lib/constants/theme';
import { ServiceCategoryTabs } from './service-ecosystem/ServiceCategoryTabs';
import { ServiceEcosystemPanel } from './service-ecosystem/ServiceEcosystemPanel';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

function normalizeEcosystemCategories(records?: CollectionRecord[]) {
  if (!records?.length) return serviceEcosystemCategories;
  return records.map((record) => {
    const servicesText = Array.isArray(record.servicesText) ? record.servicesText : [];
    return {
      ...record,
      services: servicesText.map((item) => {
        const [title, ...description] = String(item).split('::');
        return {
          title: title.trim(),
          description: description.join('::').trim(),
        };
      }).filter((item) => item.title),
    } as unknown as EcosystemCategory;
  });
}

export function ServiceEcosystemSection({ content, categories }: { content: HomepageSectionContent; categories?: CollectionRecord[] }) {
  const ecosystemCategories = useMemo(() => normalizeEcosystemCategories(categories), [categories]);
  const [activeKey, setActiveKey] = useState<ServiceKey>(
    ecosystemCategories[0].key
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      let currentKey = ecosystemCategories[0].key;
      ecosystemCategories.forEach((cat) => {
        const el = sectionRefs.current[cat.key];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          currentKey = cat.key;
        }
      });
      setActiveKey(currentKey);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ecosystemCategories]);

  const handleTabChange = (key: ServiceKey) => {
    const el = sectionRefs.current[key];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="ecosystem"
      className="relative overflow-visible bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="relative mx-auto w-full max-w-[92rem] px-5 sm:px-6 lg:px-8">

        {/* Heading block — always visible, not sticky */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 lg:hidden"
        >
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">
            {content.eyebrow}
          </p>
          <h2 className="font-serif text-[clamp(2rem,8vw,3.5rem)] font-black leading-[1.02] tracking-normal text-brand-950">
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {content.description}
          </p>
        </motion.div>

        {/* Mobile sticky tabs bar */}
        <div className="sticky top-16 z-30 -mx-5 mb-6 bg-white/90 px-5 py-3 backdrop-blur-md lg:hidden">
          <ServiceCategoryTabs
            categories={ecosystemCategories}
            activeKey={activeKey}
            onChange={handleTabChange}
          />
        </div>

        {/* Desktop: two column layout */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(15.5rem,0.34fr)_minmax(0,1fr)] lg:items-start lg:gap-[clamp(2rem,3vw,4rem)] xl:grid-cols-[minmax(18rem,0.32fr)_minmax(0,1fr)]">

          {/* LEFT SIDEBAR — desktop only sticky */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="flex w-full max-w-[21.5rem] flex-col">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">
                {content.eyebrow}
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,3.05vw,4rem)] font-black leading-[1.02] tracking-normal text-brand-950">
                {content.title}
              </h2>
              <p className="mt-5 max-w-[19rem] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-8 text-slate-600">
                {content.description}
              </p>
              <ServiceCategoryTabs
                categories={ecosystemCategories}
                activeKey={activeKey}
                onChange={handleTabChange}
              />
            </div>
          </aside>

          {/* RIGHT PANEL — all sections stacked */}
          <div className="flex min-w-0 flex-col gap-24">
            {ecosystemCategories.map((category) => (
              <div
                key={category.key}
                id={`section-${category.key}`}
                ref={(el) => { sectionRefs.current[category.key] = el; }}
                className="scroll-mt-32"
              >
                <ServiceEcosystemPanel category={category} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
