export type LandingServiceKey = 'it' | 'consultancy' | 'legal' | 'creative';

export type LandingIconName =
  | 'BadgeCheck'
  | 'BarChart3'
  | 'Bot'
  | 'BrainCircuit'
  | 'BriefcaseBusiness'
  | 'Building2'
  | 'ChartNoAxesCombined'
  | 'ClipboardCheck'
  | 'CloudCog'
  | 'Code2'
  | 'DatabaseZap'
  | 'FileCheck2'
  | 'FileSearch'
  | 'Globe2'
  | 'GraduationCap'
  | 'Handshake'
  | 'HeartPulse'
  | 'Layers3'
  | 'LineChart'
  | 'LockKeyhole'
  | 'Megaphone'
  | 'Network'
  | 'Palette'
  | 'Rocket'
  | 'Scale'
  | 'ShieldCheck'
  | 'Sparkles'
  | 'Store'
  | 'Target'
  | 'Workflow'
  | 'Zap';

export type LandingTheme = {
  key: LandingServiceKey;
  label: string;
  text: string;
  textSoft: string;
  border: string;
  borderStrong: string;
  soft: string;
  softHover: string;
  surface: string;
  gradient: string;
  gradientSoft: string;
  icon: string;
  ring: string;
  shadow: string;
  button: string;
  dot: string;
};

export const landingThemes: Record<LandingServiceKey, LandingTheme> = {
  it: {
    key: 'it',
    label: 'IT & AI Solutions',
    text: 'text-cyan-700',
    textSoft: 'text-cyan-600',
    border: 'border-cyan-200/80',
    borderStrong: 'border-cyan-400/70',
    soft: 'bg-cyan-50',
    softHover: 'hover:bg-cyan-50',
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
    label: 'Management Consultancy',
    text: 'text-emerald-700',
    textSoft: 'text-emerald-600',
    border: 'border-emerald-200/80',
    borderStrong: 'border-emerald-400/70',
    soft: 'bg-emerald-50',
    softHover: 'hover:bg-emerald-50',
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
    text: 'text-violet-700',
    textSoft: 'text-violet-600',
    border: 'border-violet-200/80',
    borderStrong: 'border-violet-400/70',
    soft: 'bg-violet-50',
    softHover: 'hover:bg-violet-50',
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
    text: 'text-orange-700',
    textSoft: 'text-orange-600',
    border: 'border-orange-200/80',
    borderStrong: 'border-orange-400/70',
    soft: 'bg-orange-50',
    softHover: 'hover:bg-orange-50',
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

export const landingBase = {
  page: 'bg-white text-brand-950',
  section: 'relative overflow-hidden py-20 md:py-28',
  container: 'mx-auto w-full max-w-7xl px-5 sm:px-6',
  card: 'rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300',
  cardHover: 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10',
  eyebrow: 'text-[10px] font-black uppercase tracking-[0.24em]',
};

export function getLandingTheme(key: LandingServiceKey) {
  return landingThemes[key];
}
