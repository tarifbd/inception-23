'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { services } from '@/lib/constants/services';
import { pushSiteToast } from '@/components/ui/ToastProvider';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  async function submit(formData: FormData) {
    setState('submitting');
    setMessage('');

    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      serviceInterest: String(formData.get('serviceInterest') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setState('error');
      setMessage('Please provide your name, email, and message.');
      pushSiteToast({
        tone: 'error',
        title: 'Please check the form',
        message: 'Your name, email, and message are required.',
      });
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage = data?.error || 'Submission failed. Please try again.';
        setState('error');
        setMessage(errorMessage);
        pushSiteToast({
          tone: 'error',
          title: 'Message not sent',
          message: errorMessage,
        });
        return;
      }

      setState('success');
      setMessage('Your inquiry has been received. We will review it carefully.');
      pushSiteToast({
        tone: 'success',
        title: 'Inquiry received',
        message: 'Thank you. The team will review your message carefully.',
      });
    } catch {
      setState('error');
      setMessage('Network connection failed. Please check your connection and try again.');
      pushSiteToast({
        tone: 'error',
        title: 'Connection problem',
        message: 'We could not reach the server. Please check your connection and try again.',
      });
    }
  }

  return (
    <form action={submit} className="ui-panel rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-white/10 dark:bg-night-900 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Name
          <input name="name" required className="ui-field rounded-lg px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Email
          <input name="email" type="email" required className="ui-field rounded-lg px-4 py-3" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Company
        <input name="company" className="ui-field rounded-lg px-4 py-3" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Service interest
        <select name="serviceInterest" className="ui-field rounded-lg px-4 py-3">
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Message
        <textarea name="message" required rows={6} className="ui-field rounded-lg px-4 py-3" />
      </label>
      <button disabled={state === 'submitting'} className="ui-action mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-950 px-6 py-4 font-semibold text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60">
        {state === 'submitting' ? <LoaderCircle className="spin-loader" size={17} /> : null}
        <span>{state === 'submitting' ? 'Sending...' : 'Send confidential inquiry'}</span>
      </button>
      {message ? (
        <p
          aria-live="polite"
          data-state={state}
          className={`status-message mt-4 px-4 py-3 text-sm font-semibold ${state === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
        >
          {state === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={17} /> : <AlertCircle className="mt-0.5 shrink-0" size={17} />}
          {message}
        </p>
      ) : null}
    </form>
  );
}
