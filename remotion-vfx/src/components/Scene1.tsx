import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, staticFile } from 'remotion';
import { Particles } from './Particles';

interface Scene1Props {
  frame: number;
  isVertical?: boolean;
}

export const Scene1: React.FC<Scene1Props> = ({ frame, isVertical = false }) => {
  const { fps, width, height } = useVideoConfig();

  // Camera zoom pull-back
  const cameraScale = interpolate(frame, [0, 120], [1.15, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera subtle drift
  const cameraDriftX = Math.sin(frame * 0.02) * 5;
  const cameraDriftY = Math.cos(frame * 0.02) * 3;

  // Crescent Moon animations: rising, opacity and 3D rotations
  const moonRiseSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 1.5, stiffness: 20 },
    delay: 10,
  });
  
  const moonY = interpolate(moonRiseSpring, [0, 1], [180, 0]);
  const moonOpacity = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const moonRotateY = interpolate(frame, [0, 120], [-20, 15]);
  const moonRotateX = interpolate(frame, [0, 120], [12, -8]);

  // Mandala rotation and scale
  const mandalaRotate = interpolate(frame, [0, 120], [0, 20]);
  const mandalaOpacity = interpolate(frame, [15, 70], [0, 0.28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Text fade-in and scale
  const textScaleSpring = spring({
    frame,
    fps,
    config: { damping: 12 },
    delay: 35,
  });
  const textOpacity = interpolate(frame, [35, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textY = interpolate(textScaleSpring, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        transform: `scale(${cameraScale}) translate(${cameraDriftX}px, ${cameraDriftY}px)`,
      }}
    >
      {/* Background Star Particles (Twinkling) */}
      <Particles frame={frame} count={80} type="stars" color="#ffffff" />
      <Particles frame={frame} count={50} type="dust" color="#fef08a" speedMultiplier={0.3} />

      {/* Background Mandala (Sacred Geometry) */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '700px',
          height: '700px',
          transform: `translate(-50%, -50%) rotate(${mandalaRotate}deg) scale(0.95)`,
          opacity: mandalaOpacity,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="mandala-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f3e7c4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8a6f27" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#mandala-gold)" strokeWidth="0.8">
            <circle cx="100" cy="100" r="85" strokeWidth="1" />
            <circle cx="100" cy="100" r="50" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <g key={i} transform={`rotate(${angle} 100 100)`}>
                  <path d="M 100 15 C 120 40 120 70 100 100 C 80 70 80 40 100 15 Z" />
                  <path d="M 100 40 C 112 60 112 80 100 100 C 88 80 88 60 100 40 Z" />
                  <line x1="100" y1="15" x2="100" y2="100" strokeDasharray="2,2" />
                  <rect x="95" y="45" width="10" height="10" transform="rotate(45 100 50)" />
                </g>
              );
            })}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="185"
                  transform={`rotate(${angle} 100 100)`}
                  strokeOpacity="0.3"
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Main 3D Glowing Crescent Moon Image */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? '35%' : '32%',
          left: '50%',
          width: isVertical ? '480px' : '320px',
          height: isVertical ? '480px' : '320px',
          transform: `translate(-50%, -50%) translateY(${moonY}px) rotateY(${moonRotateY}deg) rotateX(${moonRotateX}deg)`,
          opacity: moonOpacity,
          zIndex: 2,
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.65)) drop-shadow(0 0 50px rgba(253, 224, 71, 0.3))',
          pointerEvents: 'none',
          perspective: 1000,
        }}
      >
        <img
          src={staticFile('golden_moon.png')}
          alt="3D Golden Moon"
          style={{
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen', // composites details and warm light glow
            filter: 'brightness(1.2) contrast(1.15)',
          }}
        />
      </div>

      {/* Cinematic Scene Text */}
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? '22%' : '15%',
          left: '10%',
          right: '10%',
          textAlign: 'center',
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          zIndex: 3,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            color: '#fef08a',
            fontSize: isVertical ? '36px' : '28px',
            letterSpacing: isVertical ? '14px' : '12px',
            textTransform: 'uppercase',
            textShadow: '0 0 15px rgba(234, 179, 8, 0.5), 0 2px 10px rgba(0,0,0,0.8)',
            margin: '0 0 10px 0',
            lineHeight: '1.2',
          }}
        >
          {isVertical ? <>The Sacred<br/>Moon Rising</> : 'The Sacred Moon Rising'}
        </h2>
        <div
          style={{
            width: isVertical ? '180px' : '120px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #eab308, transparent)',
            margin: '12px auto',
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            color: '#d1d5db',
            fontSize: isVertical ? '16px' : '14px',
            letterSpacing: isVertical ? '5px' : '4px',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          A Journey of Faith and Sacrifice
        </p>
      </div>
    </AbsoluteFill>
  );
};
