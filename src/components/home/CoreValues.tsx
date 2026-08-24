'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Crosshair, Gauge, Layers3, Rocket, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Magnetic, SplitText } from '@/components/ui/HyperEffects';

type JourneyStep = {
  num: string;
  title: { en: string; bn: string };
  desc: { en: string; bn: string };
  icon: React.ElementType;
  accent: string;
  bg: string;
  proof: string;
};

const journey: JourneyStep[] = [
  {
    num: '01',
    title: { en: 'Absolute Precision', bn: 'পরম নির্ভুলতা' },
    desc: {
      en: 'Every data point, legal clause, and strategic move is calculated down to the micro-variable.',
      bn: 'প্রতিটি ডেটা, আইনগত ধারা এবং কৌশল মাইক্রো-ভেরিয়েবল স্তরে গণনা করা হয়।',
    },
    icon: Crosshair,
    accent: 'text-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    proof: 'Zero ambiguity',
  },
  {
    num: '02',
    title: { en: 'Relentless Accountability', bn: 'নিরন্তর দায়বদ্ধতা' },
    desc: {
      en: 'Execution without excuses. We take ownership of outcomes through the full operating cycle.',
      bn: 'অজুহাত ছাড়া বাস্তবায়ন। আমরা ফলাফলের পূর্ণ দায়িত্ব নিই।',
    },
    icon: ShieldCheck,
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    proof: 'Owner-led',
  },
  {
    num: '03',
    title: { en: 'Market Dominance', bn: 'বাজার আধিপত্য' },
    desc: {
      en: 'Strategic systems designed to capture, defend, and expand market share with discipline.',
      bn: 'বাজার দখল, রক্ষা এবং সম্প্রসারণের জন্য শৃঙ্খলাবদ্ধ কৌশলগত ব্যবস্থা।',
    },
    icon: Gauge,
    accent: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    proof: 'Category edge',
  },
  {
    num: '04',
    title: { en: 'Architectural Superiority', bn: 'স্থাপত্যগত শ্রেষ্ঠত্ব' },
    desc: {
      en: 'Operational and digital infrastructure that scales from early traction to public-market rigor.',
      bn: 'প্রাথমিক পর্যায় থেকে পাবলিক-মার্কেট মান পর্যন্ত স্কেল করা অবকাঠামো।',
    },
    icon: Layers3,
    accent: 'text-sky-600',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    proof: 'Scale-ready',
  },
  {
    num: '05',
    title: { en: 'Frictionless Scaling', bn: 'ঘর্ষণহীন স্কেলিং' },
    desc: {
      en: 'Bottlenecks are removed, automation is introduced, and growth velocity becomes measurable.',
      bn: 'বাধা দূর হয়, অটোমেশন যুক্ত হয় এবং প্রবৃদ্ধির গতি পরিমাপযোগ্য হয়।',
    },
    icon: Rocket,
    accent: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    proof: 'Fast rollout',
  },
  {
    num: '06',
    title: { en: 'End-Game Execution', bn: 'চূড়ান্ত বাস্তবায়ন' },
    desc: {
      en: 'From M&A closure to launch, we turn strategy into a final operating advantage.',
      bn: 'এমঅ্যান্ডএ ক্লোজার থেকে লঞ্চ পর্যন্ত কৌশলকে বাস্তব সুবিধায় রূপ দিই।',
    },
    icon: Scale,
    accent: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    proof: 'Final mile',
  },
];

