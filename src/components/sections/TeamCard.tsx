'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import type { TeamMember } from '@/lib/constants/team';
import { serviceThemes } from '@/lib/constants/theme';

type TeamCardProps = {
  member: TeamMember;
  index?: number;
};

export function TeamCard({ member, index = 0 }: TeamCardProps) {
  const theme = serviceThemes[member.themeKey];
  const socialLinks = [
    { label: 'LinkedIn', href: member.linkedinHref, icon: Linkedin },
    { label: 'Email', href: member.emailHref, icon: Mail },
    { label: 'GitHub', href: member.githubHref, icon: Github },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.025 }}
      whileHover={{ y: -5 }}
      className={`group relative flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-3 shadow-sm transition hover:shadow-2xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-2xl ${theme.surface}`} />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white bg-slate-50 p-3 shadow-inner">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientSoft}`} />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.76),transparent_42%)]" />
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-white/65">
          <Image
            src={member.imageSrc}
            alt={`${member.name} profile`}
            width={960}
            height={720}
            sizes="(min-width: 1280px) 31vw, (min-width: 768px) 46vw, 92vw"
            className="h-full w-full rounded-[1.15rem] object-contain object-center transition duration-700 group-hover:scale-[1.018]"
          />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] shadow-sm ${theme.bg} ${theme.text}`}>
            {member.category.replace('-', ' ')}
          </span>
          <div className="flex shrink-0 gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={`${member.name} ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:-translate-y-0.5 hover:border-brand-950 hover:bg-brand-950 hover:text-white"
              >
                <Icon size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-2 pb-2 pt-5">
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
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {member.expertise.map((tag) => (
            <span key={tag} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.bg} ${theme.text}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
