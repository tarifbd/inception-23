import { Header as HeaderClient } from './header/Header';
import type { CmsMenuItem, MenuKind } from './header/MegaMenu';
import { getWebsiteCollections, type CollectionRecord } from '@/lib/website-collections';

function normalizeMenu(records: CollectionRecord[]): CmsMenuItem[] {
  return records.map((record) => ({
    id: String(record.id),
    title: String(record.title || record.label || '').trim(),
    href: String(record.href || '/').trim() || '/',
    description: String(record.description || '').trim() || undefined,
    eyebrow: String(record.eyebrow || '').trim() || undefined,
    icon: String(record.icon || '').trim() || undefined,
    theme: String(record.theme || '').trim() || undefined,
  })).filter((item) => item.title);
}

export async function Header({ navigation }: { navigation?: CollectionRecord[] } = {}) {
  const collections = await getWebsiteCollections();
  const menuItems: Partial<Record<MenuKind, CmsMenuItem[]>> = {
    services: normalizeMenu(collections.servicesMenu),
    events: normalizeMenu(collections.eventsMenu),
    solutions: normalizeMenu(collections.solutionsMenu),
    industries: normalizeMenu(collections.industriesMenu),
    insights: normalizeMenu(collections.insightsMenu),
    resources: normalizeMenu(collections.resourcesMenu),
    about: normalizeMenu(collections.aboutMenu),
  };

  return <HeaderClient navigation={navigation || collections.navigation} menuItems={menuItems} />;
}
