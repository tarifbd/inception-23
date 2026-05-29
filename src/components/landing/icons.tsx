import {
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  CloudCog,
  Code2,
  DatabaseZap,
  FileCheck2,
  FileSearch,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers3,
  LineChart,
  LockKeyhole,
  Megaphone,
  Network,
  Palette,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Workflow,
  Zap,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import type { LandingIconName } from '@/lib/constants/landing';

export const landingIcons: Record<LandingIconName, LucideIcon> = {
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  CloudCog,
  Code2,
  DatabaseZap,
  FileCheck2,
  FileSearch,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers3,
  LineChart,
  LockKeyhole,
  Megaphone,
  Network,
  Palette,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Workflow,
  Zap,
};

export function getLandingIcon(name: LandingIconName) {
  return landingIcons[name];
}

type LandingIconProps = LucideProps & {
  name: LandingIconName;
};

export function LandingIcon({ name, ...props }: LandingIconProps) {
  const Icon = landingIcons[name];
  return <Icon {...props} />;
}
