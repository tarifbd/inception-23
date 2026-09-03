import type { LandingServiceKey } from './theme';

export type LandingTeamCategory = 'management' | 'advisor-consultant' | 'executive';

export type LandingTeamMember = {
  id: string;
  category: LandingTeamCategory;
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  initials: string;
  themeKey: LandingServiceKey;
  linkedinHref: string;
};

export const teamCategories: Array<{ id: LandingTeamCategory; label: string; summary: string }> = [
  {
    id: 'management',
    label: 'Management',
    summary: 'Leadership and operating ownership for strategic delivery.',
  },
  {
    id: 'advisor-consultant',
    label: 'Advisor & Consultant',
    summary: 'Specialist advisory capacity across growth, technology, legal, finance, and market work.',
  },
  {
    id: 'executive',
    label: 'Executive',
    summary: 'Execution support for operations, delivery, coordination, and client experience.',
  },
];
export const landingTeam: LandingTeamMember[] = [
  {
    id: 'khadimul-hasan',
    category: 'management',
    name: 'Khadimul Hasan',
    role: 'Management Lead',
    expertise: ['Strategy', 'Governance', 'Growth'],
    bio: 'Guides management discipline, operating priorities, and strategic accountability.',
    initials: 'KH',
    themeKey: 'consultancy',
    linkedinHref: '#',
  },
  {
    id: 'mahmudul-hasan',
    category: 'management',
    name: 'Mahmudul Hasan',
    role: 'Technology Management',
    expertise: ['Software', 'Systems', 'Automation'],
    bio: 'Shapes technical delivery, internal tools, reporting systems, and practical automation.',
    initials: 'MH',
    themeKey: 'it',
    linkedinHref: '#',
  },
  ...Array.from({ length: 3 }, (_, index) => ({
    id: `management-seat-${index + 4}`,
    category: 'management' as const,
    name: `Management Seat ${String(index + 4).padStart(2, '0')}`,
    role: 'Management Seat',
    expertise: ['Leadership', 'Delivery', 'Control'],
    bio: 'Open leadership capacity for management expansion.',
    initials: `M${index + 4}`,
    themeKey: 'consultancy' as const,
    linkedinHref: '#',
  })),
  {
    id: 'km-khairul-hasan-arif',
    category: 'advisor-consultant',
    name: 'K M Khairul Hasan Arif',
    role: 'Advocate, Supreme Court',
    expertise: ['LLB', 'M. Com (Mgt.)', 'MBA (FIRM)', 'PGDHRM'],
    bio: 'Founder & Head of Chamber, Advocvice.',
    initials: 'KA',
    themeKey: 'legal',
    linkedinHref: '#',
  },
  {
    id: 'mohammad-sirajus-salekin-fca',
    category: 'advisor-consultant',
    name: 'Mohammad Sirajus Salekin FCA',
    role: 'Independent Reviewer',
    expertise: ['BBA & MBA (DU)'],
    bio: 'Proprietor & Principal, M. S. Salekin & Co.',
    initials: 'MS',
    themeKey: 'consultancy',
    linkedinHref: '#',
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `advisor-consultant-seat-${index + 2}`,
    category: 'advisor-consultant' as const,
    name: index < 4 ? `Advisor Seat ${String(index + 2).padStart(2, '0')}` : `Consultant Seat ${String(index + 2).padStart(2, '0')}`,
    role: index < 4 ? 'Advisor Seat' : 'Consultant Seat',
    expertise: ['Advisory', 'Systems', 'Execution'],
    bio: 'Open specialist capacity for advisory and consulting assignments.',
    initials: `AC${index + 2}`,
    themeKey: (index % 4 === 0 ? 'it' : index % 4 === 1 ? 'consultancy' : index % 4 === 2 ? 'legal' : 'creative') as LandingServiceKey,
    linkedinHref: '#',
  })),
  ...Array.from({ length: 10 }, (_, index) => ({
    id: `executive-seat-${index + 1}`,
    category: 'executive' as const,
    name: `Executive Seat ${String(index + 1).padStart(2, '0')}`,
    role: 'Executive',
    expertise: ['Coordination', 'Delivery', 'Client Support'],
    bio: 'Execution capacity for project coordination, client communication, and delivery operations.',
    initials: `E${index + 1}`,
    themeKey: (index % 4 === 0 ? 'it' : index % 4 === 1 ? 'consultancy' : index % 4 === 2 ? 'legal' : 'creative') as LandingServiceKey,
    linkedinHref: '#',
  })),
];
