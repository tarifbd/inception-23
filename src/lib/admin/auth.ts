import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

const allowedRoles = new Set([
  'super-admin',
  'admin',
  'seo-manager',
  'content-manager',
  'marketing-manager',
  'support',
]);
const minimumProductionPasswordLength = 24;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseBasicAuth(header: string | null) {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function isLocalRequest(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function hasConfiguredAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return false;
  if (process.env.NODE_ENV !== 'production') return true;
  return (
    username.trim().length >= 3 &&
    password.length >= minimumProductionPasswordLength &&
    !safeEqual(username, password)
  );
}

export function authenticateAdminRequest(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!hasConfiguredAdminCredentials() || !expectedUsername || !expectedPassword) {
    return process.env.NODE_ENV !== 'production' && isLocalRequest(request);
  }

  const credentials = parseBasicAuth(request.headers.get('authorization'));
  return Boolean(
    credentials &&
      safeEqual(credentials.username, expectedUsername) &&
      safeEqual(credentials.password, expectedPassword),
  );
}

export function getConfiguredAdminRole() {
  const role = process.env.ADMIN_ROLE || 'admin';
  return allowedRoles.has(role) ? role : 'admin';
}

export function isSameOriginMutation(request: NextRequest) {
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') return true;
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function adminUnauthorizedResponse(isApiRequest = true) {
  const headers = {
    'Cache-Control': 'no-store',
    'WWW-Authenticate': 'Basic realm="Inception 23 Admin", charset="UTF-8"',
  };

  return isApiRequest
    ? Response.json({ error: 'Admin authentication required' }, { status: 401, headers })
    : new Response('Authentication required', { status: 401, headers });
}
