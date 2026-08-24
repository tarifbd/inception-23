'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@/lib/types';

/**
 * Shared /api/config data source. Every component that needs the pillar/service
 * categories should use this instead of hand-rolling its own fetch+useEffect —
 * they all listen for the same 'config-updated' event the admin panel dispatches
 * after a save, so centralizing it here means one fetch call per event, not one per consumer.
 */
export function useSiteConfig() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error('useSiteConfig fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    window.addEventListener('config-updated', refetch);
    return () => window.removeEventListener('config-updated', refetch);
  }, [refetch]);

  return { categories, setCategories, loading, refetch };
}
