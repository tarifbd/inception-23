import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import {
  defaultHomepageContent,
  homepageSettingKey,
  normalizeHomepageContent,
  type HomepageContent,
} from '@/lib/homepage-content';

const homepageCacheTag = 'homepage-content';

export const getHomepageContent = unstable_cache(
  async (): Promise<HomepageContent> => {
    try {
      const setting = await db.siteSetting.findUnique({ where: { key: homepageSettingKey } });
      if (!setting) return structuredClone(defaultHomepageContent);
      return normalizeHomepageContent(JSON.parse(setting.value));
    } catch {
      return structuredClone(defaultHomepageContent);
    }
  },
  ['homepage-content-v1'],
  { revalidate: 300, tags: [homepageCacheTag] },
);

export function invalidateHomepageContent() {
  revalidateTag(homepageCacheTag);
}
