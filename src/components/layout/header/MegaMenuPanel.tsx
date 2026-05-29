import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LandingIcon } from '@/components/landing/icons';
import type { ServiceCategory } from '@/lib/constants/service-categories';
import { serviceThemes } from '@/lib/constants/theme';

type MegaMenuPanelProps = {
  item: ServiceCategory & { subServices: string[] };
  index?: number;
  onNavigate?: () => void;
};

export function MegaMenuPanel({ item, onNavigate }: MegaMenuPanelProps) {
  const theme = serviceThemes[item.key];

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10 ${theme.border}`}
    >
      <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-2xl ${theme.surface}`} />
      <div className="relative flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg`}>
          <LandingIcon name={item.icon} size={21} />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-black leading-tight text-brand-950">{item.title}</h3>
          <p className="mt-2 text-xs leading-6 text-slate-600">{item.description}</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2">
        {item.subServices.slice(0, 6).map((service) => (
          <span key={service} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.bg} ${theme.text}`}>
            {service}
          </span>
        ))}
      </div>
      <div className={`relative mt-auto inline-flex items-center gap-2 pt-6 text-xs font-black uppercase tracking-[0.14em] ${theme.text}`}>
        Explore
        <ArrowRight size={14} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
