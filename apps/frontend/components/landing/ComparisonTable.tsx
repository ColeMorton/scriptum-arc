import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { fadeInUp, viewportConfig } from '@/lib/animation-variants'

interface Advantage {
  title: string
  description: string
}

interface Comparison {
  category: string
  advantages: Advantage[]
}

interface ComparisonTableProps {
  comparisons: Comparison[]
}

export function ComparisonTable({ comparisons }: ComparisonTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {comparisons.map((comparison, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">{comparison.category}</h3>
          <ul className="space-y-4">
            {comparison.advantages.map((advantage, advIndex) => (
              <li key={advIndex} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{advantage.title}</div>
                  <div className="text-sm text-gray-600">{advantage.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
