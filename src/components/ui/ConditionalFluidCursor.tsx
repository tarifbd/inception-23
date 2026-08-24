'use client';

import { usePathname } from 'next/navigation';
import { FluidCursor } from '@/components/ui/HyperEffects';

// The admin dashboard is a utility screen, not part of the marketing site — it doesn't
// need the decorative custom cursor, and skipping it there avoids mounting an extra
// global mousemove listener on a page that's already doing real work.
export const ConditionalFluidCursor = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <FluidCursor />;
};
