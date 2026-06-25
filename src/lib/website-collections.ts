import { industries } from '@/lib/constants/industries';
import { aiCapabilities, caAdvisoryFocus } from '@/lib/constants/solutions';
import { mainServicesAmbush } from '@/lib/constants/main-services-ambush';
import { mainNav } from '@/lib/constants/navigation';
import { footerCompanyLinks, footerSocialLinks, contactHighlights, footerTrustPoints } from '@/lib/constants/site-content';
import { processSteps } from '@/lib/constants/process';
import { serviceCategories } from '@/lib/constants/service-categories';
import { serviceEcosystemCategories } from '@/lib/constants/service-ecosystem';
import { caseStudies, insights, testimonials } from '@/lib/constants/services';
import { solutions } from '@/lib/constants/solutions';
import { teamMembers } from '@/lib/constants/team';
import { techStackGroups } from '@/lib/constants/tech-stack';
import { whyChooseItems } from '@/lib/constants/why-choose';
import { db } from '@/lib/db';

export type CollectionId =
  | 'navigation'
  | 'insights'
  | 'caseStudies'
  | 'testimonials'
  | 'footerCompanyLinks'
  | 'footerSocialLinks'
  | 'footerTrustPoints'
  | 'footerContactHighlights'
  | 'contactBudgets'
  | 'contactTrustPoints'
  | 'aboutValues'
  | 'aboutExpertise'
  | 'serviceCategories'
  | 'mainServices'
  | 'serviceEcosystem'
  | 'solutions'
  | 'aiCapabilities'
  | 'caAdvisory'
  | 'whyChoose'
  | 'industries'
  | 'team'
  | 'process'
  | 'techStack';
