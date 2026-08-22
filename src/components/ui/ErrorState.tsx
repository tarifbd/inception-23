import Link from 'next/link';
import { ArrowLeft, Home, RefreshCw, ShieldAlert } from 'lucide-react';

type ErrorStateProps = {
  code: string;
  title: string;
  description: string;
  onRetry?: () => void;
};

export function ErrorState({ code, title, description, onRetry }: ErrorStateProps) {
  return (
    <main className="ambient-mesh relative grid min-h-screen place-items-center bg-[#f7f9fa] px-5 py-24 text-brand-950 dark:bg-night-950">
      <section className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-night-900/90">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-white/10">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-800">
            <ShieldAlert size={20} />
          </span>
          <span className="font-mono text-sm font-semibold text-slate-400">{code}</span>
        </div>

        <h1 className="mt-8 max-w-xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="ui-action inline-flex items-center justify-center gap-2 rounded-lg bg-brand-950 px-5 py-3 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          ) : null}
          <Link
            href="/"
            className="ui-action inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-brand-950"
          >
            <Home size={16} />
            Back to home
          </Link>
          <Link
            href="/contact"
            className="ui-action inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-support-700"
          >
            <ArrowLeft size={16} />
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
