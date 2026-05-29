import type { LandingIconName } from './theme';

export type LandingProcessStep = {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: LandingIconName;
};

export const landingProcess: LandingProcessStep[] = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover',
    description: 'Clarify goals, constraints, stakeholders, current systems, and the business outcome that matters.',
    icon: 'FileSearch',
  },
  {
    id: 'diagnose',
    step: '02',
    title: 'Diagnose',
    description: 'Map root problems, operational gaps, legal exposure, digital friction, and growth blockers.',
    icon: 'Target',
  },
  {
    id: 'strategize',
    step: '03',
    title: 'Strategize',
    description: 'Define the roadmap, priorities, operating model, technology choices, and implementation path.',
    icon: 'ChartNoAxesCombined',
  },
  {
    id: 'design',
    step: '04',
    title: 'Design',
    description: 'Create workflows, interfaces, documents, systems architecture, and service experiences.',
    icon: 'Layers3',
  },
  {
    id: 'build-implement',
    step: '05',
    title: 'Build / Implement',
    description: 'Deliver the solution through focused execution, quality control, and accountable ownership.',
    icon: 'Code2',
  },
  {
    id: 'optimize',
    step: '06',
    title: 'Optimize',
    description: 'Measure adoption, performance, conversion, risk reduction, and operational efficiency.',
    icon: 'Zap',
  },
  {
    id: 'scale',
    step: '07',
    title: 'Scale',
    description: 'Expand what works into a repeatable system with documentation, dashboards, and governance.',
    icon: 'Rocket',
  },
];
