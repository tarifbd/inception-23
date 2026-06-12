import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  kicker?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, align = 'left', kicker }: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {kicker}
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-700 sm:mb-4 sm:tracking-[0.24em]">{eyebrow}</p>
      <h2 className="break-words font-serif text-[clamp(2rem,4.4vw,4.8rem)] font-black leading-[1.06] tracking-normal text-brand-950 sm:leading-[1.02]">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:leading-8 md:text-lg">{description}</p> : null}
    </div>
  );
}
