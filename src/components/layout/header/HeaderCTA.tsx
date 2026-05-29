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
      className={`group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-950 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-brand-950/15 transition hover:-translate-y-0.5 hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-700/20 2xl:px-6 2xl:text-xs 2xl:tracking-[0.12em] ${className}`}
    >
      <span className="hidden 2xl:inline">Book a Consultation</span>
      <span className="2xl:hidden">Book Consultation</span>
      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
    </Link>
  );
}
