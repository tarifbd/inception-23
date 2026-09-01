import type { ServiceSlug } from '@/lib/constants/services';
import type { PageMetadataInput } from './metadata';

export const staticPageMetadata = {
  home: {
    title: 'Inception 23 | Business Consulting & Execution Support',
    description:
      'Inception 23 supports growing companies with technology systems, management consulting, finance advisory, legal readiness, event execution, and creative work.',
    path: '/',
    keywords: ['business consulting Bangladesh', 'business solutions Dhaka', 'business execution support'],
  },
  services: {
    title: 'Business Consulting Services in Bangladesh',
    description:
      'Explore Inception 23 services across IT, AI, management consultancy, finance advisory, legal support, event operations, and creative execution.',
    path: '/services',
    keywords: ['business consulting services', 'IT consulting Bangladesh', 'management consultancy Bangladesh'],
  },
  about: {
    title: 'About the Advisory & Execution Team',
    description:
      'Meet the Inception 23 team helping organizations connect strategy, systems, compliance, finance, technology, and market execution with discipline.',
    path: '/about',
    keywords: ['advisory company Bangladesh', 'consulting team Dhaka', 'business execution partner'],
  },
  contact: {
    title: 'Contact for Consulting & Project Support',
    description:
      'Share a confidential brief with Inception 23 for business consulting, technology systems, finance advisory, legal support, events, or creative work.',
    path: '/contact',
    keywords: ['contact business consultant', 'consulting inquiry Bangladesh', 'project support Dhaka'],
  },
  caseStudies: {
    title: 'Business Consulting Case Studies',
    description:
      'Review selected Inception 23 project highlights across technology, management systems, compliance, legal support, finance, and creative execution.',
    path: '/case-studies',
    keywords: ['business consulting case studies', 'technology project examples', 'management consulting results'],
  },
  featuredSolutions: {
    title: 'Featured Business Solution Systems',
    description:
      'Browse practical solution systems for workflow automation, dashboards, legal readiness, operations control, campaign execution, and business growth.',
    path: '/featured-solutions',
    keywords: ['business solution systems', 'workflow automation solutions', 'operations dashboard solutions'],
  },
  insights: {
    title: 'Business Operations & Advisory Insights',
    description:
      'Read practical insights from Inception 23 on technology adoption, operating rhythm, compliance readiness, finance control, and market execution.',
    path: '/insights',
    keywords: ['business operations insights', 'management advisory articles', 'technology consulting insights'],
  },
  resources: {
    title: 'Business Guides, Templates & Frameworks',
    description:
      'Access guides, checklists, templates, and frameworks for automation readiness, KPI control, compliance tracking, branding, and operating decisions.',
    path: '/resources',
    keywords: ['business templates', 'management frameworks', 'compliance checklist', 'automation readiness checklist'],
  },
  privacy: {
    title: 'Privacy Policy for Website Visitors',
    description:
      'Learn how Inception 23 handles website inquiries, contact form submissions, analytics, and visitor information shared through this site.',
    path: '/privacy',
    keywords: ['Inception 23 privacy policy', 'website privacy Bangladesh'],
  },
  terms: {
    title: 'Website Terms of Use',
    description:
      'Read the terms for using the Inception 23 website, public service information, published resources, and inquiry forms.',
    path: '/terms',
    keywords: ['Inception 23 terms', 'website terms of use'],
  },
} as const satisfies Record<string, PageMetadataInput>;

export const servicePageMetadata = {
  'it-ai-solutions': {
    title: 'IT & AI Software Solutions for Business',
    description:
      'Build custom software, automation, dashboards, AI-ready workflows, and secure digital platforms that help teams operate with clearer data.',
    keywords: ['IT solutions Bangladesh', 'AI software solutions', 'workflow automation', 'business dashboards'],
  },
  'management-consultancy': {
    title: 'Management Consultancy for Growth Teams',
    description:
      'Improve strategy, operating models, KPI systems, process ownership, and leadership cadence with practical management consultancy support.',
    keywords: ['management consultancy Bangladesh', 'operating model design', 'KPI framework', 'business strategy consulting'],
  },
  'legal-support': {
    title: 'Legal Support & Compliance Readiness',
    description:
      'Prepare governance documents, compliance workflows, contract review notes, risk trackers, and practical legal support for business continuity.',
    keywords: ['legal support Bangladesh', 'compliance readiness', 'governance documents', 'contract review support'],
  },
  'creative-others': {
    title: 'Creative Strategy & Campaign Systems',
    description:
      'Create brand positioning, campaign assets, content systems, pitch materials, and digital experiences that make complex offers easier to trust.',
    keywords: ['creative strategy Bangladesh', 'brand positioning', 'campaign assets', 'digital experience design'],
  },
} as const satisfies Record<ServiceSlug, Omit<PageMetadataInput, 'path'>>;
