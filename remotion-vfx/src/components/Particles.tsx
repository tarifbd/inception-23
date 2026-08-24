import React, { useRef, useEffect } from 'react';
import { useVideoConfig } from 'remotion';

// Simple seedable pseudo-random generator (LCG)
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface ParticlesProps {
  frame: number;
  count?: number;
  speedMultiplier?: number;
  color?: string;
  type?: 'dust' | 'stars' | 'sparks';
}

export const Particles: React.FC<ParticlesProps> = ({
  frame,
  count = 120,
  speedMultiplier = 1,
  color = '#d4af37',
  type = 'dust',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Initialize seedable random
    const rand = createSeededRandom(42);

    // Generate initial state of particles
    const particles = Array.from({ length: count }).map((_, index) => {
      const xStart = rand() * width;
      const yStart = rand() * height;
      const size = rand() * 4 + 1;
      const speedY = (rand() * 1.2 + 0.3) * speedMultiplier;
      const speedX = (rand() * 0.6 - 0.3) * speedMultiplier;
      const waveFreq = rand() * 0.05 + 0.01;
      const waveAmp = rand() * 15 + 5;
      const maxOpacity = rand() * 0.6 + 0.2;
      const pulseSpeed = rand() * 0.1 + 0.02;
      const phase = rand() * Math.PI * 2;

      return {
        xStart,
        yStart,
        size,
        speedY,
        speedX,
        waveFreq,
        waveAmp,
        maxOpacity,
        pulseSpeed,
        phase,
      };
    });

    // Draw particles
    particles.forEach((p, index) => {
      let cy = p.yStart;
      let cx = p.xStart;

      if (type === 'dust') {
        cy = (p.yStart - frame * p.speedY + height) % height;
        cx = (p.xStart + frame * p.speedX + Math.sin(frame * p.waveFreq + p.phase) * p.waveAmp + width) % width;
      } else if (type === 'sparks') {
        cy = (p.yStart - frame * p.speedY * 2.5 + height) % height;
        cx = (p.xStart + frame * p.speedX * 1.5 + Math.sin(frame * p.waveFreq * 1.5 + p.phase) * p.waveAmp * 0.5 + width) % width;
      } else if (type === 'stars') {
        cy = p.yStart;
        cx = p.xStart;
      }

      // Compute alpha
      let alpha = p.maxOpacity;
      if (type === 'stars') {
        alpha = p.maxOpacity * (0.3 + 0.7 * Math.sin(frame * p.pulseSpeed + p.phase));
      } else if (type === 'dust') {
        const edgeDist = 100;
        if (cy < edgeDist) alpha *= cy / edgeDist;
        else if (cy > height - edgeDist) alpha *= (height - cy) / edgeDist;
      } else if (type === 'sparks') {
        alpha = p.maxOpacity * (0.5 + 0.5 * Math.sin(frame * 0.3 + p.phase)) * (1 - cy / height);
      }

      // Draw particle
      ctx.beginPath();
      if (type === 'sparks') {
        const speedVecY = p.speedY * 2.5;
        ctx.strokeStyle = color;
        ctx.lineWidth = p.size * 0.7;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - p.speedX * 2, cy + speedVecY);
        ctx.stroke();
      } else {
        const radGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.size * 2);
        radGrd.addColorStop(0, color);
        radGrd.addColorStop(0.3, color);
        radGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrd;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.arc(cx, cy, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [frame, count, speedMultiplier, color, type, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
