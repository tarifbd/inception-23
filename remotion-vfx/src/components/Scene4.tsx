import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';
import { Particles } from './Particles';

function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Scene4Props {
  frame: number;
  senderName?: string;
  isVertical?: boolean;
}

export const Scene4: React.FC<Scene4Props> = ({
  frame,
  senderName = "K M KHADIMUL HASAN",
  isVertical = false,
}) => {
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const localFrame = frame - 360; // 0 to 119

  // --- Eid Mubarak title bounce in ---
  const titleBounceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 60 },
    delay: 15,
  });
  const titleScale = interpolate(titleBounceSpring, [0, 1], [0.5, 1.0]);
  const titleOpacity = interpolate(localFrame, [15, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Light sweep
  const sweepTranslate = interpolate(localFrame, [10, 90], [-350, 350], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Top content (icon, subtitle)
  const topContentOpacity = interpolate(localFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Divider + "With Warm Regards From"
  const midContentOpacity = interpolate(localFrame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Name spring: grows to final size then FREEZES ---
  const nameGrowSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, mass: 1.2, stiffness: 40 },
    delay: 30,
  });
  // Name grows from 0.3 → 1.0 (final freeze size), never more
  const nameScale = interpolate(nameGrowSpring, [0, 1], [0.3, 1.0]);
  const nameOpacity = interpolate(localFrame, [28, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Name letter spacing expands as it grows
  const letterSpacingSpring = spring({
    frame: localFrame - 25,
    fps,
    config: { damping: 22, stiffness: 30 },
  });
  const letterSpacing = interpolate(letterSpacingSpring, [0, 1], [0, 10]);

  // Final black fade
  const blackFade = interpolate(localFrame, [114, 119], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fireworks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const fireworks = [
      { x: width * 0.25, y: height * 0.35, trigger: 15, count: 65, colors: ['#fde047', '#eab308', '#ffffff'] },
      { x: width * 0.75, y: height * 0.25, trigger: 35, count: 65, colors: ['#a855f7', '#d946ef', '#ffffff'] },
      { x: width * 0.5,  y: height * 0.4,  trigger: 55, count: 80, colors: ['#f59e0b', '#ef4444', '#fde047'] },
    ];

    fireworks.forEach((fw, fwIdx) => {
      const timeSinceTrigger = localFrame - fw.trigger;
      if (timeSinceTrigger <= 0 || timeSinceTrigger > 50) return;
      const rand = createSeededRandom(100 + fwIdx * 50);
      const sparks = Array.from({ length: fw.count }).map(() => ({
        angle: rand() * Math.PI * 2,
        speed: rand() * 4.5 + 1.5,
        drag: 0.95,
        gravity: 0.08,
        size: rand() * 3 + 1,
        color: fw.colors[Math.floor(rand() * fw.colors.length)],
      }));
      sparks.forEach((spark) => {
        let r = 0, currentSpeed = spark.speed, currentY = fw.y;
        for (let t = 0; t < timeSinceTrigger; t++) {
          r += currentSpeed;
          currentSpeed *= spark.drag;
          currentY += spark.gravity * t;
        }
        const sx = fw.x + Math.cos(spark.angle) * r;
        const sy = currentY + Math.sin(spark.angle) * r;
        const alpha = interpolate(timeSinceTrigger, [0, 50], [1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        ctx.beginPath();
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, spark.size * 2);
        g.addColorStop(0, spark.color);
        g.addColorStop(0.5, spark.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = alpha;
        ctx.arc(sx, sy, spark.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }, [localFrame, width, height]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Particles frame={frame} count={50} type="sparks" color="#fef08a" speedMultiplier={0.6} />
      <canvas ref={canvasRef} width={width} height={height} style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ===== LAYOUT: full column top to bottom ===== */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        zIndex: 2, pointerEvents: 'none',
        gap: '0px',
      }}>

        {/* Icon + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: topContentOpacity }}>
          <div style={{
            width: isVertical ? '75px' : '50px',
            height: isVertical ? '75px' : '50px',
            marginBottom: '10px',
            filter: 'drop-shadow(0 0 10px rgba(253, 224, 71, 0.6))',
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#fde047' }}>
              <path d="M 50 10 A 40 40 0 1 0 90 50 A 32 32 0 1 1 50 10 Z" />
            </svg>
          </div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            color: '#fbbf24', fontSize: isVertical ? '18px' : '13px',
            fontWeight: 500, letterSpacing: '8px',
            textTransform: 'uppercase', margin: 0,
            textShadow: '0 2px 5px rgba(0,0,0,0.8)',
          }}>
            Wishing You A Blessed
          </p>
        </div>

        {/* ===== EID MUBARAK — stays at top center ===== */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '8px 20px', marginTop: '8px',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}>
          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: isVertical ? '84px' : '64px',
            fontWeight: 800,
            letterSpacing: isVertical ? '22px' : '18px',
            textTransform: 'uppercase', margin: 0,
            background: 'linear-gradient(to bottom, #ffffff 10%, #fde047 60%, #aa7c11 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 5px 12px rgba(0,0,0,0.8))',
            whiteSpace: 'nowrap',
          }}>
            Eid Mubarak
          </h1>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '150px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.75), transparent)',
            transform: `skewX(-20deg) translateX(${sweepTranslate}px)`,
            mixBlendMode: 'overlay', pointerEvents: 'none',
          }} />
        </div>

        {/* Divider */}
        <div style={{
          width: isVertical ? '420px' : '280px', height: '2px',
          background: 'linear-gradient(to right, transparent, #d4af37, #fff, #d4af37, transparent)',
          margin: '18px 0 10px 0',
          boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
          opacity: midContentOpacity,
        }} />

        {/* With Warm Regards From */}
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          color: '#9ca3af', fontSize: isVertical ? '13px' : '10px',
          fontWeight: 500, letterSpacing: '5px',
          textTransform: 'uppercase', marginBottom: '18px',
          opacity: midContentOpacity,
        }}>
          With Warm Regards From
        </span>

        {/* ===== NAME — grows then FREEZES in place below ===== */}
        <h3 style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          color: '#ffffff',
          fontSize: isVertical ? '42px' : '30px',
          fontWeight: 800,
          letterSpacing: `${letterSpacing}px`,
          textTransform: 'uppercase',
          margin: 0,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 30px rgba(253,224,71,0.85), 0 0 60px rgba(255,200,0,0.4), 0 4px 15px rgba(0,0,0,0.9)',
          transform: `scale(${nameScale})`,
          opacity: nameOpacity,
          display: 'inline-block',
        }}>
          {senderName}
        </h3>

      </div>

      {/* Black fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: '#000', opacity: blackFade,
        pointerEvents: 'none', zIndex: 20,
      }} />
    </AbsoluteFill>
  );
};
