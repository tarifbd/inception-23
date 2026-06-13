'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CloudCog,
  Code2,
  DatabaseZap,
  FileSearch,
  Globe2,
  Layers3,
  LineChart,
  LockKeyhole,
  Megaphone,
  MessageSquareText,
  Network,
  Palette,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { serviceCategories } from '@/lib/constants/service-categories';
import type { ServiceDefinition } from '@/lib/constants/services';
import { solutions as packagedSolutions } from '@/lib/constants/solutions';
import { subServices } from '@/lib/constants/sub-services';

type Props = {
  service: Pick<ServiceDefinition, 'shortId'>;
};

type Item = {
  title: string;
  body: string;
  icon: LucideIcon;
  meta?: string;
  bullets?: string[];
};

const palette = {
  it: {
    text: 'text-cyan-700',
    textSoft: 'text-cyan-600',
    badge: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    icon: 'bg-cyan-600 text-white shadow-cyan-600/25',
    soft: 'bg-cyan-50',
    border: 'border-cyan-200/80',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    ring: 'group-hover:ring-cyan-500/25',
    glow: 'bg-cyan-500/10',
    button: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/25',
  },
  consultancy: {
    text: 'text-emerald-700',
    textSoft: 'text-emerald-600',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: 'bg-emerald-600 text-white shadow-emerald-600/25',
    soft: 'bg-emerald-50',
    border: 'border-emerald-200/80',
    gradient: 'from-emerald-500 via-teal-600 to-slate-950',
    ring: 'group-hover:ring-emerald-500/25',
    glow: 'bg-emerald-500/10',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
  },
  legal: {
    text: 'text-violet-700',
    textSoft: 'text-violet-600',
    badge: 'border-violet-200 bg-violet-50 text-violet-700',
    icon: 'bg-violet-700 text-white shadow-violet-700/25',
    soft: 'bg-violet-50',
    border: 'border-violet-200/80',
    gradient: 'from-violet-700 via-purple-700 to-amber-500',
    ring: 'group-hover:ring-violet-500/25',
    glow: 'bg-violet-500/10',
    button: 'bg-violet-700 hover:bg-violet-600 text-white shadow-violet-700/25',
  },
  creative: {
    text: 'text-orange-700',
    textSoft: 'text-orange-600',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    icon: 'bg-orange-600 text-white shadow-orange-600/25',
    soft: 'bg-orange-50',
    border: 'border-orange-200/80',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    ring: 'group-hover:ring-orange-500/25',
    glow: 'bg-orange-500/10',
    button: 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/25',
  },
};

const aiSolutions: Item[] = [
  { title: 'AI Chatbots & Virtual Assistants', body: 'Support, sales, and internal knowledge assistants with governed response behavior.', icon: MessageSquareText, bullets: ['Lead capture', 'Knowledge search', 'Support triage'] },
  { title: 'AI Agents & Workflow Automation', body: 'Agents that coordinate tasks across tools, data, teams, and documents.', icon: Bot, bullets: ['Task routing', 'Data entry', 'Status updates'] },
  { title: 'Generative AI Integration', body: 'AI features embedded into products, portals, dashboards, and internal systems.', icon: Sparkles, bullets: ['Content generation', 'Document drafting', 'Decision support'] },
  { title: 'Document AI & Knowledge Base Chatbots', body: 'Search, summarize, classify, and ask questions across policies, contracts, and files.', icon: FileSearch, bullets: ['OCR pipelines', 'RAG search', 'Secure sources'] },
  { title: 'AI-Powered CRM & Customer Support', body: 'Smarter follow-ups, ticket summaries, call notes, and customer intelligence.', icon: BriefcaseBusiness, bullets: ['Ticket scoring', 'Call notes', 'Pipeline nudges'] },
  { title: 'Predictive Analytics', body: 'Forecast demand, risk, revenue, and operational patterns from business data.', icon: LineChart, bullets: ['Risk signals', 'Trend analysis', 'Executive reporting'] },
  { title: 'Computer Vision Solutions', body: 'Image and video intelligence for inspection, detection, verification, and monitoring.', icon: Network, bullets: ['Object detection', 'Quality checks', 'Visual search'] },
  { title: 'Natural Language Processing', body: 'Text intelligence for classification, extraction, search, translation, and sentiment.', icon: DatabaseZap, bullets: ['Entity extraction', 'Sentiment', 'Semantic search'] },
  { title: 'Voice AI & Speech Automation', body: 'Voice agents, transcription, summarization, and speech-enabled workflows.', icon: Zap, bullets: ['Voice bots', 'Transcription', 'Call summaries'] },
  { title: 'AI Business Process Automation', body: 'AI-assisted business operations with approval control and audit visibility.', icon: Workflow, bullets: ['Ops workflows', 'Human approval', 'Audit trail'] },
];

