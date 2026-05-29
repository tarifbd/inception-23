export type ServiceKey = 'it' | 'consultancy' | 'legal' | 'creative';

export type ServiceTheme = {
  key: ServiceKey;
  label: string;
  shortLabel: string;
  text: string;
  textSoft: string;
  border: string;
  borderStrong: string;
  bg: string;
  bgSoft: string;
  surface: string;
  gradient: string;
  gradientSoft: string;
  icon: string;
  ring: string;
  shadow: string;
  button: string;
  dot: string;
};

export const serviceThemes: Record<ServiceKey, ServiceTheme> = {
  it: {
    key: 'it',
    label: 'IT & AI Solutions',
    shortLabel: 'IT & AI',
    text: 'text-cyan-700',
    textSoft: 'text-cyan-600',
    border: 'border-cyan-200/80',
    borderStrong: 'border-cyan-400/70',
    bg: 'bg-cyan-50',
    bgSoft: 'bg-cyan-500/10',
    surface: 'bg-cyan-500/10',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    gradientSoft: 'from-cyan-50 via-blue-50 to-white',
    icon: 'bg-cyan-600 text-white shadow-cyan-600/25',
    ring: 'ring-cyan-500/20',
    shadow: 'shadow-cyan-950/10',
    button: 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/25',
    dot: 'bg-cyan-500',
  },
  consultancy: {
    key: 'consultancy',
    label: 'Management Consultancy & Finance Advisory',
    shortLabel: 'Management',
    text: 'text-emerald-700',
    textSoft: 'text-emerald-600',
    border: 'border-emerald-200/80',
    borderStrong: 'border-emerald-400/70',
    bg: 'bg-emerald-50',
    bgSoft: 'bg-emerald-500/10',
    surface: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    gradientSoft: 'from-emerald-50 via-teal-50 to-white',
    icon: 'bg-emerald-600 text-white shadow-emerald-600/25',
    ring: 'ring-emerald-500/20',
    shadow: 'shadow-emerald-950/10',
    button: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25',
    dot: 'bg-emerald-500',
  },
  legal: {
    key: 'legal',
    label: 'Legal Support',
    shortLabel: 'Legal',
    text: 'text-violet-700',
    textSoft: 'text-violet-600',
    border: 'border-violet-200/80',
    borderStrong: 'border-violet-400/70',
    bg: 'bg-violet-50',
    bgSoft: 'bg-violet-500/10',
    surface: 'bg-violet-500/10',
    gradient: 'from-violet-700 via-purple-700 to-amber-500',
    gradientSoft: 'from-violet-50 via-purple-50 to-amber-50',
    icon: 'bg-violet-700 text-white shadow-violet-700/25',
    ring: 'ring-violet-500/20',
    shadow: 'shadow-violet-950/10',
    button: 'bg-violet-700 text-white hover:bg-violet-600 shadow-violet-700/25',
    dot: 'bg-violet-600',
  },
  creative: {
    key: 'creative',
    label: 'Creative & Others',
    shortLabel: 'Creative',
    text: 'text-orange-700',
    textSoft: 'text-orange-600',
    border: 'border-orange-200/80',
    borderStrong: 'border-orange-400/70',
    bg: 'bg-orange-50',
    bgSoft: 'bg-orange-500/10',
    surface: 'bg-orange-500/10',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    gradientSoft: 'from-orange-50 via-rose-50 to-white',
    icon: 'bg-orange-600 text-white shadow-orange-600/25',
    ring: 'ring-orange-500/20',
    shadow: 'shadow-orange-950/10',
    button: 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/25',
    dot: 'bg-orange-500',
  },
};

export const pageTheme = {
  section: 'relative overflow-hidden py-20 md:py-28',
  container: 'mx-auto w-full max-w-7xl px-5 sm:px-6',
  eyebrow: 'text-[10px] font-black uppercase tracking-[0.24em]',
  card: 'rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300',
};

export function getServiceTheme(key: ServiceKey) {
  return serviceThemes[key];
}
