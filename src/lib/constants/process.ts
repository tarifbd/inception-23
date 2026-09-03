import type { LandingIconName } from '@/lib/constants/landing';

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LandingIconName;
};

export const processSteps: ProcessStep[] = [
  { id: 'discover', number: '01', title: 'Discover', description: 'Capture stakeholders, systems, documents, constraints, and the practical goal in one brief.', icon: 'FileSearch' },
  { id: 'diagnose', number: '02', title: 'Diagnose', description: 'Map the operational, financial, legal, technical, and market gaps blocking the next decision.', icon: 'BrainCircuit' },
  { id: 'strategize', number: '03', title: 'Strategize', description: 'Prioritize decisions, roadmap, owners, budget limits, and success metrics before build work starts.', icon: 'Target' },
  { id: 'design', number: '04', title: 'Design', description: 'Shape the system, workflow, advisory framework, brand, or implementation plan around real users.', icon: 'Palette' },
  { id: 'build', number: '05', title: 'Build / Implement', description: 'Execute in focused increments with governance notes, documentation, demos, and feedback loops.', icon: 'Network' },
  { id: 'optimize', number: '06', title: 'Optimize', description: 'Review adoption, friction, conversion, reporting accuracy, and operating control after launch.', icon: 'ChartNoAxesCombined' },
  { id: 'scale', number: '07', title: 'Scale', description: 'Extend the working model into new teams, markets, services, or operating lines once ownership is clear.', icon: 'CloudCog' },
];
