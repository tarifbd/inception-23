import type { LandingIconName } from '@/lib/constants/landing';

export type Industry = {
  id: string;
  title: string;
  value: string;
  icon: LandingIconName;
};

export const industries: Industry[] = [
  { id: 'startups', title: 'Startups', value: 'Launch systems, MVP clarity, investor-ready documents, and automation foundations.', icon: 'Rocket' },
  { id: 'smes', title: 'SMEs', value: 'Strategy, process, compliance, finance control, and scalable digital workflows.', icon: 'Building2' },
  { id: 'professional-services', title: 'Professional Service Firms', value: 'Client portals, knowledge systems, premium positioning, and operational cadence.', icon: 'BriefcaseBusiness' },
  { id: 'real-estate-construction', title: 'Real Estate & Construction', value: 'Project dashboards, sales pipelines, documentation flows, and financial visibility.', icon: 'Building2' },
  { id: 'education-edtech', title: 'Education & EdTech', value: 'Admissions workflows, learning platforms, reporting, and communication systems.', icon: 'GraduationCap' },
  { id: 'ecommerce-retail', title: 'E-commerce & Retail', value: 'Conversion experiences, inventory visibility, customer automation, and analytics.', icon: 'Store' },
  { id: 'healthcare-clinics', title: 'Healthcare & Clinics', value: 'Appointment flows, reporting, patient communication, and compliance-aware systems.', icon: 'HeartPulse' },
  { id: 'manufacturing-garments', title: 'Manufacturing & Garments', value: 'Process control, QA workflows, supply visibility, and performance dashboards.', icon: 'Workflow' },
  { id: 'finance-accounting-tax', title: 'Finance, Accounting & Tax Firms', value: 'Secure client workflows, document control, reporting, and compliance support.', icon: 'LineChart' },
  { id: 'ngos-social-impact', title: 'NGOs / Social Impact Organizations', value: 'Program tracking, donor reporting, field data, and operational transparency.', icon: 'Handshake' },
];
