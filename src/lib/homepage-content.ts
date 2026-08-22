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
    secondaryCtaLabel: 'Explore services',
    secondaryCtaHref: '/services',
    footerLabel: 'Advisory / Consulting / Solutions',
    slides: [
      {
        id: 'it',
        theme: 'it',
        label: 'Technology Solutions',
        eyebrow: 'Software, systems, operations',
        title: 'Build the tools your team',
        highlight: 'actually needs to work better',
        copy: 'Custom software, data dashboards, internal tools, and secure web systems shaped around how your business already works.',
        chips: ['Custom Software', 'Dashboards', 'Internal Tools', 'Cloud Setup'],
        visualType: 'lottie',
        visualUrl: '/animations/it-new.json',
        visualAlt: 'Technology systems animated hero visual',
      },
      {
        id: 'consultancy',
        theme: 'consultancy',
        label: 'Management Consultancy',
        eyebrow: 'Practical management support',
        title: 'Scale your company with',
        highlight: 'clearer control and finance discipline',
        copy: 'Strategy, reporting rhythm, KPI systems, process improvement, finance controls, and practical support for teams that need clarity while growing.',
        chips: ['Strategy', 'Finance Control', 'Process Design', 'Reporting'],
        visualType: 'lottie',
        visualUrl: '/animations/consultancy-new.json',
        visualAlt: 'Management consultancy animated hero visual',
      },
      {
        id: 'legal',
        theme: 'legal',
        label: 'Legal Support',
        eyebrow: 'Documents, compliance, coordination',
        title: 'Keep your business ready with',
        highlight: 'careful legal support',
        copy: 'Corporate documentation, compliance coordination, governance records, and practical risk review support for day-to-day business decisions.',
        chips: ['Compliance', 'Documents', 'Governance', 'Risk Review'],
        visualType: 'lottie',
        visualUrl: '/animations/legal-new.json',
        visualAlt: 'Legal support animated hero visual',
      },
      {
        id: 'creative',
        theme: 'creative',
        label: 'Creative & Others',
        eyebrow: 'Brand, content, presentation',
        title: 'Present your work with',
        highlight: 'clearer design and messaging',
        copy: 'Brand direction, visual identity, campaign planning, interface design, and client-facing materials that make your offer easier to understand.',
        chips: ['Brand Strategy', 'Campaigns', 'Website UX', 'Content'],
        visualType: 'lottie',
        visualUrl: '/animations/creative-new.json',
        visualAlt: 'Creative services animated hero visual',
      },
    ],
  },
  sections: [
    { key: 'services', label: 'Our Services', enabled: true, order: 10, eyebrow: 'Our services', title: 'Four service areas, one practical team.', description: 'Inception 23 combines technology, management support, legal coordination, finance control, and creative work for companies that want clearer execution.', supportingText: 'Each service area has its own focus, but the work stays connected to the same business outcome.' },
    { key: 'events', label: 'Event Management', enabled: true, order: 15, eyebrow: 'Event management', title: 'Corporate events planned with less confusion on the day.', description: 'We help with conferences, launches, workshops, brand activations, exhibitions, vendor coordination, creative material, and live event control.', supportingText: 'The work is practical: clear responsibilities, a working run sheet, supplier follow-up, guest flow, and proper closing documentation.' },
    { key: 'ecosystem', label: 'Service Ecosystem', enabled: true, order: 20, eyebrow: 'Service ecosystem', title: 'Every capability grouped for fast strategic clarity.', description: 'Use the category system to see how advisory, systems, documentation, finance, compliance, and creative execution fit together.' },
    { key: 'ai', label: 'Digital Systems', enabled: true, order: 30, eyebrow: 'Digital systems', title: 'Useful software before buzzwords.', description: 'We focus on workflows, knowledge systems, dashboards, internal tools, and software that employees can actually use.', supportingText: 'The goal is simple: faster work, cleaner data, clearer responsibility, and fewer manual handoffs.' },
    { key: 'caAdvisory', label: 'CA Advisory', enabled: true, order: 40, eyebrow: 'CA, tax, VAT, customs & business advisory', title: 'Serious finance control for serious business decisions.', description: 'This pillar is designed for businesses that need accounting discipline, statutory readiness, internal control, performance reporting, and practical advisory support without losing momentum.' },
    { key: 'why', label: 'Why Choose Us', enabled: true, order: 50, eyebrow: 'Why choose Inception 23', title: 'A practical partner for work that needs care.', description: 'We connect business thinking with hands-on implementation across technology, legal support, finance, operations, and creative work.' },
    { key: 'industries', label: 'Industries', enabled: true, order: 60, eyebrow: 'Industries we serve', title: 'Built for operators, founders, and professional teams.', description: 'The same integrated model adapts to different sectors: business control, digital systems, compliance awareness, and market clarity.' },
    { key: 'process', label: 'Process', enabled: true, order: 70, eyebrow: 'Our process', title: 'A clear path from problem to working solution.', description: 'Every engagement follows a simple rhythm: understand, diagnose, design, implement, improve, and support.' },
    { key: 'solutions', label: 'Featured Solutions', enabled: true, order: 80, eyebrow: 'Featured work areas', title: 'Examples built around real operating problems.', description: 'A concise view of common work briefs, service modules, and the kind of outcomes clients usually need.', supportingText: 'Showing selected examples per service. The full solution library is available on a dedicated page.' },
    { key: 'team', label: 'Team', enabled: true, order: 90, eyebrow: 'Team structure', title: 'A team model for advisory and execution.', description: 'Structured around leadership, specialist advisory, and delivery execution, with room for steady growth.' },
    { key: 'technology', label: 'Technology Stack', enabled: true, order: 100, eyebrow: 'Tools and systems', title: 'Tools chosen for the work, not the trend.', description: 'The stack reflects practical delivery: software, reporting, finance control, compliance documentation, analytics, and market-facing work.' },
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

  return {
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
  };
}
