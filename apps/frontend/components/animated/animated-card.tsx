'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import {
  fadeInUp,
  cardHover,
  viewportConfig,
  useShouldReduceMotion,
} from '@/lib/animation-variants'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hasHover?: boolean
}

export function AnimatedCard({ children, className = '', hasHover = true }: AnimatedCardProps) {
  const shouldReduceMotion = useShouldReduceMotion()

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      whileHover={hasHover && !shouldReduceMotion ? cardHover : undefined}
      viewport={viewportConfig}
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  )
}
