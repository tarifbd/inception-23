import type { LandingIconName } from '@/lib/constants/landing';
import { subServices } from './sub-services';
import type { ServiceKey } from './theme';
import { BUSINESS_ADVISORY_SERVICE_NAME } from '@/lib/service-labels';

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
    description: 'Business software, workflow tools, dashboards, and secure systems for teams replacing spreadsheets with owned workflows.',
    icon: 'BrainCircuit',
    href: '/services/it-ai-solutions',
    highlights: subServices.it.slice(0, 8).map((item) => item.title),
  },
  {
    key: 'consultancy',
    title: BUSINESS_ADVISORY_SERVICE_NAME,
    shortTitle: BUSINESS_ADVISORY_SERVICE_NAME,
    eyebrow: 'Growth, control, finance, compliance',
    description: 'Tax, VAT, customs, accounting systems, SOPs, KPI dashboards, due diligence, and growth advisory for owner-led companies.',
    icon: 'BriefcaseBusiness',
    href: '/services/management-consultancy',
    highlights: ['Taxation Advisory', 'VAT Advisory', 'Customs & Bond Advisory', 'Financial Reporting', 'Internal Control & SOP', 'KPI Dashboard', 'Due Diligence', 'Business Plan'],
  },
  {
    key: 'legal',
    title: 'Legal Support',
    shortTitle: 'Legal Support',
    eyebrow: 'Documentation, compliance, protection',
    description: 'Documentation support, compliance coordination, governance workflows, and risk review for business continuity and board readiness.',
    icon: 'Scale',
    href: '/services/legal-support',
    highlights: subServices.legal.slice(0, 8).map((item) => item.title),
  },
  {
    key: 'creative',
    title: 'Creative & Others',
    shortTitle: 'Creative',
    eyebrow: 'Brand, story, market experience',
    description: 'Brand strategy, identity, pitch materials, UI/UX, campaign direction, and client-facing assets that sharpen the buyer path.',
    icon: 'Palette',
    href: '/services/creative-others',
    highlights: subServices.creative.slice(0, 8).map((item) => item.title),
  },
];

export function getServiceCategory(key: ServiceKey) {
  return serviceCategories.find((category) => category.key === key);
}
