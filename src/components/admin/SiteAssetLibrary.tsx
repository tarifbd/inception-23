'use client';

import Image from 'next/image';
import {
  Box,
  Copy,
  ExternalLink,
  FileJson2,
  FileText,
  FileType2,
  Image as ImageIcon,
  LockKeyhole,
  Search,
  Trash2,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { SiteAsset, SiteAssetKind } from '@/lib/site-asset-types';
import { adminSecondaryButtonClass } from './AdminModuleShell';

const filters: Array<{ id: 'all' | SiteAssetKind; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'animation', label: 'Animations' },
  { id: 'font', label: 'Fonts' },
  { id: 'document', label: 'Documents' },
  { id: 'system', label: 'System' },
  { id: 'other', label: 'Other' },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function AssetPlaceholder({ kind, extension }: { kind: SiteAssetKind; extension: string }) {
  const Icon = kind === 'animation'
    ? FileJson2
    : kind === 'font'
      ? FileType2
      : kind === 'video'
        ? Video
        : kind === 'document'
          ? FileText
          : kind === 'image'
            ? ImageIcon
            : Box;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-gray-400 dark:bg-night-800">
      <Icon size={34} strokeWidth={1.5} />
      <span className="mt-3 text-[10px] font-semibold uppercase text-gray-500">{extension}</span>
    </div>
  );
}

export function SiteAssetLibrary({
  assets,
  onCopy,
  onDelete,
}: {
  assets: SiteAsset[];
  onCopy: (url: string) => void | Promise<void>;
  onDelete: (asset: SiteAsset) => void | Promise<void>;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | SiteAssetKind>('all');
  const filteredAssets = useMemo(() => {
    const term = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesKind = filter === 'all' || asset.kind === filter;
      const matchesTerm = !term || [asset.name, asset.fileName, asset.url, asset.extension, ...asset.usage]
        .join(' ')
        .toLowerCase()
        .includes(term);
      return matchesKind && matchesTerm;
    });
  }, [assets, filter, query]);

  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-black">Complete asset library</h2>
          <p className="mt-1 text-sm text-gray-500">Built-in website files and uploaded media in one searchable place.</p>
        </div>
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search assets</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filename, path, or usage"
            className="ui-field h-11 w-full pl-10 pr-3 text-sm"
          />
        </label>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`min-h-9 shrink-0 rounded-md px-3 text-xs font-semibold transition ${
              filter === item.id ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold text-gray-500">{filteredAssets.length} of {assets.length} assets</p>
        <p className="text-xs text-gray-400">Built-in files are protected</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredAssets.map((asset) => (
          <article key={asset.id} className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-900">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-night-800">
              {asset.kind === 'image' ? (
                <Image
                  src={asset.url}
                  alt={asset.altText || `${asset.name} asset preview`}
                  fill
                  sizes="(min-width: 1536px) 24vw, (min-width: 640px) 36vw, 92vw"
                  unoptimized
                  className="object-contain p-3"
                />
              ) : asset.kind === 'video' ? (
                <video src={asset.url} className="h-full w-full object-contain" muted playsInline controls preload="metadata" />
              ) : (
                <AssetPlaceholder kind={asset.kind} extension={asset.extension} />
              )}
              <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                <span className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${asset.source === 'built-in' ? 'bg-brand-950 text-white' : 'bg-emerald-600 text-white'}`}>
                  {asset.source === 'built-in' ? 'Built-in' : 'Uploaded'}
                </span>
                <span className="rounded bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase text-gray-600 shadow-sm">{asset.kind}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-950" title={asset.fileName}>{asset.fileName}</h3>
                  <p className="mt-1 truncate font-mono text-[10px] text-gray-400" title={asset.url}>{asset.url}</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-gray-400">{formatBytes(asset.size)}</span>
              </div>

              <div className="mt-3 min-h-8">
                {asset.usage.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {asset.usage.slice(0, 3).map((usage) => <span key={usage} className="rounded bg-cyan-50 px-2 py-1 text-[9px] font-semibold text-cyan-800">{usage}</span>)}
                    {asset.usage.length > 3 ? <span className="rounded bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-500">+{asset.usage.length - 3}</span> : null}
                  </div>
                ) : <span className="text-[10px] font-medium text-amber-600">No CMS reference detected</span>}
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
                <button type="button" onClick={() => onCopy(asset.url)} className={adminSecondaryButtonClass}><Copy size={14} /> Copy URL</button>
                <a href={asset.url} target="_blank" rel="noreferrer" aria-label={`Open ${asset.fileName}`} title="Open asset" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700"><ExternalLink size={15} /></a>
                {asset.readOnly ? (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400" title="Protected built-in asset"><LockKeyhole size={15} /></span>
                ) : (
                  <button type="button" onClick={() => onDelete(asset)} aria-label={`Delete ${asset.fileName}`} title="Delete media" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filteredAssets.length ? (
        <div className="border-t border-gray-200 py-14 text-center">
          <Search className="mx-auto text-gray-300" size={34} />
          <p className="mt-3 text-sm font-semibold text-gray-600">No assets match this search.</p>
        </div>
      ) : null}
    </section>
  );
}

