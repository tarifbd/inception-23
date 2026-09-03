export const homepageSettingKey = 'homepage.content.v1';

export type HomepageSectionKey =
  | 'services'
  | 'events'
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

export type HomepageHeroSlideTheme = 'it' | 'consultancy' | 'legal' | 'creative';

export type HomepageHeroSlide = {
  id: string;
  theme?: HomepageHeroSlideTheme;
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
    secondaryCtaLabel: 'View service map',
    secondaryCtaHref: '#services',
    footerLabel: 'Advisory / Consulting / Solutions',
    slides: [
      {
        id: 'it',
        theme: 'it',
        label: 'Technology Solutions',
        eyebrow: 'Software, systems, operations',
        title: 'Build the tools your team',
        highlight: 'actually needs to work better',
        copy: 'Custom software, dashboards, internal tools, and secure web systems for teams moving work out of spreadsheets and chat threads.',
        chips: ['Custom Software', 'Dashboards', 'Internal Tools', 'Cloud Setup'],
        visualType: 'lottie',
        visualUrl: '/animations/consultancy.lottie',
        visualAlt: 'Technology systems animated hero visual',
      },
      {
        id: 'consultancy',
        theme: 'consultancy',
        label: BUSINESS_ADVISORY_SERVICE_NAME,
        eyebrow: 'Business advisory and compliance support',
        title: 'Scale your company with',
        highlight: 'clearer control and finance discipline',
        copy: 'Strategy, KPI reporting, process improvement, and finance controls for owner-led teams that need monthly decisions to become visible.',
        chips: ['Strategy', 'Finance Control', 'Process Design', 'Reporting'],
        visualType: 'lottie',
        visualUrl: '/animations/business-operations.json',
        visualAlt: 'Business advisory and compliances animated hero visual',
      },
      {
        id: 'legal',
        theme: 'legal',
        label: 'Legal Support',
        eyebrow: 'Documents, compliance, coordination',
        title: 'Keep your business ready with',
        highlight: 'careful legal support',
        copy: 'Corporate documentation, compliance coordination, governance records, and risk review support for boards, founders, and finance teams.',
        chips: ['Compliance', 'Documents', 'Governance', 'Risk Review'],
        visualType: 'lottie',
        visualUrl: '/animations/legal.json',
        visualAlt: 'Legal support animated hero visual',
      },
      {
        id: 'creative',
        theme: 'creative',
        label: 'Creative & Others',
        eyebrow: 'Brand, content, presentation',
        title: 'Present your work with',
        highlight: 'clearer design and messaging',
        copy: 'Brand direction, visual identity, campaign planning, interface design, and sales materials that make a buyer path easier to follow.',
        chips: ['Brand Strategy', 'Campaigns', 'Website UX', 'Content'],
        visualType: 'lottie',
        visualUrl: '/animations/creative.lottie',
        visualAlt: 'Creative services animated hero visual',
      },
    ],
  },
  sections: [
    { key: 'services', label: 'Our Services', enabled: true, order: 10, eyebrow: 'Our services', title: 'Four service areas, one practical team.', description: 'For owner-led SMEs, professional firms, and growth teams, Inception 23 connects technology, finance control, legal coordination, and creative delivery in one working plan.', supportingText: 'Each service area has its own focus, but the work stays connected to the same business outcome.' },
    { key: 'events', label: 'Event Management', enabled: true, order: 15, eyebrow: 'Event management', title: 'Corporate events planned with less confusion on the day.', description: 'We help with conferences, launches, workshops, brand activations, exhibitions, vendor coordination, creative material, and live event control.', supportingText: 'The handover is practical: one run sheet, named suppliers, guest-flow notes, creative checks, and closing documentation.' },
    { key: 'ecosystem', label: 'Service Ecosystem', enabled: true, order: 20, eyebrow: 'Service ecosystem', title: 'Every capability grouped for fast strategic clarity.', description: 'Scan 113 service modules across technology, management, legal support, and creative execution to find the right starting point.' },
    { key: 'ai', label: 'Digital Systems', enabled: true, order: 30, eyebrow: 'Digital systems', title: 'Useful software before buzzwords.', description: 'We build workflows, dashboards, knowledge search, internal tools, and software for teams replacing manual updates with assigned systems.', supportingText: 'For SMEs and professional teams, the outcome is fewer repeated handoffs, cleaner records, and owners who can see what changed this week.' },
    { key: 'caAdvisory', label: 'CA Advisory', enabled: true, order: 40, eyebrow: 'CA, tax, VAT, customs & business advisory', title: 'Serious finance control for serious business decisions.', description: 'For founders, SMEs, and finance teams, this pillar covers accounting discipline, statutory readiness, internal control, performance reporting, and advisory support without losing momentum.' },
    { key: 'why', label: 'Why Choose Us', enabled: true, order: 50, eyebrow: 'Why choose Inception 23', title: 'A practical partner for work that needs care.', description: 'From a 24-hour intake standard to documented ownership, we connect business thinking with implementation across systems, finance, legal support, and market work.' },
    { key: 'industries', label: 'Industries', enabled: true, order: 60, eyebrow: 'Industries we serve', title: 'Built for operators, founders, and professional teams.', description: 'The model adapts to startups, SMEs, professional firms, real estate teams, clinics, retailers, manufacturers, and NGOs that need clearer controls.' },
    { key: 'process', label: 'Process', enabled: true, order: 70, eyebrow: 'Our process', title: 'A clear path from problem to working solution.', description: 'Every engagement follows seven steps: discover, diagnose, strategize, design, build, optimize, and scale with accountable owners.' },
    { key: 'solutions', label: 'Case Studies', enabled: true, order: 80, eyebrow: 'Case studies', title: 'Real work examples, grouped by service.', description: 'Preview the selected service track with one featured brief, related examples, handled modules, and the outcome pattern before opening the full archive.', supportingText: 'The homepage shows visible examples first; the full case-study library stays one click away.' },
    { key: 'team', label: 'Team', enabled: true, order: 90, eyebrow: 'Team structure', title: 'A team model for advisory and execution.', description: 'The public roster starts with verified leadership, advisory, and delivery profiles, then grows through reviewed specialist appointments.' },
    { key: 'technology', label: 'Technology Stack', enabled: true, order: 100, eyebrow: 'Tools and systems', title: 'Tools chosen for the work, not the trend.', description: 'Nine delivery groups cover 81 practical capabilities across software, reporting, finance control, compliance documentation, analytics, and market-facing work.' },
    { key: 'mainServices', label: 'Main Services Showcase', enabled: true, order: 105, eyebrow: 'Main services', title: 'What we help with, in plain language.', description: 'A scroll view of the four Inception 23 service areas: technology, management, legal support, and creative execution.' },
    { key: 'contact', label: 'Contact Brief', enabled: true, order: 110, eyebrow: 'Get in touch', title: 'Tell us what you are working on.', description: 'Share the problem, the timeline, and the kind of support you need. We will route the brief to the right service area.' },
  ],
};

