'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  fadeInUp,
  cardHover,
  viewportConfig,
  useShouldReduceMotion,
} from '@/lib/animation-variants'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = 'text-blue-600',
}: FeatureCardProps) {
  const shouldReduceMotion = useShouldReduceMotion()

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      whileHover={shouldReduceMotion ? undefined : cardHover}
      viewport={viewportConfig}
    >
      <Card className="p-8 border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <Icon className={`h-12 w-12 ${iconColor} mb-6`} />
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </motion.div>
  )
}
