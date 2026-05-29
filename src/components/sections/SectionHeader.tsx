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
      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
      <h2 className="font-serif text-[clamp(2.1rem,4.4vw,4.8rem)] font-black leading-[1.02] tracking-normal text-brand-950">
        {title}
      </h2>
      {description ? <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{description}</p> : null}
    </div>
  );
}
