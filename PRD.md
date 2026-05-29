PRODUCT REQUIREMENTS DOCUMENT
Project: Inception 23 Website Redesign
Version: 1.0
Scope: Website redesign after hero section

1. Product Summary

Inception 23 is an advisory, consulting, and solution company. The website must present the company as a premium multidisciplinary consulting brand that combines technology, AI, management consultancy, legal support, and creative solutions.

The current website is visually weak, slow, and not structured properly. The goal is to redesign the landing page after the hero section into a high-end, light-mode, conversion-focused experience.

2. Business Positioning

Inception 23 is not a generic web agency. It is a strategic advisory and solution company.

Brand perception should be:
- Premium
- Strategic
- Intelligent
- Trustworthy
- Multidisciplinary
- Execution-capable
- Modern
- Business-focused
- Future-ready

3. Target Audience

Primary audience:
- Startups
- SMEs
- Business owners
- Professional firms
- Real estate/construction businesses
- Education businesses
- Legal/accounting/tax firms
- Clinics and healthcare businesses
- E-commerce businesses
- Organizations needing digital transformation

Audience problems:
- They need business growth
- They need better systems
- They need automation
- They need legal/compliance support
- They need brand/creative support
- They need AI adoption but do not know how
- They need strategy plus execution

4. Core Services

4.1 IT & AI Solutions
Purpose:
Help businesses adopt technology, automation, AI, software systems, dashboards, and digital operations.

Example offerings:
- Custom web applications
- AI automation
- AI chatbot
- CRM/ERP
- Data dashboard
- Internal business tools
- Workflow automation
- Digital transformation

Color identity:
Blue / cyan

4.2 Management Consultancy
Purpose:
Help businesses improve strategy, operations, structure, team, finance, process, and growth.

Example offerings:
- Business strategy
- SOP development
- Process improvement
- KPI design
- Operational restructuring
- Financial planning
- Growth consulting

Color identity:
Emerald / teal

4.3 Legal Support
Purpose:
Help businesses handle legal, compliance, documentation, contract, tax, and regulatory support.

Example offerings:
- Legal documentation
- Compliance advisory
- Contract support
- Company documentation
- Policy drafting
- Tax/VAT support
- Risk review

Color identity:
Royal purple / indigo / subtle gold

4.4 Creative & Others
Purpose:
Help businesses improve branding, website experience, communication, content, design, and digital presence.

Example offerings:
- Brand identity
- Website design
- Creative direction
- Marketing materials
- Content strategy
- Presentation design
- Social media creative

Color identity:
Orange / coral / magenta

5. Page Structure

Existing:
- Hero section already exists or will be refined separately.

Required new sections after hero:
1. Our Services
2. AI Solutions / Digital Innovation
3. Why Choose Inception 23
4. Industries We Serve
5. Our Process
6. Featured Solutions
7. Team Section
8. Technology Stack
9. Final CTA

6. Section Requirements

6.1 Our Services

Goal:
Show the four service pillars clearly.

Content:
- IT & AI Solutions
- Management Consultancy
- Legal Support
- Creative & Others

Each card must include:
- Icon
- Title
- Short description
- Capability bullets
- Color-coded accent
- CTA
- Hover animation

Design:
- Premium card grid
- Light background
- Soft gradient
- Large heading
- Clean copy
- Strong visual hierarchy

6.2 AI Solutions / Digital Innovation

Goal:
Show practical AI and technology capabilities.

Cards:
- AI Workflow Automation
- Custom Business Software
- CRM / ERP / Internal Tools
- Data Dashboards & Analytics
- AI Chatbots & Assistants
- Business Process Digitization

Each card:
- Icon
- Description
- Business benefit
- Hover animation
- Blue/cyan accent

6.3 Why Choose Inception 23

Goal:
Build trust.

Key messages:
- Multidisciplinary expertise
- Strategy to execution
- Technology + business + legal + creative under one roof
- Practical implementation mindset
- Scalable systems
- Bangladesh-aware and globally relevant
- Data-informed decision-making
- Long-term partnership

Design:
- Two-column layout or feature grid
- Animated feature rows
- Premium icons
- Subtle metric/stat placeholders

