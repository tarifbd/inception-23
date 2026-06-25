import { techStackGroups } from '@/lib/constants/tech-stack';
import { AnimatedSection } from './AnimatedSection';
import { SectionHeader } from './SectionHeader';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';

export function TechStackSection({ content, groups }: { content: HomepageSectionContent; groups?: CollectionRecord[] }) {
  const displayGroups = (groups?.length ? groups : techStackGroups) as typeof techStackGroups;

  return (
    <AnimatedSection id="technology" className="bg-slate-50">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        align="center"
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {displayGroups.map((group) => (
          <article
            key={group.id}
            className="group relative overflow-hidden rounded-[1.5rem] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
            style={{ borderColor: group.border }}
          >
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-70 blur-2xl transition group-hover:opacity-100" style={{ backgroundColor: group.soft }} />
            <div className="relative flex items-center gap-3">
              <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: group.accent, boxShadow: `0 0 0 6px ${group.soft}` }} />
              <h3 className="text-lg font-black text-brand-950">{group.title}</h3>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <span
                  key={tool}
                  className="relative rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-slate-700 transition hover:-translate-y-0.5"
                  style={{ borderColor: group.border, backgroundColor: group.soft }}
                >
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