const scrollToStep = (index: number) => {
  const el = document.getElementById(`journey-step-${index}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const JourneyCard = ({
  step,
  index,
  active,
  lang,
  onActive,
}: {
  step: JourneyStep;
  index: number;
  active: boolean;
  lang: string;
  onActive: (index: number) => void;
}) => {
  const Icon = step.icon;

  return (
    <motion.article
      id={`journey-step-${index}`}
      onViewportEnter={() => onActive(index)}
      viewport={{ amount: 0.55, margin: '-12% 0px -28% 0px' }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-lg border bg-white p-5 shadow-sm transition duration-500 dark:bg-night-900 md:p-6 ${
        active
          ? 'border-brand-500/40 shadow-xl shadow-brand-950/10 dark:border-brand-400/40'
          : 'border-gray-200 hover:border-brand-500/25 dark:border-white/10'
      }`}
    >
      <div className="absolute -left-[35px] top-7 hidden h-4 w-4 rounded-full border-4 border-white bg-brand-600 shadow-[0_0_0_6px_rgba(107,33,168,0.1)] dark:border-night-950 md:block" />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${step.bg} ${step.accent}`}>
          <Icon size={22} />
        </div>
        <div className="text-right">
          <div className="font-mono text-xs font-black tracking-widest text-gray-400">{step.num}</div>
          <div className="mt-1 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:bg-white/5 dark:text-gray-400">
            {step.proof}
          </div>
        </div>
      </div>

      <h3 className="font-serif text-2xl font-black leading-tight text-brand-950 dark:text-white md:text-3xl">
        {lang === 'en' ? step.title.en : step.title.bn}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">
        {lang === 'en' ? step.desc.en : step.desc.bn}
      </p>

      <div className="mt-8 h-px bg-gradient-to-r from-gray-200 via-brand-500/30 to-transparent dark:from-white/10" />
      <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
        <span>Operating principle</span>
        <ArrowRight className="transition group-hover:translate-x-1 group-hover:text-brand-600" size={15} />
      </div>
    </motion.article>
  );
};

export const CoreValues = () => {
  const { lang } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const active = journey[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section id="values" className="relative overflow-hidden border-t border-gray-200 bg-white py-24 dark:border-white/10 dark:bg-night-950 md:py-36">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(13,1,33,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,1,33,0.035)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-50 to-transparent dark:from-night-950" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-[0.82fr_1fr] md:items-start md:gap-10 lg:grid-cols-[0.78fr_1fr] lg:gap-16">
          <div className="md:sticky md:top-24 md:h-fit lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-700 dark:bg-night-900 dark:text-brand-300"
            >
              <Sparkles size={14} />
              {lang === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
            </motion.div>

            <h2 className="max-w-3xl font-serif text-[clamp(2.6rem,5vw,4.75rem)] font-black leading-[1.03] tracking-tight text-brand-950 dark:text-white">
              <SplitText text={lang === 'en' ? 'A system for decisive growth.' : 'প্রবৃদ্ধির সিস্টেম।'} />
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
              {lang === 'en'
                ? 'Our journey is not a timeline of promises. It is an operating model: precise, accountable, engineered, and measured at every step.'
                : 'আমাদের যাত্রা শুধু প্রতিশ্রুতির টাইমলাইন নয়। এটি একটি অপারেটিং মডেল: নির্ভুল, দায়বদ্ধ এবং পরিমাপযোগ্য।'}
            </p>

            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-white/10 dark:bg-night-900 md:mt-7">
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${active.bg} ${active.accent}`}>
                  <ActiveIcon size={22} />
                </span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Active principle</div>
                  <div className="font-serif text-xl font-black text-brand-950 dark:text-white">
                    {lang === 'en' ? active.title.en : active.title.bn}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-6 gap-2">
                {journey.map((step, index) => (
                  <button
                    key={step.num}
                    onClick={() => scrollToStep(index)}
                    className={`h-2 rounded-full transition ${
                      index <= activeStep ? 'bg-brand-600' : 'bg-gray-200 dark:bg-white/10'
                    }`}
                    aria-label={`Go to journey step ${step.num}`}
                  />
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
                <div>
                  <div className="font-serif text-3xl font-black text-brand-950 dark:text-white">{active.num}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">Current step</div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-black text-brand-950 dark:text-white">06</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">Principles</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-7">
              <Magnetic>
                <button
                  onClick={() => {
                    const el = document.getElementById('inquiry');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-950 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:text-white"
                >
                  {lang === 'en' ? 'Start a Brief' : 'শুরু করুন'}
                  <ArrowRight size={15} />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToStep(0)}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-brand-950 transition hover:border-brand-500 hover:text-brand-700 dark:border-white/10 dark:bg-night-900 dark:text-white"
                >
                  View Steps
                </button>
              </Magnetic>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-6 bottom-6 hidden w-px bg-gradient-to-b from-brand-500 via-sky-500 to-rose-500 md:block" />
            <div className="space-y-5 md:pl-14">
              {journey.map((step, index) => (
                <JourneyCard
                  key={step.num}
                  step={step}
                  index={index}
                  active={activeStep === index}
                  lang={lang}
                  onActive={setActiveStep}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { icon: CheckCircle2, value: 'Evidence', label: 'Decisions tied to measurable operating signals' },
            { icon: Gauge, value: 'Velocity', label: 'Short cycles from analysis to implementation' },
            { icon: ShieldCheck, value: 'Control', label: 'Risk, compliance, and execution tracked together' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-night-900"
              >
                <Icon className="mb-5 text-brand-600 dark:text-brand-300" size={24} />
                <div className="font-serif text-2xl font-black text-brand-950 dark:text-white">{item.value}</div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
