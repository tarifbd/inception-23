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
    label: 'Technology & Software Solutions',
    shortLabel: 'Technology',
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
    text: 'text-teal-800',
    textSoft: 'text-teal-700',
    border: 'border-teal-200/80',
    borderStrong: 'border-teal-500/70',
    bg: 'bg-teal-50',
    bgSoft: 'bg-teal-500/10',
    surface: 'bg-teal-500/10',
    gradient: 'from-slate-950 via-teal-800 to-teal-500',
    gradientSoft: 'from-slate-50 via-teal-50 to-white',
    icon: 'bg-teal-800 text-white shadow-teal-800/25',
    ring: 'ring-teal-500/20',
    shadow: 'shadow-teal-950/15',
    button: 'bg-teal-800 text-white hover:bg-teal-700 shadow-teal-800/25',
    dot: 'bg-teal-600',
  },
  legal: {
    key: 'legal',
    label: 'Legal Support',
    shortLabel: 'Legal',
    text: 'text-rose-900',
    textSoft: 'text-amber-700',
    border: 'border-rose-200/80',
    borderStrong: 'border-rose-500/70',
    bg: 'bg-rose-50',
    bgSoft: 'bg-rose-500/10',
    surface: 'bg-rose-500/10',
    gradient: 'from-rose-950 via-rose-800 to-amber-500',
    gradientSoft: 'from-rose-50 via-amber-50 to-white',
    icon: 'bg-rose-900 text-white shadow-rose-900/25',
    ring: 'ring-rose-500/20',
    shadow: 'shadow-rose-950/15',
    button: 'bg-rose-900 text-white hover:bg-rose-800 shadow-rose-900/25',
    dot: 'bg-amber-500',
  },
  creative: {
    key: 'creative',
    label: 'Creative & Others',
    shortLabel: 'Creative',
    text: 'text-purple-800',
    textSoft: 'text-fuchsia-700',
    border: 'border-purple-200/80',
    borderStrong: 'border-fuchsia-500/70',
    bg: 'bg-purple-50',
    bgSoft: 'bg-fuchsia-500/10',
    surface: 'bg-purple-500/10',
    gradient: 'from-purple-800 via-fuchsia-600 to-rose-400',
    gradientSoft: 'from-purple-50 via-fuchsia-50 to-rose-50',
    icon: 'bg-purple-800 text-white shadow-purple-800/25',
    ring: 'ring-fuchsia-500/20',
    shadow: 'shadow-purple-950/15',
    button: 'bg-purple-800 text-white hover:bg-purple-700 shadow-purple-800/25',
    dot: 'bg-rose-400',
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
