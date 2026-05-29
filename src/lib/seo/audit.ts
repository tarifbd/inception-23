import { parseJsonField } from '@/lib/api/http';

export type SeoAuditInput = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  slug?: string | null;
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  schemaJson?: string | null;
  imageAlts?: Array<{ altText?: string | null }>;
  internalLinks?: Array<unknown>;
  contentText?: string | null;
};

export type SeoAuditResult = {
  score: number;
  status: 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR';
  issues: Array<{ field: string; message: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  suggestions: string[];
};

function add(points: number, condition: boolean, result: { score: number }, issues: SeoAuditResult['issues'], field: string, message: string, priority: 'HIGH' | 'MEDIUM' | 'LOW') {
  if (condition) {
    result.score += points;
  } else {
    issues.push({ field, message, priority });
  }
}

export function auditSeo(input: SeoAuditInput): SeoAuditResult {
  const issues: SeoAuditResult['issues'] = [];
  const suggestions: string[] = [];
  const state = { score: 0 };
  const title = input.seoTitle?.trim() || '';
  const description = input.metaDescription?.trim() || '';
  const keyword = input.focusKeyword?.trim().toLowerCase() || '';
  const slug = input.slug?.trim() || '';
  const schema = parseJsonField<Record<string, unknown> | null>(input.schemaJson, null);
  const hasAlt = (input.imageAlts || []).some((item) => Boolean(item.altText?.trim()));
  const hasInternalLink = (input.internalLinks || []).length > 0;

  add(10, title.length > 0, state, issues, 'seoTitle', 'SEO title is missing.', 'HIGH');
  add(8, title.length >= 30 && title.length <= 65, state, issues, 'seoTitle', 'SEO title should usually be 30-65 characters.', 'MEDIUM');
  add(10, description.length > 0, state, issues, 'metaDescription', 'Meta description is missing.', 'HIGH');
  add(8, description.length >= 80 && description.length <= 160, state, issues, 'metaDescription', 'Meta description should usually be 80-160 characters.', 'MEDIUM');
  add(8, keyword.length > 0, state, issues, 'focusKeyword', 'Focus keyword is missing.', 'HIGH');
  add(8, keyword.length > 0 && title.toLowerCase().includes(keyword), state, issues, 'seoTitle', 'Focus keyword should appear in the SEO title.', 'MEDIUM');
  add(8, keyword.length > 0 && description.toLowerCase().includes(keyword), state, issues, 'metaDescription', 'Focus keyword should appear in the meta description.', 'MEDIUM');
  add(6, /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), state, issues, 'slug', 'Slug should be lowercase, clean, and hyphenated.', 'MEDIUM');
  add(6, hasAlt, state, issues, 'imageAlt', 'At least one image alt text should be configured.', 'LOW');
  add(6, Boolean(input.ogTitle && input.ogDescription && input.ogImage), state, issues, 'openGraph', 'Open Graph title, description, and image are recommended.', 'LOW');
  add(8, Boolean(schema), state, issues, 'schemaJson', 'Schema markup is missing or invalid.', 'MEDIUM');
  add(6, Boolean(input.canonicalUrl || (input.robotsIndex !== false && input.robotsFollow !== false)), state, issues, 'canonicalRobots', 'Canonical URL or robots configuration should be set.', 'LOW');
  add(4, hasInternalLink, state, issues, 'internalLinks', 'Add internal links for stronger discoverability.', 'LOW');
  add(4, (input.contentText || '').length >= 250, state, issues, 'content', 'Page content should be more substantial.', 'LOW');

  if (title.length > 65) suggestions.push('Shorten the SEO title for better SERP display.');
  if (description.length > 160) suggestions.push('Shorten the meta description to avoid truncation.');
  if (!schema) suggestions.push('Add JSON-LD schema such as Product, Organization, Website, Article, FAQ, or Breadcrumb.');
  if (!hasAlt) suggestions.push('Add descriptive alt text for product and content images.');
  if (!hasInternalLink) suggestions.push('Add contextual internal link suggestions.');

  const score = Math.min(100, state.score);
  const status = score >= 85 ? 'GOOD' : score >= 60 ? 'NEEDS_IMPROVEMENT' : 'POOR';
  return { score, status, issues, suggestions };
}
