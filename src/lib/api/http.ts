export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: message, details }, { status });
}

export async function readJson<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}

export function assertString(value: unknown, field: string, maxLength = 5000) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long`);
  }
  return trimmed;
}

export function optionalString(value: unknown, maxLength = 5000) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new Error('Expected string');
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new Error('Value is too long');
  return trimmed;
}

export function jsonString(value: unknown) {
  return value === undefined || value === null ? null : JSON.stringify(value);
}

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
