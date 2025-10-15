'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { scaleIn, cardHover, viewportConfig, useShouldReduceMotion } from '@/lib/animation-variants'

interface StatCardProps {
  icon: LucideIcon
  value: string
  description: string
  iconColor?: string
}

export function StatCard({
  icon: Icon,
  value,
  description,
  iconColor = 'text-red-500',
}: StatCardProps) {
  const shouldReduceMotion = useShouldReduceMotion()

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      whileHover={shouldReduceMotion ? undefined : cardHover}
      viewport={viewportConfig}
    >
      <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Icon className={`h-12 w-12 ${iconColor} mx-auto mb-4`} />
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="text-gray-600">{description}</div>
      </Card>
    </motion.div>
  )
}
