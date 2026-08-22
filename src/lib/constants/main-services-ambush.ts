import { serviceCategories } from './service-categories';
import { subServices } from './sub-services';
import type { ServiceKey } from './theme';

export type MainServicesAmbushItem = {
  key: ServiceKey;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  accent: string;
  softAccent: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  proof: string;
  outcome: string;
  services: string[];
};

const serviceMeta: Record<ServiceKey, Pick<MainServicesAmbushItem, 'image' | 'imageAlt' | 'accent' | 'softAccent' | 'textClass' | 'borderClass' | 'badgeClass' | 'proof' | 'outcome'>> = {
  it: {
    image: '/main-services/it-ai-solutions.webp',
    imageAlt: 'Cloud tools, data dashboards, and connected business software systems',
    accent: '#087EA4',
    softAccent: 'rgba(8,145,178,0.12)',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-200',
    badgeClass: 'bg-cyan-50 text-cyan-700',
    proof: 'Data, software, automation',
    outcome: 'Turn scattered operations into measurable digital systems.',
  },
  consultancy: {
    image: '/main-services/management-finance.webp',
    imageAlt: 'Management strategy, financial reporting, controls, and growth planning system',
    accent: '#0F766E',
    softAccent: 'rgba(5,150,105,0.12)',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    proof: 'Finance, control, growth discipline',
    outcome: 'Build operating clarity for leadership, compliance, and scale.',
  },
  legal: {
    image: '/main-services/legal-support.webp',
    imageAlt: 'Legal documentation, compliance controls, governance, and secure records',
    accent: '#7B2447',
    softAccent: 'rgba(109,40,217,0.12)',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
    badgeClass: 'bg-violet-50 text-violet-700',
    proof: 'Documentation, risk, compliance',
    outcome: 'Protect decisions with careful records and governance support.',
  },
  creative: {
    image: '/main-services/creative-execution.webp',
    imageAlt: 'Brand design, visual identity, content production, and creative campaign studio',
    accent: '#8B3FA8',
    softAccent: 'rgba(249,115,22,0.14)',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200',
    badgeClass: 'bg-orange-50 text-orange-700',
    proof: 'Brand, design, market experience',
    outcome: 'Make the offer clearer, sharper, and easier to trust.',
  },
};

export const mainServicesAmbush: MainServicesAmbushItem[] = serviceCategories.map((category) => ({
  key: category.key,
  title: category.title,
  shortTitle: category.shortTitle,
  eyebrow: category.eyebrow,
  description: category.description,
  href: category.href,
  services: subServices[category.key].slice(0, 8).map((service) => service.title),
  ...serviceMeta[category.key],
}));
