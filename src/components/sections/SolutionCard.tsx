'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Database, LayoutDashboard, LockKeyhole, Workflow } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import type { Solution } from '@/lib/constants/solutions';
import { serviceThemes } from '@/lib/constants/theme';

type SolutionCardProps = {
  solution: Solution;
  index?: number;
};

export function SolutionCard({ solution, index = 0 }: SolutionCardProps) {
  const theme = serviceThemes[solution.serviceKey];
  const [imageFailed, setImageFailed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const imageSrc = solution.image && !imageFailed ? solution.image : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -7 }}
      className={`group relative grid overflow-hidden rounded-[2rem] border bg-white p-3 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)] lg:grid-cols-[1.08fr_0.92fr] ${theme.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

      <div
        className={`relative min-h-[260px] overflow-hidden rounded-[1.55rem] border bg-slate-50 sm:min-h-[340px] lg:min-h-[390px] ${theme.border} ${imageSrc ? 'cursor-zoom-in' : ''}`}
        onMouseEnter={() => imageSrc && setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
      >
        <div className="relative h-full min-h-[260px] w-full sm:min-h-[340px] lg:min-h-[390px]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${solution.title} interface preview`}
              fill
              sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 56vw, 100vw"
              quality={88}
              priority={index === 0}
              onError={() => setImageFailed(true)}
              className="object-contain object-center p-2 transition duration-500 group-hover:scale-[1.015] group-hover:brightness-[1.03] sm:p-3"
            />
          ) : (
            <SolutionImageHolder solution={solution} />
          )}
        </div>

        {imageSrc ? (
          <div className="pointer-events-none absolute inset-x-5 bottom-5 hidden rounded-full border border-white/90 bg-white/92 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 shadow-lg backdrop-blur-md sm:block">
            Hover to view full image
          </div>
        ) : null}
      </div>

      {imageSrc ? (
        <ImagePreviewPortal
          open={previewOpen}
          imageSrc={imageSrc}
          title={solution.title}
          borderClass={theme.borderStrong}
        />
      ) : null}

      <div className="relative flex flex-col justify-between p-5 sm:p-7 lg:p-8">
        <div>
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg ${theme.icon}`}>
              <LandingIcon name={solution.icon} size={19} />
            </span>
            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${theme.border} ${theme.bg} ${theme.text}`}>
              {solution.badge}
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-black leading-tight text-brand-950 sm:text-3xl">{solution.title}</h3>
          <p className="mt-4 text-base font-semibold leading-8 text-slate-600">{solution.description}</p>

          <div className="mt-6">
            <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${theme.text}`}>Services rendered</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {solution.modules.slice(0, 4).map((module) => (
                <span key={module} className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] ${theme.bg} ${theme.text}`}>
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className={`rounded-2xl px-4 py-3 text-sm font-black leading-6 ${theme.bg} ${theme.text}`}>{solution.outcome}</p>
          <Link href={solution.href} className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-[0.12em] shadow-lg transition ${theme.button}`}>
            Start
            <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function ImagePreviewPortal({
  open,
  imageSrc,
  title,
  borderClass,
}: {
  open: boolean;
  imageSrc: string;
  title: string;
  borderClass: string;
}) {
  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden items-center justify-center bg-brand-950/30 p-4 backdrop-blur-md lg:flex">
      <div
        className={`relative h-[92vh] w-[94vw] overflow-hidden rounded-[2.25rem] border bg-white shadow-[0_48px_140px_rgba(15,23,42,0.4)] ${borderClass}`}
      >
        <Image
          src={imageSrc}
          alt={`${title} full preview`}
          fill
          sizes="94vw"
          quality={100}
          className="object-contain object-center p-3"
        />
      </div>
    </div>,
    document.body,
  );
}

function SolutionImageHolder({ solution }: { solution: Solution }) {
  const theme = serviceThemes[solution.serviceKey];

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${theme.gradientSoft}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,1,33,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.035)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className={`absolute -left-10 bottom-2 h-44 w-44 rounded-full blur-2xl ${theme.surface}`} />
      <div className={`absolute -right-8 top-0 h-48 w-48 rounded-full blur-2xl ${theme.surface}`} />

      <div className="absolute left-8 top-8 hidden w-28 space-y-3 sm:block">
        {[Workflow, Database, LockKeyhole].map((Icon, index) => (
          <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/76 p-3 shadow-sm backdrop-blur-md">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.icon}`}>
              <Icon size={15} />
            </span>
            <span className="h-2 flex-1 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[1.35rem] border border-white/80 bg-white/84 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:w-[58%]">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className={`h-3 rounded-full ${index % 4 === 0 ? theme.bg : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={`rounded-2xl p-3 ${theme.bgSoft}`}>
            <LayoutDashboard size={20} className={theme.textSoft} />
            <span className="mt-3 block h-2 rounded-full bg-white/80" />
          </div>
          <div className={`rounded-2xl p-3 ${theme.bgSoft}`}>
            <LandingIcon name={solution.icon} size={20} className={theme.textSoft} />
            <span className="mt-3 block h-2 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
