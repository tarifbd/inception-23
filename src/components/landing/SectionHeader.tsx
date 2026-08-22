import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { landingThemes, type LandingServiceKey } from '@/lib/constants/landing';
import { GradientTitle } from '@/components/ui/GradientTitle';

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
    <div data-motion-copy className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div data-motion-eyebrow className={`mb-4 inline-flex items-center gap-2 border-l-2 py-1 pl-3 text-xs font-semibold ${theme.border} ${theme.text}`}>
        <Sparkles size={13} />
        {eyebrow}
      </div>
      <div className={action ? 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between' : ''}>
        <div>
          <h2 data-motion-heading className="font-serif text-[clamp(2.35rem,5vw,4.75rem)] font-bold leading-[1.03] text-brand-950">
            <GradientTitle text={title} tone={themeKey === 'it' ? 'technology' : themeKey === 'consultancy' ? 'management' : themeKey === 'legal' ? 'legal' : 'creative'} />
          </h2>
          {description ? (
            <p data-motion-description className={`mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg ${isCenter ? 'mx-auto' : ''}`}>
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className={isCenter ? 'mx-auto' : 'shrink-0'}>{action}</div> : null}
      </div>
    </div>
  );
}
