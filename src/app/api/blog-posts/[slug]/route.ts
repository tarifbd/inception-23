import { NextResponse } from 'next/server';
import { insights } from '@/lib/constants/services';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const post = insights.find((item) => item.slug === slug);

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}
