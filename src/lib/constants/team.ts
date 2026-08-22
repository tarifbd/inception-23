import type { ServiceKey } from './theme';

export type TeamCategory = 'management' | 'advisor-consultant' | 'associates';

export type TeamMember = {
  id: string;
  category: TeamCategory;
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  initials: string;
  themeKey: ServiceKey;
  linkedinHref: string;
  emailHref: string;
  githubHref: string;
  imageSrc: string;
  portfolioHref?: string;
  imageFit?: 'cover' | 'contain';
  isPending?: boolean;
};

export const teamCategories: Array<{ id: TeamCategory; label: string; summary: string; themeKey: ServiceKey }> = [
  { id: 'management', label: 'Management', summary: 'Leadership ownership for strategy, governance, finance, and delivery control.', themeKey: 'consultancy' },
  { id: 'advisor-consultant', label: 'Advisory & Consultant', summary: 'Specialist support across business, technology, legal, finance, and market work.', themeKey: 'legal' },
  { id: 'associates', label: 'Associates', summary: 'Focused support for research, coordination, documentation, and accountable project delivery.', themeKey: 'it' },
];
export const teamMembers: TeamMember[] = [
  {
    id: 'khadimul-hasan',
    category: 'management',
    name: 'K M Khadimul Hasan',
    role: 'Managing Partner & Founder',
    expertise: ['Strategy', 'Governance', 'Growth'],
    bio: 'Guides management discipline, operating priorities, and strategic accountability.',
    initials: 'KH',
    themeKey: 'consultancy',
    linkedinHref: '#',
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/team-management.jpg',
    imageFit: 'cover',
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
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/team-technology.png',
    imageFit: 'contain',
  },
  {
    id: 'km-khairul-hasan-arif',
    category: 'advisor-consultant',
    name: 'K M Khairul Hasan Arif',
    role: 'Strategic Advisor',
    expertise: ['Strategy', 'Growth', 'Advisory'],
    bio: 'Advises on market direction, strategic positioning, and execution priorities.',
    initials: 'KA',
    themeKey: 'consultancy',
    linkedinHref: '#',
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/team-advisor.png',
    imageFit: 'contain',
  },
];
