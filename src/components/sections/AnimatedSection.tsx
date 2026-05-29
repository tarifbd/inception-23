'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

type AnimatedSectionProps = Omit<HTMLMotionProps<'section'>, 'children'> & {
  children: ReactNode;
  containerClassName?: string;
};

export function AnimatedSection({ children, className = '', containerClassName, ...props }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden py-20 md:py-28 ${className}`}
      {...props}
    >
      <div className={containerClassName ?? 'mx-auto w-full max-w-7xl px-5 sm:px-6'}>{children}</div>
    </motion.section>
  );
}
