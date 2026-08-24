'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, useReducedMotion, animate } from 'framer-motion';

// ==========================================
// 1. NEON SCROLL PROGRESS BAR
// ==========================================
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 via-rose-500 to-amber-500 origin-left z-[100] shadow-[0_0_10px_rgba(20,184,166,0.8),0_0_20px_rgba(244,63,94,0.5)]"
    />
  );
};

// ==========================================
// 2. LIQUID FLUID CURSOR WITH GLOWING TRAIL
// ==========================================
interface TrailPoint {
  id: number;
  x: number;
  y: number;
}

export const FluidCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28, mass: 0.2 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (prefersReducedMotion) return;

    setMounted(true);
    let idCounter = 0;
    let trailTimeout: NodeJS.Timeout;
    let rafId: number | null = null;
    let pendingEvent: MouseEvent | null = null;

    const applyMove = () => {
      rafId = null;
      const e = pendingEvent;
      if (!e) return;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Add a particle trail point on mouse move
      if (Math.random() < 0.35) { // Throttle particle count for performance
        const newPoint = {
          id: idCounter++,
          x: e.clientX,
          y: e.clientY
        };
        setTrail((prev) => [...prev.slice(-12), newPoint]); // Keep max 12 particles
      }

      // Clear trail after mouse stops moving for 600ms
      clearTimeout(trailTimeout);
      trailTimeout = setTimeout(() => {
        setTrail([]);
      }, 600);
    };

    const moveCursor = (e: MouseEvent) => {
      pendingEvent = e;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(applyMove);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-hover') ||
        target.classList.contains('cursor-pointer')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(trailTimeout);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, prefersReducedMotion]);

  if (prefersReducedMotion || !mounted) return null;

  return (
    <>
      {/* 1. Main Cursor Dot */}
      <motion.div
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 2.5 : 1,
          backgroundColor: hovered ? 'rgba(20, 184, 166, 0.15)' : 'rgba(20, 184, 166, 1)',
          borderColor: hovered ? 'rgba(20, 184, 166, 0.8)' : 'rgba(20, 184, 166, 0)',
          borderWidth: hovered ? '1.5px' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:block"
      />

      {/* 2. Fluid Outward Ring */}
      <motion.div
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 1.8 : 1,
          opacity: hovered ? 1 : 0.4,
        }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-500/30 pointer-events-none z-[998] hidden md:block"
      />

      {/* 3. Glowing Particle Trail */}
      <div className="fixed inset-0 pointer-events-none z-[997] overflow-hidden hidden md:block">
        {trail.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.1, y: p.y + (Math.random() * 20 - 10) }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: p.x,
              top: p.y,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-brand-400 to-rose-400 shadow-[0_0_6px_rgba(20,184,166,0.6)]"
          />
        ))}
      </div>
    </>
  );
};

// ==========================================
// 3. MAGNETIC HOVER EFFECT
// ==========================================
export const Magnetic = ({ children, range = 45 }: { children: React.ReactElement; range?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 15, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 15, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance from center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      // Pull inside
      x.set(distanceX * 0.4);
      y.set(distanceY * 0.4);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 4. 3D PERSPECTIVE TILT CARD
// ==========================================
export const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });

  // Rotate limits: 15deg max
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalized mouse position inside the card relative to center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`perspective-1000 origin-center transition-all duration-300 ${className}`}
    >
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

// ==========================================
// 5. STAGGERED HEADINGS SPLIT TEXT REVEAL
// ==========================================
export const SplitText = ({ text, className = "" }: { text: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const parts = text.split(/(\s+)/);

  if (prefersReducedMotion) {
    return <span className={`block origin-center ${className}`}>{text}</span>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 24, rotateX: 75 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { 
        type: 'spring', 
        damping: 15, 
        stiffness: 120 
      } 
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`block origin-center ${className}`}
      style={{ perspective: 1000 }}
    >
      {parts.map((part, partIndex) => {
        if (/^\s+$/.test(part)) {
          return <span key={`space-${partIndex}`} className="whitespace-pre">{part}</span>;
        }

        return (
          <span key={`word-${partIndex}`} className="inline-block whitespace-nowrap">
            {part.split('').map((char, charIndex) => (
              <motion.span
                key={`${partIndex}-${charIndex}`}
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.span>
  );
};

// ==========================================
// 6. STATISTICS VISUAL COUNTING NUMBER
// ==========================================
export const CountingNumber = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const hasRunRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Extract raw numeric value and suffix (e.g. "50B+", "30%", "100%")
  const match = value.match(/^([\d.,]+)(.*)$/);
  const numericStr = match ? match[1].replace(/,/g, '') : '0';
  const suffix = match ? match[2] : '';
  const targetVal = parseFloat(numericStr);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (isInView && !hasRunRef.current) {
      const node = ref.current;
      if (!node) return;

      const controls = animate(0, targetVal, {
        duration,
        ease: 'easeOut',
        onUpdate(value) {
          // Format with commas if original had them
          const rounded = Math.round(value);
          const formatted = numericStr.includes('.')
            ? value.toFixed(1)
            : rounded.toLocaleString();
          node.textContent = formatted + suffix;
        },
      });

      hasRunRef.current = true;
      return () => controls.stop();
    }
  }, [isInView, targetVal, duration, suffix, numericStr, prefersReducedMotion]);

  // Reset when out of view to allow re-animation on scroll
  useEffect(() => {
    if (!isInView) {
      hasRunRef.current = false;
    }
  }, [isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
};