6.4 Industries We Serve

Goal:
Show target industries.

Industries:
- Startups
- SMEs
- Professional service firms
- Real estate & construction
- Education & EdTech
- E-commerce & retail
- Healthcare & clinics
- Manufacturing & garments
- Finance, accounting & tax firms
- NGOs / social impact organizations

Each card:
- Icon
- Title
- One-line value statement
- Soft hover animation

6.5 Our Process

Goal:
Show how the company works.

Steps:
1. Discover
2. Diagnose
3. Strategize
4. Design
5. Build / Implement
6. Optimize
7. Scale

Each step:
- Number
- Title
- Short explanation
- Icon
- Connected timeline visual

6.6 Featured Solutions

Goal:
Show packaged solution capability.

Solutions:
1. AI-powered CRM & Client Management System
2. Business Process Automation System
3. Legal Case / Compliance Management Platform
4. Management Dashboard & KPI Reporting System
5. Creative Brand & Website Experience
6. Custom Internal Business Operating System

Each card:
- Badge
- Title
- Description
- Key modules
- Business outcome
- CTA
- Accent color

6.7 Team Section

Goal:
Present a premium consulting-style team structure.

Categories:
- Management
- Advisor & Consultant
- Executive

Features:
- Category filter or tabs
- Team card grid
- Placeholder images or initials
- Name
- Role
- Expertise tags
- Short bio
- LinkedIn placeholder

Design:
- Light glass cards
- Premium consulting feel
- Smooth category switching animation
- Not generic agency style

6.8 Technology Stack

Goal:
Show technical capability.

Categories:
- Frontend
- Backend
- Database
- AI & Automation
- Cloud & DevOps
- Design & Creative
- Analytics & BI
- Legal / Compliance Tools

Display:
- Grouped chips
- Soft animated hover
- Clean grid

6.9 Final CTA

Goal:
Convert visitors.

Main message:
“Start your next transformation with Inception 23.”

CTA:
- Book a consultation
- Explore services

Design:
- Light gradient
- Floating shapes
- Premium button animation

7. Design Requirements

Global style:
- Light mode
- Premium
- Minimal but rich
- Consulting-style
- Modern gradients
- Soft shadows
- Glass card effects
- Strong spacing
- Clean typography
- Smooth interaction

Avoid:
- Dark website like screenshot
- Generic template
- Excessive glow
- Overused agency look
- Random colors
- Too many animations
- Poor contrast
- Crowded cards

8. Animation Requirements

Use Framer Motion.

Animation types:
- Section reveal on scroll
- Staggered card reveal
- Card hover lift
- Icon micro movement
- Soft border glow
- Floating shapes
- Smooth tab transition
- CTA hover transition

Performance:
- No heavy animation blocking
- Respect reduced motion where possible
- Avoid unnecessary client components

9. Component Requirements

Reusable components:
- SectionHeader
- AnimatedSection
- ServiceCard
- FeatureCard
- IndustryCard
- ProcessTimeline
- SolutionCard
- TeamSection
- TeamCard
- TechStackSection
- CTASection
- FloatingShape
- GradientBackground

10. Data Requirements

Create central data files:
- services.ts
- industries.ts
- process.ts
- solutions.ts
- team.ts
- tech-stack.ts
- theme.ts

All repeated section data must come from these files.

11. Technical Requirements

Preferred:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- shadcn/ui or custom components

Rules:
- Server components by default
- Client components only where animation/interactivity is needed
- Clean imports
- No duplicated code
- Proper TypeScript types
- Responsive layout
- Semantic HTML
- SEO-friendly structure

12. Acceptance Criteria

The implementation is successful if:

- Hero remains intact unless minor alignment is needed
- All required sections are added after hero
- Site is light mode, not dark mode
- Each service category has distinct color identity
- Team section exists with Management, Advisor & Consultant, Executive
- Cards are modern and premium
- Animations are smooth and professional
- Page is responsive on mobile/tablet/desktop
- Content is managed from central data files
- No obvious performance issue
- No generic template feeling
- No broken layout
- No TypeScript errors
- No console errors
- Build passes successfully