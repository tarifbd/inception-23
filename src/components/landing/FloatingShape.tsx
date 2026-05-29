import type { LandingServiceKey } from '@/lib/constants/landing';
import { landingThemes } from '@/lib/constants/landing';

type FloatingShapeProps = {
  themeKey?: LandingServiceKey;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'h-36 w-36 blur-3xl',
  md: 'h-64 w-64 blur-[80px]',
  lg: 'h-96 w-96 blur-[110px]',
};

export function FloatingShape({ themeKey = 'it', className = '', size = 'md' }: FloatingShapeProps) {
  const theme = landingThemes[themeKey];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full opacity-80 ${sizes[size]} ${theme.surface} ${className}`}
    />
  );
}
