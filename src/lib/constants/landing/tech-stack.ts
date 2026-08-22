export type TechStackGroup = {
  id: string;
  title: string;
  tools: string[];
};

export const techStackGroups: TechStackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'backend',
    title: 'Backend',
    tools: ['Next.js Route Handlers', 'Node.js', 'REST APIs', 'Zod-ready validation'],
  },
  {
    id: 'database',
    title: 'Database',
    tools: ['PostgreSQL-ready schema', 'Prisma ORM', 'SQLite dev database', 'Admin-ready models'],
  },
  {
    id: 'automation-search',
    title: 'Automation & Search',
    tools: ['Workflow automation', 'Knowledge search', 'Document automation', 'Chat assistants'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    tools: ['Vercel', 'CI/CD-ready builds', 'Monitoring structure', 'Performance budgets'],
  },
  {
    id: 'design-creative',
    title: 'Design & Creative',
    tools: ['Design systems', 'Brand assets', 'Presentation systems', 'UX writing'],
  },
  {
    id: 'analytics-bi',
    title: 'Analytics & BI',
    tools: ['Dashboards', 'KPI systems', 'Data models', 'Executive reporting'],
  },
  {
    id: 'legal-compliance-tools',
    title: 'Legal / Compliance Tools',
    tools: ['Document workflows', 'Compliance registers', 'Policy tracking', 'Risk reviews'],
  },
];
