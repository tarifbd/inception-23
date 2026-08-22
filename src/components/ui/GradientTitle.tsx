type GradientTitleProps = {
  text: string;
  accentWords?: number;
  tone?: 'brand' | 'technology' | 'management' | 'legal' | 'creative';
};

const toneClasses = {
  brand: 'gradient-title-brand',
  technology: 'gradient-title-technology',
  management: 'gradient-title-management',
  legal: 'gradient-title-legal',
  creative: 'gradient-title-creative',
} as const;

export function GradientTitle({ text, accentWords = 2, tone = 'brand' }: GradientTitleProps) {
  const words = text.trim().split(/\s+/);
  const splitAt = Math.max(1, words.length - Math.min(accentWords, words.length - 1));

  return (
    <>
      {words.slice(0, splitAt).join(' ')}{' '}
      <span className={`gradient-title ${toneClasses[tone]}`}>{words.slice(splitAt).join(' ')}</span>
    </>
  );
}
