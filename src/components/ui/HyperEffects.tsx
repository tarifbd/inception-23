'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';

export const RouteTransition = () => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion || pathname.startsWith('/admin')) return null;

  return (
    <motion.div
      key={pathname}
      aria-hidden="true"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{
        clipPath: [
          'inset(0 100% 0 0)',
          'inset(0 0 0 0)',
          'inset(0 0 0 0)',
          'inset(0 0 0 100%)',
        ],
      }}
      transition={{ duration: 0.64, times: [0, 0.42, 0.56, 1], ease: [0.76, 0, 0.24, 1] }}
      className="pointer-events-none fixed inset-0 z-[120] bg-[var(--color-canvas)]"
    >
      <span className="absolute inset-y-0 left-[12%] w-px bg-support-600" />
      <span className="absolute inset-y-0 right-[12%] w-px bg-accent-500" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-brand-950/20" />
    </motion.div>
  );
};

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-gradient-to-r from-support-600 via-brand-600 to-accent-500"
    />
  );
};

export const FluidCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 360, damping: 30, mass: 0.22 });
  const springY = useSpring(cursorY, { stiffness: 360, damping: 30, mass: 0.22 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || reduceMotion) return;
    setMounted(true);

    const moveCursor = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setHovered(Boolean(target.closest('a, button, [role="button"]')));
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, reduceMotion]);

  if (!mounted) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={{ scale: hovered ? 1.45 : 1, opacity: hovered ? 0.7 : 0.45 }}
      className="working-paper-cursor pointer-events-none fixed left-0 top-0 z-[999] hidden h-5 w-5 md:block"
    />
  );
};

export const Magnetic = ({ children, range = 45 }: { children: React.ReactElement; range?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.35 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current || reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const strength = Math.min(0.08, 3 / Math.max(range, 1));
    x.set(Math.max(-3, Math.min(3, offsetX * strength)));
    y.set(Math.max(-3, Math.min(3, offsetY * strength)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

export const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SplitText = ({ text, className = '' }: { text: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`block ${className}`}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={reduceMotion ? false : { opacity: 0, y: '72%' }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.38, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
};

export const CountingNumber = ({ value, duration = 1.25 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const hasRunRef = useRef(false);
  const match = value.match(/^([\d.,]+)(.*)$/);
  const numericString = match ? match[1].replace(/,/g, '') : '0';
  const suffix = match ? match[2] : '';
  const target = Number.parseFloat(numericString);

  useEffect(() => {
    if (!isInView || hasRunRef.current || reduceMotion || !Number.isFinite(target)) return;
    const node = ref.current;
    if (!node) return;

    hasRunRef.current = true;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate(current) {
        const formatted = numericString.includes('.')
          ? current.toFixed(1)
          : Math.round(current).toLocaleString();
        node.textContent = formatted + suffix;
      },
    });

    return () => controls.stop();
  }, [duration, isInView, numericString, reduceMotion, suffix, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
};