const whyChoose: Item[] = [
  { title: 'Business-first technology strategy', body: 'Every system is mapped to measurable business outcomes.', icon: Target },
  { title: 'Scalable and secure architecture', body: 'Built for growth, reliability, access control, and long-term maintenance.', icon: LockKeyhole },
  { title: 'Full-stack delivery capability', body: 'Strategy, UX, engineering, automation, and deployment under one operating rhythm.', icon: Layers3 },
  { title: 'End-to-end development support', body: 'From roadmap and prototypes to production release and continuous improvement.', icon: Rocket },
  { title: 'Modern design and engineering standards', body: 'Clean interfaces, fast pages, maintainable code, and structured documentation.', icon: Sparkles },
  { title: 'Long-term technical partnership', body: 'We stay close to performance, adoption, operations, and iteration.', icon: CheckCircle2 },
];

const industries: Item[] = [
  { title: 'Startups', body: 'MVPs, SaaS foundations, investor-ready systems, and launch infrastructure.', icon: Rocket },
  { title: 'E-commerce', body: 'Storefronts, automation, inventory flows, and customer data platforms.', icon: Building2 },
  { title: 'Healthcare', body: 'Secure portals, reporting, care coordination, and compliance-aware digital systems.', icon: ShieldCheck },
  { title: 'Education', body: 'Learning platforms, dashboards, student workflows, and digital operations.', icon: BrainCircuit },
  { title: 'Finance & Accounting', body: 'Reporting, document workflows, KPI dashboards, and secure client portals.', icon: LineChart },
  { title: 'Legal & Compliance', body: 'Document automation, risk registers, case workflows, and evidence organization.', icon: Scale },
  { title: 'Real Estate', body: 'Property portals, CRM integrations, reporting dashboards, and client workflows.', icon: Building2 },
  { title: 'Manufacturing', body: 'Operational dashboards, workflow automation, inventory visibility, and analytics.', icon: Workflow },
  { title: 'Logistics', body: 'Tracking systems, dispatch workflows, delivery reporting, and process automation.', icon: Network },
  { title: 'Professional Services', body: 'Client portals, proposal systems, dashboards, and back-office automation.', icon: BriefcaseBusiness },
];

const process = [
  ['01', 'Discover', 'Clarify goals, workflows, users, technical constraints, and measurable success criteria.'],
  ['02', 'Strategy', 'Map the product architecture, roadmap, integrations, delivery model, and operating priorities.'],
  ['03', 'Design', 'Create information architecture, user flows, and responsive interface systems.'],
  ['04', 'Develop', 'Build stable features, APIs, automation, data models, and admin-ready foundations.'],
  ['05', 'Automate', 'Integrate AI, workflows, reporting, notifications, and intelligent business operations.'],
  ['06', 'Launch', 'Deploy, validate, document, train teams, and stabilize the production environment.'],
  ['07', 'Scale', 'Improve performance, security, analytics, adoption, and long-term maintainability.'],
];

const serviceFoundations: Record<
  ServiceDefinition['shortId'],
  {
    eyebrow: string;
    title: string;
    body: string;
    groups: Array<{ group: string; tools: string[] }>;
  }
