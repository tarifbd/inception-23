import { serviceCategories } from './service-categories';
import { subServices } from './sub-services';
import type { ServiceKey } from './theme';

export type EcosystemSubService = {
  title: string;
  description: string;
};

export type EcosystemCategory = {
  key: ServiceKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  services: EcosystemSubService[];
};

const generatedDescriptionFallbacks = new Set([
  'Practical intelligence workflows designed for safer, faster operational decisions.',
  'Automated handoffs and repeatable workflows that reduce manual coordination.',
  'Connected operating tools for teams, clients, data, and management visibility.',
  'Decision-ready reporting systems with cleaner metrics and ownership.',
  'Structured tax advisory support for planning, documentation, and compliance readiness.',
  'Compliance-focused support for statutory processes, evidence, and review control.',
  'Finance discipline for reporting, control, forecasting, and management decisions.',
  'Review frameworks that improve control, accountability, and leadership confidence.',
  'Careful documentation support for business continuity and risk coordination.',
  'Business setup and regulatory documentation support with clearer process control.',
  'Governance documentation support for records, policies, filings, and approvals.',
  'Premium brand systems that clarify positioning, recognition, and market trust.',
  'Investor and client-facing materials with sharper narrative and visual hierarchy.',
  'Digital experiences shaped for clarity, credibility, and conversion.',
  'Strategic communication assets aligned with audience, offer, and channel.',
  'Digital capability designed around secure implementation and measurable business use.',
  'Advisory support that strengthens operating control, finance discipline, and growth decisions.',
  'Documentation and compliance support for clearer business risk management.',
  'Creative execution that improves brand clarity, communication, and buyer confidence.',
].map((description) => description.toLowerCase()));

