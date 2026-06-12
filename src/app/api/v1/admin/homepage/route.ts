import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  defaultHomepageContent,
  getHomepageContent,
  homepageSettingKey,
  normalizeHomepageContent,
} from '@/lib/homepage-content';

export async function GET() {
  return NextResponse.json({ data: await getHomepageContent() });
}

export async function PUT(request: Request) {
  try {
    const payload = normalizeHomepageContent(await request.json());
    await db.siteSetting.upsert({
      where: { key: homepageSettingKey },
      update: { value: JSON.stringify(payload), group: 'homepage' },
      create: { key: homepageSettingKey, value: JSON.stringify(payload), group: 'homepage' },
    });
    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error('Homepage content update failed:', error);
    return NextResponse.json({ error: 'Could not save homepage content.' }, { status: 500 });
  }
}

export async function DELETE() {
  await db.siteSetting.deleteMany({ where: { key: homepageSettingKey } });
  return NextResponse.json({ data: defaultHomepageContent });
}
