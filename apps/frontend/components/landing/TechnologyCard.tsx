import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { fadeInUp, viewportConfig } from '@/lib/animation-variants'

interface Technology {
  name: string
  description: string
}

interface TechnologyCardProps {
  category: string
  technologies: Technology[]
  delay?: number
}

export function TechnologyCard({ category, technologies, delay = 0 }: TechnologyCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      <Card className="p-6 h-full bg-white hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
        <ul className="space-y-3">
          {technologies.map((tech, index) => (
            <li key={index} className="border-l-2 border-blue-500 pl-3">
              <div className="font-semibold text-gray-900">{tech.name}</div>
              <div className="text-sm text-gray-600">{tech.description}</div>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
