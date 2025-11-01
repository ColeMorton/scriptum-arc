'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fadeInUp, staggerContainer, listItem, viewportConfig } from '@/lib/animation-variants'

interface IndustryCardProps {
  title: string
  features: string[]
}

export function IndustryCard({ title, features }: IndustryCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <Card className="p-8 border-0 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <motion.ul
          className="space-y-2 text-gray-600"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {features.map((feature, index) => (
            <motion.li key={index} className="flex items-center" variants={listItem}>
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </Card>
    </motion.div>
  )
}
