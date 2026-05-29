'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ServiceKey } from '@/lib/constants/theme';
import { serviceThemes } from '@/lib/constants/theme';

type FloatingShapeProps = {
  serviceKey: ServiceKey;
  className?: string;
  delay?: number;
};

export function FloatingShape({ serviceKey, className = '', delay = 0 }: FloatingShapeProps) {
  const reduceMotion = useReducedMotion();
  const theme = serviceThemes[serviceKey];

  return (
    <motion.div
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`pointer-events-none absolute rounded-[2rem] border ${theme.border} ${theme.surface} backdrop-blur-xl ${className}`}
    />
  );
}
