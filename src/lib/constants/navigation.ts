import type { LandingIconName } from '@/lib/constants/landing';
import { serviceCategories } from './service-categories';
import { solutions } from './solutions';
import type { ServiceKey } from './theme';

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type SolutionNavItem = {
  title: string;
  description: string;
  badge: string;
  serviceKey: ServiceKey;
  icon: LandingIconName;
  href: string;
};

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services', menu: 'services' },
  { label: 'Events', href: '/#event-management', menu: 'events' },
  { label: 'Solutions', href: '/#solutions', menu: 'solutions' },
  { label: 'Industries', href: '/#industries', menu: 'industries' },
  { label: 'Insights', href: '/insights', menu: 'insights' },
  { label: 'Resources', href: '/resources', menu: 'resources' },
  { label: 'About', href: '/about', menu: 'about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const servicesMenu = serviceCategories.map((category) => ({
  ...category,
  subServices: category.highlights,
}));

export const solutionMenu: SolutionNavItem[] = solutions.slice(0, 8).map((solution) => ({
  title: solution.title,
  description: solution.description,
  badge: solution.badge,
  serviceKey: solution.serviceKey,
  icon: solution.icon,
  href: solution.href,
}));

export const industriesMenu: NavLink[] = [
  { label: 'Startups', href: '/#industries' },
  { label: 'SMEs', href: '/#industries' },
  { label: 'Professional Service Firms', href: '/#industries' },
  { label: 'Real Estate & Construction', href: '/#industries' },
  { label: 'Education & EdTech', href: '/#industries' },
  { label: 'E-commerce & Retail', href: '/#industries' },
  { label: 'Healthcare & Clinics', href: '/#industries' },
  { label: 'Manufacturing & Garments', href: '/#industries' },
  { label: 'Finance, Accounting & Tax Firms', href: '/#industries' },
  { label: 'NGOs / Social Impact Organizations', href: '/#industries' },
];

export const eventManagementMenu: NavLink[] = [
  {
    label: 'Corporate Events',
    href: '/contact?service=corporate-events',
    description: 'Board meetings, annual programs, partner gatherings, and internal company days.',
  },
  {
    label: 'Conferences & Seminars',
    href: '/contact?service=conferences-seminars',
    description: 'Agenda planning, speaker flow, registration, venue work, and day-of coordination.',
  },
  {
    label: 'Product Launches',
    href: '/contact?service=product-launches',
    description: 'Launch planning, guest handling, media moments, stage flow, and post-event assets.',
  },
  {
    label: 'Brand Activations',
    href: '/contact?service=brand-activations',
    description: 'On-ground brand work, campaign booths, lead capture, and field team coordination.',
  },
  {
    label: 'Workshops & Training',
    href: '/contact?service=workshops-training',
    description: 'Small-room sessions, learning materials, trainer support, check-in, and feedback.',
  },
  {
    label: 'Exhibitions & Booths',
    href: '/contact?service=exhibitions-booths',
    description: 'Booth setup, vendor follow-up, signage, visitor handling, and closing reports.',
  },
  {
    label: 'Venue & Vendor Work',
    href: '/contact?service=venue-vendor-work',
    description: 'Shortlisting, negotiation support, run sheets, supplier briefs, and delivery checks.',
  },
  {
    label: 'Event Creative & Media',
    href: '/contact?service=event-creative-media',
    description: 'Invites, social posts, backdrop copy, photo/video briefs, and recap material.',
  },
];

export const insightsMenu: NavLink[] = [
  { label: 'Blog', href: '/insights' },
  { label: 'Research & Articles', href: '/insights' },
  { label: 'Business Guides', href: '/insights' },
  { label: 'Tax & Compliance Notes', href: '/insights' },
  { label: 'Automation & Systems Notes', href: '/insights' },
  { label: 'Case Studies', href: '/case-studies' },
];

export const aboutMenu: NavLink[] = [
  { label: 'Company', href: '/about' },
  { label: 'Mission & Vision', href: '/about#mission' },
  { label: 'Team', href: '/#team' },
  { label: 'Why Inception 23', href: '/#why' },
  { label: 'Our Process', href: '/#process' },
];

export const resourcesMenu: NavLink[] = [
  { label: 'Resource Library', href: '/resources' },
  { label: 'Business Insights', href: '/insights' },
  { label: 'Case Studies', href: '/case-studies' },
];
