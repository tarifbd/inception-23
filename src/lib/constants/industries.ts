import type { LandingIconName } from '@/lib/constants/landing';

export type Industry = {
  id: string;
  title: string;
  value: string;
  icon: LandingIconName;
};

export const industries: Industry[] = [
  { id: 'startups', title: 'Startups', value: 'Launch systems, MVP clarity, investor-ready documents, and automation foundations.', icon: 'Rocket' },
  { id: 'smes', title: 'SMEs', value: 'Owner dashboards, approval paths, compliance files, finance controls, and team handoff routines.', icon: 'Building2' },
  { id: 'professional-services', title: 'Professional Service Firms', value: 'Client portals, case files, proposal systems, knowledge search, and monthly delivery cadence.', icon: 'BriefcaseBusiness' },
  { id: 'real-estate-construction', title: 'Real Estate & Construction', value: 'Project dashboards, sales pipelines, documentation flows, and financial visibility.', icon: 'Building2' },
  { id: 'education-edtech', title: 'Education & EdTech', value: 'Admissions workflows, learning platforms, reporting, and communication systems.', icon: 'GraduationCap' },
  { id: 'ecommerce-retail', title: 'E-commerce & Retail', value: 'Offer pages, inventory views, customer follow-up flows, order reports, and campaign tracking.', icon: 'Store' },
  { id: 'healthcare-clinics', title: 'Healthcare & Clinics', value: 'Appointment flows, reporting, patient communication, and compliance-aware systems.', icon: 'HeartPulse' },
  { id: 'manufacturing-garments', title: 'Manufacturing & Garments', value: 'Process control, QA workflows, supply visibility, and performance dashboards.', icon: 'Workflow' },
  { id: 'finance-accounting-tax', title: 'Finance, Accounting & Tax Firms', value: 'Secure client workflows, document control, reporting, and compliance support.', icon: 'LineChart' },
  { id: 'ngos-social-impact', title: 'NGOs / Social Impact Organizations', value: 'Program trackers, donor reports, field records, beneficiary data, and impact dashboards.', icon: 'Handshake' },
];
