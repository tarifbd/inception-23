import React from 'react';
import { AbsoluteFill, Audio, Series, useCurrentFrame, useVideoConfig, staticFile, Sequence, interpolate } from 'remotion';
import { Background, VFXTheme } from './Background';
import { Lantern } from './Lantern';
import { Scene1 } from './Scene1';
import { Scene2 } from './Scene2';
import { Scene3 } from './Scene3';
import { Scene4 } from './Scene4';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';

// Load cinematic typography
loadCinzel();
loadMontserrat();
loadPlayfair();

export interface EidCompositionProps {
  theme?: VFXTheme;
  senderName?: string;
  message?: string;
  audioUrl?: string;
  volume?: number;
  particleDensity?: number;
  cameraShake?: boolean;
}

export const EidComposition: React.FC<EidCompositionProps> = ({
  theme = 'midnight-gold',
  senderName = 'K M KHADIMUL HASAN',
  message = 'May your faith and devotion be rewarded with abundance, happiness, and peace.',
  audioUrl = staticFile('audio.mp3'),
  volume = 0.8,
  particleDensity = 1.0,
  cameraShake = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const isVertical = height > width;

  // Gentle floating camera effect
  const shakeX = cameraShake ? Math.sin(frame * 0.08) * 3 : 0;
  const shakeY = cameraShake ? Math.cos(frame * 0.06) * 2 : 0;

  // Hyper transition zoom jump at frames 120, 240, 360 (vertical mode only)
  const getTransitionZoom = (f: number) => {
    if (!isVertical) return 1.0;
    // Scene 1 -> 2 transition (frame 120)
    if (f >= 112 && f <= 128) {
      return interpolate(f, [112, 120, 128], [1.0, 1.08, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
    // Scene 2 -> 3 transition (frame 240)
    if (f >= 232 && f <= 248) {
      return interpolate(f, [232, 240, 248], [1.0, 1.08, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
    // Scene 3 -> 4 transition (frame 360)
    if (f >= 352 && f <= 368) {
      return interpolate(f, [352, 360, 368], [1.0, 1.08, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
    return 1.0;
  };

  const transitionZoom = getTransitionZoom(frame);

  // Transition flash calculation (more intense in vertical mode)
  const getFlashOpacity = (f: number) => {
    const peak = isVertical ? 1.0 : 0.8;
    // Phase 1 transition: Scene 1 to Scene 2 (frames 112 to 128)
    if (f >= 112 && f <= 128) {
      return interpolate(f, [112, 120, 128], [0, peak, 0]);
    }
    // Phase 2 transition: Scene 2 to Scene 3 (frames 232 to 248)
    if (f >= 232 && f <= 248) {
      return interpolate(f, [232, 240, 248], [0, peak, 0]);
    }
    // Phase 3 transition: Scene 3 to Scene 4 (frames 352 to 368)
    if (f >= 352 && f <= 368) {
      return interpolate(f, [352, 360, 368], [0, peak, 0]);
    }
    return 0;
  };

  const flashOpacity = getFlashOpacity(frame);

  // Resolve absolute URL to bypass Web Worker "Failed to construct URL" issues in Remotion Studio
  const resolveAudioUrl = (url: string) => {
    if (typeof window === 'undefined') {
      return url;
    }
    try {
      return new URL(url, window.location.origin).href;
    } catch (e) {
      return url;
    }
  };

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${transitionZoom})`,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Background with selected theme */}
      <Background theme={theme} frame={frame} durationInFrames={durationInFrames} />
      {/* Swinging lanterns */}
      <Lantern
        frame={frame}
        xOffset={12}
        yOffset={-30}
        scale={0.8}
        swingSpeed={0.9}
        maxSwingAngle={7}
      />
      <Lantern
        frame={frame}
        xOffset={88}
        yOffset={-50}
        scale={0.7}
        swingSpeed={0.8}
        maxSwingAngle={6}
      />
      {/* Audio Track */}
      {audioUrl && (
        <Audio
          src={resolveAudioUrl(audioUrl)}
          volume={volume}
          startFrom={0}
        />
      )}
      {/* Sound Effects Sequences */}
      {/* Frame 10: Moon rise impact */}
      <Sequence from={10} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.75 : 0.5) * volume} />
      </Sequence>
      {/* Frame 108: Transition to Scene 2 whoosh */}
      <Sequence from={108} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('whoosh.mp3'))} volume={(isVertical ? 0.8 : 0.6) * volume} />
      </Sequence>
      {/* Frame 120: Scene 2 start impact */}
      <Sequence from={120} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.8 : 0.6) * volume} />
      </Sequence>

      {/* Frame 135: Cow reveal "haaambaa" moo sound + cinematic impact (Moos doubled to boost amplitude loudness) */}
      <Sequence from={135} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('cow_moo.mp3'))} volume={1.0 * volume} />
      </Sequence>
      <Sequence from={135} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('cow_moo.mp3'))} volume={1.0 * volume} />
      </Sequence>
      <Sequence from={135} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.85 : 0.75) * volume} />
      </Sequence>
      {/* Frame 228: Transition to Scene 3 whoosh */}
      <Sequence from={228} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('whoosh.mp3'))} volume={(isVertical ? 0.8 : 0.6) * volume} />
      </Sequence>
      {/* Frame 240: Scene 3 card entry impact */}
      <Sequence from={240} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.8 : 0.6) * volume} />
      </Sequence>
      {/* Frame 348: Transition to Scene 4 whoosh */}
      <Sequence from={348} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('whoosh.mp3'))} volume={(isVertical ? 0.8 : 0.6) * volume} />
      </Sequence>
      {/* Frame 360: Eid Mubarak drop impact */}
      <Sequence from={360} durationInFrames={90}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.9 : 0.7) * volume} />
      </Sequence>
      {/* Synchronized firework explosions */}
      <Sequence from={375} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.6 : 0.4) * volume} />
      </Sequence>
      <Sequence from={395} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.6 : 0.4) * volume} />
      </Sequence>
      <Sequence from={415} durationInFrames={60}>
        <Audio src={resolveAudioUrl(staticFile('impact.mp3'))} volume={(isVertical ? 0.6 : 0.4) * volume} />
      </Sequence>
      {/* Heavy Camera Flash Transitions */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, rgba(255,250,230,1) 0%, rgba(212,175,55,0.8) 50%, rgba(0,0,0,0) 100%)',
            opacity: flashOpacity,
            pointerEvents: 'none',
            zIndex: 999,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Premium Gold Islamic Border Frame - Vertical Mode Only */}
      {isVertical && (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 5 }}>
          {/* Top Border Arch */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', opacity: 0.85 }}>
            <svg viewBox="0 0 1080 120" style={{ width: '100%', height: '100%', fill: 'url(#arch-gold)' }}>
              <path d="M 0,0 L 1080,0 L 1080,40 Q 940,40 900,60 Q 860,80 810,60 Q 760,40 540,110 Q 320,40 270,60 Q 220,80 180,60 Q 140,40 0,40 Z" />
            </svg>
          </div>
          
          {/* Bottom Border Arch */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', opacity: 0.85, transform: 'rotate(180deg)' }}>
            <svg viewBox="0 0 1080 120" style={{ width: '100%', height: '100%', fill: 'url(#arch-gold)' }}>
              <path d="M 0,0 L 1080,0 L 1080,40 Q 940,40 900,60 Q 860,80 810,60 Q 760,40 540,110 Q 320,40 270,60 Q 220,80 180,60 Q 140,40 0,40 Z" />
            </svg>
          </div>
          
          <svg style={{ width: 0, height: 0 }}>
            <defs>
              <linearGradient id="arch-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a6f27" />
                <stop offset="30%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#543d00" />
              </linearGradient>
            </defs>
          </svg>
        </AbsoluteFill>
      )}

      {/* Scenes Timeline */}
      <Series>
        {/* Scene 1: 0s - 4s (120 frames) */}
        <Series.Sequence durationInFrames={120} layout="none">
          <Scene1 frame={frame} isVertical={isVertical} />
        </Series.Sequence>

        {/* Scene 2: 4s - 8s (120 frames) */}
        <Series.Sequence durationInFrames={120} layout="none">
          <Scene2 frame={frame} isVertical={isVertical} />
        </Series.Sequence>

        {/* Scene 3: 8s - 12s (120 frames) */}
        <Series.Sequence durationInFrames={120} layout="none">
          <Scene3 frame={frame} message={message} isVertical={isVertical} />
        </Series.Sequence>

        {/* Scene 4: 12s - 16s (120 frames) */}
        <Series.Sequence durationInFrames={120} layout="none">
          <Scene4 frame={frame} senderName={senderName} isVertical={isVertical} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
