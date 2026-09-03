type StatBadgeSize = 'sm' | 'md' | 'lg';
type StatBadgeAlign = 'left' | 'center' | 'right';

type StatBadgeProps = {
  label: string;
  value: number | string;
  size?: StatBadgeSize;
  align?: StatBadgeAlign;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
};

const sizeClasses: Record<StatBadgeSize, { value: string; label: string }> = {
  sm: {
    value: 'text-2xl',
    label: 'text-[9px]',
  },
  md: {
    value: 'text-3xl',
    label: 'text-[10px]',
  },
  lg: {
    value: 'text-5xl sm:text-6xl',
    label: 'text-[10px]',
  },
};

const alignClasses: Record<StatBadgeAlign, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

function formatStatValue(value: number | string) {
  if (typeof value === 'number') return String(value).padStart(2, '0');
  const trimmed = value.trim();
  return /^\d+$/.test(trimmed) ? trimmed.padStart(2, '0') : trimmed;
}

export function StatBadge({
  label,
  value,
  size = 'md',
  align = 'left',
  className = '',
  valueClassName = '',
  labelClassName = '',
}: StatBadgeProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`flex min-w-0 flex-col gap-1 ${alignClasses[align]} ${className}`}>
      <span className={`font-serif font-bold leading-none tabular-nums text-brand-950 dark:text-white ${classes.value} ${valueClassName}`}>
        {formatStatValue(value)}
      </span>
      <span className={`font-mono font-bold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400 ${classes.label} ${labelClassName}`}>
        {label}
      </span>
    </div>
  );
}
