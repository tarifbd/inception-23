export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: message, details }, { status });
}

export async function readJson<T = unknown>(request: Request, maxBytes = 64 * 1024): Promise<T> {
  const declaredLength = Number.parseInt(request.headers.get('content-length') || '0', 10);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error('Request body is too large');
  }

  try {
    if (!request.body) throw new Error('Invalid JSON body');
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error('Request body is too large');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof Error && error.message === 'Request body is too large') throw error;
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
