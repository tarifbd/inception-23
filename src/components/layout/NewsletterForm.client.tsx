'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { pushSiteToast } from '@/components/ui/ToastProvider';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Newsletter request failed');
      setEmail('');
      setStatus('success');
      pushSiteToast({ tone: 'success', title: 'Subscription confirmed', message: 'You are now on the Inception 23 insight list.' });
    } catch {
      setStatus('error');
      pushSiteToast({ tone: 'error', title: 'Subscription failed', message: 'Please check the email address and try again.' });
    } finally {
      window.setTimeout(() => setStatus('idle'), 3600);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="mt-9 border-t border-white/15 pt-7">
      <label htmlFor="footer-email" className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">
        Global insight dispatch
      </label>
      <div className="mt-4 flex min-w-0 border border-white/20 bg-white/[0.04] pl-4 transition focus-within:border-cyan-300/70 focus-within:bg-white/[0.07]">
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          disabled={status === 'submitting'}
          className="min-h-12 min-w-0 flex-1 bg-transparent pr-3 text-sm font-semibold text-white outline-none placeholder:text-white/65 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label={status === 'submitting' ? 'Subscribing' : 'Subscribe to insight dispatch'}
          className="ui-action flex h-12 w-12 shrink-0 items-center justify-center border-l border-white/20 bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {status === 'submitting' ? <span className="font-mono text-[9px]">...</span> : <Send size={17} />}
        </button>
      </div>
      {status === 'success' ? <p className="status-message mt-3 text-sm font-semibold text-emerald-800" data-state="success" data-auto-dismiss>Subscribed. Thank you.</p> : null}
      {status === 'error' ? <p className="status-message mt-3 text-sm font-semibold text-rose-800" data-state="error" data-auto-dismiss>Could not subscribe. Please try again.</p> : null}
    </form>
  );
}
