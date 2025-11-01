import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CheckCircle2, TrendingUp } from 'lucide-react'
import { fadeInUp, viewportConfig } from '@/lib/animation-variants'

interface UseCaseCardProps {
  title: string
  problem: string
  solution: string
  metrics: string[]
  technologies: string[]
  delay?: number
}

export function UseCaseCard({
  title,
  problem,
  solution,
  metrics,
  technologies,
  delay = 0,
}: UseCaseCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      <Card className="p-8 h-full bg-white hover:shadow-xl transition-shadow duration-300">
        <div className="space-y-6">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

          {/* Problem */}
          <div>
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Challenge
              </h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{problem}</p>
          </div>

          {/* Solution */}
          <div>
            <div className="flex items-center mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Solution
              </h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{solution}</p>
          </div>

          {/* Metrics */}
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Results
              </h4>
            </div>
            <ul className="space-y-1">
              {metrics.map((metric, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
