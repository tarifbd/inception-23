'use client';

import { useEffect, useRef, useState } from 'react';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export function HeroLottie({ src, className, paused, onReady }: {
  src: string;
  className: string;
  paused: boolean;
  onReady?: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<DotLottie | DotLottieWorker | null>(null);
  const pausedRef = useRef(paused);
  const onReadyRef = useRef(onReady);
  const [loaded, setLoaded] = useState(false);
  pausedRef.current = paused;
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    setLoaded(false);
    // A fresh canvas for every effect setup also supports React Strict Mode:
    // transferControlToOffscreen cannot be called twice on the same canvas.
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    // Blob workers have no document base URL for resolving relative assets.
    const wasmUrl = new URL('/wasm/dotlottie-player.wasm', window.location.href).href;
    DotLottie.setWasmUrl(wasmUrl);
    DotLottieWorker.setWasmUrl(wasmUrl);
    const Player = typeof OffscreenCanvas !== 'undefined' ? DotLottieWorker : DotLottie;
    const instance = new Player({
      canvas, src: new URL(src, window.location.href).href, loop: true, autoplay: !pausedRef.current, speed: 0.9,
      useFrameInterpolation: false, backgroundColor: '#00000000',
      layout: { fit: 'contain', align: [0.5, 0.5] },
      renderConfig: { autoResize: true, devicePixelRatio: 1.25, freezeOnOffscreen: true, quality: 88 },
    });
    player.current = instance;
    let disposed = false;
    const ready = () => {
      if (disposed) return;
      setLoaded(true);
      onReadyRef.current?.();
      void Promise.resolve(pausedRef.current ? instance.pause() : instance.play()).catch(() => undefined);
    };
    instance.addEventListener('load', ready);
    if (instance.isLoaded) ready();
    return () => {
      disposed = true;
      instance.removeEventListener('load', ready);
      player.current = null;
      void Promise.resolve(instance.destroy()).catch(() => undefined);
      canvas.remove();
    };
  }, [src]);

  useEffect(() => {
    const instance = player.current;
    if (instance) void Promise.resolve(paused ? instance.pause() : instance.play()).catch(() => undefined);
  }, [paused]);

  return <div ref={container} aria-hidden="true"
    className={`relative h-full w-full bg-transparent transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`} />;
}
