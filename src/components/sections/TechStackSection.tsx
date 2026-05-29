import { techStackGroups } from '@/lib/constants/tech-stack';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';

export function TechStackSection() {
  return (
    <AnimatedSection id="technology" className="bg-slate-50">
      <SectionHeader
        eyebrow="Technology stack"
        title="Modern tools, business systems, and advisory infrastructure."
        description="The stack reflects how Inception 23 thinks: software, automation, finance control, compliance documentation, analytics, and market experience working together."
        align="center"
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {techStackGroups.map((group) => (
          <article key={group.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
            <h3 className="text-lg font-black text-brand-950">{group.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <span key={tool} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-slate-600 transition hover:border-brand-700/30 hover:bg-brand-50 hover:text-brand-950">
                  {tool}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
