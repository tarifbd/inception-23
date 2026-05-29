'use client';

import { motion } from 'framer-motion';
import type { EcosystemCategory } from '@/lib/constants/service-ecosystem';
import { serviceThemes } from '@/lib/constants/theme';
import { SubServiceCard } from './SubServiceCard';

type ServiceEcosystemPanelProps = {
  category: EcosystemCategory;
};

export function ServiceEcosystemPanel({ category }: ServiceEcosystemPanelProps) {
  const theme = serviceThemes[category.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-[2rem] border bg-white/76 p-4 shadow-2xl shadow-slate-950/7 backdrop-blur-xl md:p-6 ${theme.border}`}
    >
      <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${theme.surface}`} />
      <div className={`relative mb-5 rounded-[1.5rem] bg-gradient-to-br ${theme.gradientSoft} p-5`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${theme.text}`}>{category.eyebrow}</p>
        <h3 className="mt-2 font-serif text-[clamp(1.8rem,3vw,3rem)] font-black leading-tight text-brand-950">{category.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{category.description}</p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.025 } },
        }}
        className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {category.services.map((service, index) => (
          <SubServiceCard key={service.title} service={service} serviceKey={category.key} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
}
