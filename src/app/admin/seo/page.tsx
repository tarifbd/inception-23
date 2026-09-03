import { SeoDashboardClient } from '@/components/admin/SeoDashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SeoAdminPage() {
  return <SeoDashboardClient />;
}