const serviceDescriptionOverrides: Record<ServiceKey, Record<string, string>> = {
  it: {
    'Workflow Automation': 'Replace repeat approvals with tracked handoffs, reminders, and owner-level status visibility.',
    'Customer Support Assistants': 'Triage inboxes, FAQs, and escalation notes so support teams answer with consistent context.',
    'Custom Web Application Development': 'Build role-based portals around the forms, approvals, and reports your team uses daily.',
    'Business Software Development': 'Turn spreadsheet-heavy operations into maintained software with permissions, logs, and workflows.',
    'CRM / ERP / Internal Tool Development': 'Connect leads, clients, inventory, finance, and admin work in one operating workspace.',
    'Dashboard & Data Analytics': 'Give leadership live KPI views with definitions, owners, filters, and review cadence.',
    'Data Visualization & Business Intelligence': 'Translate raw operational data into comparison views managers can read in minutes.',
    'Website & Landing Page Development': 'Launch credible pages with clear offers, fast load paths, and inquiry-ready forms.',
    'E-commerce System Development': 'Set up product, order, payment, stock, and customer flows for retail teams.',
    'API Integration': 'Connect CRMs, websites, forms, spreadsheets, payment tools, and dashboards without duplicate entry.',
    'Cloud & DevOps Setup': 'Prepare hosting, environments, backups, deployment checks, and access control for production work.',
    'Cybersecurity Basic Review': 'Review common exposure points across accounts, forms, permissions, hosting, and data handling.',
    'Digital Systems Roadmap': 'Prioritize the next 90 days of software, automation, reporting, and governance work.',
    'Smart Tool Integration for Business': 'Fit approved tools into daily workflows so teams use them without extra admin burden.',
    'Document Automation': 'Generate recurring letters, reports, approvals, and templates from structured inputs.',
    'Google Workspace / Microsoft 365 Automation': 'Automate Drive, Sheets, Gmail, Calendar, SharePoint, and Teams handoffs for office workflows.',
    'No-code / Low-code Automation': 'Prototype lightweight apps and automations before committing to a full build.',
    'Company Knowledge Search': 'Make SOPs, policies, proposals, and files searchable with access-aware retrieval.',
    'Customer Support Automation': 'Route tickets, suggested replies, and follow-up tasks from one support intake flow.',
    'Sales Funnel Automation': 'Track lead stages, nudges, reminders, and handoffs from inquiry to proposal.',
  },
  consultancy: {
    'Taxation Advisory': 'Plan tax positions, documentation, and filing readiness for growth-stage companies.',
    'Corporate Tax Planning': 'Map company tax exposure, deadlines, incentives, and evidence before decisions are made.',
    'Individual Tax Planning': 'Organize personal income, investments, documentation, and filing obligations with clearer timing.',
    'VAT Advisory': 'Structure VAT registration, calculation, records, and filing checks for recurring operations.',
    'Customs & Bond Advisory': 'Coordinate customs, bond, import evidence, and documentation controls for trade teams.',
    'Import / Export Compliance Support': 'Track import-export documents, approvals, shipment evidence, and compliance responsibilities.',
    'Business Health Checkup': 'Review revenue, process, compliance, people, and system risks in a practical diagnostic.',
    'Financial Health Checkup': 'Assess cash position, margins, receivables, payables, and reporting discipline.',
    'Accounting System Setup': 'Design chart of accounts, voucher flow, approvals, and reporting outputs before rollout.',
    'Bookkeeping System Design': 'Define transaction capture, evidence storage, reconciliations, and month-end routines.',
    'Management Accounts Preparation': 'Prepare owner-ready monthly accounts with variance notes and decision context.',
    'Financial Reporting Support': 'Improve reporting packs, schedules, checks, and review trails for management use.',
    'IFRS / IAS Reporting Guidance': 'Help finance teams interpret reporting standards and prepare cleaner working papers.',
    'Internal Control System Design': 'Install approval, segregation, evidence, and review controls around sensitive processes.',
    'SOP Development': 'Document recurring work into clear steps, roles, exceptions, and review checkpoints.',
    'Business Process Improvement': 'Remove bottlenecks in handoffs, approvals, reporting, and customer-facing operations.',
    'Budgeting & Forecasting': 'Build forecast assumptions, ownership, version control, and review cycles for planning.',
    'Cash Flow Management': 'Track inflows, outflows, commitments, and short-term cash risks with usable cadence.',
    'Costing & Pricing Strategy': 'Model cost drivers, margin scenarios, and pricing rules for product or service lines.',
    'KPI Design & Performance Dashboard': 'Define KPIs, owners, targets, and dashboard views for leadership meetings.',
    'Feasibility Study': 'Test market, cost, revenue, risk, and operational assumptions before investment decisions.',
    'Business Plan Preparation': 'Shape investor, lender, or board-ready plans with numbers tied to execution steps.',
    'Financial Modeling': 'Build scenario models for revenue, cost, cash, funding, and sensitivity decisions.',
    'Due Diligence Support': 'Organize documents, checks, risk notes, and summaries for transaction review.',
    'Internal Audit Support': 'Plan audit scope, control testing, evidence requests, and finding follow-up.',
    'External Audit Coordination': 'Prepare schedules, reconciliations, evidence folders, and response ownership for auditors.',
    'Risk Management Advisory': 'Turn operational, financial, and compliance risks into owners, controls, and review rhythm.',
    'Payroll & HR Compliance Support': 'Check payroll records, policy documents, statutory deductions, and approval trails.',
    'Vendor / Supplier Payment Control System': 'Control supplier onboarding, bill evidence, payment approval, and exception logs.',
    'Inventory Control Advisory': 'Review stock records, movement controls, count routines, and shrinkage signals.',
    'Project Financial Management': 'Track project budgets, commitments, billing, costs, and margin movement.',
    'ERP / Accounting Software Implementation Advisory': 'Align ERP setup with accounts, permissions, process owners, and reporting needs.',
    'Startup Financial Structuring': 'Set up early finance controls, cap table notes, budgets, and investor reporting basics.',
    'SME Growth Advisory': 'Help owner-led teams install reporting, delegation, pricing, and operating discipline.',
    'Corporate Governance Advisory': 'Prepare board cadence, delegated authorities, registers, and decision documentation.',
    'Business Restructuring Advisory': 'Map cost, people, process, debt, and reporting changes for turnaround work.',
    'Investment Readiness Support': 'Prepare metrics, financial model, data room, and story for investor conversations.',
    'Bank Loan Documentation Support': 'Organize lender packs, financial schedules, security documents, and response tracking.',
    'Management Reporting Framework': 'Create the monthly reporting pack, owners, deadlines, and escalation notes.',
  },
  legal: {
    'Criminal Law': 'Coordinate document preparation, case timelines, and evidence notes for criminal-law related matters.',
    'Civil Law': 'Organize pleadings, notices, evidence lists, and case files for civil-law coordination.',
    'Family Law': 'Prepare sensitive family-law document checklists, timelines, and appointment coordination.',
    'Property Law': 'Track deeds, ownership papers, mutation notes, leases, and property-related document gaps.',
    'Company Formation Support': 'Prepare formation documents, owner details, and filing steps for compliant company setup.',
    'RJSC Documentation Support': 'Coordinate RJSC forms, director records, share details, and submission evidence.',
    'Trade License / Business License Support': 'Manage license requirements, renewal dates, supporting papers, and authority follow-ups.',
    'Contract Drafting Support': 'Turn commercial terms into structured draft clauses for legal review and negotiation.',
    'Agreement Review Support': 'Summarize key obligations, risk clauses, renewal dates, and missing attachments.',
    'Employment Documentation': 'Prepare offer, appointment, policy acknowledgement, and employee record templates.',
    'HR Policy Documentation': 'Draft workplace policy structures with roles, approval routes, and update ownership.',
    'Legal Notice Drafting Support': 'Organize facts, dates, parties, claims, and attachments for notice preparation.',
    'Compliance Documentation': 'Create evidence folders, registers, and checklists for recurring compliance obligations.',
    'Regulatory Filing Support': 'Track filing requirements, forms, deadlines, signatories, and proof of submission.',
    'Board Resolution / Minutes Support': 'Prepare meeting agendas, resolutions, minutes, attendance notes, and approval records.',
    'Shareholder Documentation Support': 'Maintain shareholder registers, transfer notes, consent records, and communication logs.',
    'Partnership Documentation Support': 'Document partner roles, capital terms, profit rules, exits, and decision rights.',
    'Vendor Agreement Support': 'Structure vendor scope, payment terms, delivery checks, confidentiality, and termination notes.',
    'NDA / Confidentiality Agreement Support': 'Prepare confidentiality terms, disclosure scope, receiving-party duties, and expiry tracking.',
    'Terms & Conditions / Privacy Policy Support': 'Draft web terms and privacy notices around actual data collection and service flow.',
    'Business Policy Drafting': 'Turn management rules into publishable policies with approval, exception, and review paths.',
    'Legal Risk Review': 'Identify priority contract, compliance, employment, IP, and documentation exposure for management.',
    'Tax & Legal Documentation Coordination': 'Align tax files, legal records, registrations, and evidence folders for review readiness.',
    'Intellectual Property / Trademark Coordination': 'Track brand assets, trademark search notes, filing steps, and renewal reminders.',
    'Dispute Documentation Support': 'Compile chronology, communications, evidence, claims, and response notes for disputes.',
    'Legal Workflow Tracking': 'Create dashboards for matters, deadlines, owners, next steps, and document status.',
    'Document Management System for Legal Files': 'Set up searchable legal folders with version control, access rules, and retention notes.',
  },
  creative: {
    'Architectural Design': 'Shape concept layouts, mood direction, and presentation boards for built-environment decisions.',
    'Interior Design': 'Plan room flow, materials, furniture, lighting, and user experience for functional spaces.',
    'Exterior Design': 'Develop facade, signage, entry, and visual presence studies for public-facing buildings.',
    'Space Planning': 'Map circulation, zoning, workstation needs, storage, and visitor flow before buildout.',
    'Brand Strategy': 'Define positioning, audience, promise, tone, and proof points for market clarity.',
    'Logo & Visual Identity Design': 'Create marks, color systems, typography, and usage rules for consistent recognition.',
    'Corporate Profile Design': 'Package company story, services, leadership, proof, and credentials into a polished profile.',
    'Pitch Deck Design': 'Turn investor or client narratives into structured slides with a clear ask.',
    'Business Presentation Design': 'Improve executive slides with stronger hierarchy, charts, copy, and meeting flow.',
    'Website UI/UX Design': 'Design page structure, navigation, forms, and trust cues for easier inquiry paths.',
    'Landing Page Design': 'Build focused offer pages with proof, objections, CTAs, and conversion flow.',
    'Social Media Creative Design': 'Prepare branded post systems, campaign visuals, and repeatable content formats.',
    'Content Strategy': 'Plan topics, channels, formats, and publishing cadence around the buyer journey.',
    'Copywriting': 'Write headlines, service copy, captions, proposals, and web text with a specific offer.',
    'Marketing Campaign Concept': 'Shape campaign angle, audience hook, message ladder, and activation ideas.',
    'Digital Marketing Support': 'Coordinate content, landing pages, tracking notes, and channel updates for active campaigns.',
    'Video Script & Storyboard': 'Plan scenes, voiceover, shot order, and message flow before production.',
    'Motion Graphics Direction': 'Define animation style, timing, transitions, and brand cues for motion assets.',
    'Personal Branding': 'Clarify professional positioning, profile copy, content themes, and credibility assets.',
    'Founder Branding': 'Build founder narrative, thought-leadership topics, profile assets, and speaking points.',
    'LinkedIn Profile / Company Page Optimization': 'Refine LinkedIn headline, about copy, page structure, proof, and content prompts.',
    'Proposal Design': 'Turn sales proposals into clear scope, value, timeline, fee, and decision pages.',
    'Brochure / Flyer / Marketing Material Design': 'Produce print and digital collateral with offer hierarchy and brand consistency.',
    'Course / Training Material Design': 'Design slides, worksheets, handouts, and learning flow for training delivery.',
    'Event / Campaign Creative Support': 'Prepare key visuals, stage copy, signage, social assets, and recap materials.',
    'Creative Consultation': 'Review brand, website, campaign, or pitch materials and identify practical fixes.',
    'Brand Experience Design': 'Connect identity, spaces, digital touchpoints, and service moments into one brand impression.',
  },
};

