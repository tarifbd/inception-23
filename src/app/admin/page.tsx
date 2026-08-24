'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Database,
  Edit,
  Eye,
  Inbox,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Trash2,
  X,
} from 'lucide-react';

import type { Category, ServiceItem, CaseStudy } from '@/lib/types';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  serviceInterest: string | null;
  message: string;
  status: string;
  createdAt: string;
}

type TabId = 'overview' | 'pillars' | 'services' | 'cases' | 'inquiries' | 'contacts' | 'subscribers';
type ToastType = 'success' | 'error' | 'none';

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';
const labelClass = 'text-[11px] font-bold uppercase tracking-wider text-gray-500';
const cardClass = 'rounded-lg border border-gray-200 bg-white shadow-sm';

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'pillars', label: 'Pillars', icon: Settings },
  { id: 'services', label: 'Services', icon: ClipboardList },
  { id: 'cases', label: 'Case Studies', icon: BookOpen },
  { id: 'inquiries', label: 'Inquiries', icon: Inbox },
  { id: 'contacts', label: 'Contact Submissions', icon: Send },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
];

const emptyService = (categoryId: string, order: number): ServiceItem => ({
  categoryId,
  titleEn: '',
  titleBn: '',
  descEn: '',
  descBn: '',
  icon: 'Sparkles',
  theme: 'cyan',
  order,
});

