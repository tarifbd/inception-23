import { BrainCircuit, BriefcaseBusiness, Scale, Sparkles } from 'lucide-react';

export type ServiceSlug = 'it-ai-solutions' | 'management-consultancy' | 'legal-support' | 'creative-others';

export type ServiceTheme = {
  name: string;
  text: string;
  border: string;
  soft: string;
  surface: string;
  gradient: string;
  button: string;
  ring: string;
};

export type ServiceDefinition = {
  slug: ServiceSlug;
  shortId: 'it' | 'consultancy' | 'legal' | 'creative';
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: typeof BrainCircuit;
  lottie: string;
  theme: ServiceTheme;
  problems: string[];
  solutions: string[];
  process: string[];
  deliverables: string[];
  useCases: string[];
};

export const serviceThemes: Record<ServiceSlug, ServiceTheme> = {
  'it-ai-solutions': {
    name: 'Electric systems',
    text: 'text-cyan-700',
    border: 'border-cyan-300/70',
    soft: 'bg-cyan-50',
    surface: 'bg-cyan-500/10',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    button: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    ring: 'ring-cyan-500/25',
  },
  'management-consultancy': {
    name: 'Operational clarity',
    text: 'text-emerald-700',
    border: 'border-emerald-300/70',
    soft: 'bg-emerald-50',
    surface: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ring: 'ring-emerald-500/25',
  },
  'legal-support': {
    name: 'Controlled confidence',
    text: 'text-violet-700',
    border: 'border-violet-300/70',
    soft: 'bg-violet-50',
    surface: 'bg-violet-500/10',
    gradient: 'from-violet-700 via-purple-700 to-amber-500',
    button: 'bg-violet-700 hover:bg-violet-600 text-white',
    ring: 'ring-violet-500/25',
  },
  'creative-others': {
    name: 'Market momentum',
    text: 'text-orange-700',
    border: 'border-orange-300/70',
    soft: 'bg-orange-50',
    surface: 'bg-orange-500/10',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    button: 'bg-orange-600 hover:bg-orange-500 text-white',
    ring: 'ring-orange-500/25',
  },
};

