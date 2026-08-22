import type { LandingIconName } from '@/lib/constants/landing';

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LandingIconName;
};

export const processSteps: ProcessStep[] = [
  { id: 'discover', number: '01', title: 'Discover', description: 'Understand the business, stakeholders, constraints, and practical goal.', icon: 'FileSearch' },
  { id: 'diagnose', number: '02', title: 'Diagnose', description: 'Map the operational, financial, legal, technical, and market gaps.', icon: 'BrainCircuit' },
  { id: 'strategize', number: '03', title: 'Strategize', description: 'Prioritize the right decisions, roadmap, ownership model, and success metrics.', icon: 'Target' },
  { id: 'design', number: '04', title: 'Design', description: 'Shape the system, workflow, advisory framework, brand, or implementation plan.', icon: 'Palette' },
  { id: 'build', number: '05', title: 'Build / Implement', description: 'Execute in focused increments with governance, documentation, and feedback loops.', icon: 'Network' },
  { id: 'optimize', number: '06', title: 'Optimize', description: 'Measure adoption, remove friction, improve conversion, and refine operating control.', icon: 'ChartNoAxesCombined' },
  { id: 'scale', number: '07', title: 'Scale', description: 'Extend the system into new teams, markets, services, or operating lines.', icon: 'CloudCog' },
];
