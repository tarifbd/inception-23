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

function buildServiceDescription(title: string, key: ServiceKey): string {
  const lower = title.toLowerCase();

  if (lower.includes('ai') || lower.includes('rag')) return 'Practical intelligence workflows designed for safer, faster operational decisions.';
  if (lower.includes('automation')) return 'Automated handoffs and repeatable workflows that reduce manual coordination.';
  if (lower.includes('crm') || lower.includes('erp')) return 'Connected operating tools for teams, clients, data, and management visibility.';
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('kpi')) return 'Decision-ready reporting systems with cleaner metrics and ownership.';
  if (lower.includes('tax')) return 'Structured tax advisory support for planning, documentation, and compliance readiness.';
  if (lower.includes('vat') || lower.includes('customs') || lower.includes('import') || lower.includes('export')) return 'Compliance-focused support for statutory processes, evidence, and review control.';
  if (lower.includes('account') || lower.includes('financial') || lower.includes('cash') || lower.includes('budget')) return 'Finance discipline for reporting, control, forecasting, and management decisions.';
  if (lower.includes('audit') || lower.includes('risk') || lower.includes('governance')) return 'Review frameworks that improve control, accountability, and leadership confidence.';
  if (lower.includes('contract') || lower.includes('agreement') || lower.includes('legal')) return 'Careful documentation support for business continuity and risk coordination.';
  if (lower.includes('rjsc') || lower.includes('license') || lower.includes('formation')) return 'Business setup and regulatory documentation support with clearer process control.';
  if (lower.includes('policy') || lower.includes('compliance') || lower.includes('resolution') || lower.includes('minutes')) return 'Governance documentation support for records, policies, filings, and approvals.';
  if (lower.includes('brand') || lower.includes('identity') || lower.includes('logo')) return 'Premium brand systems that clarify positioning, recognition, and market trust.';
  if (lower.includes('pitch') || lower.includes('presentation') || lower.includes('proposal')) return 'Investor and client-facing materials with sharper narrative and visual hierarchy.';
  if (lower.includes('website') || lower.includes('ui') || lower.includes('landing')) return 'Digital experiences shaped for clarity, credibility, and conversion.';
  if (lower.includes('content') || lower.includes('copy') || lower.includes('campaign')) return 'Strategic communication assets aligned with audience, offer, and channel.';

  const fallback: Record<ServiceKey, string> = {
    it: 'Digital capability designed around secure implementation and measurable business use.',
    consultancy: 'Advisory support that strengthens operating control, finance discipline, and growth decisions.',
    legal: 'Documentation and compliance support for clearer business risk management.',
    creative: 'Creative execution that improves brand clarity, communication, and buyer confidence.',
  };

  return fallback[key];
}

export const serviceEcosystemCategories: EcosystemCategory[] = serviceCategories.map((category) => ({
  key: category.key,
  label: category.shortTitle,
  eyebrow: category.eyebrow,
  title: category.title,
  description: category.description,
  services: subServices[category.key].map((service) => ({
    title: service.title,
    description: service.summary ?? buildServiceDescription(service.title, category.key),
  })),
}));

