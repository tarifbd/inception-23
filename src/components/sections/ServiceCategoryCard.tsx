'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import type { ServiceCategory } from '@/lib/constants/service-categories';
import { serviceThemes } from '@/lib/constants/theme';

type ServiceCategoryCardProps = {
  category: ServiceCategory;
  index?: number;
};

export function ServiceCategoryCard({ category, index = 0 }: ServiceCategoryCardProps) {
  const theme = serviceThemes[category.key];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.42, delay: index * 0.045 }}
      whileHover={{ y: -8 }}
      className={`group relative flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white/88 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-2xl ${theme.border} ${theme.shadow} hover:ring-8 ${theme.ring}`}
    >
      <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-2xl ${theme.surface}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg`}>
          <LandingIcon name={category.icon} size={24} />
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${theme.bg} ${theme.text}`}>
          {category.shortTitle}
        </span>
      </div>
      <p className={`relative mt-7 text-[10px] font-black uppercase tracking-[0.22em] ${theme.text}`}>{category.eyebrow}</p>
      <h3 className="relative mt-3 font-serif text-2xl font-black leading-tight text-brand-950 md:text-3xl">{category.title}</h3>
      <p className="relative mt-4 text-sm leading-7 text-slate-600">{category.description}</p>
      <div className="relative mt-6 grid gap-2">
        {category.highlights.slice(0, 8).map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CheckCircle2 size={16} className={theme.textSoft} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-auto pt-8">
        <Link href={category.href} className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg transition ${theme.button}`}>
          Explore service
          <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
