'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import type { LandingTeamMember } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';

type TeamCardProps = {
  member: LandingTeamMember;
  index?: number;
};

export function TeamCard({ member, index = 0 }: TeamCardProps) {
  const theme = landingThemes[member.themeKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.42, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-[1.5rem] border bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute -right-14 -top-14 h-32 w-32 rounded-full blur-2xl ${theme.surface}`} />
      <div className="relative flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black shadow-lg ${theme.icon}`}>
          {member.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-brand-950">{member.name}</h3>
          <p className={`mt-1 text-xs font-black uppercase tracking-[0.16em] ${theme.text}`}>{member.role}</p>
        </div>
        <Link
          href={member.linkedinHref}
          aria-label={`${member.name} LinkedIn`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-950 hover:bg-brand-950 hover:text-white"
        >
          <Linkedin size={15} />
        </Link>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-600">{member.bio}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {member.expertise.map((tag) => (
          <span key={tag} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.soft} ${theme.text}`}>
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
