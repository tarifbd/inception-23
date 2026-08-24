import React from 'react';
import { interpolate, staticFile } from 'remotion';

interface LanternProps {
  frame: number;
  swingSpeed?: number;
  maxSwingAngle?: number;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
}

export const Lantern: React.FC<LanternProps> = ({
  frame,
  swingSpeed = 1,
  maxSwingAngle = 6,
  xOffset = 15,
  yOffset = -20,
  scale = 1.0,
}) => {
  // Compute the swing rotation using a sine wave
  const swingAngle = Math.sin((frame * 0.05 * swingSpeed)) * maxSwingAngle;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${yOffset}px`,
        left: `${xOffset}%`,
        transform: `translateX(-50%) rotate(${swingAngle}deg)`,
        transformOrigin: 'top center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Lantern Hanging Cord */}
      <div
        style={{
          width: '2px',
          height: `${110 * scale}px`,
          background: 'linear-gradient(to bottom, #f3e7c4, #d4af37, #8a6f27)',
          boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
        }}
      />

      {/* 3D Rendered Golden Lantern Image */}
      <img
        src={staticFile('golden_lantern.png')}
        alt="Golden Lantern"
        style={{
          width: `${160 * scale}px`,
          height: `${160 * scale}px`,
          marginTop: '-30px',
          mixBlendMode: 'screen', // Blends black background away, keeping gold highlights and warm glow
          filter: 'brightness(1.2) contrast(1.1)',
        }}
      />
    </div>
  );
};
