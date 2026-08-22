import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/admin/rbac';
import { readJson } from '@/lib/api/http';
import {
  defaultHomepageContent,
  homepageSettingKey,
  normalizeHomepageContent,
} from '@/lib/homepage-content';
import {
  getHomepageContent,
  invalidateHomepageContent,
} from '@/lib/homepage-content.server';

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.view');
  if (forbidden) return forbidden;
  return NextResponse.json({ data: await getHomepageContent() });
}

export async function PUT(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  try {
    const payload = normalizeHomepageContent(await readJson(request, 512 * 1024));
    await db.siteSetting.upsert({
      where: { key: homepageSettingKey },
      update: { value: JSON.stringify(payload), group: 'homepage' },
      create: { key: homepageSettingKey, value: JSON.stringify(payload), group: 'homepage' },
    });
    invalidateHomepageContent();
    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error('Homepage content update failed:', error);
    return NextResponse.json({ error: 'Could not save homepage content.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  await db.siteSetting.deleteMany({ where: { key: homepageSettingKey } });
  invalidateHomepageContent();
  return NextResponse.json({ data: defaultHomepageContent });
}
