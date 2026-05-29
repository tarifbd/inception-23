'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Magnetic, SplitText } from '@/components/ui/HyperEffects';

const articles = [
  {
    category: 'Strategy',
    title: 'The Quantum Pivot: Rethinking Corporate Velocity in a Stagnant Market.',
    date: 'OCT 2026',
    read: '7 min',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    category: 'Defense',
    title: 'Navigating the New EU Regulatory Frameworks.',
    date: 'NOV 2026',
    read: '5 min',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=900&auto=format&fit=crop',
  },
  {
    category: 'Technology',
    title: 'Zero-Trust Infrastructures for Financial Institutions.',
    date: 'DEC 2026',
    read: '9 min',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop',
  },
];

export const Insights = () => {
  const { lang } = useAppStore();
  const featured = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <section id="insights" className="relative overflow-hidden border-t border-gray-200 bg-[#f6f7fb] py-24 dark:border-white/10 dark:bg-night-950 md:py-36">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(13,1,33,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,1,33,0.035)_1px,transparent_1px)] bg-[size:54px_54px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-700 shadow-sm dark:bg-night-900 dark:text-brand-300"
            >
              <BookOpen size={14} />
              {lang === 'en' ? 'Publications' : 'Publications'}
            </motion.div>
            <h2 className="max-w-4xl font-serif text-[clamp(2.6rem,5vw,4.75rem)] font-black leading-[1.03] tracking-tight text-brand-950 dark:text-white">
              <SplitText text={lang === 'en' ? 'Intelligence for operators.' : 'Intelligence for operators.'} />
            </h2>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-night-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300">
                <Sparkles size={18} />
              </span>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Field notes on strategy, regulatory pressure, AI deployment, and operating-model transformation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative min-h-[620px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-900"
          >
            <Image src={featured.img} alt={featured.title} fill className="object-cover transition duration-1000 group-hover:scale-105" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-brand-950/5" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Featured / {featured.category}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                <Clock size={13} />
                {featured.read}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-brand-200">{featured.date}</p>
              <h3 className="max-w-3xl font-serif text-[clamp(2.4rem,4vw,4rem)] font-black leading-[1.04] text-white">
                {featured.title}
              </h3>
              <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-6">
                <Magnetic>
                  <button className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-brand-950 transition hover:bg-brand-100">
                    Read Brief
                    <ArrowRight size={15} />
                  </button>
                </Magnetic>
                <ArrowRight className="text-white/60 transition group-hover:translate-x-2 group-hover:text-white" size={24} />
              </div>
            </div>
          </motion.article>

          <div className="grid gap-6">
            {sideArticles.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group grid overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-xl dark:border-white/10 dark:bg-night-900 sm:grid-cols-[220px_1fr]"
              >
                <div className="relative min-h-[260px] sm:min-h-full">
                  <Image src={article.img} alt={article.title} fill className="object-cover transition duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-brand-950/20" />
                </div>
                <div className="flex min-h-[260px] flex-col justify-between p-6">
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-700 dark:bg-white/10 dark:text-brand-300">
                        {article.category}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{article.read}</span>
                    </div>
                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{article.date}</p>
                    <h3 className="font-serif text-2xl font-black leading-tight text-brand-950 transition group-hover:text-brand-700 dark:text-white">
                      {article.title}
                    </h3>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">
                    Read Article
                    <ArrowRight className="transition group-hover:translate-x-1" size={14} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
