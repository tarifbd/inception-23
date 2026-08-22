import type { LandingIconName } from './theme';

export type LandingFeature = {
  id: string;
  title: string;
  description: string;
  benefit: string;
  icon: LandingIconName;
};

export const aiSolutions: LandingFeature[] = [
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'Automate recurring approvals, routing, summaries, reminders, and operational handoffs.',
    benefit: 'Less manual work, faster execution.',
    icon: 'Workflow',
  },
  {
    id: 'custom-business-software',
    title: 'Custom Business Software',
    description: 'Role-based portals, internal tools, dashboards, and operating systems built around real workflows.',
    benefit: 'A system that fits the business.',
    icon: 'Code2',
  },
  {
    id: 'crm-erp-internal-tools',
    title: 'CRM / ERP / Internal Tools',
    description: 'Centralize leads, clients, operations, inventory, tasks, and reporting into dependable business tools.',
    benefit: 'Clear visibility across teams.',
    icon: 'DatabaseZap',
  },
  {
    id: 'data-dashboards-analytics',
    title: 'Data Dashboards & Analytics',
    description: 'Executive reporting, KPI views, performance signals, and decision dashboards leaders can trust.',
    benefit: 'Data-informed decisions.',
    icon: 'BarChart3',
  },
  {
    id: 'support-assistants',
    title: 'Support Assistants',
    description: 'Customer support, internal knowledge, lead capture, and service assistants with clear operating rules.',
    benefit: 'Better response without chaos.',
    icon: 'Bot',
  },
  {
    id: 'business-process-digitization',
    title: 'Business Process Digitization',
    description: 'Convert paper, spreadsheet, and messaging-based operations into trackable digital workflows.',
    benefit: 'Cleaner operations at scale.',
    icon: 'Zap',
  },
];
