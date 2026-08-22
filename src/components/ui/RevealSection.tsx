'use client';

import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, useInView, useReducedMotion, type Target } from 'framer-motion';

export type RevealVariant = 'rise' | 'from-left' | 'from-right' | 'focus' | 'editorial';

export type RevealSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  containerClassName?: string;
  defaultContainerClassName?: string;
  delay?: number;
  motionVariant?: RevealVariant;
};

const revealTargets: Record<RevealVariant, Target> = {
  rise: { opacity: 0, y: 34 },
  'from-left': { opacity: 0, y: 10, clipPath: 'inset(0 10% 0 0)' },
  'from-right': { opacity: 0, y: 10, clipPath: 'inset(0 0 0 10%)' },
  focus: { opacity: 0, y: 20, scale: 0.988, clipPath: 'inset(0 0 8% 0)' },
  editorial: { opacity: 0, y: 18, clipPath: 'inset(0 0 5% 0)' },
};

const revealOrder: RevealVariant[] = ['rise', 'from-left', 'editorial', 'from-right', 'focus'];

function resolveVariant(signature: string, explicitVariant?: RevealVariant) {
  if (explicitVariant) return explicitVariant;

  const score = Array.from(signature).reduce((total, character) => total + character.charCodeAt(0), 0);
  return revealOrder[score % revealOrder.length];
}

export function RevealSection({
  children,
  className = '',
  containerClassName,
  defaultContainerClassName = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  delay = 0,
  motionVariant,
  ...props
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px -10% 0px', amount: 0.08 });
  const variant = resolveVariant(`${props.id ?? ''}-${className}`, motionVariant);
  const isVisible = Boolean(reduceMotion || isInView);

  return (
    <motion.section
      ref={sectionRef}
      data-native-reveal
      data-motion-state={isVisible ? 'visible' : 'hidden'}
      data-motion-variant={variant}
      data-motion-signature={`${props.id ?? 'section'}-${variant}`}
      initial={reduceMotion ? false : revealTargets[variant]}
      animate={isVisible ? { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0 0 0)' } : undefined}
      transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden py-16 ${className}`}
      {...props}
    >
      <div
        data-motion-cascade
        className={containerClassName ?? defaultContainerClassName}
      >
        {children}
      </div>
    </motion.section>
  );
}
