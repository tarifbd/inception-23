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
  imagePosition?: string;
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
    role: 'Managing Partner & Co-founder',
    expertise: ['BBA, MBA (DU)', 'CA (Partly qualified)', 'ITP, Member of Dhaka Taxes Bar'],
    bio: 'Business, finance, tax, and management advisory leadership grounded in practical delivery and accountable decision-making.',
    initials: 'KH',
    themeKey: 'consultancy',
    linkedinHref: '#',
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/khadimul-hasan.webp',
    imageFit: 'cover',
  },
  {
    id: 'mahmudul-hasan',
    category: 'management',
    name: 'Mahmudul Hasan',
    role: 'CTO & Co-founder',
    expertise: ['EEE, BUET', 'MBA, IBA (DU)'],
    bio: 'Leads technology strategy, software delivery, digital systems, and practical automation across the firm.',
    initials: 'MH',
    themeKey: 'it',
    linkedinHref: '#',
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/mahmudul-hasan.webp',
    imageFit: 'cover',
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
    imageSrc: '/team/km-khairul-hasan-arif.webp',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    id: 'md-humayon-kabir-porosh',
    category: 'associates',
    name: 'MD Humayon Kabir Porosh',
    role: 'Associate, Marketing & Operation',
    expertise: [],
    bio: 'Supports marketing and operational work across client and internal delivery.',
    initials: 'HP',
    themeKey: 'creative',
    linkedinHref: '#',
    emailHref: 'mailto:hello@inception23.com',
    githubHref: '#',
    imageSrc: '/team/md-humayon-kabir-porosh.webp',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
];
