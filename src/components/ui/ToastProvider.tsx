'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export type SiteToast = {
  message: string;
  title?: string;
  tone?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

type ToastItem = SiteToast & { id: number; duration: number };

const toastEventName = 'site:toast';

export function pushSiteToast(detail: SiteToast) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<SiteToast>(toastEventName, { detail }));
}

const toneStyles = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 text-emerald-800',
    iconClassName: 'bg-emerald-50 text-emerald-700',
    barClassName: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    className: 'border-rose-200 text-rose-900',
    iconClassName: 'bg-rose-50 text-rose-800',
    barClassName: 'bg-rose-500',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-amber-300/70 text-amber-950',
    iconClassName: 'bg-amber-100 text-amber-800',
    barClassName: 'bg-amber-500',
  },
  info: {
    icon: Info,
    className: 'border-cyan-200 text-cyan-900',
    iconClassName: 'bg-cyan-50 text-cyan-800',
    barClassName: 'bg-cyan-500',
  },
} as const;

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<SiteToast>).detail;
      const id = ++nextId.current;
      const duration = Math.max(1800, detail.duration ?? 4000);
      setToasts((current) => [...current.slice(-3), { ...detail, id, duration }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, duration);
    };

    window.addEventListener(toastEventName, onToast);
    return () => window.removeEventListener(toastEventName, onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-3 bottom-20 z-[110] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:w-[min(26rem,calc(100vw-2.5rem))] md:bottom-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const tone = toneStyles[toast.tone ?? 'info'];
          const Icon = tone.icon;

          return (
            <motion.div
              key={toast.id}
              role={toast.tone === 'error' ? 'alert' : 'status'}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 18, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-white/92 p-3.5 shadow-[0_22px_65px_-24px_rgba(15,23,42,0.42)] ring-1 ring-white/80 backdrop-blur-xl dark:bg-[#11171f]/94 dark:ring-white/10 ${tone.className}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${tone.iconClassName}`}>
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                {toast.title ? <span className="block text-sm font-semibold">{toast.title}</span> : null}
                <span className="block text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {toast.message}
                </span>
              </span>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={15} />
              </button>
              <motion.span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left ${tone.barClassName}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
