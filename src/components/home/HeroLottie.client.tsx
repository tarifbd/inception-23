'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DotLottieReact, setWasmUrl, type DotLottie } from '@lottiefiles/dotlottie-react';

setWasmUrl('/wasm/dotlottie-player.wasm');

export function HeroLottie({
  src,
  className,
  paused,
  onReady,
}: {
  src: string;
  className: string;
  paused: boolean;
  onReady?: () => void;
}) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [loaded, setLoaded] = useState(false);
  const readyReportedRef = useRef(false);

  const reportReady = useCallback(() => {
    if (readyReportedRef.current) return;
    readyReportedRef.current = true;
    onReady?.();
  }, [onReady]);

  const handlePlayerRef = useCallback((instance: DotLottie | null) => {
    setPlayer(instance);
    if (!instance?.isLoaded) return;
    instance.setSpeed(0.9);
    instance.resize();
    setLoaded(true);
    reportReady();
  }, [reportReady]);

  useEffect(() => {
    setLoaded(false);
    readyReportedRef.current = false;
  }, [src]);

  useEffect(() => {
    if (!player) return;
    const handleLoad = () => {
      player.setSpeed(0.9);
      player.resize();
      setLoaded(true);
      reportReady();
    };
    if (player.isLoaded) handleLoad();
    player.addEventListener('load', handleLoad);
    return () => player.removeEventListener('load', handleLoad);
  }, [player, reportReady]);

  useEffect(() => {
    if (!player || !loaded) return;
    if (paused) player.pause();
    else player.play();
  }, [loaded, paused, player]);

  return (
    <DotLottieReact
      src={src}
      loop
      autoplay={!paused}
      backgroundColor="#00000000"
      width={640}
      height={640}
      layout={{ fit: 'contain', align: [0.5, 0.5] }}
      renderConfig={{ autoResize: true, devicePixelRatio: 1.25, freezeOnOffscreen: true, quality: 88 }}
      dotLottieRefCallback={handlePlayerRef}
      aria-hidden="true"
      className={`relative h-full w-full bg-transparent object-contain transition-[opacity,filter] duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
    />
  );
}
