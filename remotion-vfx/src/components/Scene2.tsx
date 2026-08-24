import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, staticFile } from 'remotion';
import { Particles } from './Particles';

interface Scene2Props {
  frame: number;
  isVertical?: boolean;
}

export const Scene2: React.FC<Scene2Props> = ({ frame, isVertical = false }) => {
  const { fps, width, height } = useVideoConfig();

  // Local frame calculation (starts at frame 120)
  const localFrame = frame - 120;

  // Sky gradient animation
  const skyShift = Math.sin(localFrame * 0.015) * 10;

  // Camera animation
  const cameraScale = interpolate(localFrame, [0, 120], [1.0, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraY = interpolate(localFrame, [0, 120], [0, -15]);

  // Cow heavy spring reveal
  const cowRevealSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 1.5, stiffness: 40 },
    delay: 15,
  });

  const cowScale = interpolate(cowRevealSpring, [0, 1], [0.6, 1.0]);
  const cowRotateY = interpolate(localFrame, [0, 120], [-15, 12]);
  const cowRotateX = interpolate(localFrame, [0, 120], [8, -6]);

  // Cow opacity and glow pulses
  const cowOpacity = interpolate(localFrame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  const glowIntensity = interpolate(
    Math.sin(localFrame * 0.08) + Math.cos(localFrame * 0.03),
    [-2, 2],
    [10, 25]
  );

  // Title text reveal with spring dynamics and motion blur
  const titleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, mass: 1.2, stiffness: 35 },
    delay: 45,
  });
  const titleOpacity = interpolate(localFrame, [45, 75], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1.0]);
  const titleBlur = interpolate(titleSpring, [0, 0.8, 1], [15, 3, 0]);

  // Light sweep reflection
  const sweepTranslate = interpolate(localFrame, [45, 110], [-250, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: `radial-gradient(circle at 50% ${70 + skyShift}%, #3c096c 0%, #1a0033 100%)`,
      }}
    >
      {/* Moving Sunset Dusk BG Lights */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, #ff9e00 0%, #e0aaff 40%, transparent 100%)',
          opacity: 0.65,
          zIndex: 1,
        }}
      />

      {/* Ambient Sparks */}
      <Particles frame={frame} count={60} type="sparks" color="#f59e0b" speedMultiplier={0.8} />

      {/* Mosque Domes Silhouette Background */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          right: 0,
          height: isVertical ? '350px' : '240px',
          opacity: 0.85,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 1000 240"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', fill: '#0a001a' }}
        >
          <path d="M 0 240 L 0 160 L 15 130 L 30 160 L 30 240 Z" />
          <path d="M 80 240 L 80 80 Q 95 70 95 50 Q 95 70 110 80 L 110 240 Z" />
          <path d="M 90 50 L 95 20 L 100 50 Z" fill="#aa7c11" />
          <path d="M 180 240 L 180 150 Q 180 90 240 80 Q 300 90 300 150 L 300 240 Z" />
          <circle cx="240" cy="70" r="5" fill="#f59e0b" />
          <path d="M 240 70 L 240 50" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 330 240 L 330 170 Q 330 130 365 125 Q 400 130 400 170 L 400 240 Z" />
          <path d="M 880 240 L 880 100 Q 890 90 890 75 Q 890 90 900 100 L 900 240 Z" />
          <path d="M 890 75 L 895 55 L 900 75 Z" />
          <rect x="0" y="230" width="1000" height="20" />
        </svg>
      </div>

      {/* Main Composited VFX Scene Canvas */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* 3D Glowing Cow Sculpture */}
        <div
          style={{
            position: 'absolute',
            top: isVertical ? '25%' : '22%',
            width: isVertical ? '600px' : '440px',
            height: isVertical ? '600px' : '440px',
            opacity: cowOpacity,
            transform: `scale(${cowScale}) rotateY(${cowRotateY}deg) rotateX(${cowRotateX}deg)`,
            filter: `drop-shadow(0 15px 35px rgba(0,0,0,0.7)) drop-shadow(0 0 ${glowIntensity}px rgba(212, 175, 55, 0.35))`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            perspective: 1000,
          }}
        >
          <img
            src={staticFile('golden_cow.png')}
            alt="3D Golden Cow"
            style={{
              width: '100%',
              height: '100%',
              mixBlendMode: 'screen', // composites gold details beautifully
              filter: 'brightness(1.15) contrast(1.1)',
            }}
          />
        </div>

        {/* Text Reveal Title */}
        <div
          style={{
            position: 'absolute',
            bottom: isVertical ? '26%' : '22%',
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: '#fbbf24',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            The Sacred Sacrifice
          </span>

          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <h1
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                color: '#fff',
                fontSize: '52px',
                fontWeight: 700,
                letterSpacing: '14px',
                textTransform: 'uppercase',
                margin: 0,
                background: 'linear-gradient(to bottom, #ffffff 30%, #ffd700 70%, #d4af37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
              }}
            >
              Eid Al-Adha
            </h1>

            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '120px',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)',
                transform: `skewX(-25deg) translateX(${sweepTranslate}px)`,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
