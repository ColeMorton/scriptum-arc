import { Variants, useReducedMotion } from 'framer-motion'

// Base animation durations and easing for professional feel
export const animationConfig = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  stagger: 0.1,
} as const

// Hook to check if user prefers reduced motion
export const useShouldReduceMotion = () => {
  const shouldReduceMotion = useReducedMotion()
  return shouldReduceMotion
}

// Fade in with upward motion - subtle and professional
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    },
  },
}

// Simple fade in
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    },
  },
}

// Gentle scale with fade
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    },
  },
}

// Stagger container for animating children sequentially
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationConfig.stagger,
      delayChildren: 0.1,
    },
  },
}

// Stagger item for children of stagger container
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    },
  },
}

// Card hover animation - subtle lift
export const cardHover = {
  y: -4,
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
}

// Button interaction animations
export const buttonHover = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
}

export const buttonTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
}

// List item animation for checklists
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: animationConfig.ease,
    },
  },
}

// Viewport configuration for once-only animations
export const viewportConfig = {
  once: true,
  margin: '-50px',
  amount: 0.3,
} as const
