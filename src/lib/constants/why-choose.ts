import type { LandingIconName } from '@/lib/constants/landing';

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: LandingIconName;
};

export const whyChooseItems: WhyChooseItem[] = [
  {
    title: 'Multidisciplinary expertise',
    description: 'Technology, management, finance, legal support, and creative thinking under one operating lens.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Strategy to execution',
    description: 'The work moves from diagnosis to roadmap, system, documentation, interface, and measurable implementation.',
    icon: 'Network',
  },
  {
    title: 'Bangladesh-aware, globally relevant',
    description: 'Practical understanding of local business realities with modern systems and globally credible standards.',
    icon: 'Globe2',
  },
  {
    title: 'Data-informed decisions',
    description: 'Dashboards, KPIs, reporting frameworks, and decision logs that make leadership conversations sharper.',
    icon: 'ChartNoAxesCombined',
  },
  {
    title: 'Scalable systems',
    description: 'Each solution is designed to survive growth, delegation, compliance pressure, and operational complexity.',
    icon: 'CloudCog',
  },
  {
    title: 'Long-term partnership',
    description: 'We stay close to the business model, not just the project scope, so the system keeps improving.',
    icon: 'ShieldCheck',
  },
];
