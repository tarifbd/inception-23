import { NextResponse } from 'next/server';

export function errorResponse(label: string, error: unknown, status = 500, message?: string) {
  console.error(`${label}:`, error);
  return NextResponse.json({ error: message ?? 'Something went wrong. Please try again.' }, { status });
}
