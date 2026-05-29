import { NextResponse } from 'next/server';
import { insights } from '@/lib/constants/services';

export async function GET() {
  return NextResponse.json({ data: insights });
}
