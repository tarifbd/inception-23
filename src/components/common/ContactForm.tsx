'use client';

import { useState } from 'react';
import { services } from '@/lib/constants/services';

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
      return;
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setState('error');
      setMessage(data?.error || 'Submission failed. Please try again.');
      return;
    }

    setState('success');
    setMessage('Your inquiry has been received. We will review it carefully.');
  }

  return (
    <form action={submit} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Name
          <input name="name" required className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Email
          <input name="email" type="email" required className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Company
        <input name="company" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Service interest
        <select name="serviceInterest" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500">
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
        <textarea name="message" required rows={6} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" />
      </label>
      <button disabled={state === 'submitting'} className="mt-6 w-full rounded-2xl bg-brand-950 px-6 py-4 font-black text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60">
        {state === 'submitting' ? 'Sending...' : 'Send confidential inquiry'}
      </button>
      {message ? (
        <p className={`mt-4 text-sm font-bold ${state === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>{message}</p>
      ) : null}
    </form>
  );
}
