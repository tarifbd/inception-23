import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { landingThemes, type LandingServiceKey } from '@/lib/constants/landing';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  themeKey?: LandingServiceKey;
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  themeKey = 'it',
  action,
}: SectionHeaderProps) {
  const theme = landingThemes[themeKey];
  const isCenter = align === 'center';

  return (
    <div className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] ${theme.border} ${theme.soft} ${theme.text}`}>
        <Sparkles size={13} />
        {eyebrow}
      </div>
      <div className={action ? 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between' : ''}>
        <div>
          <h2 className="font-serif text-[clamp(2.35rem,5vw,4.75rem)] font-black leading-[1.03] text-brand-950">
            {title}
          </h2>
          {description ? (
            <p className={`mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg ${isCenter ? 'mx-auto' : ''}`}>
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className={isCenter ? 'mx-auto' : 'shrink-0'}>{action}</div> : null}
      </div>
    </div>
  );
}
