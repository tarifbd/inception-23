export const BUSINESS_ADVISORY_SERVICE_NAME = 'Business Advisory & Compliances';

const legacyBusinessAdvisoryLabels = new Set([
  'Management Consultancy & Finance Advisory',
  'Management Consultancy',
  'Management & Finance',
]);

export function canonicalizeBusinessAdvisoryLabel(value: string) {
  return legacyBusinessAdvisoryLabels.has(value.trim()) ? BUSINESS_ADVISORY_SERVICE_NAME : value;
}

export function canonicalizeBusinessAdvisoryContent<T>(value: T): T {
  if (typeof value === 'string') return canonicalizeBusinessAdvisoryLabel(value) as T;
  if (Array.isArray(value)) return value.map(canonicalizeBusinessAdvisoryContent) as T;
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, canonicalizeBusinessAdvisoryContent(item)]),
  ) as T;
}
