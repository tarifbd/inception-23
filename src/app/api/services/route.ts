import { NextResponse } from 'next/server';
import { services } from '@/lib/constants/services';

export async function GET() {
  return NextResponse.json({ data: services });
}
