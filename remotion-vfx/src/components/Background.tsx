import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

export type VFXTheme = 'midnight-gold' | 'royal-purple' | 'emerald-majesty' | 'crimson-sunset';

interface BackgroundProps {
  theme: VFXTheme;
  frame: number;
  durationInFrames: number;
}

export const Background: React.FC<BackgroundProps> = ({ theme, frame, durationInFrames }) => {
  // Gentle pulse animation for the background glow
  const glowPulse = interpolate(
    Math.sin((frame / durationInFrames) * Math.PI * 4),
    [-1, 1],
    [0.7, 0.95],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const themeStyles: Record<VFXTheme, { background: string; glow: string; accent: string }> = {
    'midnight-gold': {
      background: 'linear-gradient(135deg, #070b19 0%, #02040a 100%)',
      glow: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, ${0.12 * glowPulse}) 0%, rgba(0, 0, 0, 0) 70%)`,
      accent: 'rgba(212, 175, 55, 0.1)',
    },
    'royal-purple': {
      background: 'linear-gradient(135deg, #18052b 0%, #080112 100%)',
      glow: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, ${0.15 * glowPulse}) 0%, rgba(0, 0, 0, 0) 70%)`,
      accent: 'rgba(168, 85, 247, 0.1)',
    },
    'emerald-majesty': {
      background: 'linear-gradient(135deg, #022312 0%, #000c05 100%)',
      glow: `radial-gradient(circle at 50% 50%, rgba(52, 211, 153, ${0.12 * glowPulse}) 0%, rgba(0, 0, 0, 0) 70%)`,
      accent: 'rgba(52, 211, 153, 0.1)',
    },
    'crimson-sunset': {
      background: 'linear-gradient(135deg, #2b020a 0%, #0f0003 100%)',
      glow: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, ${0.12 * glowPulse}) 0%, rgba(0, 0, 0, 0) 70%)`,
      accent: 'rgba(239, 68, 68, 0.1)',
    },
  };

  const activeTheme = themeStyles[theme] || themeStyles['midnight-gold'];

  return (
    <AbsoluteFill style={{ background: activeTheme.background }}>
      {/* Ambient radial glow in center */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: activeTheme.glow,
          pointerEvents: 'none',
        }}
      />
      {/* Corner vignette for cinematic focus */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
