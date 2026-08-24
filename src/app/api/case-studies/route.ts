import { NextResponse } from 'next/server';
import { caseStudies } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';

type PublicCaseStudy = {
  id: string;
  slug: string;
  isPublished?: boolean | string;
};

export async function GET() {
  const stored = await getWebsiteCollection<CollectionRecord & PublicCaseStudy>('caseStudies');
  const fallback: PublicCaseStudy[] = caseStudies.map((study, index) => ({ id: `case-study-${index + 1}`, ...study }));
  const data = (stored.length ? stored : fallback)
    .filter((study) => study.isPublished !== false && study.isPublished !== 'false');
  return NextResponse.json({ data });
}
