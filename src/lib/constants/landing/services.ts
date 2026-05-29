import type { LandingIconName, LandingServiceKey } from './theme';

export type LandingService = {
  id: LandingServiceKey;
  title: string;
  eyebrow: string;
  description: string;
  icon: LandingIconName;
  bullets: string[];
  cta: string;
  href: string;
};

export const landingServices: LandingService[] = [
  {
    id: 'it',
    title: 'IT & AI Solutions',
    eyebrow: 'Blue / cyan system',
    description: 'Software, automation, AI agents, dashboards, and digital operations built for measurable business execution.',
    icon: 'BrainCircuit',
    bullets: ['Custom applications', 'AI automation', 'Dashboards & data', 'Workflow systems'],
    cta: 'Explore IT systems',
    href: '/services/it-ai-solutions',
  },
  {
    id: 'consultancy',
    title: 'Management Consultancy',
    eyebrow: 'Emerald / teal system',
    description: 'Strategy, operating models, SOPs, KPI systems, finance structure, and growth advisory for leadership teams.',
    icon: 'BriefcaseBusiness',
    bullets: ['Business strategy', 'SOP development', 'KPI design', 'Growth consulting'],
    cta: 'Explore advisory',
    href: '/services/management-consultancy',
  },
  {
    id: 'legal',
    title: 'Legal Support',
    eyebrow: 'Purple / gold system',
    description: 'Compliance, documentation, contracts, company policies, tax/VAT support, and business risk review.',
    icon: 'Scale',
    bullets: ['Compliance support', 'Contracts', 'Policy drafting', 'Risk review'],
    cta: 'Explore legal',
    href: '/services/legal-support',
  },
  {
    id: 'creative',
    title: 'Creative & Others',
    eyebrow: 'Warm creative system',
    description: 'Brand identity, website experience, content strategy, presentations, and market-facing creative systems.',
    icon: 'Palette',
    bullets: ['Brand identity', 'Website design', 'Content systems', 'Pitch assets'],
    cta: 'Explore creative',
    href: '/services/creative-others',
  },
];
