import { industries } from '@/lib/constants/industries';
import { mainNav } from '@/lib/constants/navigation';
import { processSteps } from '@/lib/constants/process';
import { solutions } from '@/lib/constants/solutions';
import { teamMembers } from '@/lib/constants/team';
import { db } from '@/lib/db';

export type CollectionId = 'navigation' | 'solutions' | 'industries' | 'team' | 'process';
export type CollectionFieldType = 'text' | 'textarea' | 'select' | 'tags' | 'image' | 'video';

export type CollectionField = {
  key: string;
  label: string;
  type: CollectionFieldType;
  options?: string[];
  placeholder?: string;
};

export type CollectionDefinition = {
  id: CollectionId;
  title: string;
  singular: string;
  description: string;
  fields: CollectionField[];
};

export type CollectionRecord = Record<string, unknown> & { id: string };

export const collectionDefinitions: Record<CollectionId, CollectionDefinition> = {
  navigation: {
    id: 'navigation',
    title: 'Navigation',
    singular: 'Navigation item',
    description: 'Control the main website menu labels, destinations, order, and dropdown behavior.',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'href', label: 'Destination', type: 'text', placeholder: '/about or #team' },
      { key: 'menu', label: 'Dropdown menu', type: 'select', options: ['', 'services', 'solutions', 'industries', 'insights', 'about'] },
    ],
  },
  solutions: {
    id: 'solutions',
    title: 'Featured Solutions',
    singular: 'Solution',
    description: 'Edit solution stories, service grouping, modules, outcome, imagery, links, and video references.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'serviceKey', label: 'Service group', type: 'select', options: ['it', 'consultancy', 'legal', 'creative'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'challenge', label: 'Challenge', type: 'textarea' },
      { key: 'modules', label: 'Modules', type: 'tags' },
      { key: 'outcome', label: 'Outcome', type: 'textarea' },
      { key: 'image', label: 'Preview image', type: 'image' },
      { key: 'videoUrl', label: 'YouTube / Vimeo URL', type: 'video' },
      { key: 'href', label: 'CTA destination', type: 'text' },
      { key: 'icon', label: 'Icon name', type: 'text' },
    ],
  },
  industries: {
    id: 'industries',
    title: 'Industries',
    singular: 'Industry',
    description: 'Manage the industries displayed on the homepage and their value statements.',
    fields: [
      { key: 'title', label: 'Industry name', type: 'text' },
      { key: 'value', label: 'Value statement', type: 'textarea' },
      { key: 'icon', label: 'Icon name', type: 'text' },
      { key: 'image', label: 'Optional image', type: 'image' },
    ],
  },
  team: {
    id: 'team',
    title: 'Team',
    singular: 'Team member',
    description: 'Manage team profiles, groups, expertise, contact links, biography, and profile imagery.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'category', label: 'Team group', type: 'select', options: ['management', 'advisor-consultant', 'executive'] },
      { key: 'bio', label: 'Biography', type: 'textarea' },
      { key: 'expertise', label: 'Expertise', type: 'tags' },
      { key: 'initials', label: 'Initials', type: 'text' },
      { key: 'themeKey', label: 'Color theme', type: 'select', options: ['it', 'consultancy', 'legal', 'creative'] },
      { key: 'imageSrc', label: 'Profile image', type: 'image' },
      { key: 'linkedinHref', label: 'LinkedIn URL', type: 'text' },
      { key: 'emailHref', label: 'Email link', type: 'text' },
      { key: 'githubHref', label: 'GitHub URL', type: 'text' },
    ],
  },
  process: {
    id: 'process',
    title: 'Process',
    singular: 'Process step',
    description: 'Customize the homepage delivery process, descriptions, numbering, and icons.',
    fields: [
      { key: 'number', label: 'Step number', type: 'text' },
      { key: 'title', label: 'Step title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'icon', label: 'Icon name', type: 'text' },
    ],
  },
};

const defaults: Record<CollectionId, CollectionRecord[]> = {
  navigation: mainNav.map((item, index) => ({
    id: `navigation-${index + 1}`,
    label: item.label,
    href: item.href,
    menu: 'menu' in item ? item.menu : '',
  })),
  solutions: solutions.map((item) => ({
    ...item,
    videoUrl: '',
  })) as CollectionRecord[],
  industries: industries.map((item) => ({ ...item, image: '' })) as CollectionRecord[],
  team: teamMembers as CollectionRecord[],
  process: processSteps as CollectionRecord[],
};

export function isCollectionId(value: string): value is CollectionId {
  return value in collectionDefinitions;
}

export function getDefaultCollection(id: CollectionId) {
  return structuredClone(defaults[id]);
}

export async function getWebsiteCollection<T extends CollectionRecord = CollectionRecord>(id: CollectionId): Promise<T[]> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: `website.collection.${id}.v1` } });
    if (!setting) return getDefaultCollection(id) as T[];
    const parsed = JSON.parse(setting.value);
    return Array.isArray(parsed) ? parsed as T[] : getDefaultCollection(id) as T[];
  } catch {
    return getDefaultCollection(id) as T[];
  }
}

export async function saveWebsiteCollection(id: CollectionId, records: CollectionRecord[]) {
  const cleanRecords = records.map((record, index) => ({
    ...record,
    id: String(record.id || `${id}-${crypto.randomUUID()}`),
    order: index,
  }));
  await db.siteSetting.upsert({
    where: { key: `website.collection.${id}.v1` },
    update: { value: JSON.stringify(cleanRecords), group: 'website-content' },
    create: { key: `website.collection.${id}.v1`, value: JSON.stringify(cleanRecords), group: 'website-content' },
  });
  return cleanRecords;
}
