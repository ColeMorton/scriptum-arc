import { motion } from 'framer-motion'
import { LucideIcon, Webhook, Box, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fadeInUp, viewportConfig } from '@/lib/animation-variants'

interface CapabilityShowcaseProps {
  title: string
  description: string
  features: string[]
  example: string
  icon: string
  delay?: number
}

const iconMap: Record<string, LucideIcon> = {
  Webhook: Webhook,
  Kubernetes: Box,
  Activity: Activity,
}

export function CapabilityShowcase({
  title,
  description,
  features,
  example,
  icon,
  delay = 0,
}: CapabilityShowcaseProps) {
  const Icon = iconMap[icon] || Activity

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      <Card className="p-8 h-full bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-shadow duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 rounded-lg p-3 flex-shrink-0">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Technical Implementation
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 flex-shrink-0">→</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example */}
          <div className="bg-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
            <div className="text-xs font-semibold text-blue-900 mb-1 uppercase tracking-wide">
              Real Example
            </div>
            <div className="text-sm text-blue-900">{example}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
