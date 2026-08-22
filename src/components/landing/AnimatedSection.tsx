import { RevealSection, type RevealSectionProps } from '@/components/ui/RevealSection';

type AnimatedSectionProps = Omit<RevealSectionProps, 'defaultContainerClassName'>;

export function AnimatedSection(props: AnimatedSectionProps) {
  return <RevealSection defaultContainerClassName="mx-auto w-full max-w-7xl px-5 sm:px-6" {...props} />;
}
