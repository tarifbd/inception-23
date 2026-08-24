'use client';

import { motion } from 'framer-motion';
import { BarChart, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CountingNumber } from '@/components/ui/HyperEffects';

export const ProofModern = () => {
  const { lang } = useAppStore();
  const stats = [
    { val: '$50B+', label: { en: 'Assets Advised', bn: 'পরিচালিত সম্পদ' }, icon: TrendingUp },
    { val: '30%', label: { en: 'Avg. Efficiency Gain', bn: 'গড় দক্ষতা বৃদ্ধি' }, icon: BarChart },
    { val: '100%', label: { en: 'Regulatory Compliance', bn: 'নিয়ন্ত্রক সম্মতি' }, icon: ShieldCheck },
  ];

  return (
    <section id="proof" className="relative overflow-hidden bg-brand-950 py-16 text-white dark:bg-night-950 md:py-24">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:54px_54px]" />
      <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-200">Performance Proof</div>
            <h2 className="mt-3 font-serif text-4xl font-black leading-none md:text-6xl">Measured outcomes.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Advisory, operational change, and regulatory control translated into visible client outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
                key={stat.val}
                className="group rounded-lg border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.1] md:p-8"
              >
                <div className="mb-10 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-brand-200">
                    <Icon size={21} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">0{index + 1}</span>
                </div>
                <div className="font-serif text-5xl font-black leading-none text-white md:text-7xl">
                  <CountingNumber value={stat.val} />
                </div>
                <div className="mt-5 text-xs font-black uppercase tracking-widest text-brand-200">
                  {lang === 'en' ? stat.label.en : stat.label.bn}
                </div>
                <div className="mt-8 h-px bg-gradient-to-r from-brand-400/60 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
