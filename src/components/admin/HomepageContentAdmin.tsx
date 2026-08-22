'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Copy, Eye, ImagePlus, Plus, RotateCcw, Save, Trash2, Upload } from 'lucide-react';
import {
  AdminField,
  AdminLoadingSkeleton,
  AdminModuleShell,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from '@/components/admin/AdminModuleShell';
import type { HomepageContent } from '@/lib/homepage-content';

type MediaAsset = { id: string; name: string; url: string; altText: string; mimeType: string };

export function HomepageContentAdmin() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch('/api/v1/admin/homepage').then((response) => response.json()),
      fetch('/api/v1/admin/cms/media').then((response) => response.json()),
    ])
      .then(([homepagePayload, mediaPayload]) => {
        setContent(homepagePayload.data);
        setAssets(Array.isArray(mediaPayload.data) ? mediaPayload.data : []);
      })
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

  const updateSlide = (index: number, patch: Partial<HomepageContent['hero']['slides'][number]>) => {
    if (!content) return;
    const slides = [...content.hero.slides];
    slides[index] = { ...slides[index], ...patch };
    setContent({ ...content, hero: { ...content.hero, slides } });
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    if (!content) return;
    const target = index + direction;
    if (!content.hero.slides[target]) return;
    const slides = [...content.hero.slides];
    [slides[index], slides[target]] = [slides[target], slides[index]];
    setContent({ ...content, hero: { ...content.hero, slides } });
  };

  const duplicateSlide = (index: number) => {
    if (!content) return;
    const source = content.hero.slides[index];
    const duplicate = {
      ...structuredClone(source),
      id: `hero-${crypto.randomUUID()}`,
      label: `${source.label} copy`,
    };
    const slides = [...content.hero.slides.slice(0, index + 1), duplicate, ...content.hero.slides.slice(index + 1)];
    setContent({ ...content, hero: { ...content.hero, slides } });
    setMessage('Hero slide duplicated. Save all to publish.');
  };

  const addSlide = () => {
    if (!content) return;
    const source = content.hero.slides[0];
    const slide = {
      ...structuredClone(source),
      id: `hero-${crypto.randomUUID()}`,
      theme: 'it' as const,
      label: 'New hero slide',
      eyebrow: 'New service story',
      title: 'Add your headline',
      highlight: 'and highlighted outcome',
      copy: 'Add the supporting description for this hero slide.',
      chips: ['Capability one', 'Capability two'],
    };
    setContent({ ...content, hero: { ...content.hero, slides: [...content.hero.slides, slide] } });
    setMessage('New hero slide added. Save all to publish.');
  };

  const deleteSlide = (index: number) => {
    if (!content || content.hero.slides.length <= 1) return;
    setContent({ ...content, hero: { ...content.hero, slides: content.hero.slides.filter((_, itemIndex) => itemIndex !== index) } });
    setMessage('Hero slide removed. Save all to publish.');
  };

  const uploadSlideMedia = async (event: React.FormEvent<HTMLFormElement>, slideIndex: number) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch('/api/v1/admin/cms/media', { method: 'POST', body: new FormData(form) });
    const payload = await response.json();
    if (!response.ok) return setMessage(payload.error || 'Media upload failed.');
    const asset = payload.data as MediaAsset;
    setAssets((current) => [asset, ...current]);
    updateSlide(slideIndex, {
      visualUrl: asset.url,
      visualType: asset.mimeType.startsWith('video/') ? 'video' : 'image',
      visualAlt: asset.altText || asset.name,
    });
    form.reset();
    setMessage('Media uploaded and selected. Save all to publish.');
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
        <AdminLoadingSkeleton rows={5} />
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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Hero</p>
                <h2 className="mt-1 font-serif text-2xl font-black">Hero controls and slides</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={addSlide} className={adminSecondaryButtonClass}><Plus size={15} /> Add slide</button>
                <label className="flex items-center gap-2 text-sm font-black">
                  <input type="checkbox" checked={content.hero.enabled} onChange={(event) => setContent({ ...content, hero: { ...content.hero, enabled: event.target.checked } })} />
                  Show hero
                </label>
              </div>
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
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-brand-700">Slide {index + 1}</p>
                      <p className="mt-1 text-xs font-bold text-gray-400">{slide.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select className={adminInputClass} value={slide.theme || 'it'} onChange={(event) => updateSlide(index, { theme: event.target.value as NonNullable<typeof slide.theme> })} aria-label="Slide color theme">
                        <option value="it">Technology theme</option>
                        <option value="consultancy">Consultancy theme</option>
                        <option value="legal">Legal theme</option>
                        <option value="creative">Creative theme</option>
                      </select>
                      <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className={adminSecondaryButtonClass} aria-label="Move slide up"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === content.hero.slides.length - 1} className={adminSecondaryButtonClass} aria-label="Move slide down"><ArrowDown size={14} /></button>
                      <button type="button" onClick={() => duplicateSlide(index)} className={adminSecondaryButtonClass} aria-label="Duplicate slide"><Copy size={14} /></button>
                      <button type="button" onClick={() => deleteSlide(index)} disabled={content.hero.slides.length <= 1} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Delete slide"><Trash2 size={14} /></button>
                    </div>
                  </div>
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
                      updateSlide(index, { chips: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) });
                    }} />
                  </AdminField>
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-brand-700">Hero visual</p>
                        <p className="mt-1 text-xs font-bold text-gray-500">Change image, video, or lottie for this slide.</p>
                      </div>
                      <select
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-black uppercase"
                        value={slide.visualType || 'lottie'}
                        onChange={(event) => updateSlide(index, { visualType: event.target.value as HomepageContent['hero']['slides'][number]['visualType'] })}
                      >
                        <option value="lottie">Lottie</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
                      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {slide.visualType === 'video' && slide.visualUrl ? (
                          <video src={slide.visualUrl} className="h-full w-full object-contain" controls playsInline />
                        ) : slide.visualType === 'image' && slide.visualUrl ? (
                          <Image
                            src={slide.visualUrl}
                            alt={slide.visualAlt || 'Hero visual preview'}
                            width={320}
                            height={180}
                            unoptimized
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImagePlus className="text-gray-300" size={32} />
                        )}
                      </div>
                      <div className="space-y-3">
                        <AdminField label="Visual URL">
                          <input
                            className={adminInputClass}
                            value={slide.visualUrl || ''}
                            onChange={(event) => updateSlide(index, { visualUrl: event.target.value })}
                            placeholder="/uploads/cms/file.webp, /animations/file.json, or video URL"
                          />
                        </AdminField>
                        <AdminField label="Alt / label">
                          <input
                            className={adminInputClass}
                            value={slide.visualAlt || ''}
                            onChange={(event) => updateSlide(index, { visualAlt: event.target.value })}
                            placeholder="Describe the visual"
                          />
                        </AdminField>
                        <select
                          className={adminInputClass}
                          value=""
                          onChange={(event) => {
                            const asset = assets.find((item) => item.url === event.target.value);
                            if (!asset) return;
                            updateSlide(index, {
                              visualUrl: asset.url,
                              visualType: asset.mimeType.startsWith('video/') ? 'video' : 'image',
                              visualAlt: asset.altText || asset.name,
                            });
                          }}
                        >
                          <option value="">Choose uploaded image/video</option>
                          {assets.map((asset) => <option key={asset.id} value={asset.url}>{asset.name}</option>)}
                        </select>
                        <form onSubmit={(event) => uploadSlideMedia(event, index)} className="flex flex-col gap-2 sm:flex-row">
                          <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" required className={`${adminInputClass} file:mr-2 file:border-0 file:bg-transparent file:text-xs file:font-bold`} />
                          <button className={adminSecondaryButtonClass}><Upload size={14} /> Upload</button>
                        </form>
                      </div>
                    </div>
                  </div>
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
