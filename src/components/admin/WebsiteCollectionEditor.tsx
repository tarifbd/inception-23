'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ImagePlus, Plus, RefreshCw, RotateCcw, Save, Trash2, Upload } from 'lucide-react';
import {
  AdminField,
  AdminModuleShell,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from './AdminModuleShell';
import type { CollectionDefinition, CollectionField, CollectionRecord } from '@/lib/website-collections';

type MediaAsset = { id: string; name: string; url: string; altText: string; mimeType: string };

export function WebsiteCollectionEditor({ collection }: { collection: string }) {
  const [definition, setDefinition] = useState<CollectionDefinition | null>(null);
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [contentResponse, mediaResponse] = await Promise.all([
        fetch(`/api/v1/admin/website-content/${collection}`),
        fetch('/api/v1/admin/cms/media'),
      ]);
      const [contentPayload, mediaPayload] = await Promise.all([contentResponse.json(), mediaResponse.json()]);
      if (!contentResponse.ok) throw new Error(contentPayload.error || 'Could not load content');
      setDefinition(contentPayload.definition);
      setRecords(contentPayload.data);
      setAssets(mediaResponse.ok ? mediaPayload.data : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load content');
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const response = await fetch(`/api/v1/admin/website-content/${collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(payload.error || 'Could not save content');
    setRecords(payload.data);
    setMessage(`${definition?.title || 'Content'} saved and published.`);
  };

  const reset = async () => {
    if (!window.confirm('Reset this collection to the current website defaults?')) return;
    const response = await fetch(`/api/v1/admin/website-content/${collection}`, { method: 'DELETE' });
    const payload = await response.json();
    setRecords(payload.data);
    setMessage('Collection reset to defaults.');
  };

  const updateRecord = (index: number, key: string, value: unknown) => {
    setRecords((current) => current.map((record, recordIndex) => recordIndex === index ? { ...record, [key]: value } : record));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (!records[target]) return;
    const next = [...records];
    [next[index], next[target]] = [next[target], next[index]];
    setRecords(next);
  };

  const add = () => {
    if (!definition) return;
    const blank = Object.fromEntries(definition.fields.map((field) => [field.key, field.type === 'tags' ? [] : '']));
    setRecords((current) => [...current, { id: `${collection}-${crypto.randomUUID()}`, ...blank }]);
  };

  const uploadImage = async (event: FormEvent<HTMLFormElement>, recordIndex: number, field: CollectionField) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch('/api/v1/admin/cms/media', { method: 'POST', body: new FormData(form) });
    const payload = await response.json();
    if (!response.ok) return setMessage(payload.error || 'Media upload failed');
    updateRecord(recordIndex, field.key, payload.data.url);
    setAssets((current) => [payload.data, ...current]);
    form.reset();
    setMessage('Media uploaded and selected. Save the collection to publish it.');
  };

  return (
    <AdminModuleShell
      title={definition?.title || 'Website Content'}
      eyebrow="Add, upload, delete, reorder, and change"
      nav={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/website', label: 'Website CMS' },
        { href: '/', label: 'View website' },
      ]}
    >
      <div className="sticky top-3 z-30 mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-gray-700">{message || definition?.description || 'Loading content...'}</p>
          <p className="mt-1 text-xs text-gray-400">{records.length} item{records.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} disabled={loading} className={adminSecondaryButtonClass}><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
          <button onClick={reset} className={adminSecondaryButtonClass}><RotateCcw size={15} /> Reset</button>
          <button onClick={add} className={adminSecondaryButtonClass}><Plus size={15} /> Add {definition?.singular || 'item'}</button>
          <button onClick={save} disabled={saving} className={adminButtonClass}><Save size={15} /> {saving ? 'Saving...' : 'Save all'}</button>
        </div>
      </div>

      <div className="space-y-4">
        {records.map((record, index) => (
          <article key={record.id} className={`${adminCardClass} p-5`}>
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Item {index + 1}</p>
                <h2 className="mt-1 font-serif text-xl font-black">{String(record.title || record.name || record.label || definition?.singular || 'Content item')}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => move(index, -1)} disabled={index === 0} className={adminSecondaryButtonClass} aria-label="Move up"><ArrowUp size={14} /></button>
                <button onClick={() => move(index, 1)} disabled={index === records.length - 1} className={adminSecondaryButtonClass} aria-label="Move down"><ArrowDown size={14} /></button>
                <button onClick={() => setRecords((current) => current.filter((_, recordIndex) => recordIndex !== index))} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label="Delete item"><Trash2 size={15} /></button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {definition?.fields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={record[field.key]}
                  assets={assets}
                  onChange={(value) => updateRecord(index, field.key, value)}
                  onUpload={(event) => uploadImage(event, index, field)}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      {!loading && records.length === 0 ? (
        <div className={`${adminCardClass} p-12 text-center`}>
          <p className="font-black text-gray-900">No items in this collection.</p>
          <button onClick={add} className={`${adminButtonClass} mt-4`}><Plus size={15} /> Add first item</button>
        </div>
      ) : null}
    </AdminModuleShell>
  );
}

function FieldEditor({
  field,
  value,
  assets,
  onChange,
  onUpload,
}: {
  field: CollectionField;
  value: unknown;
  assets: MediaAsset[];
  onChange: (value: unknown) => void;
  onUpload: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const stringValue = Array.isArray(value) ? value.join('\n') : String(value ?? '');
  const spanClass = field.type === 'textarea' || field.type === 'image' || field.type === 'video' ? 'md:col-span-2' : '';

  if (field.type === 'textarea') {
    return <div className={spanClass}><AdminField label={field.label}><textarea className={`${adminInputClass} min-h-28 resize-y`} value={stringValue} onChange={(event) => onChange(event.target.value)} /></AdminField></div>;
  }

  if (field.type === 'tags') {
    return <div className={spanClass}><AdminField label={`${field.label} (one per line)`}><textarea className={`${adminInputClass} min-h-24 resize-y`} value={stringValue} onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} /></AdminField></div>;
  }

  if (field.type === 'select') {
    return <div className={spanClass}><AdminField label={field.label}><select className={adminInputClass} value={stringValue} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option} value={option}>{option || 'None'}</option>)}</select></AdminField></div>;
  }

  if (field.type === 'color') {
    return (
      <div className={spanClass}>
        <AdminField label={field.label}>
          <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
            <input type="color" className="h-11 w-full rounded-lg border border-gray-200 bg-white p-1" value={stringValue || '#0f172a'} onChange={(event) => onChange(event.target.value)} />
            <input className={adminInputClass} value={stringValue} onChange={(event) => onChange(event.target.value)} placeholder="#0f172a" />
          </div>
        </AdminField>
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div className={spanClass}>
        <AdminField label={field.label}>
          <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {stringValue ? <img src={stringValue} alt="" className="h-full w-full object-contain" /> : <ImagePlus className="text-gray-300" size={30} />}
            </div>
            <div className="space-y-3">
              <input className={adminInputClass} value={stringValue} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/cms/..." />
              <select className={adminInputClass} value="" onChange={(event) => event.target.value && onChange(event.target.value)}>
                <option value="">Choose from media library</option>
                {assets.filter((asset) => asset.mimeType?.startsWith('image/')).map((asset) => <option key={asset.id} value={asset.url}>{asset.name}</option>)}
              </select>
              <form onSubmit={onUpload} className="flex flex-col gap-2 sm:flex-row">
                <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required className={`${adminInputClass} file:mr-2 file:border-0 file:bg-transparent file:text-xs file:font-bold`} />
                <button className={adminSecondaryButtonClass}><Upload size={14} /> Upload</button>
              </form>
            </div>
          </div>
        </AdminField>
      </div>
    );
  }

  if (field.type === 'video') {
    return (
      <div className={spanClass}>
        <AdminField label={field.label}>
          <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {stringValue ? <video src={stringValue} className="h-full w-full object-contain" controls playsInline /> : <ImagePlus className="text-gray-300" size={30} />}
            </div>
            <div className="space-y-3">
              <input className={adminInputClass} value={stringValue} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/cms/video.mp4 or YouTube/Vimeo URL" />
              <select className={adminInputClass} value="" onChange={(event) => event.target.value && onChange(event.target.value)}>
                <option value="">Choose video from media library</option>
                {assets.filter((asset) => asset.mimeType?.startsWith('video/')).map((asset) => <option key={asset.id} value={asset.url}>{asset.name}</option>)}
              </select>
              <form onSubmit={onUpload} className="flex flex-col gap-2 sm:flex-row">
                <input type="file" name="file" accept="video/mp4,video/webm,video/quicktime" required className={`${adminInputClass} file:mr-2 file:border-0 file:bg-transparent file:text-xs file:font-bold`} />
                <button className={adminSecondaryButtonClass}><Upload size={14} /> Upload</button>
              </form>
            </div>
          </div>
        </AdminField>
      </div>
    );
  }

  return (
    <div className={spanClass}>
      <AdminField label={field.label}>
        <input className={adminInputClass} value={stringValue} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} />
      </AdminField>
    </div>
  );
}