> = {
  it: {
    eyebrow: 'Technology stack',
    title: 'Modern, production-grade foundations.',
    body: 'We select tools for speed, reliability, maintainability, and long-term scalability.',
    groups: [
      { group: 'Frontend', tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { group: 'Backend', tools: ['Node.js', 'Next.js API', 'Prisma', 'PostgreSQL', 'REST APIs'] },
      { group: 'AI & Automation', tools: ['OpenAI', 'LangChain', 'Vector Search', 'RAG', 'Workflow Agents'] },
      { group: 'Cloud & DevOps', tools: ['Vercel', 'Docker', 'CI/CD', 'Monitoring', 'Cloud Storage'] },
    ],
  },
  consultancy: {
    eyebrow: 'Management toolkit',
    title: 'Consultancy systems for finance, control, and growth.',
    body: 'Practical management tools for reporting, planning, compliance coordination, and leadership decisions.',
    groups: [
      { group: 'Finance & Control', tools: ['MIS reporting', 'Cash flow models', 'Budget controls', 'Cost tracking', 'Profit analysis'] },
      { group: 'Tax, VAT & Compliance', tools: ['Tax planning', 'VAT tracking', 'Return calendars', 'Compliance registers', 'Audit support'] },
      { group: 'Management Systems', tools: ['KPI dashboards', 'SOP frameworks', 'Review cadence', 'Decision logs', 'Internal controls'] },
      { group: 'Growth Advisory', tools: ['Business diagnostics', 'Feasibility review', 'Market planning', 'Process improvement', 'Leadership reporting'] },
    ],
  },
  legal: {
    eyebrow: 'Legal support toolkit',
    title: 'Documentation and compliance foundations.',
    body: 'Structured legal-support tools for document control, case coordination, policy tracking, and risk visibility.',
    groups: [
      { group: 'Document Management', tools: ['Contract logs', 'Document templates', 'Version control', 'Approval trails', 'Evidence records'] },
      { group: 'Case Coordination', tools: ['Case files', 'Hearing dates', 'Task follow-ups', 'Client notes', 'Status reporting'] },
      { group: 'Compliance Control', tools: ['Policy registers', 'Risk reviews', 'Deadline tracking', 'Governance checklists', 'Regulatory logs'] },
      { group: 'Business Legal Support', tools: ['Agreement support', 'Company records', 'Due diligence files', 'Notice tracking', 'Secure archives'] },
    ],
  },
  creative: {
    eyebrow: 'Creative production toolkit',
    title: 'Brand, content, and market-facing foundations.',
    body: 'Creative systems for identity, campaigns, presentation assets, and consistent communication across channels.',
    groups: [
      { group: 'Brand System', tools: ['Visual identity', 'Logo systems', 'Color palettes', 'Typography rules', 'Brand guidelines'] },
      { group: 'Content Production', tools: ['Social media kits', 'Copywriting', 'Campaign calendars', 'Content templates', 'Creative briefs'] },
      { group: 'Design Assets', tools: ['Pitch decks', 'Brochures', 'Post templates', 'Ad creatives', 'Presentation systems'] },
      { group: 'Digital Experience', tools: ['Landing pages', 'UX writing', 'Conversion flows', 'Portfolio layouts', 'Market messaging'] },
    ],
  },
};

const teams = [
  {
    title: 'Management',
    count: '06 seats',
    members: ['Khadimul Hasan', 'Gaizi Faisal', 'Mahmudul Hasan', 'Management Seat 04', 'Management Seat 05', 'Management Seat 06'],
  },
  {
    title: 'Advisor & Consultant',
    count: '10 seats',
    members: ['K M Khairul Hasan Arif', 'Advisor Seat 02', 'Advisor Seat 03', 'Advisor Seat 04', 'Advisor Seat 05', 'Consultant Seat 06', 'Consultant Seat 07', 'Consultant Seat 08', 'Consultant Seat 09', 'Consultant Seat 10'],
  },
  {
    title: 'Executive',
    count: '10 seats',
    members: ['Executive Seat 01', 'Executive Seat 02', 'Executive Seat 03', 'Executive Seat 04', 'Executive Seat 05', 'Executive Seat 06', 'Executive Seat 07', 'Executive Seat 08', 'Executive Seat 09', 'Executive Seat 10'],
  },
];

const iconSets: Record<ServiceDefinition['shortId'], LucideIcon[]> = {
  it: [Code2, Bot, BrainCircuit, Network, LineChart, CloudCog, DatabaseZap, Workflow, Globe2, ShieldCheck],
  consultancy: [BriefcaseBusiness, LineChart, ClipboardCheck, Target, DatabaseZap, Workflow, CheckCircle2, Rocket, Building2, FileSearch],
  legal: [Scale, FileSearch, ShieldCheck, ClipboardCheck, LockKeyhole, CheckCircle2, Workflow, Building2, DatabaseZap, Network],
  creative: [Palette, Sparkles, Megaphone, Globe2, Layers3, MessageSquareText, Target, Rocket, CheckCircle2, BrainCircuit],
};

const fallbackBodies: Record<ServiceDefinition['shortId'], string> = {
  it: 'Digital systems, automation, data, AI, and secure software delivery for measurable operational advantage.',
  consultancy: 'CA-aware business advisory, finance control, tax/VAT support, management reporting, and operating discipline.',
  legal: 'Professional legal support, documentation assistance, compliance coordination, and practical business risk control.',
  creative: 'Brand, content, design, communication, and market-facing assets that make complex offers easier to trust.',
};

const focusCopy: Record<ServiceDefinition['shortId'], { eyebrow: string; title: string; body: string }> = {
  it: {
    eyebrow: 'AI solutions',
    title: 'Intelligent systems for real operations.',
    body: 'AI that improves workflows, decisions, customer experience, reporting, and execution without turning the product heavy.',
  },
  consultancy: {
    eyebrow: 'CA, finance and management advisory',
    title: 'Business control for serious growth decisions.',
    body: 'Tax, VAT, customs, accounting systems, internal control, reporting, budgeting, and governance support connected to execution.',
  },
  legal: {
    eyebrow: 'Legal support and compliance',
    title: 'Documentation and risk control for operating confidence.',
    body: 'Legal support, policy documentation, compliance coordination, contract assistance, governance documents, and workflow control.',
  },
  creative: {
    eyebrow: 'Creative and market systems',
    title: 'Brand experience built for trust and conversion.',
    body: 'Creative strategy, visual identity, pitch assets, content systems, campaigns, UI/UX, and communication design for serious businesses.',
  },
};

function getCategory(service: Pick<ServiceDefinition, 'shortId'>) {
  return serviceCategories.find((category) => category.key === service.shortId);
}

function buildSubServiceItems(service: Pick<ServiceDefinition, 'shortId'>, limit = 12): Item[] {
  const icons = iconSets[service.shortId];
  return subServices[service.shortId].slice(0, limit).map((entry, index) => ({
    title: entry.title,
    body: entry.summary ?? fallbackBodies[service.shortId],
    icon: icons[index % icons.length],
  }));
}

function buildFeaturedItems(service: Pick<ServiceDefinition, 'shortId'>): Item[] {
  const related = packagedSolutions.filter((solution) => solution.serviceKey === service.shortId);
  const icons = iconSets[service.shortId];

  if (related.length > 0) {
    return related.map((solution, index) => ({
      title: solution.title,
      body: solution.description,
      icon: icons[index % icons.length],
      meta: solution.badge,
      bullets: solution.modules,
    }));
  }

  return buildSubServiceItems(service, 4).map((item, index) => ({
    ...item,
    meta: index === 0 ? 'Priority system' : 'Advisory track',
  }));
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

function SectionIntro({ eyebrow, title, body, service }: { eyebrow: string; title: string; body: string; service: Pick<ServiceDefinition, 'shortId'> }) {
  const p = palette[service.shortId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] ${p.badge}`}>
        <Sparkles size={14} />
        {eyebrow}
      </div>
      <h2 className="break-words font-serif text-[clamp(2rem,5vw,4rem)] font-black leading-[1.06] text-brand-950 sm:leading-[1.02]">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:leading-8 md:text-lg">{body}</p>
    </motion.div>
  );
}

function CapabilityCard({ entry, service }: { entry: Item; service: Pick<ServiceDefinition, 'shortId'> }) {
  const p = palette[service.shortId];
  const Icon = entry.icon;

  return (
    <motion.article
      variants={itemMotion}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm ring-0 transition duration-300 hover:shadow-2xl hover:shadow-slate-950/10 ${p.ring} hover:ring-8`}
    >
      <div className={`absolute -right-16 -top-16 h-36 w-36 rounded-full blur-2xl ${p.glow}`} />
      <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg ${p.icon}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-black leading-tight text-brand-950">{entry.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{entry.body}</p>
      <Link href="/contact" className={`mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] ${p.text}`}>
        Learn more <ArrowRight size={14} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}

function SolutionCard({ entry, service }: { entry: Item; service: Pick<ServiceDefinition, 'shortId'> }) {
  const p = palette[service.shortId];
  const Icon = entry.icon;

  return (
    <motion.article
      variants={itemMotion}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-[1.5rem] border ${p.border} bg-white p-5 shadow-sm transition hover:shadow-2xl hover:shadow-slate-950/10`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${p.gradient}`} />
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg ${p.icon}`}>
          <Icon size={19} />
        </div>
        <CheckCircle2 className={p.textSoft} size={18} />
      </div>
      <h3 className="mt-5 text-lg font-black leading-tight text-brand-950">{entry.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{entry.body}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {entry.bullets?.map((bullet) => (
          <span key={bullet} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${p.soft} ${p.text}`}>
            {bullet}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export function ServiceDetailExperience({ service }: Props) {
  const p = palette[service.shortId];
  const category = getCategory(service);
  const capabilityItems = buildSubServiceItems(service, 12);
  const focusItems = service.shortId === 'it' ? aiSolutions : buildSubServiceItems(service, 10);
  const featuredItems = buildFeaturedItems(service);
  const focus = focusCopy[service.shortId];
  const foundation = serviceFoundations[service.shortId];

  return (
    <>
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className={`absolute left-0 top-20 h-72 w-72 rounded-full blur-[90px] ${p.glow}`} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            service={service}
            eyebrow="Our services"
            title={`${category?.shortTitle ?? 'Service'} capabilities.`}
            body={category?.description ?? 'End-to-end services designed to transform complex requirements into reliable, measurable business systems.'}
          />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityItems.map((entry) => (
              <CapabilityCard key={entry.title} entry={entry} service={service} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 ${p.soft}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow={focus.eyebrow} title={focus.title} body={focus.body} />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusItems.map((entry) => (
              <SolutionCard key={entry.title} entry={entry} service={service} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow="Why choose Inception 23" title="Designed for trust, speed, and scale." body="Our delivery model combines strategy, product thinking, engineering discipline, and long-term operational support." />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-4 md:grid-cols-2">
            {whyChoose.map((entry) => {
              const Icon = entry.icon;
              return (
                <motion.div key={entry.title} variants={itemMotion} className="group flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${p.icon}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-brand-950">{entry.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{entry.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow="Industries we serve" title="Built for multiple operating realities." body="Specialized systems for teams that need clarity, performance, accountability, and market-ready execution." />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {industries.map((entry) => {
              const Icon = entry.icon;
              return (
                <motion.article key={entry.title} variants={itemMotion} whileHover={{ y: -6 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl">
                  <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${p.soft} ${p.text}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-black text-brand-950">{entry.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-600">{entry.body}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow="Our process" title="A disciplined transformation journey." body="From discovery to optimization, every phase has a clear decision point, output, and ownership model." />
          <div className="relative mt-14">
            <div className={`absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b ${p.gradient} opacity-30 md:left-1/2`} />
            <div className="space-y-5">
              {process.map(([num, title, body], index) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className={`relative grid gap-4 md:grid-cols-[1fr_70px_1fr] ${index % 2 === 0 ? '' : 'md:[&>article]:col-start-3'}`}
                >
                  <article className="ml-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:ml-0">
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${p.text}`}>{num}</p>
                    <h3 className="mt-2 text-xl font-black text-brand-950">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
                  </article>
                  <div className={`absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full ${p.icon} md:static md:col-start-2`}>
                    {num}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 ${p.soft}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow="Featured solutions" title={`${category?.shortTitle ?? 'Service'} solutions ready to customize.`} body="Each solution is structured as a strong starting point for a production-grade advisory, documentation, operating, or digital system." />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-5 lg:grid-cols-2">
            {featuredItems.map((entry) => {
              const Icon = entry.icon;
              return (
                <motion.article key={entry.title} variants={itemMotion} whileHover={{ y: -8 }} className="group rounded-[1.6rem] border border-white bg-white p-6 shadow-sm transition hover:shadow-2xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.icon}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${p.badge}`}>{entry.meta}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-brand-950">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{entry.body}</p>
                  <Link href="/contact" className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${p.button}`}>
                    Start this build <ArrowRight size={14} />
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow={foundation.eyebrow} title={foundation.title} body={foundation.body} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {foundation.groups.map(({ group, tools }) => (
              <motion.div key={group} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className={`text-xs font-black uppercase tracking-[0.22em] ${p.text}`}>{group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span key={tool} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 ${p.soft}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro service={service} eyebrow="Team structure" title="A modern advisory delivery bench." body="Management, advisors, consultants, and executives work as one accountable delivery system." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {teams.map((group, groupIndex) => (
              <motion.article
                key={group.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: groupIndex * 0.08 }}
                className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-sm"
              >
                <div className={`bg-gradient-to-r ${p.gradient} p-5 text-white`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">{group.count}</p>
                  <h3 className="mt-2 font-serif text-2xl font-black">{group.title}</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-1">
                  {group.members.map((member, index) => (
                    <motion.div
                      key={member}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${index === 0 ? p.icon : `${p.soft} ${p.text}`}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-brand-950">{member}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{group.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
