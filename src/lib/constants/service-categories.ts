import type { LandingIconName } from '@/lib/constants/landing';
import { subServices } from './sub-services';
import type { ServiceKey } from './theme';

export type ServiceCategory = {
  key: ServiceKey;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  icon: LandingIconName;
  href: string;
  highlights: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    key: 'it',
    title: 'Technology & Software Solutions',
    shortTitle: 'Technology',
    eyebrow: 'Software, dashboards, internal tools',
    description: 'Business software, workflow tools, data dashboards, and secure digital systems built around real operations.',
    icon: 'BrainCircuit',
    href: '/services/it-ai-solutions',
    highlights: subServices.it.slice(0, 8).map((item) => item.title),
  },
  {
    key: 'consultancy',
    title: 'Management Consultancy & Finance Advisory',
    shortTitle: 'Management & Finance',
    eyebrow: 'Growth, control, finance, compliance',
    description: 'Tax, VAT, customs, accounting systems, internal control, SOPs, KPI dashboards, feasibility, due diligence, and growth advisory.',
    icon: 'BriefcaseBusiness',
    href: '/services/management-consultancy',
    highlights: ['Taxation Advisory', 'VAT Advisory', 'Customs & Bond Advisory', 'Financial Reporting', 'Internal Control & SOP', 'KPI Dashboard', 'Due Diligence', 'Business Plan'],
  },
  {
    key: 'legal',
    title: 'Legal Support',
    shortTitle: 'Legal Support',
    eyebrow: 'Documentation, compliance, protection',
    description: 'Careful legal support, documentation assistance, compliance coordination, governance workflows, and risk review for business continuity.',
    icon: 'Scale',
    href: '/services/legal-support',
    highlights: subServices.legal.slice(0, 8).map((item) => item.title),
  },
  {
    key: 'creative',
    title: 'Creative & Others',
    shortTitle: 'Creative',
    eyebrow: 'Brand, story, market experience',
    description: 'Brand strategy, visual identity, pitch materials, content, UI/UX, campaign direction, and market-facing creative assets.',
    icon: 'Palette',
    href: '/services/creative-others',
    highlights: subServices.creative.slice(0, 8).map((item) => item.title),
  },
];

export function getServiceCategory(key: ServiceKey) {
  return serviceCategories.find((category) => category.key === key);
}
