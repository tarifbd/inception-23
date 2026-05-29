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
    summary: 'Specialist advisory capacity across growth, technology, legal, and market systems.',
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
    id: 'gaizi-faisal',
    category: 'management',
    name: 'Gaizi Faisal',
    role: 'Management Partner',
    expertise: ['Risk', 'Legal', 'Operations'],
    bio: 'Connects business decisions with compliance, risk control, and operating continuity.',
    initials: 'GF',
    themeKey: 'legal',
    linkedinHref: '#',
  },
  {
    id: 'mahmudul-hasan',
    category: 'management',
    name: 'Mahmudul Hasan',
    role: 'Technology Management',
    expertise: ['AI Systems', 'Software', 'Automation'],
    bio: 'Shapes technical delivery, AI architecture, and scalable digital operating systems.',
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
    bio: 'Reserved leadership capacity for future management expansion.',
    initials: `M${index + 4}`,
    themeKey: 'consultancy' as const,
    linkedinHref: '#',
  })),
  {
    id: 'km-khairul-hasan-arif',
    category: 'advisor-consultant',
    name: 'K M Khairul Hasan Arif',
    role: 'Strategic Advisor',
    expertise: ['Strategy', 'Digital Growth', 'Advisory'],
    bio: 'Advises on market direction, strategic positioning, and transformation priorities.',
    initials: 'KA',
    themeKey: 'consultancy',
    linkedinHref: '#',
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `advisor-consultant-seat-${index + 2}`,
    category: 'advisor-consultant' as const,
    name: index < 4 ? `Advisor Seat ${String(index + 2).padStart(2, '0')}` : `Consultant Seat ${String(index + 2).padStart(2, '0')}`,
    role: index < 4 ? 'Advisor Seat' : 'Consultant Seat',
    expertise: ['Advisory', 'Systems', 'Execution'],
    bio: 'Reserved specialist capacity for advisory and consulting assignments.',
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
