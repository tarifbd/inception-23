import type { LandingIconName, LandingServiceKey } from './theme';

export type LandingSolution = {
  id: string;
  serviceKey: LandingServiceKey;
  badge: string;
  title: string;
  description: string;
  modules: string[];
  outcome: string;
  icon: LandingIconName;
  href: string;
};

export const featuredSolutions: LandingSolution[] = [
  {
    id: 'crm-client-management',
    serviceKey: 'it',
    badge: 'Client growth',
    title: 'CRM & Client Management System',
    description: 'A lead, client, follow-up, document, and reporting system for clearer sales ownership.',
    modules: ['Lead pipeline', 'Client profiles', 'Follow-up reminders', 'Management dashboard'],
    outcome: 'Cleaner sales rhythm and stronger client accountability.',
    icon: 'Bot',
    href: '/contact',
  },
  {
    id: 'business-process-automation',
    serviceKey: 'consultancy',
    badge: 'Operating control',
    title: 'Business Process Automation System',
    description: 'A structured workflow layer for approvals, tasks, reminders, reporting, and role ownership.',
    modules: ['SOP mapping', 'Approval flow', 'Task engine', 'KPI reporting'],
    outcome: 'Less dependency on manual coordination.',
    icon: 'Workflow',
    href: '/contact',
  },
  {
    id: 'legal-compliance-platform',
    serviceKey: 'legal',
    badge: 'Risk readiness',
    title: 'Legal Case / Compliance Management Platform',
    description: 'A secure system for documents, cases, deadlines, policies, compliance checks, and risk tracking.',
    modules: ['Case tracker', 'Document vault', 'Compliance checklist', 'Risk register'],
    outcome: 'Better visibility across legal obligations.',
    icon: 'Scale',
    href: '/contact',
  },
  {
    id: 'management-dashboard-kpi',
    serviceKey: 'consultancy',
    badge: 'Leadership visibility',
    title: 'Management Dashboard & KPI Reporting System',
    description: 'A leadership command view for performance metrics, reviews, decisions, and business priorities.',
    modules: ['KPI map', 'Review cadence', 'Performance alerts', 'Decision log'],
    outcome: 'Faster leadership decisions with less ambiguity.',
    icon: 'LineChart',
    href: '/contact',
  },
  {
    id: 'creative-brand-website',
    serviceKey: 'creative',
    badge: 'Market presence',
    title: 'Creative Brand & Website Experience',
    description: 'A brand and website system that clarifies the offer and improves trust at first contact.',
    modules: ['Identity system', 'Website UX', 'Content direction', 'Pitch assets'],
    outcome: 'A sharper market signal and higher conversion confidence.',
    icon: 'Palette',
    href: '/contact',
  },
  {
    id: 'custom-business-os',
    serviceKey: 'it',
    badge: 'Custom operations',
    title: 'Custom Internal Business Operating System',
    description: 'A role-based operating platform for internal tools, reporting, data, tasks, and team workflows.',
    modules: ['Role access', 'Data model', 'Workflow tools', 'Admin console'],
    outcome: 'A central system built around how the company really works.',
    icon: 'Network',
    href: '/contact',
  },
];
