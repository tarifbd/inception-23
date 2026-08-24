'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from 'lucide-react';
import { serviceCategories } from '@/lib/constants/service-categories';
import { subServices } from '@/lib/constants/sub-services';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';
import { GradientBackground } from './GradientBackground';
import { defaultHomepageContent, type HomepageSectionContent } from '@/lib/homepage-content';
import type { CollectionRecord } from '@/lib/website-collections';
import { pushSiteToast } from '@/components/ui/ToastProvider';
import { GradientTitle } from '@/components/ui/GradientTitle';

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type SelectKey = 'mainService' | 'subService' | 'budget';
type SelectOption = { value: string; label: string };
type ContactChannel = { id: string; type: 'email' | 'phone' | 'whatsapp'; label: string; value: string; href: string };

const socialPlatforms = [
  { key: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'X', label: 'X', icon: null },
  { key: 'Facebook', label: 'Facebook', icon: Facebook },
  { key: 'Instagram', label: 'Instagram', icon: Instagram },
  { key: 'Youtube', label: 'YouTube', icon: Youtube },
  { key: 'Github', label: 'GitHub', icon: Github },
  { key: 'Globe2', label: 'Website', icon: Globe2 },
] as const;

function getChannelHref(channel: ContactChannel) {
  if (channel.href && /^(mailto:|tel:|https:\/\/)/i.test(channel.href)) return channel.href;
  if (channel.type === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(channel.value)) return `mailto:${channel.value}`;
  if (channel.type === 'phone') return `tel:${channel.value.replace(/[^+\d]/g, '')}`;
  if (channel.type === 'whatsapp') return `https://wa.me/${channel.value.replace(/\D/g, '')}`;
  return '';
}

