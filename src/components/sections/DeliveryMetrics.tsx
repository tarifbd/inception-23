'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Layers3, Route, UsersRound } from 'lucide-react';
import { CountingNumber } from '@/components/ui/HyperEffects';

const metrics = [
  {
    value: '4',
    label: 'Core service areas',
    detail: 'Technology, management, legal, and creative',
    icon: Layers3,
    accent: 'text-cyan-700',
    ring: 'border-cyan-200 bg-cyan-50',
  },
  {
    value: '6',
    label: 'Delivery stages',
    detail: 'From the first brief through ongoing support',
    icon: Route,
    accent: 'text-teal-800',
    ring: 'border-teal-200 bg-teal-50',
  },
  {
    value: '1',
    label: 'Connected team',
    detail: 'Specialists working toward the same business outcome',
    icon: UsersRound,
    accent: 'text-purple-800',
    ring: 'border-purple-200 bg-purple-50',
  },
] as const;

export function DeliveryMetrics() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-8 grid overflow-hidden rounded-lg border border-slate-200 bg-slate-50/80 shadow-sm md:grid-cols-3 dark:border-white/10 dark:bg-night-900/70">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <motion.div
            key={metric.label}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.38, delay: index * 0.06 }}
            className="metric-node group flex min-h-36 items-center gap-4 border-b border-slate-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 dark:border-white/10"
          >
            <span className={`metric-node__ring relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${metric.ring} ${metric.accent}`}>
              <Icon size={20} />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-4xl font-bold leading-none text-brand-950 dark:text-white">
                <CountingNumber value={metric.value} />
              </span>
              <span className="mt-2 block text-sm font-semibold text-brand-950 dark:text-white">
                {metric.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                {metric.detail}
              </span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
