'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import type { TeamMember } from '@/lib/constants/team';
import { serviceThemes } from '@/lib/constants/theme';

type TeamCardProps = {
  member: TeamMember;
  index?: number;
};

export function TeamCard({ member, index = 0 }: TeamCardProps) {
  const theme = serviceThemes[member.themeKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.025 }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-[1.6rem] border bg-white p-3 shadow-sm transition hover:shadow-xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-2xl ${theme.surface}`} />
      <div className={`relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${theme.gradientSoft}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.9),transparent_28%)]" />
        <Link
          href={member.linkedinHref}
          aria-label={`${member.name} LinkedIn`}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:border-brand-950 hover:bg-brand-950 hover:text-white"
        >
          <Linkedin size={15} />
        </Link>
        <div className="relative mx-auto aspect-[5/3] w-full max-w-[360px]">
          <Image
            src={member.imageSrc}
            alt={`${member.name} profile illustration`}
            fill
            sizes="(min-width: 1280px) 31vw, (min-width: 768px) 46vw, 92vw"
            className="object-contain px-4 pt-4 transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className="relative px-2 pb-2 pt-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-lg ${theme.icon}`}>
            {member.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black leading-tight text-brand-950">{member.name}</h3>
            <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.16em] ${theme.text}`}>{member.role}</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600">{member.bio}</p>
      </div>

      <div className="relative flex flex-wrap gap-2 px-2 pb-2">
        {member.expertise.map((tag) => (
          <span key={tag} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.bg} ${theme.text}`}>
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
