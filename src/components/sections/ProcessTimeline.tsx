'use client';

import { motion } from 'framer-motion';
import { ContextIcon } from '@/components/ui/ContextIcon';
import { processSteps } from '@/lib/constants/process';
import type { CollectionRecord } from '@/lib/website-collections';

const processAccentStyles = [
  {
    card: 'border-cyan-200/80 bg-gradient-to-br from-cyan-50/75 via-white to-white hover:shadow-cyan-950/10',
    icon: 'from-cyan-500 via-blue-500 to-slate-950 shadow-cyan-500/25',
    dot: 'bg-cyan-500',
    glow: 'bg-cyan-300/30',
    text: 'text-cyan-700',
  },
  {
    card: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/75 via-white to-white hover:shadow-emerald-950/10',
    icon: 'from-emerald-500 via-teal-500 to-slate-950 shadow-emerald-500/25',
    dot: 'bg-emerald-500',
    glow: 'bg-emerald-300/30',
    text: 'text-emerald-700',
  },
  {
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50/75 via-white to-white hover:shadow-violet-950/10',
    icon: 'from-violet-600 via-purple-600 to-slate-950 shadow-violet-600/25',
    dot: 'bg-violet-600',
    glow: 'bg-violet-300/30',
    text: 'text-violet-700',
  },
  {
    card: 'border-orange-200/80 bg-gradient-to-br from-orange-50/75 via-white to-white hover:shadow-orange-950/10',
    icon: 'from-orange-500 via-rose-500 to-fuchsia-600 shadow-orange-500/25',
    dot: 'bg-orange-500',
    glow: 'bg-orange-300/30',
    text: 'text-orange-700',
  },
];

export function ProcessTimeline({ steps }: { steps?: CollectionRecord[] }) {
  const displaySteps = (steps?.length ? steps : processSteps) as typeof processSteps;

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute bottom-8 left-5 top-8 w-px bg-[linear-gradient(180deg,#22d3ee_0%,#34d399_34%,#8b5cf6_68%,#fb923c_100%)] opacity-40 md:left-1/2" />
      <div className="space-y-5">
        {displaySteps.map((step, index) => {
          const isEven = index % 2 === 0;
          const accent = processAccentStyles[index % processAccentStyles.length];

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: isEven ? -22 : 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.42, delay: index * 0.035 }}
              className={`relative grid gap-4 md:grid-cols-[1fr_76px_1fr] ${isEven ? '' : 'md:[&>article]:col-start-3'}`}
            >
              <article className={`group relative ml-12 overflow-hidden rounded-[1.45rem] border p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl md:ml-0 ${accent.card}`}>
                <div className={`absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125 ${accent.glow}`} />
                <p className={`relative text-[10px] font-black uppercase tracking-[0.22em] ${accent.text}`}>{step.number}</p>
                <h3 className="mt-2 text-xl font-black text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
              <div className="absolute left-0 top-5 inline-flex rounded-[1.15rem] border border-white/70 bg-white/65 p-1.5 shadow-inner shadow-white/80 backdrop-blur md:static md:col-start-2 md:place-self-start">
                <div className={`flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br text-white shadow-xl md:h-12 md:w-12 ${accent.icon}`}>
                  <ContextIcon context={`${step.title} ${step.description} ${step.icon}`} size={20} strokeWidth={1.8} />
                </div>
                <span className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ring-4 ring-white ${accent.dot}`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
