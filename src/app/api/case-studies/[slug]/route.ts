import { NextResponse } from 'next/server';
import { caseStudies } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';

type Props = {
  params: Promise<{ slug: string }>;
};

type PublicCaseStudy = {
  id?: string;
  slug: string;
  isPublished?: boolean | string;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const stored = await getWebsiteCollection<CollectionRecord & PublicCaseStudy>('caseStudies');
  const source: PublicCaseStudy[] = stored.length ? stored : caseStudies;
  const study = source.find((item) => item.slug === slug && item.isPublished !== false && item.isPublished !== 'false');

  if (!study) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
  }

  return NextResponse.json({ data: study });
}
