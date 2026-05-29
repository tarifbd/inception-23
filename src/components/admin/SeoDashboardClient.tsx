'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { AdminModuleShell, AdminStatCard, adminButtonClass, adminCardClass, adminInputClass } from './AdminModuleShell';

type SeoDashboard = {
  total_indexable_pages: number;
  missing_meta_title_count: number;
  missing_meta_description_count: number;
  poor_seo_score_count: number;
  duplicate_title_count: number;
  duplicate_description_count: number;
  active_redirect_count: number;
  sitemap_url_count: number;
  recent_audits: Array<{ id: string; entityType: string; score: number; status: string; createdAt: string }>;
};

const seoNav = [
  { href: '/admin/seo', label: 'Dashboard' },
  { href: '/admin/seo/products', label: 'Products' },
  { href: '/admin/seo/redirects', label: 'Redirects' },
  { href: '/admin/seo/sitemap', label: 'Sitemap' },
  { href: '/admin/seo/robots', label: 'Robots' },
  { href: '/admin/seo/image-alt-texts', label: 'Image Alts' },
  { href: '/admin/seo/settings', label: 'Settings' },
];

export function SeoDashboardClient() {
  const [dashboard, setDashboard] = useState<SeoDashboard | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSlug, setQuickSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    const res = await fetch('/api/v1/admin/seo/dashboard');
    if (res.ok) setDashboard(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createHomeMetadata() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/admin/seo/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'HOME',
          entityId: 'home',
          seoTitle: quickTitle || 'Inception 23 | Premium Advisory & Solutions',
          metaDescription: 'Strategic advisory, AI systems, management consultancy, legal support, and creative solutions for modern business growth.',
          slug: quickSlug || '',
          focusKeyword: 'advisory solutions',
          schemaType: 'Organization',
          schemaJson: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Inception 23' },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create metadata');
      setMessage('SEO metadata created.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Create failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModuleShell title="Advanced SEO" eyebrow="Search control center" nav={seoNav}>
      <div className="grid gap-4 md:grid-cols-4">
        <AdminStatCard label="Indexable Pages" value={dashboard?.total_indexable_pages ?? 0} tone="emerald" />
        <AdminStatCard label="Missing Titles" value={dashboard?.missing_meta_title_count ?? 0} tone="rose" />
        <AdminStatCard label="Missing Descriptions" value={dashboard?.missing_meta_description_count ?? 0} tone="rose" />
        <AdminStatCard label="Poor Scores" value={dashboard?.poor_seo_score_count ?? 0} tone="cyan" />
        <AdminStatCard label="Duplicate Titles" value={dashboard?.duplicate_title_count ?? 0} />
        <AdminStatCard label="Duplicate Descriptions" value={dashboard?.duplicate_description_count ?? 0} />
        <AdminStatCard label="Active Redirects" value={dashboard?.active_redirect_count ?? 0} />
        <AdminStatCard label="Sitemap Entries" value={dashboard?.sitemap_url_count ?? 0} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_420px]">
        <section className={`${adminCardClass} p-5`}>
          <h2 className="font-serif text-xl font-black">Recent SEO Audits</h2>
          <div className="mt-4 grid gap-3">
            {dashboard?.recent_audits?.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm">
                <span className="font-bold">{audit.entityType}</span>
                <span className={audit.status === 'GOOD' ? 'font-black text-emerald-700' : audit.status === 'POOR' ? 'font-black text-rose-600' : 'font-black text-amber-600'}>{audit.score}/100 {audit.status}</span>
              </div>
            ))}
            {!dashboard?.recent_audits?.length && <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">No SEO audits yet.</div>}
          </div>
        </section>

        <section className={`${adminCardClass} p-5`}>
          <h2 className="font-serif text-xl font-black">Quick Metadata</h2>
          <p className="mt-2 text-sm text-gray-600">Create a first homepage SEO record, then expand from products/categories/pages.</p>
          <div className="mt-4 space-y-3">
            <input className={adminInputClass} value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} placeholder="SEO title" />
            <input className={adminInputClass} value={quickSlug} onChange={(e) => setQuickSlug(e.target.value)} placeholder="Slug, e.g. /" />
            <button onClick={createHomeMetadata} disabled={loading} className={adminButtonClass}>
              {loading ? <Loader2 className="animate-spin" size={15} /> : <Search size={15} />}
              Create metadata
            </button>
            {message && <p className="rounded-lg bg-gray-50 p-3 text-sm font-bold text-gray-700">{message}</p>}
          </div>
        </section>
      </div>
    </AdminModuleShell>
  );
}

export { seoNav };
