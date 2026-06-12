export const resourceCategories = [
  'Management',
  'Technology',
  'Finance',
  'Compliance',
  'Legal',
  'Creative',
] as const;

export const resourceTypes = [
  'Guide',
  'Checklist',
  'Framework',
  'Template',
  'Report',
  'Video',
] as const;

export type ResourceWithTags = {
  tagsJson: string;
};

export function createResourceSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function normalizeResourceTags(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  return Array.from(
    new Set(
      values
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 40)),
    ),
  ).slice(0, 12);
}

export function serializeResourceTags(value: unknown) {
  return JSON.stringify(normalizeResourceTags(value));
}

export function parseResourceTags(resource: ResourceWithTags | string | null | undefined) {
  const value = typeof resource === 'string' ? resource : resource?.tagsJson;
  if (!value) return [];

  try {
    return normalizeResourceTags(JSON.parse(value));
  } catch {
    return normalizeResourceTags(value);
  }
}

export function estimateReadingMinutes(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function resourceDestination(resource: { fileUrl: string | null; externalUrl: string | null }) {
  return resource.fileUrl || resource.externalUrl;
}