function isSpecificSocialUrl(href: string) {
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && url.pathname !== '/' && url.pathname !== '';
  } catch {
    return false;
  }
}

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
        className={`ui-field relative flex min-h-[56px] w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${active ? 'border-brand-700/40 ring-4 ring-brand-700/10' : ''} ${disabled ? '' : 'hover:border-brand-700/30'}`}
        aria-expanded={active}
        aria-haspopup="listbox"
      >
        <span className={selected ? 'min-w-0 truncate text-slate-800' : 'min-w-0 truncate text-slate-400'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-slate-500 transition ${active ? 'rotate-180' : ''}`} />
      </button>
      {required && !value ? <span className="sr-only">Required</span> : null}
      <AnimatePresence>
        {active ? (
        <motion.div
          role="listbox"
          initial={{ opacity: 0, y: -6, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.99 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-full z-[120] mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-night-800"
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
                className={`ui-nav-link flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold ${selectedOption ? `${accentClass} bg-slate-50` : 'text-slate-700 hover:bg-slate-50 hover:text-brand-950'}`}
              >
                <span className="min-w-0 break-words">{option.label}</span>
                {selectedOption ? <Check size={16} className="shrink-0" /> : null}
              </button>
            );
          })}
        </motion.div>
        ) : null}
      </AnimatePresence>
    </label>
  );
}

export function ContactBriefSection({
  content = defaultHomepageContent.sections.find((section) => section.key === 'contact')!,
  headingLevel = 'h2',
  budgetItems: cmsBudgetItems,
  trustItems: cmsTrustItems,
  serviceCategoryItems,
  serviceEcosystemItems,
  contactChannelItems,
  socialLinkItems,
}: {
  content?: HomepageSectionContent;
  headingLevel?: 'h1' | 'h2';
  budgetItems?: string[];
  trustItems?: string[];
  serviceCategoryItems?: CollectionRecord[];
  serviceEcosystemItems?: CollectionRecord[];
  contactChannelItems?: CollectionRecord[];
  socialLinkItems?: CollectionRecord[];
}) {
  const Heading = headingLevel;
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [serviceKey, setServiceKey] = useState<ServiceKey | ''>('');
  const [subService, setSubService] = useState('');
  const [budget, setBudget] = useState('');
  const [openSelect, setOpenSelect] = useState<SelectKey | null>(null);
  const activeTheme = serviceKey ? serviceThemes[serviceKey] : serviceThemes.it;
  const activeSubServices = useMemo(() => {
    if (!serviceKey) return [];
    const cmsGroup = serviceEcosystemItems?.find((item) => item.key === serviceKey);
    const cmsServices = Array.isArray(cmsGroup?.servicesText)
      ? cmsGroup.servicesText.map((item) => String(item).split('::')[0].trim()).filter(Boolean)
      : [];
    return cmsServices.length ? cmsServices : subServices[serviceKey].map((item) => item.title);
  }, [serviceEcosystemItems, serviceKey]);
  const mainServiceOptions = serviceCategoryItems?.length
    ? serviceCategoryItems
        .map((category) => ({ value: String(category.key || ''), label: String(category.title || '') }))
        .filter((item) => item.value && item.label)
    : serviceCategories.map((category) => ({ value: category.key, label: category.title }));
  const subServiceOptions = activeSubServices.map((item) => ({ value: item, label: item }));
  const budgetItems = cmsBudgetItems?.length ? cmsBudgetItems : budgets;
  const trustItems = cmsTrustItems?.length ? cmsTrustItems : trustPoints;
  const budgetOptions = budgetItems.map((item) => ({ value: item, label: item }));
  const contactChannels = (contactChannelItems ?? [])
    .map((item) => ({
      id: String(item.id || ''),
      type: String(item.type || '') as ContactChannel['type'],
      label: String(item.label || ''),
      value: String(item.value || ''),
      href: String(item.href || ''),
    }))
    .filter((item) => ['email', 'phone', 'whatsapp'].includes(item.type) && item.value);
  const channelsByType = {
    email: contactChannels.filter((item) => item.type === 'email').slice(0, 3),
    phone: contactChannels.filter((item) => item.type === 'phone').slice(0, 3),
    whatsapp: contactChannels.filter((item) => item.type === 'whatsapp').slice(0, 1),
  };
  const configuredSocials = (socialLinkItems ?? [])
    .map((item) => ({ label: String(item.label || ''), href: String(item.href || ''), icon: String(item.icon || '') }))
    .filter((item) => isSpecificSocialUrl(item.href));

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
      pushSiteToast({
        tone: 'error',
        title: 'Please check the brief',
        message: 'Name, email, service, sub-service, and project details are required.',
      });
      return;
    }

    const selectedCategory = serviceCategories.find((category) => category.key === mainService);
    try {
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
        const errorMessage = data?.error || 'Submission failed. Please try again.';
        setState('error');
        setMessage(errorMessage);
        pushSiteToast({ tone: 'error', title: 'Brief not sent', message: errorMessage });
        return;
      }

      event.currentTarget.reset();
      setServiceKey('');
      setSubService('');
      setBudget('');
      setOpenSelect(null);
      setState('success');
      setMessage('Your brief has been received. We will review it carefully and respond within 24 hours.');
      pushSiteToast({
        tone: 'success',
        title: 'Brief received',
        message: 'The team will review your project details and respond within 24 hours.',
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
    <section id="inquiry" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <GradientBackground />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-brand-700/30 py-1 pl-3 text-xs font-semibold text-brand-700">
            <span className={`h-2 w-2 rounded-full ${activeTheme.dot}`} />
            {content.eyebrow}
          </div>
          <Heading className="break-words font-serif text-[clamp(2.05rem,4.8vw,5rem)] font-black leading-[1.06] text-brand-950 sm:leading-[1.02]">
            <GradientTitle text={content.title} accentWords={2} tone="creative" />
          </Heading>
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
            className="ui-panel min-w-0 rounded-lg border border-slate-200 bg-white/88 p-4 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-night-900/88 sm:p-5 md:p-7"
          >
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Name *
                <input name="name" required placeholder="Your full name" className="ui-field rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-400" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Email *
                <input name="email" type="email" required placeholder="you@company.com" className="ui-field rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-400" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Phone
                <input name="phone" placeholder="Optional contact number" className="ui-field rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-400" />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-950">
                Company
                <input name="company" placeholder="Your company name" className="ui-field rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-400" />
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
                className="ui-field resize-y rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-400"
              />
            </label>

            <button
              disabled={state === 'submitting'}
              className={`ui-action mt-5 inline-flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${activeTheme.button}`}
            >
              {state === 'submitting' ? <LoaderCircle className="spin-loader" size={17} /> : <Send className="motion-icon" size={17} />}
              <span>{state === 'submitting' ? 'Sending...' : 'Send Message'}</span>
            </button>
            {message ? (
              <p
                aria-live="polite"
                data-state={state}
                className={`status-message mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${state === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
              >
                {state === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={17} /> : <AlertCircle className="mt-0.5 shrink-0" size={17} />}
                {message}
              </p>
            ) : null}
          </form>

          <div className="grid gap-5">
            <div className="ui-panel overflow-hidden rounded-lg border border-slate-200 bg-white/86 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-night-900/86">
              <div className="border-b border-slate-200 p-6 dark:border-white/10 md:p-7">
                <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${activeTheme.text}`}>Direct channels</p>
                <h3 className="mt-2 text-2xl font-black text-brand-950">Contact Information</h3>
              </div>

              <div className="grid divide-y divide-slate-200 dark:divide-white/10">
                <ContactChannelGroup icon={Mail} label="Email" items={channelsByType.email} emptySlots={3} />
                <ContactChannelGroup icon={Phone} label="Phone" items={channelsByType.phone} emptySlots={3} />
                <ContactChannelGroup icon={MessageCircle} label="WhatsApp" items={channelsByType.whatsapp} emptySlots={1} />
              </div>

              <div className="border-t border-slate-200 p-6 dark:border-white/10 md:p-7">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <MapPin size={17} className={activeTheme.text} />
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2" aria-label="Social media profiles">
                  {socialPlatforms.map((platform) => {
                    const configured = configuredSocials.find(
                      (item) => item.icon.toLowerCase() === platform.key.toLowerCase() || item.label.toLowerCase() === platform.label.toLowerCase(),
                    );
                    const Icon = platform.icon;
                    const icon = Icon ? <Icon size={18} aria-hidden="true" /> : <span aria-hidden="true" className="text-sm font-black">X</span>;
                    const className = `ui-action flex h-11 w-11 items-center justify-center rounded-md border transition ${
                      configured
                        ? 'border-slate-200 bg-slate-50 text-brand-950 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:bg-white/[0.06] dark:text-white'
                        : 'cursor-not-allowed border-slate-200/70 bg-slate-50/60 text-slate-400 opacity-55 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500'
                    }`;

                    return configured ? (
                      <a key={platform.key} href={configured.href} target="_blank" rel="noreferrer" aria-label={platform.label} title={platform.label} className={className}>
                        {icon}
                      </a>
                    ) : (
                      <span key={platform.key} role="img" aria-label={`${platform.label} profile not configured`} title={`${platform.label} profile can be connected from CMS`} className={className}>
                        {icon}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={`rounded-lg border bg-slate-50 p-6 shadow-sm dark:bg-night-900 md:p-7 ${activeTheme.border}`}>
              <h3 className="text-2xl font-black text-brand-950">Why work with us?</h3>
              <div className="mt-7 grid gap-4">
                {trustItems.map((point) => (
                  <div key={point} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                    <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${activeTheme.text}`} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactChannelGroup({
  icon: Icon,
  label,
  items,
  emptySlots,
}: {
  icon: typeof Mail;
  label: string;
  items: ContactChannel[];
  emptySlots: number;
}) {
  const slots = Array.from({ length: emptySlots }, (_, index) => items[index] ?? null);

  return (
    <div className="grid gap-4 p-6 md:grid-cols-[7.5rem_1fr] md:p-7">
      <div className="flex items-center gap-3 self-start text-xs font-black uppercase tracking-[0.14em] text-brand-950">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-cyan-300">
          <Icon size={17} aria-hidden="true" />
        </span>
        {label}
      </div>
      <div className="grid gap-2">
        {slots.map((item, index) => {
          const href = item ? getChannelHref(item) : '';
          return item && href ? (
            <a key={item.id} href={href} className="group flex min-h-12 items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50/60 hover:text-cyan-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:bg-cyan-400/10">
              <span className="min-w-0">
                <span className="block text-[9px] font-black uppercase tracking-[0.13em] text-slate-400">{item.label || `${label} ${index + 1}`}</span>
                <span className="mt-0.5 block break-all">{item.value}</span>
              </span>
              <Send size={14} className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          ) : (
            <div key={`${label}-slot-${index}`} className="flex min-h-12 items-center rounded-md border border-dashed border-slate-200 px-4 text-xs font-semibold text-slate-400 dark:border-white/10 dark:text-slate-500">
              Verified {label.toLowerCase()} {index + 1} can be published here
            </div>
          );
        })}
      </div>
    </div>
  );
}
