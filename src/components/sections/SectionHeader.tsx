import type { ReactNode } from 'react';
import { GradientTitle } from '@/components/ui/GradientTitle';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  kicker?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, align = 'left', kicker }: SectionHeaderProps) {
  return (
    <div data-motion-copy className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {kicker}
      <p data-motion-eyebrow className="mb-3 flex items-center gap-3 font-utility text-[0.68rem] font-bold uppercase tracking-[0.16em] text-brand-700 sm:mb-4"><span className="h-px w-7 bg-current" aria-hidden="true" />{eyebrow}</p>
      <h2 data-motion-heading className="break-words font-serif text-[2.25rem] font-bold leading-[1.04] text-brand-950 sm:text-[3.25rem] lg:text-[4.25rem]">
        <GradientTitle text={title} />
      </h2>
      {description ? <p data-motion-description className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:leading-8 md:text-lg">{description}</p> : null}
    </div>
  );
}
