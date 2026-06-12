import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type HeaderCTAProps = {
  className?: string;
  onClick?: () => void;
};

export function HeaderCTA({ className = '', onClick }: HeaderCTAProps) {
  return (
    <Link
      href="/contact"
      onClick={onClick}
      className={`group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-950 px-5 text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-700/20 min-[1600px]:px-6 min-[1600px]:text-xs min-[1600px]:tracking-[0.12em] ${className}`}
    >
      <span className="hidden min-[1600px]:inline">Book a Consultation</span>
      <span className="min-[1600px]:hidden">Book Consultation</span>
      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
    </Link>
  );
}
