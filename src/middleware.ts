import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  adminUnauthorizedResponse,
  authenticateAdminRequest,
  isSameOriginMutation,
} from '@/lib/admin/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';

export function middleware(request: NextRequest) {
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  if (!authenticateAdminRequest(request)) {
    const rateLimit = checkRateLimit(request, {
      key: 'admin-auth-failure',
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return Response.json(
        { error: 'Too many authentication attempts. Try again later.' },
        { status: 429, headers: rateLimit.headers },
      );
    }
    const response = adminUnauthorizedResponse(isApiRequest);
    Object.entries(rateLimit.headers).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
  if (!isSameOriginMutation(request)) {
    return Response.json({ error: 'Cross-origin admin mutation blocked' }, { status: 403 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-admin-role');
  requestHeaders.delete('x-inception-admin-authenticated');

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/v1/admin/:path*'],
  runtime: 'nodejs',
};
