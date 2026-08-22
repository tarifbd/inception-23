import { ErrorState } from '@/components/ui/ErrorState';

export default function NotFoundPage() {
  return (
    <ErrorState
      code="404"
      title="We could not find that page."
      description="The link may be outdated or the page may have moved. Return to the homepage or contact the team for the right destination."
    />
  );
}
