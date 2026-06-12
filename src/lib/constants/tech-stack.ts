export type TechStackGroup = {
  id: string;
  title: string;
  accent: string;
  soft: string;
  border: string;
  tools: string[];
};

export const techStackGroups: TechStackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    accent: '#7C3AED',
    soft: '#F5F3FF',
    border: '#DDD6FE',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Responsive UI', 'Accessibility', 'Landing pages', 'Component systems'],
  },
  {
    id: 'backend',
    title: 'Backend',
    accent: '#2563EB',
    soft: '#EFF6FF',
    border: '#BFDBFE',
    tools: ['Next.js Route Handlers', 'Node.js', 'REST APIs', 'Secure server logic', 'Auth flows', 'Admin APIs', 'Webhooks', 'File workflows', 'Role-based access'],
  },
  {
    id: 'database',
    title: 'Database',
    accent: '#059669',
    soft: '#ECFDF5',
    border: '#A7F3D0',
    tools: ['Prisma ORM', 'PostgreSQL-ready schema', 'SQLite dev database', 'Admin-ready models', 'Data relations', 'Migrations', 'Seed data', 'Audit fields', 'Backup planning'],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    accent: '#0891B2',
    soft: '#ECFEFF',
    border: '#A5F3FC',
    tools: ['AI agents', 'RAG assistants', 'Workflow automation', 'Document automation', 'Chat assistants', 'Prompt systems', 'Knowledge bases', 'Email automation', 'Internal copilots'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    accent: '#EA580C',
    soft: '#FFF7ED',
    border: '#FED7AA',
    tools: ['Vercel', 'CI/CD-ready builds', 'Monitoring structure', 'Performance budgets', 'Preview deploys', 'Environment setup', 'Domain setup', 'Error tracking', 'Release checks'],
  },
  {
    id: 'design-creative',
    title: 'Design & Creative',
    accent: '#DB2777',
    soft: '#FDF2F8',
    border: '#FBCFE8',
    tools: ['Design systems', 'Brand assets', 'Pitch decks', 'UX writing', 'Creative direction', 'Social media kits', 'Campaign visuals', 'Presentation design', 'Content templates'],
  },
  {
    id: 'analytics-bi',
    title: 'Analytics & Business Intelligence',
    accent: '#4F46E5',
    soft: '#EEF2FF',
    border: '#C7D2FE',
    tools: ['Dashboards', 'KPI systems', 'Data models', 'Executive reporting', 'Funnel tracking', 'Business scorecards', 'Monthly reports', 'Forecast views', 'Decision dashboards'],
  },
  {
    id: 'legal-compliance-tools',
    title: 'Legal / Compliance Tools',
    accent: '#9333EA',
    soft: '#FAF5FF',
    border: '#E9D5FF',
    tools: ['Document workflows', 'Compliance registers', 'Policy tracking', 'Risk reviews', 'Case files', 'Contract logs', 'Reminder systems', 'Approval trails', 'Document templates'],
  },
  {
    id: 'finance-tools',
    title: 'Accounting / Finance Tools',
    accent: '#16A34A',
    soft: '#F0FDF4',
    border: '#BBF7D0',
    tools: ['MIS reporting', 'Cash flow models', 'Budget controls', 'Financial dashboards', 'Invoice tracking', 'Tax/VAT trackers', 'Expense controls', 'Profit analysis', 'A/R follow-up'],
  },
];
