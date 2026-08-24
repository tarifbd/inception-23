// Best-effort, in-memory sliding-window rate limiter keyed by client IP + route.
// This is per-instance state: fine for a single Node server, but it will NOT coordinate
// across multiple serverless instances/regions. A real multi-instance deploy would need
// a shared store (e.g. Upstash Redis) instead.

const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number = WINDOW_MS): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((ts) => now - ts < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > limit;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