export const services: ServiceDefinition[] = [
  {
    slug: 'it-ai-solutions',
    shortId: 'it',
    title: 'Technology & Software Solutions',
    eyebrow: 'Software, systems, dashboards',
    summary: 'Business software, workflow automation, and data platforms for measurable operational clarity.',
    description:
      'We design and implement secure digital systems that connect data, workflows, and people into dependable business infrastructure.',
    icon: BrainCircuit,
    lottie: '/animations/it-new.json',
    theme: serviceThemes['it-ai-solutions'],
    problems: ['Manual workflows blocking scale', 'Disconnected data and reporting', 'Legacy websites that cannot convert', 'Tools that never reach daily use'],
    solutions: ['Custom software and portals', 'Workflow automation', 'Data dashboards and analytics layers', 'Cloud, DevOps, and integration architecture'],
    process: ['Assess systems and data maturity', 'Design the operating architecture', 'Build secure product increments', 'Deploy, measure, and optimize'],
    deliverables: ['Automation roadmap', 'Production web application', 'Data and reporting dashboard', 'Technical documentation'],
    useCases: ['Support tools', 'Client portals', 'Business intelligence platforms', 'Internal workflow automation'],
  },
  {
    slug: 'management-consultancy',
    shortId: 'consultancy',
    title: 'Management Consultancy',
    eyebrow: 'Strategy with operating discipline',
    summary: 'Corporate strategy, operational redesign, governance, and growth systems for leadership teams.',
    description:
      'We help companies turn ambition into operating rhythm through sharper strategy, process clarity, and executive-grade accountability.',
    icon: BriefcaseBusiness,
    lottie: '/animations/consultancy-new.json',
    theme: serviceThemes['management-consultancy'],
    problems: ['Unclear priorities across leadership', 'Slow decision cycles', 'Weak process ownership', 'Growth without operational control'],
    solutions: ['Corporate strategy design', 'Operating model redesign', 'Performance management systems', 'Market and expansion advisory'],
    process: ['Diagnose strategy and operations', 'Define the management system', 'Align teams around metrics', 'Install review cadence'],
    deliverables: ['Strategic roadmap', 'Operating model blueprint', 'KPI and dashboard framework', 'Process improvement plan'],
    useCases: ['New market entry', 'Operational restructuring', 'Founder-led scaling', 'Board reporting systems'],
  },
  {
    slug: 'legal-support',
    shortId: 'legal',
    title: 'Legal Support',
    eyebrow: 'Compliance and risk control',
    summary: 'Corporate legal support, compliance readiness, governance documents, and risk review frameworks.',
    description:
      'We support companies with practical legal and regulatory structures that protect decisions, contracts, and operating continuity.',
    icon: Scale,
    lottie: '/animations/legal-new.json',
    theme: serviceThemes['legal-support'],
    problems: ['Incomplete compliance documentation', 'Contract and governance risk', 'Regulatory uncertainty', 'Dispute exposure without preparation'],
    solutions: ['Corporate documentation support', 'Compliance workflow design', 'Risk register and mitigation plans', 'Governance and policy frameworks'],
    process: ['Review legal and compliance exposure', 'Prioritize risk areas', 'Prepare documentation and workflows', 'Monitor updates and obligations'],
    deliverables: ['Compliance checklist', 'Governance document pack', 'Contract review notes', 'Risk mitigation tracker'],
    useCases: ['Company governance', 'Policy preparation', 'Compliance audits', 'Dispute support preparation'],
  },
  {
    slug: 'creative-others',
    shortId: 'creative',
    title: 'Creative & Others',
    eyebrow: 'Brand and experience systems',
    summary: 'Brand strategy, creative direction, campaign systems, and clear digital experience design.',
    description:
      'We shape the market-facing side of business with structured creative systems that make complex offers easier to trust and buy.',
    icon: Sparkles,
    lottie: '/animations/creative-new.json',
    theme: serviceThemes['creative-others'],
    problems: ['Weak brand differentiation', 'Inconsistent visual communication', 'Low-converting campaigns', 'Complex offers that feel unclear'],
    solutions: ['Brand positioning and identity systems', 'Campaign and content architecture', 'Interactive digital experiences', 'Presentation and pitch assets'],
    process: ['Clarify audience and offer', 'Define visual and message system', 'Create campaign assets', 'Measure response and refine'],
    deliverables: ['Brand system guide', 'Campaign asset kit', 'Creative direction board', 'Premium landing page or deck'],
    useCases: ['Launch campaigns', 'Corporate presentations', 'Brand repositioning', 'Digital showrooms'],
  },
];

export const caseStudies = [
  {
    slug: 'operations-control-room',
    title: 'Operations Control Room',
    service: 'Technology & Software Solutions',
    serviceSlug: 'it-ai-solutions' as ServiceSlug,
    summary: 'Designed a reporting and workflow layer for leadership visibility across teams.',
    metric: 'Faster reporting cycles',
  },
  {
    slug: 'growth-operating-model',
    title: 'Growth Operating Model',
    service: 'Management Consultancy',
    serviceSlug: 'management-consultancy' as ServiceSlug,
    summary: 'Rebuilt management cadence, ownership model, and KPI review system for a scaling service company.',
    metric: 'Clearer accountability',
  },
  {
    slug: 'compliance-readiness-system',
    title: 'Compliance Readiness System',
    service: 'Legal Support',
    serviceSlug: 'legal-support' as ServiceSlug,
    summary: 'Created compliance documentation, risk tracker, and governance workflow for recurring review.',
    metric: 'Priority gaps tracked',
  },
];

export const insights = [
  {
    slug: 'why-digital-projects-fail-after-the-demo',
    title: 'Why digital projects fail after the demo',
    category: 'Technology',
    summary: 'Useful software needs governance, workflow integration, and business ownership before tool choice.',
  },
  {
    slug: 'operating-rhythm-for-founder-led-companies',
    title: 'Operating rhythm for founder-led companies',
    category: 'Management',
    summary: 'A practical cadence for turning decisions into execution without adding bureaucracy.',
  },
  {
    slug: 'compliance-as-a-growth-infrastructure',
    title: 'Compliance as growth infrastructure',
    category: 'Legal',
    summary: 'Good compliance systems reduce friction, improve trust, and protect expansion decisions.',
  },
];

export const testimonials = [
  {
    quote: 'They translated a complex operating problem into a clear system our team could actually use.',
    name: 'Sarah Jenkins',
    role: 'COO, ScaleLab Group',
  },
  {
    quote: 'The work felt strategic and practical at the same time. That combination is rare.',
    name: 'Arif Rahman',
    role: 'Founder, Northline Ventures',
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
