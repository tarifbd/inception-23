import { notFound } from 'next/navigation';
import { WebsiteCollectionEditor } from '@/components/admin/WebsiteCollectionEditor';
import { isCollectionId } from '@/lib/website-collections';

export default async function WebsiteCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionId(collection)) notFound();
  return <WebsiteCollectionEditor collection={collection} />;
}
