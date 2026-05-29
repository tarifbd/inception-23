import { NextResponse } from 'next/server';
import { getService } from '@/lib/constants/services';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json({ data: service });
}
