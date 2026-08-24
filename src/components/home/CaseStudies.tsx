'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import Image from 'next/image';
import { SplitText, TiltCard } from '@/components/ui/HyperEffects';
import { useSiteConfig } from '@/lib/hooks/useSiteConfig';
import { useCaseStudies } from '@/lib/hooks/useCaseStudies';
import type { CaseStudy } from '@/lib/types';

export const CaseStudies = () => {
  const { lang } = useAppStore();
  const { categories } = useSiteConfig();
  const { caseStudies } = useCaseStudies();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  // Filter case studies
  const filteredStudies = activeTab === 'all'
    ? caseStudies
    : caseStudies.filter(study => study.categoryId === activeTab);

  return (
    <section id="cases" className="py-24 md:py-32 bg-gray-50 dark:bg-night-950 relative overflow-hidden border-t border-gray-200 dark:border-night-900 z-30">
      {/* Dynamic Glowing background highlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Modern Heading reveal */}
        <div className="mb-14 max-w-3xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="inline-flex px-4 py-1.5 border border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-[0.25em] rounded-full mb-4"
          >
            {lang === 'en' ? 'CASE STUDIES' : 'কেস স্টাডিজ'}
          </motion.div>
          
          <h2 className="text-[clamp(2.6rem,5vw,4.75rem)] font-serif font-black mb-5 text-brand-950 dark:text-white leading-[1.03] tracking-tight">
            <SplitText text={lang === 'en' ? 'Total Dominance Proven.' : 'সাফল্যের বাস্তব প্রমাণ।'} />
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed font-light">
            {lang === 'en' 
              ? 'Real-world data and client testimonies proving how Inception 23 accelerates operational efficiency, mitigates legal risk, and secures market share.' 
              : 'বাস্তব ডেটা এবং ক্লায়েন্ট প্রশংসাপত্র যা প্রমাণ করে কীভাবে ইনসেপশন ২৩ দক্ষতা বৃদ্ধি করে।'}
          </p>
        </div>

        {/* Category filtering selectors */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-white dark:bg-night-900/60 rounded-full border border-gray-200 dark:border-white/10 shadow-sm max-w-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative whitespace-nowrap px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 flex items-center justify-center cursor-pointer ${
                activeTab === 'all' ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-white'
              }`}
            >
              {activeTab === 'all' && (
                <motion.div
                  layoutId="activeTabCaseStudies"
                  className="absolute inset-0 rounded-full bg-brand-950 dark:bg-brand-600 shadow-md"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {lang === 'en' ? 'All Operations' : 'সব কার্যক্রম'}
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative whitespace-nowrap px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 flex items-center justify-center cursor-pointer ${
                  activeTab === cat.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-white'
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activeTabCaseStudies"
                    className="absolute inset-0 rounded-full bg-brand-950 dark:bg-brand-600 shadow-md"
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

        {/* Dynamic Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study) => (
              <motion.div
                key={study.id ?? study.titleEn}
                layout
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 90 }}
                onClick={() => setSelectedCase(study)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCase(study);
                  }
                }}
                className="cursor-pointer group h-full"
              >
                <TiltCard className="h-full">
                  <div className="relative group bg-white dark:bg-night-900 border border-gray-200/50 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    {/* Visual Showcase Thumbnail */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
                      <Image src={study.img} alt={study.titleEn} fill className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[1.5s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                      
                      {/* Metric highlights floating */}
                      <div className="absolute bottom-6 left-6 bg-brand-500 text-black px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin" />
                        {lang === 'en' ? study.metricsEn : study.metricsBn}
                      </div>
                    </div>

                    <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-brand-600 dark:text-brand-400 uppercase block mb-2">
                          {lang === 'en' ? study.clientEn : study.clientBn}
                        </span>
                        <h3 className="font-serif font-black text-2xl md:text-3xl text-brand-950 dark:text-white leading-tight mb-4 group-hover:text-brand-500 transition-colors">
                          {lang === 'en' ? study.titleEn : study.titleBn}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light line-clamp-3">
                          {lang === 'en' ? study.summaryEn : study.summaryBn}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center gap-3 text-brand-700 dark:text-brand-400 text-xs font-black uppercase tracking-widest self-start group-hover:translate-x-2 transition-transform duration-300">
                        <span>{lang === 'en' ? 'Examine Case Study' : 'কেস স্টাডি বিস্তারিত'}</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* 5. IMMERSIVE CASE STUDY DETAIL SLIDE-IN MODAL */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-night-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className="bg-white dark:bg-night-900 border border-gray-200 dark:border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col"
            >
              
              {/* Close Button overlay */}
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white z-50 flex items-center justify-center border border-white/10 transition-colors shadow-lg cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Scrolling body content */}
              <div className="overflow-y-auto no-scrollbar flex-grow">
                {/* Visual Banner */}
                <div className="relative w-full aspect-[16/8] bg-black">
                  <Image src={selectedCase.img} alt={selectedCase.titleEn} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-night-900 via-transparent to-black/40" />
                  
                  <div className="absolute bottom-6 left-8 right-8 z-10 text-brand-950 dark:text-white">
                    <span className="text-xs font-black tracking-widest uppercase bg-brand-500 text-black px-4 py-1.5 rounded-full inline-block mb-3">
                      {lang === 'en' ? selectedCase.clientEn : selectedCase.clientBn}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
                      {lang === 'en' ? selectedCase.titleEn : selectedCase.titleBn}
                    </h3>
                  </div>
                </div>

                {/* Grid details */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column metrics */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="p-6 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-950 dark:text-white shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-2">PROVED METRIC</span>
                      <div className="text-2xl md:text-3xl font-serif font-black text-brand-700 dark:text-brand-300">
                        {lang === 'en' ? selectedCase.metricsEn : selectedCase.metricsBn}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500 border-t border-gray-200 dark:border-white/5 pt-6">
                      <div>Pillar: <span className="text-brand-500">{selectedCase.categoryId.toUpperCase()}</span></div>
                    </div>
                  </div>

                  {/* Right Column core info */}
                  <div className="md:col-span-2 space-y-8">
                    {/* Summary */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Overview</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-light">
                        {lang === 'en' ? selectedCase.summaryEn : selectedCase.summaryBn}
                      </p>
                    </div>

                    {/* Challenge */}
                    <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                      <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
                        <Cpu size={14} /> The Business Challenge
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-light">
                        {lang === 'en' ? selectedCase.challengeEn : selectedCase.challengeBn}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} /> Our Strategic Solution
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-light">
                        {lang === 'en' ? selectedCase.solutionEn : selectedCase.solutionBn}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
