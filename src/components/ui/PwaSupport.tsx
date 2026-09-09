'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X } from 'lucide-react';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaSupport() {
  const pathname = usePathname();
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const privatePage = /^\/(admin|api|auth|login)(\/|$)/.test(pathname);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator) || privatePage) return;
    void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch(() => console.warn('Offline support could not be registered.'));
  }, [privatePage]);

  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const installed = () => setPrompt(null);
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', ready);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  if (!prompt || dismissed || privatePage) return null;
  return (
    <aside aria-label="Install Inception 23" className="fixed bottom-24 left-3 z-40 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-white/20 dark:bg-night-950">
      <button disabled={installing} onClick={async () => {
        setInstalling(true);
        try { await prompt.prompt(); await prompt.userChoice; }
        catch { console.warn('Installation was not available. Use the browser install menu.'); }
        finally { setPrompt(null); setInstalling(false); }
      }} className="flex min-h-11 items-center gap-2 rounded px-3 text-sm font-semibold text-cyan-800 focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-cyan-300">
        <Download size={18} aria-hidden="true" />Install app
      </button>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss install offer" title="Dismiss" className="flex h-11 w-11 items-center justify-center rounded text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-600"><X size={16} /></button>
    </aside>
  );
}
