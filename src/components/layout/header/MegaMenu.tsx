'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Clapperboard,
  Factory,
  FileText,
  FolderKanban,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Landmark,
  Library,
  Lightbulb,
  MapPin,
  Megaphone,
  Newspaper,
  Presentation,
  ReceiptText,
  Rocket,
  Route,
  ShieldCheck,
  ShoppingBag,
  Store,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import {
  aboutMenu,
  eventManagementMenu,
  industriesMenu,
  insightsMenu,
  resourcesMenu,
  servicesMenu,
  solutionMenu,
} from '@/lib/constants/navigation';
import { serviceThemes } from '@/lib/constants/theme';
import type { LandingIconName } from '@/lib/constants/landing';
import type { ServiceKey } from '@/lib/constants/theme';

type MenuKind = 'services' | 'events' | 'solutions' | 'industries' | 'insights' | 'resources' | 'about';

type MegaMenuProps = {
  activeMenu: MenuKind;
  onNavigate: () => void;
  menuItems?: Partial<Record<MenuKind, CmsMenuItem[]>>;
};

export type CmsMenuItem = {
  id: string;
  title: string;
  href: string;
  description?: string;
  eyebrow?: string;
  icon?: string;
  theme?: string;
};

type MenuCardProps = {
  href: string;
  index: number;
  eyebrow: string;
  title: string;
  description?: string;
  action: string;
  icon: ReactNode;
  iconTone: string;
  eyebrowTone?: string;
  onNavigate: () => void;
};

const eventIcons = [Building2, Presentation, Rocket, Megaphone, GraduationCap, Store, MapPin, Clapperboard] as const;
const industryIcons = [Rocket, BriefcaseBusiness, Building2, Landmark, GraduationCap, ShoppingBag, HeartPulse, Factory, ReceiptText, HandHeart] as const;
const insightIcons = [Newspaper, BookOpen, FileText, ReceiptText, Workflow, FolderKanban] as const;
const resourceIcons = [Library, Lightbulb, FolderKanban] as const;
const aboutIcons = [Building2, Target, Users, ShieldCheck, Route] as const;

const iconTones = [
  'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200',
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200',
  'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200',
  'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-300/20 dark:bg-orange-300/10 dark:text-orange-200',
] as const;

const menuLabels: Record<MenuKind, string> = {
  services: 'Service disciplines',
  events: 'Event management',
  solutions: 'Business solutions',
  industries: 'Industries',
  insights: 'Insights',
  resources: 'Resources',
  about: 'Company',
};

