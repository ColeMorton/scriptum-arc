import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fadeInUp, viewportConfig } from '@/lib/animation-variants'

interface ServicePackageCardProps {
  name: string
  tagline: string
  price: string
  priceNote: string
  timeline: string
  bestFor: string
  includes: string[]
  featured?: boolean
  delay?: number
}

export function ServicePackageCard({
  name,
  tagline,
  price,
  priceNote,
  timeline,
  bestFor,
  includes,
  featured = false,
  delay = 0,
}: ServicePackageCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
      className="relative"
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      <Card
        className={`h-full p-8 ${
          featured ? 'border-2 border-blue-500 shadow-xl' : 'border border-gray-200 shadow-lg'
        } hover:shadow-2xl transition-shadow duration-300`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-sm text-gray-600 mb-4">{tagline}</p>
            <div className="mb-4">
              <div className="text-3xl font-bold text-blue-600">{price}</div>
              <div className="text-sm text-gray-600">{priceNote}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Timeline:</span> {timeline}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Best for:</span> {bestFor}
              </div>
            </div>
          </div>

          {/* Includes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              What&apos;s Included
            </h4>
            <ul className="space-y-2">
              {includes.slice(0, 8).map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
              {includes.length > 8 && (
                <li className="text-sm text-gray-600 italic ml-7">
                  + {includes.length - 8} more items
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
