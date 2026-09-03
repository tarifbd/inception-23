import Link from 'next/link';
import { ArrowRight, CalendarDays, Check, ClipboardCheck } from 'lucide-react';
import { ContextIcon } from '@/components/ui/ContextIcon';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { eventManagementMenu } from '@/lib/constants/navigation';
import { AnimatedSection } from './AnimatedSection';
import type { HomepageSectionContent } from '@/lib/homepage-content';
import type { WebsiteCollections } from '@/lib/website-collections';

const deskNotes = [
  ['Before', 'Budget, venue shortlist, guest list, supplier calls, stage needs'],
  ['During', 'Check-in, seating, speaker cues, vendor timing, issue desk'],
  ['After', 'Photo handover, bills, lead list, recap note, closing report'],
] as const;

const handoverItems = [
  'Event brief and working budget',
  'Venue/vendor comparison sheet',
  'Guest and RSVP tracker',
  'Program flow and cue sheet',
  'Creative asset checklist',
  'Post-event recap and closing notes',
] as const;

export function EventManagementSection({ content, collections }: { content: HomepageSectionContent; collections?: WebsiteCollections }) {
  const eventServices = collections?.eventServices?.length ? collections.eventServices : eventManagementMenu;
  const handover = collections?.eventHandover?.length
    ? collections.eventHandover.map((item) => String(item.label || '')).filter(Boolean)
    : handoverItems;
  const phases = collections?.eventPhases?.length
    ? collections.eventPhases
        .map((item) => [String(item.phase || ''), String(item.detail || '')] as const)
        .filter(([phase]) => phase)
    : deskNotes;

  return (
    <AnimatedSection id="event-management" motionVariant="from-right" className="event-section bg-[#fbfcf5] dark:bg-night-950">
      <div className="grid gap-8 lg:gap-10">
        <div className="grid gap-7 border-y border-[#dfe7c2] py-8 dark:border-lime-200/15 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.7fr)] lg:items-end lg:gap-16 lg:py-12">
          <div>
            <p data-motion-eyebrow className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#607019] dark:text-lime-200">
              <CalendarDays size={17} />
              {content.eyebrow}
            </p>
            <h2 data-motion-heading className="max-w-4xl break-words font-serif text-[clamp(2rem,4.1vw,4.65rem)] font-bold leading-[1.06] text-brand-950 dark:text-white sm:leading-[1.02]">
              <GradientTitle text={content.title} accentWords={2} tone="creative" />
            </h2>
          </div>

          <div className="lg:pb-1">
            <p data-motion-description className="max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300 md:text-lg">{content.description}</p>
            {content.supportingText ? (
              <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-400">{content.supportingText}</p>
            ) : null}
            <Link
              href="/contact?service=event-management"
              className="ui-action mt-7 inline-flex items-center gap-3 rounded-lg bg-[#26310b] px-6 py-3 text-xs font-semibold text-white hover:bg-[#536512] dark:bg-lime-200 dark:text-[#182005] dark:hover:bg-lime-100"
            >
              Plan an event brief
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-stretch">
          <div className="overflow-hidden border border-[#dfe7c2] bg-white/80 dark:border-lime-200/15 dark:bg-white/[0.035]">
            <div className="grid grid-cols-[64px_1fr] border-b border-[#dfe7c2] bg-[#f4f8df] text-xs font-semibold text-[#657021] dark:border-lime-200/15 dark:bg-lime-300/[0.07] dark:text-lime-200 lg:grid-cols-[1fr_1fr]">
              <div className="border-r border-[#dfe7c2] px-4 py-3 dark:border-lime-200/15 lg:border-r-0 lg:px-5">
                <span className="lg:hidden">No.</span>
                <span className="hidden lg:inline">Event work we can take off your team</span>
              </div>
              <div className="px-4 py-3 lg:hidden">Event work we can take off your team</div>
            </div>

            <div data-motion-grid className="lg:grid lg:grid-cols-2">
              {eventServices.map((item, index) => (
                <Link
                  key={`${String(item.label || 'event')}-${index}`}
                  href={String(item.href || '/contact?service=event-management')}
                  className="group grid grid-cols-[64px_1fr] border-b border-[#e7ecd2] transition hover:bg-[#f4f8df] dark:border-white/10 dark:hover:bg-lime-300/[0.07] lg:min-h-40 lg:grid-cols-[48px_1fr] lg:[&:nth-child(odd)]:border-r lg:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <span className="border-r border-[#e7ecd2] px-3 py-4 font-mono text-xs font-bold text-[#8a9650] dark:border-white/10 dark:text-lime-300/70 lg:px-4 lg:py-5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="px-4 py-4 lg:px-5 lg:py-5">
                    <span className="flex items-start justify-between gap-3 text-base font-bold text-brand-950 dark:text-white">
                      <span className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#dfe7c2] bg-[#f4f8df] text-[#607019] dark:border-lime-200/15 dark:bg-lime-300/[0.08] dark:text-lime-200">
                          <ContextIcon context={String(item.label || '')} size={16} />
                        </span>
                        <span>{String(item.label || '')}</span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-[#8a9650] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-lime-300" />
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">{String(item.description || '')}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="border-t-2 border-[#a9ba55] bg-[#f7fae9] p-5 dark:border-lime-300/60 dark:bg-lime-300/[0.06] lg:p-6">
            <div className="flex items-center gap-2 text-[#607019] dark:text-lime-200">
              <ClipboardCheck size={17} />
              <p className="text-xs font-semibold">Handover pack</p>
            </div>
            <div data-motion-grid className="mt-5 grid gap-3">
              {handover.map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-[#e1e8c4] pb-3 text-sm font-bold leading-6 text-slate-700 last:border-b-0 last:pb-0 dark:border-white/10 dark:text-slate-200">
                  <Check size={15} className="mt-1 shrink-0 text-[#718020] dark:text-lime-300" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div data-motion-grid className="grid overflow-hidden border border-[#dfe7c2] bg-white/75 dark:border-lime-200/15 dark:bg-white/[0.03] md:grid-cols-3">
          {phases.map(([phase, detail], index) => (
            <div key={phase} className="grid grid-cols-[44px_1fr] gap-3 border-b border-[#e7ecd2] px-5 py-4 last:border-b-0 dark:border-white/10 md:border-b-0 md:border-r md:last:border-r-0 lg:px-6 lg:py-5">
              <span className="font-mono text-xs font-bold text-[#8a9650] dark:text-lime-300/70">0{index + 1}</span>
              <div>
                <p className="text-sm font-bold text-brand-950 dark:text-white">{phase}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