const emptyCase = (categoryId: string): CaseStudy => ({
  titleEn: '',
  titleBn: '',
  clientEn: '',
  clientBn: '',
  categoryId,
  summaryEn: '',
  summaryBn: '',
  metricsEn: '',
  metricsBn: '',
  challengeEn: '',
  challengeBn: '',
  solutionEn: '',
  solutionBn: '',
  img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop',
  order: 0,
});

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [categories, setCategories] = useState<Category[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({ type: 'none', message: '' });
  const [copied, setCopied] = useState('');

  const totalServices = useMemo(
    () => categories.reduce((sum, category) => sum + category.services.length, 0),
    [categories],
  );

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories],
  );

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categories.map((category) => ({
      ...category,
      services: category.services.filter((service) => {
        if (!term) return true;
        return [service.titleEn, service.titleBn, service.descEn, service.descBn, service.icon, service.theme]
          .join(' ')
          .toLowerCase()
          .includes(term);
      }),
    }));
  }, [categories, query]);

  const filteredCases = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return caseStudies;
    return caseStudies.filter((caseStudy) =>
      [caseStudy.titleEn, caseStudy.clientEn, caseStudy.categoryId, caseStudy.summaryEn, caseStudy.metricsEn]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [caseStudies, query]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, casesRes, inquiriesRes, contactsRes, subscribersRes, healthRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/casestudies'),
        fetch('/api/inquiries'),
        fetch('/api/contact'),
        fetch('/api/newsletter'),
        fetch('/api/health'),
      ]);

      if (configRes.ok) setCategories(await configRes.json());
      if (casesRes.ok) setCaseStudies((await casesRes.json()).data ?? []);
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      if (contactsRes.ok) setContactSubmissions(await contactsRes.json());
      if (subscribersRes.ok) setSubscribers(await subscribersRes.json());
      setDbOnline(healthRes.ok);
    } catch (error) {
      console.error('Admin fetch error:', error);
      showToast('Could not load admin data.', 'error');
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hadDarkClass = document.documentElement.classList.contains('dark');
    document.documentElement.classList.remove('dark');
    fetchData();
    return () => {
      if (hadDarkClass) document.documentElement.classList.add('dark');
    };
  }, [fetchData]);

  const showToast = (message: string, type: Exclude<ToastType, 'none'>) => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ type: 'none', message: '' }), 3500);
  };

  const syncConfig = async (payload: object, successMessage: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Config save failed');
      await fetchData();
      window.dispatchEvent(new Event('config-updated'));
      showToast(successMessage, 'success');
      return true;
    } catch (error) {
      console.error(error);
      showToast('Database update failed.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updated = [...categories];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    const finalized = updated.map((category, order) => ({ ...category, order }));
    setCategories(finalized);
    await syncConfig({ categories: finalized }, 'Pillar order updated.');
  };

  const updateCategory = async (category: Category) => {
    await syncConfig({ categories: [category] }, 'Pillar settings saved.');
  };

  const saveService = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedService) return;

    const isNew = !selectedService.id;
    const ok = await syncConfig(
      {
        action: isNew ? 'create-service' : 'update-service',
        services: [selectedService],
      },
      isNew ? 'Service created.' : 'Service updated.',
    );
    if (ok) setSelectedService(null);
  };

  const deleteService = async (service: ServiceItem) => {
    if (!service.id || !confirm(`Delete "${service.titleEn}"?`)) return;
    await syncConfig({ action: 'delete-service', services: [{ id: service.id }] }, 'Service deleted.');
  };

  const moveService = async (category: Category, serviceIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;
    if (targetIndex < 0 || targetIndex >= category.services.length) return;

    const services = [...category.services];
    [services[serviceIndex], services[targetIndex]] = [services[targetIndex], services[serviceIndex]];
    const finalized = services.map((service, order) => ({ ...service, order }));
    setCategories((current) =>
      current.map((item) => (item.id === category.id ? { ...item, services: finalized } : item)),
    );
    await syncConfig({ services: finalized }, 'Service order updated.');
  };

  const saveCaseStudy = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCase) return;

    setSaving(true);
    try {
      const res = await fetch('/api/casestudies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCase),
      });

      if (!res.ok) throw new Error('Case save failed');
      await fetchData();
      window.dispatchEvent(new Event('config-updated'));
      showToast(selectedCase.id ? 'Case study updated.' : 'Case study created.', 'success');
      setSelectedCase(null);
    } catch (error) {
      console.error(error);
      showToast('Case study save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCaseStudy = async (caseStudy: CaseStudy) => {
    if (!caseStudy.id || !confirm(`Delete "${caseStudy.titleEn}"?`)) return;

    setSaving(true);
    try {
      const res = await fetch('/api/casestudies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: caseStudy.id, action: 'delete' }),
      });

      if (!res.ok) throw new Error('Delete failed');
      await fetchData();
      window.dispatchEvent(new Event('config-updated'));
      showToast('Case study deleted.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Could not delete case study.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await deleteRecord('/api/inquiries', id, 'Inquiry deleted.');
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    await deleteRecord('/api/newsletter', id, 'Subscriber deleted.');
  };

  const deleteRecord = async (url: string, id: string, successMessage: string) => {
    setSaving(true);
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchData();
      showToast(successMessage, 'success');
    } catch (error) {
      console.error(error);
      showToast('Delete failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(''), 1800);
  };

  const exportSubscribers = () => {
    const csv = ['email,subscribedAt', ...subscribers.map((sub) => `${sub.email},${sub.subscribedAt}`)].join('\n');
    copyText(csv);
    showToast('Subscriber CSV copied to clipboard.', 'success');
  };

  const createNewService = (category: Category) => {
    setSelectedService(emptyService(category.id, category.services.length));
    setActiveTab('services');
  };

  const createNewCase = () => {
    setSelectedCase(emptyCase(categories[0]?.id ?? 'it'));
    setActiveTab('cases');
  };

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? 'Admin';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-gray-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-serif text-xl font-black text-white">
                  I
                </div>
                <div>
                  <div className="font-serif text-lg font-black leading-none">INCEPTION 23</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">Admin Panel</div>
                </div>
              </div>

              <div className="mb-6 flex gap-2">
                <Link
                  href="/"
                  className="inline-flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-brand-500 hover:text-brand-700"
                >
                  <ArrowLeft size={14} />
                  Return to site
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  aria-label="Log out"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-rose-400 hover:text-rose-600"
                >
                  <LogOut size={14} />
                </button>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count =
                    tab.id === 'pillars'
                      ? categories.length
                      : tab.id === 'services'
                        ? totalServices
                        : tab.id === 'cases'
                          ? caseStudies.length
                          : tab.id === 'inquiries'
                            ? inquiries.length
                            : tab.id === 'contacts'
                              ? contactSubmissions.length
                              : tab.id === 'subscribers'
                                ? subscribers.length
                                : undefined;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedCase(null);
                        setSelectedService(null);
                        setQuery('');
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} />
                        {tab.label}
                      </span>
                      {count !== undefined && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-8 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-bold">Database</span>
                <span className="flex items-center gap-1 font-black text-emerald-700">
                  <Database size={12} />
                  Prisma
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">Status</span>
                {dbOnline === null ? (
                  <span className="flex items-center gap-1 font-black text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    Checking...
                  </span>
                ) : dbOnline ? (
                  <span className="flex items-center gap-1 font-black text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-black text-rose-700">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-brand-700">Light Console</div>
              <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-gray-950">{activeTabLabel}</h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {(activeTab === 'services' || activeTab === 'cases') && (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search records"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:w-64"
                  />
                </div>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-brand-500 hover:text-brand-700 disabled:opacity-60"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </header>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Settings} label="Active Pillars" value={`${activeCategories}/${categories.length}`} />
                    <StatCard icon={ClipboardList} label="Services" value={totalServices.toString()} />
                    <StatCard icon={BookOpen} label="Case Studies" value={caseStudies.length.toString()} />
                    <StatCard icon={Inbox} label="Leads" value={inquiries.length.toString()} tone="rose" />
                  </div>

                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    <div className={`${cardClass} p-5 xl:col-span-2`}>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-serif text-xl font-black">Admin Modules</h2>
                        <span className="text-xs font-bold text-gray-500">Ready for content operations</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {tabs.slice(1).map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-brand-400 hover:bg-white hover:shadow-sm"
                            >
                              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                                <Icon size={18} />
                              </span>
                              <span>
                                <span className="block text-sm font-black text-gray-950">{tab.label}</span>
                                <span className="block text-xs text-gray-500">Open module</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`${cardClass} p-5`}>
                      <h2 className="font-serif text-xl font-black">Quick Actions</h2>
                      <div className="mt-4 space-y-2">
                        <QuickAction label="Add service" icon={Plus} onClick={() => categories[0] && createNewService(categories[0])} />
                        <QuickAction label="Add case study" icon={BookOpen} onClick={createNewCase} />
                        <QuickAction label="Export subscribers" icon={Copy} onClick={exportSubscribers} />
                        <QuickAction label="View website" icon={Eye} onClick={() => window.open('/', '_blank')} />
                      </div>
                    </div>
                  </div>

                  <div className={`${cardClass} overflow-hidden`}>
                    <div className="border-b border-gray-200 px-5 py-4">
                      <h2 className="font-serif text-xl font-black">Recent Inquiries</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {inquiries.slice(0, 5).map((inquiry) => (
                        <div key={inquiry.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-bold text-gray-950">{inquiry.name}</div>
                            <div className="text-xs text-gray-500">{inquiry.email}</div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('inquiries');
                              setExpandedInquiryId(inquiry.id);
                            }}
                            className="text-left text-xs font-black uppercase tracking-wider text-brand-700"
                          >
                            Open lead
                          </button>
                        </div>
                      ))}
                      {inquiries.length === 0 && <EmptyState icon={Inbox} title="No inquiries yet" />}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pillars' && (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {categories.map((category, index) => (
                    <div key={category.id} className={`${cardClass} p-5`}>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest text-brand-700">Order {index + 1}</div>
                          <h2 className="mt-1 font-serif text-xl font-black">{category.labelEn}</h2>
                        </div>
                        <div className="flex gap-2">
                          <IconButton icon={ArrowUp} label="Move up" disabled={index === 0} onClick={() => moveCategory(index, 'up')} />
                          <IconButton icon={ArrowDown} label="Move down" disabled={index === categories.length - 1} onClick={() => moveCategory(index, 'down')} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Field label="English Label">
                          <input
                            className={inputClass}
                            value={category.labelEn}
                            onChange={(event) =>
                              setCategories((current) =>
                                current.map((item) => (item.id === category.id ? { ...item, labelEn: event.target.value } : item)),
                              )
                            }
                          />
                        </Field>
                        <Field label="Bangla Label">
                          <input
                            className={inputClass}
                            value={category.labelBn}
                            onChange={(event) =>
                              setCategories((current) =>
                                current.map((item) => (item.id === category.id ? { ...item, labelBn: event.target.value } : item)),
                              )
                            }
                          />
                        </Field>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                          <input
                            type="checkbox"
                            checked={category.isActive}
                            onChange={(event) =>
                              setCategories((current) =>
                                current.map((item) => (item.id === category.id ? { ...item, isActive: event.target.checked } : item)),
                              )
                            }
                            className="h-4 w-4 accent-brand-600"
                          />
                          Visible on site
                        </label>
                        <button
                          onClick={() => updateCategory(category)}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-60"
                        >
                          <Save size={14} />
                          Save Pillar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-5">
                  {filteredServices.map((category) => (
                    <section key={category.id} className={`${cardClass} overflow-hidden`}>
                      <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="font-serif text-xl font-black">{category.labelEn}</h2>
                          <p className="text-xs text-gray-500">{category.services.length} services</p>
                        </div>
                        <button
                          onClick={() => createNewService(category)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-700"
                        >
                          <Plus size={14} />
                          Add Service
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
                        {category.services.map((service, index) => (
                          <div key={service.id} className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-600">
                                  {service.theme} / {service.icon}
                                </span>
                                <h3 className="mt-3 font-serif text-lg font-black">{service.titleEn}</h3>
                              </div>
                              <div className="flex gap-1">
                                <IconButton icon={ArrowUp} label="Move up" disabled={index === 0} onClick={() => moveService(category, index, 'up')} />
                                <IconButton icon={ArrowDown} label="Move down" disabled={index === category.services.length - 1} onClick={() => moveService(category, index, 'down')} />
                              </div>
                            </div>
                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{service.descEn}</p>
                            <div className="mt-4 flex gap-2">
                              <button onClick={() => setSelectedService(service)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-brand-500 hover:text-brand-700">
                                <Edit size={13} />
                                Edit
                              </button>
                              <button onClick={() => deleteService(service)} className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {category.services.length === 0 && <EmptyState icon={ClipboardList} title="No services in this category" />}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {activeTab === 'cases' && (
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <button onClick={createNewCase} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-700">
                      <Plus size={14} />
                      Add Case Study
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {filteredCases.map((caseStudy) => (
                      <article key={caseStudy.id} className={`${cardClass} overflow-hidden`}>
                        <div className="flex gap-4 p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={caseStudy.img} alt={caseStudy.titleEn} className="h-24 w-24 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-700">{caseStudy.categoryId}</span>
                            <h2 className="line-clamp-2 font-serif text-lg font-black">{caseStudy.titleEn}</h2>
                            <p className="mt-1 text-xs font-bold text-gray-500">{caseStudy.clientEn} / {caseStudy.metricsEn}</p>
                            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{caseStudy.summaryEn}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 border-t border-gray-100 p-4">
                          <button onClick={() => setSelectedCase(caseStudy)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-brand-500 hover:text-brand-700">
                            <Edit size={13} />
                            Edit
                          </button>
                          <button onClick={() => deleteCaseStudy(caseStudy)} className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </article>
                    ))}
                    {filteredCases.length === 0 && <EmptyState icon={BookOpen} title="No case studies found" />}
                  </div>
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-3">
                  {inquiries.map((inquiry) => {
                    const isOpen = expandedInquiryId === inquiry.id;
                    return (
                      <div key={inquiry.id} className={`${cardClass} overflow-hidden`}>
                        <button
                          onClick={() => setExpandedInquiryId(isOpen ? null : inquiry.id)}
                          className="flex w-full flex-col gap-3 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span>
                            <span className="block font-serif text-lg font-black">{inquiry.name}</span>
                            <span className="block text-sm text-gray-500">{inquiry.email}</span>
                          </span>
                          <span className="text-xs font-bold text-gray-500">
                            {new Date(inquiry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              <div className="space-y-4 border-t border-gray-100 bg-gray-50 p-5">
                                <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">{inquiry.message}</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                                    <Mail size={14} />
                                    Reply
                                  </a>
                                  <button onClick={() => copyText(inquiry.email)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700">
                                    {copied === inquiry.email ? <Check size={14} /> : <Copy size={14} />}
                                    Copy Email
                                  </button>
                                  <button onClick={() => deleteInquiry(inquiry.id)} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-rose-600">
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                  {inquiries.length === 0 && <EmptyState icon={Inbox} title="No inquiries yet" />}
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className={`${cardClass} overflow-hidden`}>
                  <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="font-serif text-xl font-black">Contact Form Submissions</h2>
                    <p className="text-xs text-gray-500">
                      Leads submitted through the site&apos;s contact form (separate from the Inquiries widget above).
                    </p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {contactSubmissions.map((submission) => (
                      <div key={submission.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif text-lg font-black">{submission.name}</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-gray-600">
                              {submission.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{submission.email}</div>
                          {(submission.company || submission.serviceInterest) && (
                            <div className="mt-1 text-xs text-gray-500">
                              {[submission.company, submission.serviceInterest].filter(Boolean).join(' · ')}
                            </div>
                          )}
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700">{submission.message}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">
                            {new Date(submission.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          <a href={`mailto:${submission.email}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                            <Mail size={14} />
                            Reply
                          </a>
                        </div>
                      </div>
                    ))}
                    {contactSubmissions.length === 0 && <EmptyState icon={Send} title="No contact submissions yet" />}
                  </div>
                </div>
              )}

              {activeTab === 'subscribers' && (
                <div className={`${cardClass} overflow-hidden`}>
                  <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-black">Newsletter Audience</h2>
                      <p className="text-xs text-gray-500">{subscribers.length} total subscribers</p>
                    </div>
                    <button onClick={exportSubscribers} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-brand-500 hover:text-brand-700">
                      <Copy size={14} />
                      Copy CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left">
                      <thead className="border-b border-gray-200 text-[11px] font-black uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3">Subscribed</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 text-sm font-bold text-gray-900">{subscriber.email}</td>
                            <td className="px-5 py-4 text-sm text-gray-500">{new Date(subscriber.subscribedAt).toLocaleString(undefined, { dateStyle: 'medium' })}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <IconButton icon={copied === subscriber.email ? Check : Copy} label="Copy email" onClick={() => copyText(subscriber.email)} />
                                <IconButton icon={Trash2} label="Delete subscriber" tone="danger" onClick={() => deleteSubscriber(subscriber.id)} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {subscribers.length === 0 && <EmptyState icon={Mail} title="No subscribers yet" />}
                </div>
              )}
          </motion.div>
        </section>
      </div>

      <EditorPanel
        title={selectedService?.id ? 'Edit Service' : 'New Service'}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
      >
        {selectedService && (
          <form onSubmit={saveService} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="English Title">
                <input className={inputClass} value={selectedService.titleEn} onChange={(event) => setSelectedService({ ...selectedService, titleEn: event.target.value })} required />
              </Field>
              <Field label="Bangla Title">
                <input className={inputClass} value={selectedService.titleBn} onChange={(event) => setSelectedService({ ...selectedService, titleBn: event.target.value })} required />
              </Field>
            </div>
            <Field label="Category">
              <select className={inputClass} value={selectedService.categoryId} onChange={(event) => setSelectedService({ ...selectedService, categoryId: event.target.value })}>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.labelEn}</option>)}
              </select>
            </Field>
            <Field label="English Description">
              <textarea className={`${inputClass} min-h-28 resize-y`} value={selectedService.descEn} onChange={(event) => setSelectedService({ ...selectedService, descEn: event.target.value })} required />
            </Field>
            <Field label="Bangla Description">
              <textarea className={`${inputClass} min-h-28 resize-y`} value={selectedService.descBn} onChange={(event) => setSelectedService({ ...selectedService, descBn: event.target.value })} required />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Icon">
                <input className={inputClass} value={selectedService.icon} onChange={(event) => setSelectedService({ ...selectedService, icon: event.target.value })} required />
              </Field>
              <Field label="Theme">
                <select className={inputClass} value={selectedService.theme} onChange={(event) => setSelectedService({ ...selectedService, theme: event.target.value })}>
                  {['rose', 'cyan', 'purple', 'emerald', 'amber', 'blue'].map((theme) => <option key={theme} value={theme}>{theme}</option>)}
                </select>
              </Field>
              <Field label="Order">
                <input type="number" className={inputClass} value={selectedService.order} onChange={(event) => setSelectedService({ ...selectedService, order: Number(event.target.value) })} />
              </Field>
            </div>
            <SubmitButton saving={saving} label="Save Service" />
          </form>
        )}
      </EditorPanel>

      <EditorPanel
        title={selectedCase?.id ? 'Edit Case Study' : 'New Case Study'}
        open={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      >
        {selectedCase && (
          <form onSubmit={saveCaseStudy} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Client English">
                <input className={inputClass} value={selectedCase.clientEn} onChange={(event) => setSelectedCase({ ...selectedCase, clientEn: event.target.value })} required />
              </Field>
              <Field label="Client Bangla">
                <input className={inputClass} value={selectedCase.clientBn} onChange={(event) => setSelectedCase({ ...selectedCase, clientBn: event.target.value })} required />
              </Field>
              <Field label="Title English">
                <input className={inputClass} value={selectedCase.titleEn} onChange={(event) => setSelectedCase({ ...selectedCase, titleEn: event.target.value })} required />
              </Field>
              <Field label="Title Bangla">
                <input className={inputClass} value={selectedCase.titleBn} onChange={(event) => setSelectedCase({ ...selectedCase, titleBn: event.target.value })} required />
              </Field>
              <Field label="Category">
                <select className={inputClass} value={selectedCase.categoryId} onChange={(event) => setSelectedCase({ ...selectedCase, categoryId: event.target.value })}>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.labelEn}</option>)}
                </select>
              </Field>
              <Field label="Metric English">
                <input className={inputClass} value={selectedCase.metricsEn} onChange={(event) => setSelectedCase({ ...selectedCase, metricsEn: event.target.value })} required />
              </Field>
              <Field label="Metric Bangla">
                <input className={inputClass} value={selectedCase.metricsBn} onChange={(event) => setSelectedCase({ ...selectedCase, metricsBn: event.target.value })} required />
              </Field>
              <Field label="Image URL">
                <input className={inputClass} value={selectedCase.img} onChange={(event) => setSelectedCase({ ...selectedCase, img: event.target.value })} required />
              </Field>
            </div>
            <TextPair
              leftLabel="Summary English"
              rightLabel="Summary Bangla"
              leftValue={selectedCase.summaryEn}
              rightValue={selectedCase.summaryBn}
              onLeft={(value) => setSelectedCase({ ...selectedCase, summaryEn: value })}
              onRight={(value) => setSelectedCase({ ...selectedCase, summaryBn: value })}
            />
            <TextPair
              leftLabel="Challenge English"
              rightLabel="Challenge Bangla"
              leftValue={selectedCase.challengeEn}
              rightValue={selectedCase.challengeBn}
              onLeft={(value) => setSelectedCase({ ...selectedCase, challengeEn: value })}
              onRight={(value) => setSelectedCase({ ...selectedCase, challengeBn: value })}
            />
            <TextPair
              leftLabel="Solution English"
              rightLabel="Solution Bangla"
              leftValue={selectedCase.solutionEn}
              rightValue={selectedCase.solutionBn}
              onLeft={(value) => setSelectedCase({ ...selectedCase, solutionEn: value })}
              onRight={(value) => setSelectedCase({ ...selectedCase, solutionBn: value })}
            />
            <SubmitButton saving={saving} label="Save Case Study" />
          </form>
        )}
      </EditorPanel>

      <AnimatePresence>
        {toast.type !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
          >
            {toast.type === 'success' ? <CheckCircle2 className="mt-0.5 text-emerald-600" size={18} /> : <X className="mt-0.5 text-rose-600" size={18} />}
            <div>
              <div className="text-sm font-black">{toast.type === 'success' ? 'Saved' : 'Error'}</div>
              <div className="mt-0.5 text-sm text-gray-600">{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, tone = 'brand' }: { icon: React.ElementType; label: string; value: string; tone?: 'brand' | 'rose' }) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-gray-500">{label}</div>
          <div className="mt-2 text-3xl font-black text-gray-950">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-700'}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function IconButton({ icon: Icon, label, onClick, disabled, tone = 'neutral' }: { icon: React.ElementType; label: string; onClick: () => void; disabled?: boolean; tone?: 'neutral' | 'danger' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === 'danger'
          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
          : 'border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700'
      }`}
    >
      <Icon size={15} />
    </button>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-brand-400 hover:text-brand-700">
      <span className="flex items-center gap-2">
        <Icon size={16} />
        {label}
      </span>
      <Activity size={14} />
    </button>
  );
}

function EmptyState({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
      <Icon size={34} className="mb-3 text-gray-400" />
      <div className="text-sm font-bold">{title}</div>
    </div>
  );
}

function EditorPanel({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40 flex justify-end bg-gray-950/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="hidden flex-1 cursor-default lg:block" onClick={onClose} aria-label="Close editor" />
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl sm:max-w-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="font-serif text-2xl font-black">{title}</h2>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50">
                <X size={17} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-60">
      <Save size={15} />
      {saving ? 'Saving...' : label}
    </button>
  );
}

function TextPair({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  onLeft,
  onRight,
}: {
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
  onLeft: (value: string) => void;
  onRight: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label={leftLabel}>
        <textarea className={`${inputClass} min-h-28 resize-y`} value={leftValue} onChange={(event) => onLeft(event.target.value)} required />
      </Field>
      <Field label={rightLabel}>
        <textarea className={`${inputClass} min-h-28 resize-y`} value={rightValue} onChange={(event) => onRight(event.target.value)} required />
      </Field>
    </div>
  );
}