export function normalizeHomepageContent(value: unknown): HomepageContent {
  if (!value || typeof value !== 'object') return structuredClone(defaultHomepageContent);
  const input = value as Partial<HomepageContent>;
  const inputSections = Array.isArray(input.sections) ? input.sections : [];
  const inputHero: Partial<HomepageContent['hero']> =
    input.hero && typeof input.hero === 'object' ? input.hero : {};
  const inputSlides = Array.isArray(inputHero.slides)
    ? inputHero.slides.filter((slide): slide is HomepageHeroSlide => Boolean(slide && typeof slide === 'object'))
    : [];
  const validThemes = new Set<HomepageHeroSlideTheme>(['it', 'consultancy', 'legal', 'creative']);
  const slides = inputSlides.length ? inputSlides.map((slide, index) => {
    const inferredTheme = validThemes.has(slide.theme as HomepageHeroSlideTheme)
      ? slide.theme as HomepageHeroSlideTheme
      : validThemes.has(slide.id as HomepageHeroSlideTheme)
        ? slide.id as HomepageHeroSlideTheme
        : 'it';
    const fallback = defaultHomepageContent.hero.slides.find((item) => item.theme === inferredTheme)
      ?? defaultHomepageContent.hero.slides[0];
    return {
      ...fallback,
      ...slide,
      id: String(slide.id || `hero-slide-${index + 1}`),
      theme: inferredTheme,
    };
  }) : structuredClone(defaultHomepageContent.hero.slides);

  return canonicalizeBusinessAdvisoryContent({
    version: 1,
    hero: {
      ...defaultHomepageContent.hero,
      ...inputHero,
      slides,
    },
    sections: defaultHomepageContent.sections.map((section) => ({
      ...section,
      ...inputSections.find((item) => item?.key === section.key),
    })),
  });
}
import { BUSINESS_ADVISORY_SERVICE_NAME, canonicalizeBusinessAdvisoryContent } from '@/lib/service-labels';
