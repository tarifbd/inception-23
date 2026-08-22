import type { NextRequest } from 'next/server';

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  inception23RateLimits?: Map<string, RateLimitRecord>;
};

const store = globalRateLimit.inception23RateLimits ?? new Map<string, RateLimitRecord>();
globalRateLimit.inception23RateLimits = store;

function requestIdentity(request: NextRequest) {
  return (
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  ).slice(0, 100);
}

function pruneExpired(now: number) {
  if (store.size < 5000) return;
  for (const [key, value] of store) {
    if (value.resetAt <= now) store.delete(key);
  }
}

export function checkRateLimit(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  pruneExpired(now);
  const id = `${options.key}:${requestIdentity(request)}`;
  const previous = store.get(id);
  const record = !previous || previous.resetAt <= now
    ? { count: 1, resetAt: now + options.windowMs }
    : { count: previous.count + 1, resetAt: previous.resetAt };

  store.set(id, record);

  return {
    allowed: record.count <= options.limit,
    headers: {
      'RateLimit-Limit': String(options.limit),
      'RateLimit-Remaining': String(Math.max(0, options.limit - record.count)),
      'RateLimit-Reset': String(Math.ceil(record.resetAt / 1000)),
      'Cache-Control': 'no-store',
    },
  };
}
