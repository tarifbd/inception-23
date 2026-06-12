'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import { serviceCategories } from '@/lib/constants/service-categories';
import { subServices } from '@/lib/constants/sub-services';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';
import { GradientBackground } from './GradientBackground';
import { defaultHomepageContent, type HomepageSectionContent } from '@/lib/homepage-content';

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type SelectKey = 'mainService' | 'subService' | 'budget';
type SelectOption = { value: string; label: string };

const budgets = [
  'Need guidance first',
  'Below BDT 50,000',
  'BDT 50,000 - 150,000',
  'BDT 150,000 - 500,000',
  'BDT 500,000+',
  'Long-term retainer',
];

const trustPoints = [
  'Confidential initial consultation and project scoping',
  'Strategy, finance, legal support, technology, and creative thinking under one roof',
  'Clear roadmap before implementation begins',
  'Senior-level review for business-critical decisions',
  'Practical delivery with documentation and ownership clarity',
  'Response within 24 hours during business days',
];

function CustomSelect({
  label,
  name,
  value,
  placeholder,
  options,
  required,
  disabled,
  active,
  accentClass,
  onOpen,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  active: boolean;
  accentClass: string;
  onOpen: () => void;
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <label className="relative grid gap-2 text-sm font-black text-brand-950">
      {label}
      <input name={name} value={value} readOnly className="sr-only" tabIndex={-1} aria-hidden="true" />
      <button
        type="button"
        disabled={disabled}
        onClick={onOpen}
        className={`relative flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm font-bold outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${active ? 'border-brand-700/40 ring-4 ring-brand-700/10' : 'border-slate-200'} ${disabled ? '' : 'hover:border-brand-700/30'}`}
        aria-expanded={active}
        aria-haspopup="listbox"
      >
        <span className={selected ? 'min-w-0 truncate text-slate-800' : 'min-w-0 truncate text-slate-400'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-slate-500 transition ${active ? 'rotate-180' : ''}`} />
      </button>
      {required && !value ? <span className="sr-only">Required</span> : null}
      {active ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-[120] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/18"
        >
          {options.map((option) => {
            const selectedOption = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selectedOption}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onChange(option.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${selectedOption ? `${accentClass} bg-slate-50` : 'text-slate-700 hover:bg-slate-50 hover:text-brand-950'}`}
              >
                <span className="min-w-0 break-words">{option.label}</span>
                {selectedOption ? <Check size={16} className="shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </label>
  );
}

export function ContactBriefSection({
  content = defaultHomepageContent.sections.find((section) => section.key === 'contact')!,
}: {
  content?: HomepageSectionContent;
}) {
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [serviceKey, setServiceKey] = useState<ServiceKey | ''>('');
  const [subService, setSubService] = useState('');
  const [budget, setBudget] = useState('');
  const [openSelect, setOpenSelect] = useState<SelectKey | null>(null);
  const activeTheme = serviceKey ? serviceThemes[serviceKey] : serviceThemes.it;
  const activeSubServices = useMemo(() => (serviceKey ? subServices[serviceKey] : []), [serviceKey]);
  const mainServiceOptions = serviceCategories.map((category) => ({ value: category.key, label: category.title }));
  const subServiceOptions = activeSubServices.map((item) => ({ value: item.title, label: item.title }));
  const budgetOptions = budgets.map((item) => ({ value: item, label: item }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const mainService = serviceKey;
    const project = String(formData.get('project') || '').trim();

    if (!name || !email || !mainService || !subService || !project) {
      setState('error');
      setMessage('Please provide your name, email, main service, sub-service, and project brief.');
      return;
    }

    const selectedCategory = serviceCategories.find((category) => category.key === mainService);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        company,
        serviceInterest: `${selectedCategory?.title ?? mainService} / ${subService}`,
        message: [
          `Phone: ${phone || 'Not provided'}`,
          `Budget: ${budget || 'Not selected'}`,
          `Main service: ${selectedCategory?.title ?? mainService}`,
          `Sub-service: ${subService}`,
          '',
          project,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setState('error');
      setMessage(data?.error || 'Submission failed. Please try again.');
      return;
    }

    event.currentTarget.reset();
    setServiceKey('');
    setSubService('');
    setBudget('');
    setOpenSelect(null);
    setState('success');
    setMessage('Your brief has been received. We will review it carefully and respond within 24 hours.');
  }

  return (
    <section id="inquiry" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <GradientBackground />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-700/20 bg-white/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-700 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${activeTheme.dot}`} />
            {content.eyebrow}
          </div>
          <h2 className="break-words font-serif text-[clamp(2.05rem,4.8vw,5rem)] font-black leading-[1.06] text-brand-950 sm:leading-[1.02]">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <form
            onSubmit={handleSubmit}
            onClick={(event) => {
              const target = event.target as HTMLElement;
              if (!target.closest('[data-custom-select="true"]')) {
                setOpenSelect(null);
              }
            }}
            className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-white/88 p-4 shadow-2xl shadow-slate-950/8 backdrop-blur-xl sm:p-5 md:rounded-[2rem] md:p-7"
          >
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Name *
                <input name="name" required placeholder="Your full name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-700/50 focus:ring-4 focus:ring-brand-700/10" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Email *
                <input name="email" type="email" required placeholder="you@company.com" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-700/50 focus:ring-4 focus:ring-brand-700/10" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Phone
                <input name="phone" placeholder="+880 1XXX-XXXXXX" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-700/50 focus:ring-4 focus:ring-brand-700/10" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Company
                <input name="company" placeholder="Your company name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-700/50 focus:ring-4 focus:ring-brand-700/10" />
              </label>
              <div data-custom-select="true">
                <CustomSelect
                  label="Main service *"
                  name="mainService"
                  value={serviceKey}
                  placeholder="Select main service"
                  options={mainServiceOptions}
                  required
                  active={openSelect === 'mainService'}
                  accentClass={activeTheme.text}
                  onOpen={() => setOpenSelect(openSelect === 'mainService' ? null : 'mainService')}
                  onChange={(value) => {
                    setServiceKey(value as ServiceKey);
                    setSubService('');
                    setOpenSelect(null);
                  }}
                />
              </div>
              <div data-custom-select="true">
                <CustomSelect
                  label="Sub-service *"
                  name="subService"
                  value={subService}
                  placeholder={serviceKey ? 'Select sub-service' : 'Select main service first'}
                  options={subServiceOptions}
                  required
                  disabled={!serviceKey}
                  active={openSelect === 'subService'}
                  accentClass={activeTheme.text}
                  onOpen={() => {
                    if (serviceKey) setOpenSelect(openSelect === 'subService' ? null : 'subService');
                  }}
                  onChange={(value) => {
                    setSubService(value);
                    setOpenSelect(null);
                  }}
                />
              </div>
              <div className="md:col-span-2" data-custom-select="true">
                <CustomSelect
                  label="Project budget"
                  name="budget"
                  value={budget}
                  placeholder="Select budget range"
                  options={budgetOptions}
                  active={openSelect === 'budget'}
                  accentClass={activeTheme.text}
                  onOpen={() => setOpenSelect(openSelect === 'budget' ? null : 'budget')}
                  onChange={(value) => {
                    setBudget(value);
                    setOpenSelect(null);
                  }}
                />
              </div>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-black text-brand-950">
              Tell us about your project *
              <textarea
                name="project"
                required
                rows={6}
                placeholder="Describe your goals, timeline, challenges, or the outcome you want..."
                className="resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-700/50 focus:ring-4 focus:ring-brand-700/10"
              />
            </label>

            <button
              disabled={state === 'submitting'}
              className={`mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${activeTheme.button}`}
            >
              {state === 'submitting' ? 'Sending...' : 'Send Message'}
              <Send size={17} />
            </button>
            {message ? (
              <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </p>
            ) : null}
          </form>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white/86 p-6 shadow-xl shadow-slate-950/6 backdrop-blur-xl md:p-7">
              <h3 className="text-2xl font-black text-brand-950">Contact Information</h3>
              <div className="mt-7 grid gap-5">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@inception23.com' },
                  { icon: Phone, label: 'Phone / WhatsApp', value: '+880 1XXX-XXXXXX' },
                  { icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh' },
                  { icon: Clock3, label: 'Support hours', value: 'Mon - Fri, 09:00 - 18:00 BST (UTC+6)' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-brand-700">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${activeTheme.text}`}>{item.label}</p>
                        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-[2rem] border bg-gradient-to-br ${activeTheme.gradientSoft} p-6 shadow-xl shadow-slate-950/6 md:p-7 ${activeTheme.border}`}>
              <h3 className="text-2xl font-black text-brand-950">Why work with us?</h3>
              <div className="mt-7 grid gap-4">
                {trustPoints.map((point) => (
                  <div key={point} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                    <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${activeTheme.text}`} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800">
              Average response time: under 24 hours during business days
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
