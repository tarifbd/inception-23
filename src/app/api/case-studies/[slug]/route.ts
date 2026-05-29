import { NextResponse } from 'next/server';
import { caseStudies } from '@/lib/constants/services';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
  }

  return NextResponse.json({ data: study });
}
