'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Eye, RotateCcw, Save } from 'lucide-react';
import {
  AdminField,
  AdminModuleShell,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from '@/components/admin/AdminModuleShell';
import type { HomepageContent } from '@/lib/homepage-content';

export function HomepageContentAdmin() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    fetch('/api/v1/admin/homepage')
      .then((response) => response.json())
      .then((payload) => setContent(payload.data))
      .catch(() => setMessage('Could not load homepage content.'));
  }, []);

  if (!mounted) return null;

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/v1/admin/homepage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(payload.error || 'Could not save homepage content.');
    setContent(payload.data);
    setMessage('Homepage content saved.');
  };

  const reset = async () => {
    if (!confirm('Reset all homepage content to the current defaults?')) return;
    const response = await fetch('/api/v1/admin/homepage', { method: 'DELETE' });
    const payload = await response.json();
    setContent(payload.data);
    setMessage('Homepage content reset to defaults.');
  };

  const updateSection = (index: number, patch: Partial<HomepageContent['sections'][number]>) => {
    if (!content) return;
    const sections = [...content.sections];
    sections[index] = { ...sections[index], ...patch };
    setContent({ ...content, sections });
  };

  const moveSection = (sourceIndex: number, direction: -1 | 1) => {
    if (!content) return;
    const sorted = [...content.sections].sort((a, b) => a.order - b.order);
    const current = sorted.findIndex((item) => item.key === content.sections[sourceIndex].key);
    const target = current + direction;
    if (!sorted[target]) return;
    [sorted[current], sorted[target]] = [sorted[target], sorted[current]];
    const order = new Map(sorted.map((item, index) => [item.key, (index + 1) * 10]));
    setContent({ ...content, sections: content.sections.map((item) => ({ ...item, order: order.get(item.key) ?? item.order })) });
  };

  return (
    <AdminModuleShell title="Homepage CMS" eyebrow="Live website content" nav={[{ href: '/', label: 'View website' }]}>
      {!content ? (
        <div className={`${adminCardClass} p-8 text-sm font-bold text-gray-500`}>Loading homepage content...</div>
      ) : (
        <div className="space-y-6">
          <div className="sticky top-3 z-30 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-sm font-bold ${message.includes('Could not') ? 'text-rose-600' : 'text-emerald-700'}`}>
              {message || 'Save to publish changes on the homepage.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/" target="_blank" className={adminSecondaryButtonClass}><Eye size={15} /> Preview</Link>
              <button type="button" onClick={reset} className={adminSecondaryButtonClass}><RotateCcw size={15} /> Reset</button>
              <button type="button" onClick={save} disabled={saving} className={adminButtonClass}><Save size={15} /> {saving ? 'Saving...' : 'Save all'}</button>
            </div>
          </div>

          <section className={`${adminCardClass} p-5`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Hero</p>
                <h2 className="mt-1 font-serif text-2xl font-black">Hero controls and slides</h2>
              </div>
              <label className="flex items-center gap-2 text-sm font-black">
                <input type="checkbox" checked={content.hero.enabled} onChange={(event) => setContent({ ...content, hero: { ...content.hero, enabled: event.target.checked } })} />
                Show hero
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(['primaryCtaLabel', 'primaryCtaHref', 'secondaryCtaLabel', 'secondaryCtaHref', 'footerLabel'] as const).map((field) => (
                <AdminField key={field} label={field.replace(/([A-Z])/g, ' $1')}>
                  <input className={adminInputClass} value={content.hero[field]} onChange={(event) => setContent({ ...content, hero: { ...content.hero, [field]: event.target.value } })} />
                </AdminField>
              ))}
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {content.hero.slides.map((slide, index) => (
                <article key={slide.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-4 text-xs font-black uppercase tracking-wider text-brand-700">{slide.id} slide</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(['label', 'eyebrow', 'title', 'highlight'] as const).map((field) => (
                      <AdminField key={field} label={field}>
                        <input className={adminInputClass} value={slide[field]} onChange={(event) => {
                          const slides = [...content.hero.slides];
                          slides[index] = { ...slide, [field]: event.target.value };
                          setContent({ ...content, hero: { ...content.hero, slides } });
                        }} />
                      </AdminField>
                    ))}
                  </div>
                  <AdminField label="Description">
                    <textarea className={`${adminInputClass} mt-3 min-h-24`} value={slide.copy} onChange={(event) => {
                      const slides = [...content.hero.slides];
                      slides[index] = { ...slide, copy: event.target.value };
                      setContent({ ...content, hero: { ...content.hero, slides } });
                    }} />
                  </AdminField>
                  <AdminField label="Chips, one per line">
                    <textarea className={`${adminInputClass} mt-3 min-h-24`} value={slide.chips.join('\n')} onChange={(event) => {
                      const slides = [...content.hero.slides];
                      slides[index] = { ...slide, chips: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) };
                      setContent({ ...content, hero: { ...content.hero, slides } });
                    }} />
                  </AdminField>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand-700">Page sections</p>
              <h2 className="mt-1 font-serif text-2xl font-black">Visibility, order, and copy</h2>
            </div>
            {[...content.sections].sort((a, b) => a.order - b.order).map((section) => {
              const index = content.sections.findIndex((item) => item.key === section.key);
              return (
                <article key={section.key} className={`${adminCardClass} p-5`}>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-xs font-black uppercase tracking-wider text-brand-700">{section.key}</p><h3 className="mt-1 text-xl font-black">{section.label}</h3></div>
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Move up" onClick={() => moveSection(index, -1)} className={adminSecondaryButtonClass}><ArrowUp size={15} /></button>
                      <button type="button" aria-label="Move down" onClick={() => moveSection(index, 1)} className={adminSecondaryButtonClass}><ArrowDown size={15} /></button>
                      <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black uppercase"><input type="checkbox" checked={section.enabled} onChange={(event) => updateSection(index, { enabled: event.target.checked })} /> Visible</label>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Eyebrow"><input className={adminInputClass} value={section.eyebrow} onChange={(event) => updateSection(index, { eyebrow: event.target.value })} /></AdminField>
                    <AdminField label="Title"><input className={adminInputClass} value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} /></AdminField>
                  </div>
                  <AdminField label="Description"><textarea className={`${adminInputClass} mt-4 min-h-24`} value={section.description} onChange={(event) => updateSection(index, { description: event.target.value })} /></AdminField>
                  {section.supportingText !== undefined ? (
                    <AdminField label="Supporting text"><textarea className={`${adminInputClass} mt-4 min-h-20`} value={section.supportingText} onChange={(event) => updateSection(index, { supportingText: event.target.value })} /></AdminField>
                  ) : null}
                </article>
              );
            })}
          </section>
        </div>
      )}
    </AdminModuleShell>
  );
}
