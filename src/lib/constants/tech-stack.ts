export type TechStackGroup = {
  id: string;
  title: string;
  tools: string[];
};

export const techStackGroups: TechStackGroup[] = [
  { id: 'frontend', title: 'Frontend', tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { id: 'backend', title: 'Backend', tools: ['Next.js Route Handlers', 'Node.js', 'REST APIs', 'Secure server logic'] },
  { id: 'database', title: 'Database', tools: ['Prisma ORM', 'PostgreSQL-ready schema', 'SQLite dev database', 'Admin-ready models'] },
  { id: 'ai-automation', title: 'AI & Automation', tools: ['AI agents', 'RAG assistants', 'Workflow automation', 'Document automation'] },
  { id: 'cloud-devops', title: 'Cloud & DevOps', tools: ['Vercel', 'CI/CD-ready builds', 'Monitoring structure', 'Performance budgets'] },
  { id: 'design-creative', title: 'Design & Creative', tools: ['Design systems', 'Brand assets', 'Pitch decks', 'UX writing'] },
  { id: 'analytics-bi', title: 'Analytics & Business Intelligence', tools: ['Dashboards', 'KPI systems', 'Data models', 'Executive reporting'] },
  { id: 'legal-compliance-tools', title: 'Legal / Compliance Tools', tools: ['Document workflows', 'Compliance registers', 'Policy tracking', 'Risk reviews'] },
  { id: 'finance-tools', title: 'Accounting / Finance Tools', tools: ['MIS reporting', 'Cash flow models', 'Budget controls', 'Financial dashboards'] },
];
