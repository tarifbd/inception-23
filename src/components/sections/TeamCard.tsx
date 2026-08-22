'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github, Globe2, Linkedin, Mail } from 'lucide-react';
import type { TeamMember } from '@/lib/constants/team';

type TeamCardProps = {
  member: TeamMember;
  index?: number;
  slotNumber: number;
  categoryAccent: string;
};

function hasProfileLink(href?: string) {
  return Boolean(href && href !== '#');
}

export function TeamCard({ member, index = 0, slotNumber, categoryAccent }: TeamCardProps) {
  const reduceMotion = useReducedMotion();
  const actions = [
    { label: 'Email', href: member.emailHref, icon: Mail, required: true },
    { label: 'LinkedIn', href: member.linkedinHref, icon: Linkedin, required: true },
    { label: 'GitHub', href: member.githubHref, icon: Github, required: false },
    { label: 'Portfolio', href: member.portfolioHref, icon: Globe2, required: false },
  ].filter((action) => action.required || hasProfileLink(action.href));

  return (
    <motion.article
      data-interactive-surface
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: '-56px' }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.48, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid h-[42rem] w-full max-w-[22rem] min-w-0 grid-rows-[22rem_minmax(0,1fr)] overflow-hidden border border-t-[3px] border-slate-300 bg-white shadow-[0_18px_52px_-40px_rgba(15,23,42,0.5)] transition-[border-color,box-shadow] duration-500 hover:border-slate-400 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.4)] dark:border-white/12 dark:bg-[#10151b] dark:hover:border-white/25"
      style={{ borderTopColor: categoryAccent }}
    >
      <div data-motion-media className="relative h-full min-h-0 overflow-hidden bg-slate-200 dark:bg-[#0b1016]">
        <Image
          src={member.imageSrc}
          alt={`${member.name} profile`}
          fill
          sizes="(min-width: 640px) 352px, 100vw"
          className="object-cover object-center transition duration-1000 ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091018]/72 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center border border-white/70 bg-white/92 px-2 font-mono text-[9px] font-bold text-brand-950 backdrop-blur-md dark:border-white/15 dark:bg-[#0b1016]/90 dark:text-white">
          {String(slotNumber).padStart(2, '0')}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white/85">Verified profile</p>
          <span className="h-px w-10 bg-white/65 transition-all duration-500 group-hover:w-16" aria-hidden="true" />
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden p-5">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em]" style={{ color: categoryAccent }}>{member.role}</p>
        <h4 className="mt-3 break-words font-serif text-[1.85rem] font-bold leading-[1.02] text-brand-950 transition-colors dark:text-white">{member.name}</h4>
        <p className="mt-4 text-[13px] leading-6 text-slate-600 dark:text-slate-400">{member.bio}</p>

        {member.expertise.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-200 pt-4 dark:border-white/10" aria-label={`${member.name} expertise`}>
            {member.expertise.map((tag, tagIndex) => (
              <li key={tag} className="grid grid-cols-[1.25rem_1fr] items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span className="font-mono text-[8px] font-bold" style={{ color: categoryAccent }}>{String(tagIndex + 1).padStart(2, '0')}</span>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
          {actions.map(({ label, href, icon: Icon }) => hasProfileLink(href) ? (
            <a
              key={label}
              href={href}
              target={href?.startsWith('mailto:') ? undefined : '_blank'}
              rel={href?.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={`${member.name} ${label}`}
              className="group/action inline-flex min-h-10 items-center gap-2 border border-slate-300 px-3 text-[10px] font-bold text-slate-700 transition hover:border-brand-950 hover:bg-brand-950 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/15 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white dark:hover:text-night-950"
            >
              <Icon size={14} aria-hidden="true" />
              {label}
              <ArrowUpRight size={12} className="transition-transform group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5" aria-hidden="true" />
            </a>
          ) : (
            <span key={label} aria-label={`${member.name} ${label} pending verification`} className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 border border-slate-200 px-3 text-[10px] font-bold text-slate-400 dark:border-white/10 dark:text-slate-600">
              <Icon size={14} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
