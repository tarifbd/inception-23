import { NextResponse } from 'next/server';
import { caseStudies } from '@/lib/constants/services';

export async function GET() {
  return NextResponse.json({ data: caseStudies });
}
