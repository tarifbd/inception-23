'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CaseStudy } from '@/lib/types';

/**
 * Shared /api/casestudies data source. The endpoint responds with { data: CaseStudy[] } —
 * every previous call site (Header, CaseStudies section, admin panel) stored that wrapper
 * object directly instead of unwrapping .data, so caseStudies state ended up holding
 * an object rather than an array. Centralizing the fetch here fixes that for all consumers at once.
 */
export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/casestudies');
      if (res.ok) {
        const json = await res.json();
        setCaseStudies(Array.isArray(json?.data) ? json.data : []);
      }
    } catch (err) {
      console.error('useCaseStudies fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    window.addEventListener('config-updated', refetch);
    return () => window.removeEventListener('config-updated', refetch);
  }, [refetch]);

  return { caseStudies, setCaseStudies, loading, refetch };
}
