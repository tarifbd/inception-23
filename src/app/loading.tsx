import Image from 'next/image';

export default function LoadingPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--color-canvas)] px-6 text-[var(--color-ink)]">
      <div className="w-full max-w-sm" role="status" aria-live="polite">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-sm">
            <Image src="/inception23-mark.png" alt="" width={72} height={72} priority className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em]">Inception 23</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">Preparing the advisory workspace</p>
          </div>
        </div>
        <div className="mt-6 h-px overflow-hidden bg-[var(--color-border)]" aria-hidden="true">
          <span className="page-loading-line block h-full w-2/5 bg-[var(--color-support)]" />
        </div>
        <span className="sr-only">Loading page</span>
      </div>
    </main>
  );
}
