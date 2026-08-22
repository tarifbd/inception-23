'use client';

import '@/lib/configure-lottie';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function LottieStage({ src, className = '' }: { src: string; className?: string }) {
  return (
    <DotLottieReact
      src={src}
      loop
      autoplay
      backgroundColor="#00000000"
      className={`h-full w-full bg-transparent object-contain ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
