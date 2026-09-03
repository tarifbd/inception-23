import type { LandingIconName } from '@/lib/constants/landing';

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: LandingIconName;
};

export const whyChooseItems: WhyChooseItem[] = [
  {
    title: 'Multidisciplinary expertise',
    description: 'One team can connect software, finance control, legal documentation, and creative delivery in the same workstream.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Strategy to execution',
    description: 'A brief can move from diagnosis to roadmap, system, document pack, interface, and implementation checkpoint.',
    icon: 'Network',
  },
  {
    title: 'Bangladesh-aware, globally relevant',
    description: 'Practical understanding of local business realities with modern systems and globally credible standards.',
    icon: 'Globe2',
  },
  {
    title: 'KPI control for managers',
    description: 'Dashboards, KPI definitions, owners, and decision logs make monthly leadership reviews easier to run.',
    icon: 'ChartNoAxesCombined',
  },
  {
    title: 'Systems ready for delegation',
    description: 'Each solution documents roles, permissions, evidence, and review points before a process is handed to a team.',
    icon: 'CloudCog',
  },
  {
    title: 'Long-term partnership',
    description: 'We stay close to the business model, not just the project scope, so the system keeps improving.',
    icon: 'ShieldCheck',
  },
];
