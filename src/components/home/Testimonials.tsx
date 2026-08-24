'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Quote, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Magnetic, SplitText } from '@/components/ui/HyperEffects';

export const Testimonials = () => {
  const { lang } = useAppStore();
  const [idx, setIdx] = useState(0);

  // Client identities are withheld pending case-study approval; roles reflect the kind of
  // engagement, not a named/verifiable client.
  const quotes = [
    {
      quote: {
        en: "Inception 23 didn't just advise us, they re-engineered our entire operational architecture and unlocked significant trapped value.",
        bn: 'তারা শুধু পরামর্শ দেয়নি, আমাদের সম্পূর্ণ কার্যক্রম কাঠামো পুনর্গঠন করে উল্লেখযোগ্য মূল্য উন্মোচন করেছে।',
      },
      author: 'Chief Operating Officer',
      role: 'Financial Services Client',
      metric: 'SCALE',
      theme: 'Operational Architecture',
    },
    {
      quote: {
        en: 'Their legal defense strategy during our global restructuring was nothing short of legendary. Absolute precision.',
        bn: 'বৈশ্বিক পুনর্গঠনের সময় তাদের আইনি প্রতিরক্ষা কৌশল ছিল অসাধারণ নির্ভুল।',
      },
      author: 'Chief Legal Counsel',
      role: 'Energy Sector Client',
      metric: 'DEFENSE',
      theme: 'Regulatory Defense',
    },
    {
      quote: {
        en: 'The AI transformation they deployed took us from an analog legacy player to a digital-first market leader.',
        bn: 'তাদের এআই রূপান্তর আমাদের প্রথাগত অবস্থান থেকে ডিজিটাল-প্রথম বাজার নেতৃত্বে নিয়ে গেছে।',
      },
      author: 'Chief Technology Officer',
      role: 'Banking Sector Client',
      metric: 'AI-FIRST',
      theme: 'AI Transformation',
    },
  ];

  const paginate = (direction: number) => {
    setIdx((prev) => (prev + direction + quotes.length) % quotes.length);
  };

  const active = quotes[idx];

  return (
    <section className="relative overflow-hidden border-t border-gray-200 bg-[#f6f7fb] py-24 text-brand-950 dark:border-white/10 dark:bg-night-950 dark:text-white md:py-36">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(13,1,33,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,1,33,0.035)_1px,transparent_1px)] bg-[size:54px_54px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-700 shadow-sm dark:bg-night-900 dark:text-brand-300"
            >
              <ShieldCheck size={14} />
              {lang === 'en' ? 'Client Endorsements' : 'ক্লায়েন্ট প্রশংসাপত্র'}
            </motion.div>
            <h2 className="max-w-3xl font-serif text-[clamp(2.6rem,5vw,4.75rem)] font-black leading-[1.03] tracking-tight">
              <SplitText text={lang === 'en' ? 'Proof from the field.' : 'মাঠ পর্যায়ের প্রমাণ।'} />
            </h2>
          </div>

          <div className="flex items-center justify-start gap-3 lg:justify-end">
            <Magnetic>
              <button onClick={() => paginate(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-brand-950 transition hover:border-brand-700 hover:bg-brand-950 hover:text-white dark:border-white/10 dark:bg-night-900 dark:text-white">
                <ChevronLeft size={20} />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => paginate(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-brand-950 transition hover:border-brand-700 hover:bg-brand-950 hover:text-white dark:border-white/10 dark:bg-night-900 dark:text-white">
                <ChevronRight size={20} />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.42fr_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300">
              <Sparkles size={26} />
            </div>
            <div className="mt-12 font-serif text-6xl font-black leading-none text-brand-950 dark:text-white">{active.metric}</div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">
              {active.theme}
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-brand-500/50 to-transparent" />
            <p className="mt-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Rotating proof points from client transformation mandates.
            </p>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-900 md:p-10">
            <Quote className="absolute right-8 top-8 text-brand-500/10" size={120} />
            <AnimatePresence>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex min-h-[440px] flex-col justify-between"
              >
                <p className="max-w-4xl font-serif text-[clamp(2rem,3.4vw,3.6rem)] font-black leading-[1.08] tracking-tight text-brand-950 dark:text-white">
                  &quot;{lang === 'en' ? active.quote.en : active.quote.bn}&quot;
                </p>

                <div className="mt-12 flex flex-col gap-6 border-t border-gray-200 pt-6 dark:border-white/10 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.25em] text-brand-950 dark:text-white">{active.author}</h4>
                    <p className="mt-2 text-sm text-brand-700 dark:text-brand-300">{active.role}</p>
                  </div>
                  <button className="inline-flex items-center gap-3 rounded-full bg-brand-950 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-brand-700 dark:bg-brand-500">
                    View Case
                    <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