export type CollectionFieldType = 'text' | 'textarea' | 'select' | 'tags' | 'image' | 'video' | 'color';

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
  insights: {
    id: 'insights',
    title: 'Posts / Insights',
    singular: 'Post',
    description: 'Create and manage blog-style insight cards shown on the Insights page.',
    fields: [
      { key: 'title', label: 'Post title', type: 'text' },
      { key: 'slug', label: 'Post slug', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Optional image', type: 'image' },
      { key: 'videoUrl', label: 'Optional video', type: 'video' },
      { key: 'isPublished', label: 'Published', type: 'select', options: ['true', 'false'] },
      { key: 'seoTitle', label: 'SEO title', type: 'text' },
      { key: 'seoDescription', label: 'SEO description', type: 'textarea' },
    ],
  },
  caseStudies: {
    id: 'caseStudies',
    title: 'Case Studies',
    singular: 'Case study',
    description: 'Manage portfolio/case study cards shown on the Case Studies page.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'service', label: 'Service label', type: 'text' },
      { key: 'serviceSlug', label: 'Service slug', type: 'select', options: ['it-ai-solutions', 'management-consultancy', 'legal-support', 'creative-others'] },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'metric', label: 'Metric', type: 'text' },
      { key: 'image', label: 'Optional image', type: 'image' },
      { key: 'isPublished', label: 'Published', type: 'select', options: ['true', 'false'] },
    ],
  },
  testimonials: {
    id: 'testimonials',
    title: 'Testimonials',
    singular: 'Testimonial',
    description: 'Manage testimonial quotes, names, roles, and optional media.',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'image', label: 'Optional image', type: 'image' },
    ],
  },
  footerCompanyLinks: {
    id: 'footerCompanyLinks',
    title: 'Footer Company Links',
    singular: 'Footer link',
    description: 'Edit footer company/navigation links.',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'href', label: 'URL', type: 'text' },
    ],
  },
  footerSocialLinks: {
    id: 'footerSocialLinks',
    title: 'Footer Social Links',
    singular: 'Social link',
    description: 'Edit footer social media links and icons.',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'href', label: 'URL', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['Linkedin', 'Facebook', 'Instagram', 'Youtube', 'Mail'] },
    ],
  },
  footerTrustPoints: {
    id: 'footerTrustPoints',
    title: 'Footer Trust Points',
    singular: 'Trust point',
    description: 'Edit footer trust point cards.',
    fields: [{ key: 'label', label: 'Text', type: 'textarea' }],
  },
  footerContactHighlights: {
    id: 'footerContactHighlights',
    title: 'Footer Contact Highlights',
    singular: 'Contact highlight',
    description: 'Edit footer contact highlight rows.',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'value', label: 'Value', type: 'textarea' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['Clock3', 'MessageCircle', 'Globe2', 'Mail', 'Phone', 'MapPin'] },
    ],
  },
  contactBudgets: {
    id: 'contactBudgets',
    title: 'Contact Budget Options',
    singular: 'Budget option',
    description: 'Edit the budget dropdown options in contact forms.',
    fields: [{ key: 'label', label: 'Budget label', type: 'text' }],
  },
  contactTrustPoints: {
    id: 'contactTrustPoints',
    title: 'Contact Trust Points',
    singular: 'Trust point',
    description: 'Edit why-work-with-us points in the contact section.',
    fields: [{ key: 'label', label: 'Trust point', type: 'textarea' }],
  },
  aboutValues: {
    id: 'aboutValues',
    title: 'About Values',
    singular: 'Value',
    description: 'Edit values shown on the About page.',
    fields: [{ key: 'label', label: 'Value', type: 'text' }],
  },
  aboutExpertise: {
    id: 'aboutExpertise',
    title: 'About Expertise Areas',
    singular: 'Expertise area',
    description: 'Edit expertise bullets shown on the About page.',
    fields: [{ key: 'label', label: 'Expertise area', type: 'textarea' }],
  },
  serviceCategories: {
    id: 'serviceCategories',
    title: 'Service Cards',
    singular: 'Service card',
    description: 'Edit homepage service cards, links, icons, descriptions, and highlight bullets.',
    fields: [
      { key: 'key', label: 'Service key', type: 'select', options: ['it', 'consultancy', 'legal', 'creative'] },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'shortTitle', label: 'Short title', type: 'text' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'icon', label: 'Icon name', type: 'text' },
      { key: 'href', label: 'Destination', type: 'text' },
      { key: 'highlights', label: 'Highlight bullets', type: 'tags' },
    ],
  },
  mainServices: {
    id: 'mainServices',
    title: 'Main Services Showcase',
    singular: 'Main service slide',
    description: 'Control the GSAP main services showcase text, colors, images, links, and bullets.',
    fields: [
      { key: 'key', label: 'Service key', type: 'select', options: ['it', 'consultancy', 'legal', 'creative'] },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'shortTitle', label: 'Short title', type: 'text' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'href', label: 'Destination', type: 'text' },
      { key: 'image', label: 'Showcase image', type: 'image' },
      { key: 'imageAlt', label: 'Image alt text', type: 'text' },
      { key: 'accent', label: 'Accent color', type: 'color' },
      { key: 'softAccent', label: 'Soft accent CSS color', type: 'text' },
      { key: 'proof', label: 'Proof label', type: 'text' },
      { key: 'outcome', label: 'Outcome text', type: 'textarea' },
      { key: 'services', label: 'Service bullets', type: 'tags' },
    ],
  },
  serviceEcosystem: {
    id: 'serviceEcosystem',
    title: 'Service Ecosystem',
    singular: 'Ecosystem group',
    description: 'Edit the capability ecosystem groups and their cards. Cards use Title :: Description per line.',
    fields: [
      { key: 'key', label: 'Service key', type: 'select', options: ['it', 'consultancy', 'legal', 'creative'] },
      { key: 'label', label: 'Tab label', type: 'text' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'servicesText', label: 'Cards: Title :: Description', type: 'tags' },
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
  aiCapabilities: {
    id: 'aiCapabilities',
    title: 'AI Capability Cards',
    singular: 'AI capability',
    description: 'Edit the AI solutions cards shown on the homepage.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'benefit', label: 'Benefit', type: 'text' },
      { key: 'icon', label: 'Icon name', type: 'text' },
    ],
  },
  caAdvisory: {
    id: 'caAdvisory',
    title: 'CA Advisory Focus',
    singular: 'Focus item',
    description: 'Edit the finance, tax, VAT, customs, compliance, and advisory focus list.',
    fields: [
      { key: 'title', label: 'Focus item', type: 'text' },
    ],
  },
  whyChoose: {
    id: 'whyChoose',
    title: 'Why Choose Cards',
    singular: 'Reason card',
    description: 'Edit the why choose us cards, descriptions, and icons.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
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
  techStack: {
    id: 'techStack',
    title: 'Technology Stack',
    singular: 'Technology group',
    description: 'Edit technology stack groups, colors, and tool chips.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tools', label: 'Tools', type: 'tags' },
      { key: 'accent', label: 'Accent color', type: 'color' },
      { key: 'soft', label: 'Soft background CSS color', type: 'text' },
      { key: 'border', label: 'Border color', type: 'color' },
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
  insights: insights.map((item, index) => ({
    id: `insight-${index + 1}`,
    ...item,
    image: '',
    videoUrl: '',
    isPublished: 'true',
    seoTitle: item.title,
    seoDescription: item.summary,
  })),
  caseStudies: caseStudies.map((item, index) => ({ id: `case-study-${index + 1}`, ...item, image: '', isPublished: 'true' })),
  testimonials: testimonials.map((item, index) => ({ id: `testimonial-${index + 1}`, ...item, image: '' })),
  footerCompanyLinks: footerCompanyLinks.map((item, index) => ({ id: `footer-company-${index + 1}`, ...item })),
  footerSocialLinks: footerSocialLinks.map((item, index) => ({ id: `footer-social-${index + 1}`, ...item })),
  footerTrustPoints: footerTrustPoints.map((label, index) => ({ id: `footer-trust-${index + 1}`, label })),
  footerContactHighlights: contactHighlights.map((item, index) => ({ id: `footer-contact-${index + 1}`, ...item })),
  contactBudgets: [
    'Need guidance first',
    'Below BDT 50,000',
    'BDT 50,000 - 150,000',
    'BDT 150,000 - 500,000',
    'BDT 500,000+',
    'Long-term retainer',
  ].map((label, index) => ({ id: `contact-budget-${index + 1}`, label })),
  contactTrustPoints: [
    'Confidential initial consultation and project scoping',
    'Strategy, finance, legal support, technology, and creative thinking under one roof',
    'Clear roadmap before implementation begins',
    'Senior-level review for business-critical decisions',
    'Practical delivery with documentation and ownership clarity',
    'Response within 24 hours during business days',
  ].map((label, index) => ({ id: `contact-trust-${index + 1}`, label })),
  aboutValues: [
    'Clarity before complexity',
    'Execution over theater',
    'Trust through disciplined systems',
    'Design with commercial purpose',
  ].map((label, index) => ({ id: `about-value-${index + 1}`, label })),
  aboutExpertise: [
    'Technology and AI systems',
    'Management consulting and process control',
    'Finance, tax, VAT, customs, and business advisory support',
    'Legal documentation and compliance coordination',
    'Brand, communication, and market experience',
    'Dashboards, operating models, and implementation governance',
  ].map((label, index) => ({ id: `about-expertise-${index + 1}`, label })),
  serviceCategories: serviceCategories.map((item) => ({ id: `service-category-${item.key}`, ...item })) as CollectionRecord[],
  mainServices: mainServicesAmbush.map((item) => ({ id: `main-service-${item.key}`, ...item })) as CollectionRecord[],
  serviceEcosystem: serviceEcosystemCategories.map((category) => ({
    id: `service-ecosystem-${category.key}`,
    ...category,
    servicesText: category.services.map((service) => `${service.title} :: ${service.description}`),
  })) as CollectionRecord[],
  solutions: solutions.map((item) => ({
    ...item,
    videoUrl: '',
  })) as CollectionRecord[],
  aiCapabilities: aiCapabilities.map((item, index) => ({ id: `ai-capability-${index + 1}`, ...item })) as CollectionRecord[],
  caAdvisory: caAdvisoryFocus.map((title, index) => ({ id: `ca-advisory-${index + 1}`, title })),
  whyChoose: whyChooseItems.map((item, index) => ({ id: `why-choose-${index + 1}`, ...item })) as CollectionRecord[],
  industries: industries.map((item) => ({ ...item, image: '' })) as CollectionRecord[],
  team: teamMembers as CollectionRecord[],
  process: processSteps as CollectionRecord[],
  techStack: techStackGroups as CollectionRecord[],
};

export type WebsiteCollections = {
  [Key in CollectionId]: CollectionRecord[];
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

export async function getWebsiteCollections(): Promise<WebsiteCollections> {
  const entries = await Promise.all(
    (Object.keys(collectionDefinitions) as CollectionId[]).map(async (id) => [id, await getWebsiteCollection(id)] as const),
  );
  return Object.fromEntries(entries) as WebsiteCollections;
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