function MenuCard({
  href,
  index,
  eyebrow,
  title,
  description,
  action,
  icon,
  iconTone,
  eyebrowTone = 'text-support-700 dark:text-support-300',
  onNavigate,
}: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.028, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={href}
        onClick={onNavigate}
        className="group relative flex h-full min-h-40 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-4 text-left shadow-[0_12px_28px_-24px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:border-support-600/35 hover:bg-support-50/40 hover:shadow-[0_20px_38px_-24px_rgba(15,23,42,0.42)] focus:outline-none focus-visible:ring-4 focus-visible:ring-support-600/15 dark:border-white/10 dark:bg-[#131820] dark:hover:border-support-300/35 dark:hover:bg-support-300/[0.055]"
      >
        <span className="absolute inset-y-4 left-0 w-0.5 origin-bottom scale-y-0 bg-support-600 transition-transform duration-300 group-hover:scale-y-100 dark:bg-support-300" aria-hidden="true" />
        <span className="flex items-start justify-between gap-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${iconTone}`}>
            {icon}
          </span>
          <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-600">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>
        <span className={`mt-4 text-[10px] font-bold ${eyebrowTone}`}>{eyebrow}</span>
        <h3 className="mt-2 text-sm font-black leading-snug text-brand-950 dark:text-white">{title}</h3>
        {description ? <p className="mt-2 flex-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{description}</p> : <span className="flex-1" />}
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-support-700 dark:text-support-300">
          {action}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}

function LucideMenuIcon({ Icon }: { Icon: LucideIcon }) {
  return <Icon size={19} strokeWidth={1.85} aria-hidden="true" />;
}

export function MegaMenu({ activeMenu, onNavigate, menuItems }: MegaMenuProps) {
  const menus: Record<MenuKind, CmsMenuItem[]> = {
    services: menuItems?.services ?? servicesMenu.map((item) => ({ id: item.key, title: item.title, href: item.href, description: item.description, eyebrow: 'Service discipline', icon: item.icon, theme: item.key })),
    events: menuItems?.events ?? eventManagementMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description, eyebrow: 'Event work' })),
    solutions: menuItems?.solutions ?? solutionMenu.map((item) => ({ id: item.title, title: item.title, href: item.href, description: item.description, eyebrow: item.badge, icon: item.icon, theme: item.serviceKey })),
    industries: menuItems?.industries ?? industriesMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description, eyebrow: 'Industry focus' })),
    insights: menuItems?.insights ?? insightsMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description, eyebrow: 'Knowledge' })),
    resources: menuItems?.resources ?? resourcesMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description, eyebrow: 'Resource' })),
    about: menuItems?.about ?? aboutMenu.map((item) => ({ id: item.label, title: item.label, href: item.href, description: item.description, eyebrow: 'Inception 23' })),
  };
  const itemCount = menus[activeMenu].length;
  const compactGrid = activeMenu === 'insights' || activeMenu === 'resources' || activeMenu === 'about';

  return (
    <motion.div
      data-mega-menu
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 top-[calc(100%+0.7rem)] z-50 max-h-[calc(100vh-120px)] w-[min(1180px,calc(100vw-32px))] overflow-y-auto rounded-lg border border-slate-200 bg-[#f8faf9] p-3 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#0f141b]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200 dark:bg-white/10" aria-hidden="true">
        <span className="absolute left-0 top-0 h-px w-32 bg-support-600 dark:bg-support-300" />
        <span className="absolute left-32 top-0 h-px w-8 bg-orange-500" />
      </div>

      <div className="relative mb-3 flex items-center justify-between gap-4 border-b border-slate-200 px-1 pb-3 pt-1 dark:border-white/10">
        <p className="text-xs font-bold text-brand-950 dark:text-white">{menuLabels[activeMenu]}</p>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          {String(itemCount).padStart(2, '0')} entries
        </p>
      </div>

      <div className={`relative grid gap-3 ${compactGrid ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
        {activeMenu === 'services'
          ? menus.services.map((item, index) => {
              const theme = serviceThemes[(item.theme || 'it') as ServiceKey];
              return (
                <MenuCard
                  key={item.id}
                  href={item.href}
                  index={index}
                  eyebrow={item.eyebrow || 'Service discipline'}
                  title={item.title}
                  description={item.description}
                  action="Explore service"
                  icon={<LandingIcon name={(item.icon || 'Cpu') as LandingIconName} size={19} strokeWidth={1.9} />}
                  iconTone={`${theme.border} ${theme.bg} ${theme.text}`}
                  eyebrowTone={theme.text}
                  onNavigate={onNavigate}
                />
              );
            })
          : null}

        {activeMenu === 'events'
          ? menus.events.map((item, index) => (
              <MenuCard
                key={item.id}
                href={item.href}
                index={index}
                eyebrow={item.eyebrow || 'Event work'}
                title={item.title}
                description={item.description}
                action="Discuss this"
                icon={<LucideMenuIcon Icon={eventIcons[index]} />}
                iconTone={iconTones[index % iconTones.length]}
                onNavigate={onNavigate}
              />
            ))
          : null}

        {activeMenu === 'solutions'
          ? menus.solutions.map((item, index) => {
              const theme = serviceThemes[(item.theme || 'it') as ServiceKey];
              return (
                <MenuCard
                  key={item.id}
                  href={item.href}
                  index={index}
                  eyebrow={item.eyebrow || 'Solution'}
                  title={item.title}
                  description={item.description}
                  action="View solution"
                  icon={<LandingIcon name={(item.icon || 'Cpu') as LandingIconName} size={19} strokeWidth={1.9} />}
                  iconTone={`${theme.border} ${theme.bg} ${theme.text}`}
                  eyebrowTone={theme.text}
                  onNavigate={onNavigate}
                />
              );
            })
          : null}

        {activeMenu === 'industries'
          ? menus.industries.map((item, index) => (
              <MenuCard
                key={item.id}
                href={item.href}
                index={index}
                eyebrow={item.eyebrow || 'Industry focus'}
                title={item.title}
                description={item.description}
                action="View industry"
                icon={<LucideMenuIcon Icon={industryIcons[index]} />}
                iconTone={iconTones[index % iconTones.length]}
                onNavigate={onNavigate}
              />
            ))
          : null}

        {activeMenu === 'insights'
          ? menus.insights.map((item, index) => (
              <MenuCard
                key={item.id}
                href={item.href}
                index={index}
                eyebrow={item.eyebrow || 'Knowledge'}
                title={item.title}
                description={item.description}
                action="Read more"
                icon={<LucideMenuIcon Icon={insightIcons[index]} />}
                iconTone={iconTones[index % iconTones.length]}
                onNavigate={onNavigate}
              />
            ))
          : null}

        {activeMenu === 'resources'
          ? menus.resources.map((item, index) => (
              <MenuCard
                key={item.id}
                href={item.href}
                index={index}
                eyebrow={item.eyebrow || 'Resource'}
                title={item.title}
                description={item.description}
                action="Open resource"
                icon={<LucideMenuIcon Icon={resourceIcons[index]} />}
                iconTone={iconTones[index % iconTones.length]}
                onNavigate={onNavigate}
              />
            ))
          : null}

        {activeMenu === 'about'
          ? menus.about.map((item, index) => (
              <MenuCard
                key={item.id}
                href={item.href}
                index={index}
                eyebrow={item.eyebrow || 'Inception 23'}
                title={item.title}
                description={item.description}
                action="Explore"
                icon={<LucideMenuIcon Icon={aboutIcons[index]} />}
                iconTone={iconTones[index % iconTones.length]}
                onNavigate={onNavigate}
              />
            ))
          : null}
      </div>
    </motion.div>
  );
}

export type { MenuKind };
