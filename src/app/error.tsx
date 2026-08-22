'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      code="500"
      title="This page could not finish loading."
      description="The request reached an unexpected problem. Your information has not been submitted twice, and you can safely try the page again."
      onRetry={reset}
    />
  );
}
