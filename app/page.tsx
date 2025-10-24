'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/animated/stat-card'
import { FeatureCard } from '@/components/animated/feature-card'
import { AnimatedCard } from '@/components/animated/animated-card'
import { ServicePackageCard } from '@/components/landing/ServicePackageCard'
import { TechnologyCard } from '@/components/landing/TechnologyCard'
import { CapabilityShowcase } from '@/components/landing/CapabilityShowcase'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { UseCaseCard } from '@/components/landing/UseCaseCard'
import {
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
  ArrowRight,
  Activity,
  MapPin,
  CheckCircle2,
  Github,
  Unlock,
  Download,
  LucideIcon,
} from 'lucide-react'
import {
  fadeIn,
  fadeInUp,
  buttonHover,
  buttonTap,
  viewportConfig,
  useShouldReduceMotion,
} from '@/lib/animation-variants'
import {
  HERO_CONTENT,
  PROBLEM_STATEMENT,
  CLOUD_NATIVE_BENEFITS,
  CAPABILITIES,
  SERVICE_PACKAGES,
  IMPLEMENTATION_PROCESS,
  COMPETITIVE_DIFFERENTIATORS,
  USE_CASES,
  TECHNOLOGY_STACK,
  TRUST_SIGNALS,
  FINAL_CTA,
} from '@/lib/landing-content'

// Icon map for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Shield,
  DollarSign,
  Zap,
  Activity,
  MapPin,
  CheckCircle2,
  Github,
  Unlock,
}

export default function Home() {
  const shouldReduceMotion = useShouldReduceMotion()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              viewport={viewportConfig}
            >
              {HERO_CONTENT.headline}
            </motion.h1>
            <motion.p
              className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              viewport={viewportConfig}
            >
              {HERO_CONTENT.subheadline}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              viewport={viewportConfig}
            >
              <motion.div
                whileHover={shouldReduceMotion ? undefined : buttonHover}
                whileTap={shouldReduceMotion ? undefined : buttonTap}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
                  onClick={() => scrollToSection('capabilities')}
                >
                  {HERO_CONTENT.primaryCTA}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={shouldReduceMotion ? undefined : buttonHover}
                whileTap={shouldReduceMotion ? undefined : buttonTap}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
                  onClick={() => scrollToSection('pricing')}
                >
                  {HERO_CONTENT.secondaryCTA}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {PROBLEM_STATEMENT.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manual deployments, spiraling cloud costs, and missing monitoring create real business
              pain. Let&apos;s fix that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROBLEM_STATEMENT.painPoints.map((point, index) => (
              <StatCard
                key={index}
                icon={Clock}
                value={point.stat}
                description={point.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cloud-Native Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {CLOUD_NATIVE_BENEFITS.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {CLOUD_NATIVE_BENEFITS.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {CLOUD_NATIVE_BENEFITS.benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon] || Activity
              return (
                <FeatureCard
                  key={index}
                  icon={Icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Showcase Section */}
      <section id="capabilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {CAPABILITIES.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{CAPABILITIES.subheadline}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CAPABILITIES.items.map((capability, index) => (
              <CapabilityShowcase
                key={index}
                title={capability.title}
                description={capability.description}
                features={capability.features}
                example={capability.example}
                icon={capability.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Service Tiers for Brisbane Tech Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Docker Compose MVP to multi-region Kubernetes. Choose the infrastructure tier
              that fits your scale and growth stage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SERVICE_PACKAGES.map((pkg, index) => (
              <ServicePackageCard
                key={index}
                name={pkg.name}
                tagline={pkg.tagline}
                price={pkg.price}
                priceNote={pkg.priceNote}
                timeline={pkg.timeline}
                bestFor={pkg.bestFor}
                includes={pkg.includes}
                featured={pkg.featured}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {IMPLEMENTATION_PROCESS.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {IMPLEMENTATION_PROCESS.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {IMPLEMENTATION_PROCESS.steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="text-sm text-blue-600 font-semibold">{step.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {USE_CASES.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{USE_CASES.subheadline}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {USE_CASES.cases.map((useCase, index) => (
              <UseCaseCard
                key={index}
                title={useCase.title}
                problem={useCase.problem}
                solution={useCase.solution}
                metrics={useCase.metrics}
                technologies={useCase.technologies}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Differentiators Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {COMPETITIVE_DIFFERENTIATORS.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {COMPETITIVE_DIFFERENTIATORS.subheadline}
            </p>
          </div>

          <ComparisonTable comparisons={COMPETITIVE_DIFFERENTIATORS.comparisons} />
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {TECHNOLOGY_STACK.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {TECHNOLOGY_STACK.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TECHNOLOGY_STACK.categories.map((category, index) => (
              <TechnologyCard
                key={index}
                category={category.category}
                technologies={category.technologies}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {TRUST_SIGNALS.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{TRUST_SIGNALS.subheadline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRUST_SIGNALS.signals.map((signal, index) => {
              const Icon = iconMap[signal.icon] || CheckCircle2
              return (
                <AnimatedCard
                  key={index}
                  className="p-6 text-center border-0 shadow-lg bg-white"
                  hasHover={false}
                >
                  <Icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{signal.title}</h3>
                  <p className="text-sm text-gray-600">{signal.description}</p>
                </AnimatedCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{FINAL_CTA.headline}</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{FINAL_CTA.subheadline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : buttonHover}
              whileTap={shouldReduceMotion ? undefined : buttonTap}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
              >
                {FINAL_CTA.primaryCTA.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="text-sm text-blue-200 mt-2">{FINAL_CTA.primaryCTA.subtitle}</div>
            </motion.div>
            <motion.div
              whileHover={shouldReduceMotion ? undefined : buttonHover}
              whileTap={shouldReduceMotion ? undefined : buttonTap}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 h-auto bg-white hover:bg-gray-100 hover:scale-105 transition-transform duration-200"
              >
                <Download className="mr-2 h-5 w-5" />
                {FINAL_CTA.secondaryCTA.text}
              </Button>
              <div className="text-sm text-blue-200 mt-2">{FINAL_CTA.secondaryCTA.subtitle}</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