function normalizeDescription(description: string) {
  return description.trim().replace(/\s+/g, ' ').toLowerCase();
}

function buildServiceDescription(title: string, key: ServiceKey): string {
  const override = serviceDescriptionOverrides[key][title];
  if (override) return override;

  const lower = title.toLowerCase();

  if (lower.includes('automation')) return `${title} support that removes repeat manual work from a named owner workflow.`;
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('kpi')) return `${title} views that connect metrics, owners, and review cadence.`;
  if (lower.includes('document') || lower.includes('policy')) return `${title} organized around templates, approvals, versions, and evidence.`;
  if (lower.includes('brand') || lower.includes('creative')) return `${title} shaped around positioning, proof, and a consistent buyer impression.`;

  const fallback: Record<ServiceKey, string> = {
    it: `${title} configured for secure daily use, clear ownership, and measurable adoption.`,
    consultancy: `${title} support tied to management decisions, finance discipline, and operating control.`,
    legal: `${title} coordinated through clear records, deadlines, evidence, and review steps.`,
    creative: `${title} delivered with sharper messaging, visual consistency, and commercial purpose.`,
  };

  return fallback[key];
}

export function resolveEcosystemServiceDescription(title: string, key: ServiceKey, candidate?: string) {
  const trimmedCandidate = candidate?.trim();
  if (trimmedCandidate && !generatedDescriptionFallbacks.has(normalizeDescription(trimmedCandidate))) {
    return trimmedCandidate;
  }

  return buildServiceDescription(title, key);
}

export const serviceEcosystemCategories: EcosystemCategory[] = serviceCategories.map((category) => ({
  key: category.key,
  label: category.shortTitle,
  eyebrow: category.eyebrow,
  title: category.title,
  description: category.description,
  services: subServices[category.key].map((service) => ({
    title: service.title,
    description: resolveEcosystemServiceDescription(service.title, category.key, service.summary),
  })),
}));
