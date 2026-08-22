import type { LandingIconName } from './theme';

export type LandingIndustry = {
  id: string;
  title: string;
  value: string;
  icon: LandingIconName;
};

export const landingIndustries: LandingIndustry[] = [
  { id: 'startups', title: 'Startups', value: 'MVPs, launch systems, automation, and investor-ready operating clarity.', icon: 'Rocket' },
  { id: 'smes', title: 'SMEs', value: 'Practical strategy, systems, compliance, and digital workflows for growing companies.', icon: 'Building2' },
  { id: 'professional-services', title: 'Professional Service Firms', value: 'Client portals, knowledge workflows, CRM systems, and clear market positioning.', icon: 'BriefcaseBusiness' },
  { id: 'real-estate-construction', title: 'Real Estate & Construction', value: 'Project visibility, sales pipelines, documentation flows, and reporting dashboards.', icon: 'Building2' },
  { id: 'education-edtech', title: 'Education & EdTech', value: 'Learning platforms, admissions workflows, analytics, and communication systems.', icon: 'GraduationCap' },
  { id: 'ecommerce-retail', title: 'E-commerce & Retail', value: 'Storefronts, automation, inventory visibility, and customer growth systems.', icon: 'Store' },
  { id: 'healthcare-clinics', title: 'Healthcare & Clinics', value: 'Appointment, reporting, patient communication, and compliance-aware systems.', icon: 'HeartPulse' },
  { id: 'manufacturing-garments', title: 'Manufacturing & Garments', value: 'Operational dashboards, process automation, QA workflows, and supply visibility.', icon: 'Workflow' },
  { id: 'finance-accounting-tax', title: 'Finance, Accounting & Tax Firms', value: 'Secure client workflows, document control, reporting, and compliance support.', icon: 'LineChart' },
  { id: 'ngos-social-impact', title: 'NGOs / Social Impact', value: 'Program tracking, donor reporting, field data, and operational transparency.', icon: 'Handshake' },
];
