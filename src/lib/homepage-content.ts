import { db } from '@/lib/db';

export const homepageSettingKey = 'homepage.content.v1';

export type HomepageSectionKey =
  | 'services'
  | 'ecosystem'
  | 'ai'
  | 'caAdvisory'
  | 'why'
  | 'industries'
  | 'process'
  | 'solutions'
  | 'team'
  | 'technology'
  | 'contact'
  | 'mainServices';

export type HomepageSectionContent = {
  key: HomepageSectionKey;
  label: string;
  enabled: boolean;
  order: number;
  eyebrow: string;
  title: string;
  description: string;
  supportingText?: string;
};

export type HomepageHeroSlide = {
  id: 'it' | 'consultancy' | 'legal' | 'creative';
  label: string;
  eyebrow: string;
  title: string;
  highlight: string;
  copy: string;
  chips: string[];
  visualType?: 'lottie' | 'image' | 'video';
  visualUrl?: string;
  visualAlt?: string;
};

export type HomepageContent = {
  version: 1;
  hero: {
    enabled: boolean;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    footerLabel: string;
    slides: HomepageHeroSlide[];
  };
  sections: HomepageSectionContent[];
};

export const defaultHomepageContent: HomepageContent = {
  version: 1,
  hero: {
    enabled: true,
    primaryCtaLabel: 'Start a confidential brief',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Explore services',
    secondaryCtaHref: '/services',
    footerLabel: 'Advisory / Consulting / Solutions',
    slides: [
      {
        id: 'it',
        label: 'IT & AI Solutions',
        eyebrow: 'Enterprise AI systems',
        title: 'Transform your business with',
        highlight: 'IT, AI & digital innovation',
        copy: 'Production-grade AI automation, custom software, data platforms, and secure web systems built for measurable business outcomes.',
        chips: ['AI Agents', 'Custom Software', 'Data Platforms', 'Cloud & DevOps'],
        visualType: 'lottie',
        visualUrl: '/animations/it-new.json',
        visualAlt: 'IT and AI animated hero visual',
      },
      {
        id: 'consultancy',
        label: 'Management Consultancy',
        eyebrow: 'Operating model advisory',
        title: 'Scale your company with',
        highlight: 'management intelligence',
        copy: 'Strategy, operating cadence, KPI systems, process redesign, and governance structures for leadership teams that need control while scaling.',
        chips: ['Corporate Strategy', 'Operational Scaling', 'Process Design', 'Growth Systems'],
        visualType: 'lottie',
        visualUrl: '/animations/consultancy-new.json',
        visualAlt: 'Management consultancy animated hero visual',
      },
      {
        id: 'legal',
        label: 'Legal Support',
        eyebrow: 'Risk and compliance control',
        title: 'Protect your enterprise with',
        highlight: 'legal precision',
        copy: 'Corporate legal support, compliance readiness, governance documents, and practical risk mitigation frameworks for serious operators.',
        chips: ['Compliance', 'Corporate Law', 'Governance', 'Risk Mitigation'],
        visualType: 'lottie',
        visualUrl: '/animations/legal-new.json',
        visualAlt: 'Legal support animated hero visual',
      },
      {
        id: 'creative',
        label: 'Creative & Others',
        eyebrow: 'Brand and market systems',
        title: 'Shape your market with',
        highlight: 'creative systems',
        copy: 'Brand strategy, visual direction, campaign architecture, premium interface design, and market-facing assets that make complex offers easier to trust.',
        chips: ['Brand Strategy', 'Campaign Systems', 'Digital Experience', 'Creative Direction'],
        visualType: 'lottie',
        visualUrl: '/animations/creative-new.json',
        visualAlt: 'Creative services animated hero visual',
      },
    ],
  },
  sections: [
    { key: 'services', label: 'Our Services', enabled: true, order: 10, eyebrow: 'Our services', title: 'Four advisory pillars, one operating intelligence.', description: 'Inception 23 combines technology, business control, legal support, and market experience into one integrated transformation partner.', supportingText: 'Each pillar has its own color system and delivery discipline, but every engagement stays connected to the same business outcome.' },
    { key: 'ecosystem', label: 'Service Ecosystem', enabled: true, order: 20, eyebrow: 'Service ecosystem', title: 'Every capability grouped for fast strategic clarity.', description: 'Use the category system to see how advisory, systems, documentation, finance, compliance, and creative execution fit together.' },
    { key: 'ai', label: 'AI Solutions', enabled: true, order: 30, eyebrow: 'AI solutions / digital innovation', title: 'Turn AI from demo into business infrastructure.', description: 'We focus on practical AI adoption: workflows, knowledge systems, dashboards, assistants, and software that employees can actually use.', supportingText: 'The goal is not novelty. The goal is faster work, cleaner data, stronger accountability, and safer automation inside the operating model.' },
    { key: 'caAdvisory', label: 'CA Advisory', enabled: true, order: 40, eyebrow: 'CA, tax, VAT, customs & business advisory', title: 'Serious finance control for serious business decisions.', description: 'This pillar is designed for businesses that need accounting discipline, statutory readiness, internal control, performance reporting, and practical advisory support without losing momentum.' },
    { key: 'why', label: 'Why Choose Us', enabled: true, order: 50, eyebrow: 'Why choose Inception 23', title: 'A premium partner for business moves that cannot be treated casually.', description: 'We connect board-level thinking with production-grade implementation across business, technology, legal support, finance, and creative systems.' },
    { key: 'industries', label: 'Industries', enabled: true, order: 60, eyebrow: 'Industries we serve', title: 'Built for operators, founders, and professional teams.', description: 'The same integrated model adapts to different sectors: business control, digital systems, compliance awareness, and market clarity.' },
    { key: 'process', label: 'Process', enabled: true, order: 70, eyebrow: 'Our process', title: 'A disciplined path from uncertainty to operating advantage.', description: 'Every engagement follows a clear rhythm: understand, diagnose, design, implement, improve, and scale.' },
    { key: 'solutions', label: 'Featured Solutions', enabled: true, order: 80, eyebrow: 'Featured solutions', title: 'Image-led systems built around real operating problems.', description: 'Horizontal solution stories with preview media first, then a concise work brief, modules, metrics, and implementation direction.', supportingText: 'Showing two selected systems per service. The full solution library is available on a dedicated page.' },
    { key: 'team', label: 'Team', enabled: true, order: 90, eyebrow: 'Team structure', title: 'A consulting-grade team model for advisory and execution.', description: 'Structured around leadership, specialist advisory, and delivery execution, ready to grow without changing the design system.' },
    { key: 'technology', label: 'Technology Stack', enabled: true, order: 100, eyebrow: 'Technology stack', title: 'Modern tools, business systems, and advisory infrastructure.', description: 'The stack reflects how Inception 23 thinks: software, automation, finance control, compliance documentation, analytics, and market experience working together.' },
    { key: 'mainServices', label: 'Main Services Showcase', enabled: true, order: 105, eyebrow: 'Main services', title: 'Strategic capability, delivered in color.', description: 'A scroll-triggered view of the four Inception 23 operating pillars: technology, management, legal support, and creative execution.' },
    { key: 'contact', label: 'Contact Brief', enabled: true, order: 110, eyebrow: 'Get in touch', title: 'Start your transformation.', description: 'Tell us what you need. Select a main service first, then choose the exact sub-service so we can route your brief properly.' },
  ],
};

export function normalizeHomepageContent(value: unknown): HomepageContent {
  if (!value || typeof value !== 'object') return structuredClone(defaultHomepageContent);
  const input = value as Partial<HomepageContent>;
  const inputSections = Array.isArray(input.sections) ? input.sections : [];
  const inputHero: Partial<HomepageContent['hero']> =
    input.hero && typeof input.hero === 'object' ? input.hero : {};
  const inputSlides: HomepageHeroSlide[] = Array.isArray(inputHero.slides) ? inputHero.slides : [];

  return {
    version: 1,
    hero: {
      ...defaultHomepageContent.hero,
      ...inputHero,
      slides: defaultHomepageContent.hero.slides.map((slide) => ({
        ...slide,
        ...(inputSlides.find((item) => item.id === slide.id) ?? {}),
      })),
    },
    sections: defaultHomepageContent.sections.map((section) => ({
      ...section,
      ...inputSections.find((item) => item?.key === section.key),
    })),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: homepageSettingKey } });
    if (!setting) return structuredClone(defaultHomepageContent);
    return normalizeHomepageContent(JSON.parse(setting.value));
  } catch {
    return structuredClone(defaultHomepageContent);
  }
}
