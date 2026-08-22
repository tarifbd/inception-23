'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ArrowRight, Cpu } from 'lucide-react';
import * as Icons from 'lucide-react';
import { RichIcon } from '@/components/ui/RichIcon';
import { TiltCard, SplitText } from '@/components/ui/HyperEffects';

interface ServiceItem {
  id: string;
  categoryId: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  icon: string;
  theme: string;
  order: number;
}

interface Category {
  id: string;
  labelEn: string;
  labelBn: string;
  order: number;
  isActive: boolean;
  services: ServiceItem[];
}

// Dynamically resolve Lucide Icon string from DB
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIconComponent = (name: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComp = (Icons as any)[name];
  return IconComp || Icons.HelpCircle;
};

export const Capabilities = () => {
  const { lang } = useAppStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch dynamic categories in order
  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Capabilities fetch config error:', err);
    }
  }, []);

  useEffect(() => {
    const initialFetch = window.setTimeout(fetchConfig, 0);

    // Listen for category updates
    window.addEventListener('config-updated', fetchConfig);
    return () => {
      window.clearTimeout(initialFetch);
      window.removeEventListener('config-updated', fetchConfig);
    };
  }, [fetchConfig]);

  // Listen to Window Location Hash changes for scroll tab updates
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.length > 0) {
        const index = categories.findIndex((c) => c.id === hash);
        if (index !== -1) {
          setActiveTab(index);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger on initial category load
    if (categories.length > 0) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  const getBgColor = (theme: string) => {
    const bgMap: Record<string, string> = {
      rose: 'bg-rose-50/40 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 border-rose-100 dark:border-rose-900/30',
      blue: 'bg-blue-50/40 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
      emerald: 'bg-emerald-50/40 hover:bg-emerald-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
      purple: 'bg-purple-50/40 hover:bg-purple-50 dark:bg-purple-950/10 dark:hover:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
      amber: 'bg-amber-50/40 hover:bg-amber-50 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      cyan: 'bg-cyan-50/40 hover:bg-cyan-50 dark:bg-cyan-950/10 dark:hover:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30',
    };
    return bgMap[theme] || bgMap.blue;
  };

  if (categories.length === 0) return null;

  const activeCategory = categories[activeTab];

  return (
    <section id="services" className="py-24 md:py-32 bg-white dark:bg-night-950 relative overflow-hidden">
      {/* Background drifting glowing blobs */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Modern Headline Reveal */}
        <div className="mb-14 max-w-3xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="inline-flex px-4 py-1.5 border border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-[0.25em] rounded-full mb-4"
          >
            {lang === 'en' ? 'OUR CAPABILITIES' : 'আমাদের সক্ষমতা'}
          </motion.div>
          
          <h2 className="text-[clamp(2.6rem,5vw,4.75rem)] font-serif font-black mb-5 text-brand-950 dark:text-white leading-[1.03] tracking-tight">
            <SplitText text={lang === 'en' ? 'Practical Services' : 'এন্টারপ্রাইজ সমাধান'} />
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed font-light">
            {lang === 'en' 
              ? 'Practical service areas for operations, finance, legal readiness, software, reporting, and market-facing work.'
              : 'আধুনিক উদ্যোগের জটিল প্রয়োজনের জন্য ডিজাইন করা ব্যাপক সমাধান।'}
          </p>
        </div>

        {/* Dynamic Category Pill Tabs Selector */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-gray-50 dark:bg-night-900/60 rounded-full border border-gray-200 dark:border-white/10 shadow-inner max-w-full overflow-x-auto no-scrollbar">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(i);
                  window.history.pushState(null, '', `#${cat.id}`);
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                }}
                className={`relative whitespace-nowrap px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === i ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-white'
                }`}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="activeTabCapabilities"
                    className="absolute inset-0 rounded-full bg-brand-950 dark:bg-brand-600 shadow-lg shadow-brand-600/10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {lang === 'en' ? cat.labelEn : cat.labelBn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {activeCategory.services.map((service, i) => {
              const IconComp = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: i * 0.08, type: 'spring', stiffness: 100, damping: 15 }}
                  className="h-full"
                >
                  {/* 3D Perspective Tilt Card */}
                  <TiltCard className="h-full">
                    <div className={`group h-full p-8 md:p-10 border rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${getBgColor(service.theme)}`}>
                      
                      {/* Ambient corner highlights */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div>
                        {/* Faux 3D RichIcon Wrapper */}
                        <RichIcon icon={IconComp} theme={service.theme} />
                        
                        <h3 className="text-2xl font-serif font-black mb-3 text-brand-950 dark:text-white group-hover:text-brand-500 transition-colors">
                          {lang === 'en' ? service.titleEn : service.titleBn}
                        </h3>
                        
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-light">
                          {lang === 'en' ? service.descEn : service.descBn}
                        </p>
                      </div>

                      <a 
                        href="#services" 
                        onClick={() => {
                          const el = document.getElementById('services');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-night-800 rounded-full shadow-sm text-brand-950 dark:text-white group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 self-start mt-auto"
                      >
                        <ArrowRight size={18} className="transition-transform group-hover:rotate-[-45deg]" />
                      </a>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}

            {/* Website development showcase card */}
            {/* Displayed at the end of the technology tab. */}
            {activeCategory.id === 'it' && (
              <motion.div
                key="web-showcase-card"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, delay: activeCategory.services.length * 0.08, type: 'spring' }}
                className="h-full lg:col-span-2"
              >
                <TiltCard className="h-full">
                  <div className="relative group h-full p-8 md:p-10 border border-brand-500/20 bg-gradient-to-br from-brand-950 via-night-900 to-night-950 rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row gap-8 justify-between items-center text-white">
                    {/* Glowing neon overlay */}
                    <div className="absolute -inset-10 bg-brand-500/10 rounded-full blur-[80px] opacity-70 pointer-events-none group-hover:bg-brand-500/15 transition-all duration-700" />
                    
                    <div className="space-y-4 max-w-xl relative z-10">
                      <div className="inline-flex px-3 py-1 bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[10px] font-black uppercase tracking-widest rounded-md">
                        WEBSITE SHOWCASE
                      </div>
                      
                      <h3 className="text-3xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-brand-300">
                        {lang === 'en' ? 'A Working Example' : 'বাস্তব প্রমাণ ও প্রযুক্তি'}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        {lang === 'en' 
                          ? "This website is a working example of our custom web development capability: Next.js pages, responsive sections, structured content, Prisma data models, local database storage, and an admin area for updating content."
                          : "এই সম্পূর্ণ ওয়েবসাইটটি আমাদের কাস্টম ওয়েব ডেভেলপমেন্ট দক্ষতার জীবন্ত প্রমাণ।"}
                      </p>

                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {['Next.js 15', 'Three.js / Fiber', 'Prisma ORM', 'SQLite', 'Framer Motion', 'TailwindCSS'].map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all duration-500 group-hover:scale-105 z-10 border-brand-500/25 shadow-[0_0_20px_rgba(20,184,166,0.05)]">
                      <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3 group-hover:rotate-180 transition-transform duration-700">
                        <Cpu size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-400 block mb-1">LIVE SITE</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">WORKING BUILD</span>
                    </div>

                  </div>
                </TiltCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
