import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';
import { Particles } from './Particles';

interface Scene3Props {
  frame: number;
  message?: string;
  isVertical?: boolean;
}

export const Scene3: React.FC<Scene3Props> = ({
  frame,
  message = "May your faith and devotion be rewarded with abundance, happiness, and peace.",
  isVertical = false,
}) => {
  const { fps, width, height } = useVideoConfig();

  // Local frame calculation (starts at frame 240)
  const localFrame = frame - 240;

  // Background slow zoom
  const cameraScale = interpolate(localFrame, [0, 120], [1.1, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Card reveal animations
  const cardRevealSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 1.2, stiffness: 35 },
    delay: 5,
  });

  const cardScale = interpolate(cardRevealSpring, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(localFrame, [5, 30], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  // Floating 3D card rotation based on frame sines to simulate floating 3D board
  const cardRotateX = Math.sin(localFrame * 0.04) * 3.5;
  const cardRotateY = Math.cos(localFrame * 0.03) * 4.5;

  // Floating Islamic geometric pattern opacity
  const patternOpacity = interpolate(localFrame, [20, 60], [0, 0.15], {
    extrapolateLeft: 'clamp',
  });

  // Shooting Stars
  const ss1Progress = interpolate(localFrame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ss1X = ss1Progress * (width * 0.7);
  const ss1Y = ss1Progress * (height * 0.4);
  const ss1Opacity = interpolate(ss1Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const ss2Progress = interpolate(localFrame, [50, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ss2X = width - ss2Progress * (width * 0.7);
  const ss2Y = ss2Progress * (height * 0.3);
  const ss2Opacity = interpolate(ss2Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Split message into words
  const words = message.split(' ');

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Stars & Dust */}
      <Particles frame={frame} count={60} type="stars" color="#fff" />
      <Particles frame={frame} count={40} type="dust" color="#d4af37" speedMultiplier={0.4} />

      {/* Shooting Star 1 */}
      {ss1Progress > 0 && ss1Progress < 1 && (
        <div
          style={{
            position: 'absolute',
            top: `${ss1Y}px`,
            left: `${ss1X}px`,
            width: '100px',
            height: '2px',
            background: 'linear-gradient(to right, #fff, transparent)',
            transform: 'rotate(25deg)',
            opacity: ss1Opacity,
            filter: 'drop-shadow(0 0 6px #fff)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Shooting Star 2 */}
      {ss2Progress > 0 && ss2Progress < 1 && (
        <div
          style={{
            position: 'absolute',
            top: `${ss2Y}px`,
            left: `${ss2X}px`,
            width: '120px',
            height: '2px',
            background: 'linear-gradient(to left, #fff, transparent)',
            transform: 'rotate(-18deg)',
            opacity: ss2Opacity,
            filter: 'drop-shadow(0 0 6px #fff)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Background Lattice */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80%',
          height: '80%',
          transform: 'translate(-50%, -50%)',
          opacity: patternOpacity,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', stroke: '#d4af37', strokeWidth: '0.1', fill: 'none' }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 10} y1="0" x2="100" y2={(10 - i) * 10} />
              <line x1="0" y1={i * 10} x2={(10 - i) * 10} y2="100" />
              <line x1={i * 10} y1="0" x2="0" y2={i * 10} />
              <line x1="100" y1={i * 10} x2={i * 10} y2="100" />
            </React.Fragment>
          ))}
        </svg>
      </div>

      {/* Greeting Card Frame */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: isVertical ? '85%' : '75%',
          maxWidth: '850px',
          height: isVertical ? '480px' : '340px',
          transform: `translate(-50%, -50%) scale(${cardScale}) perspective(1200px) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg)`,
          opacity: cardOpacity,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.45) 0%, rgba(5, 5, 10, 0.75) 100%)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(135deg, rgba(20,20,35,0.45), rgba(5,5,10,0.75)), linear-gradient(135deg, #f3e7c4 0%, #aa7c11 50%, #543d00 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(212, 175, 55, 0.1)',
          }}
        />

        {/* corner golden geometric ornaments */}
        {Array.from({ length: 4 }).map((_, i) => {
          const rotations = ['0deg', '90deg', '180deg', '270deg'];
          const positions = [
            { top: '10px', left: '10px' },
            { top: '10px', right: '10px' },
            { bottom: '10px', right: '10px' },
            { bottom: '10px', left: '10px' },
          ];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...positions[i],
                width: '40px',
                height: '40px',
                transform: `rotate(${rotations[i]})`,
                opacity: 0.8,
              }}
            >
              <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M 0,0 L 25,0 L 25,5 L 5,5 L 5,25 L 0,25 Z M 10,10 L 20,10 L 20,20 L 10,20 Z"
                  fill="#d4af37"
                />
              </svg>
            </div>
          );
        })}

        {/* Text Container */}
        <div
          style={{
            padding: '40px 60px',
            textAlign: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center',
            gap: '12px 14px',
            zIndex: 3,
          }}
        >
          {words.map((word, index) => {
            const wordSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 12, stiffness: 50 },
              delay: 20 + index * 4,
            });

            const wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
            const wordY = interpolate(wordSpring, [0, 1], [15, 0]);
            const wordBlur = interpolate(wordSpring, [0, 0.8, 1], [12, 3, 0]);

            return (
              <span
                key={index}
                style={{
                  fontFamily: "'Playfair Display', 'Cinzel', serif",
                  fontSize: isVertical ? '32px' : '24px',
                  fontWeight: 500,
                  lineHeight: '1.4',
                  color: '#fff9e6',
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  filter: `blur(${wordBlur}px)`,
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  display: 'inline-block',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
