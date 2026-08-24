'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function LottieStage({ src, className = '' }: { src: string; className?: string }) {
  return <DotLottieReact src={src} loop autoplay className={`h-full w-full object-contain ${className}`} />;
}
