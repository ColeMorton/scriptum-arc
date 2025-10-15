'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/animated/stat-card'
import { FeatureCard } from '@/components/animated/feature-card'
import { IndustryCard } from '@/components/animated/industry-card'
import { AnimatedCard } from '@/components/animated/animated-card'
import {
  BarChart3,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
} from 'lucide-react'
import {
  fadeIn,
  fadeInUp,
  buttonHover,
  buttonTap,
  viewportConfig,
  useShouldReduceMotion,
} from '@/lib/animation-variants'

export default function Home() {
  const shouldReduceMotion = useShouldReduceMotion()

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
              Save <span className="text-blue-600 animate-pulse">$53,500</span> annually
            </motion.h1>
            <motion.p
              className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              viewport={viewportConfig}
            >
              Premium Business Intelligence for Australian SMEs.
              <br className="hidden sm:block" />
              From 10 hours of manual reporting to 30 minutes of automated insights.
            </motion.p>
            <motion.div
              className="mt-10"
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
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Value Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              The Hidden Cost of Manual Reporting
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Australian SMEs waste thousands of hours and dollars on disconnected data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={Clock} value="10 hrs" description="Weekly manual reporting" />
            <StatCard icon={DollarSign} value="$39,000" description="Annual labor cost" />
            <StatCard icon={TrendingUp} value="$8,000" description="Data entry errors" />
            <StatCard icon={Users} value="2-3 weeks" description="Decision delays" />
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Your Business Intelligence, Automated
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One unified dashboard. Zero manual work. Enterprise-grade insights at SME pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Automated Data Consolidation"
              description="Connects to Xero, HubSpot, Asana, and 50+ Australian business tools. Data syncs automatically, no manual entry required."
            />
            <FeatureCard
              icon={BarChart3}
              title="Custom KPI Tracking"
              description="Bespoke visualizations designed for your industry. Track the metrics that matter to YOUR business, not generic templates."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Real-Time Insights"
              description="Updated daily via automated ETL pipelines. See cash flow, sales pipeline, and operational efficiency in real-time."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Built for Australian Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Custom dashboards designed for your specific business model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <IndustryCard
              title="Professional Services"
              features={[
                'Matter profitability tracking',
                'Utilization rates analysis',
                'Client lifetime value metrics',
              ]}
            />
            <IndustryCard
              title="Construction & Trades"
              features={[
                'Job costing and materials tracking',
                'Equipment utilization monitoring',
                'Quote-to-completion cycle time',
              ]}
            />
            <IndustryCard
              title="E-Commerce & Retail"
              features={[
                'Inventory turnover analysis',
                'Cart abandonment tracking',
                'Product margin analysis',
              ]}
            />
          </div>

          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">297%</div>
                <div className="text-gray-600">ROI in Year 1</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">94%</div>
                <div className="text-gray-600">Reduction in reporting time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">3 weeks</div>
                <div className="text-gray-600">To production dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Trust */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with the same technology that powers Spotify, Netflix, and enterprise data
              warehouses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Australian Data Residency</h3>
              <p className="text-sm text-gray-600">
                Data stored in Sydney region, never leaves Australia
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-gray-600">AES-256 encryption, OAuth 2.0 authentication</p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">99.9% Uptime SLA</h3>
              <p className="text-sm text-gray-600">
                Automated backups, disaster recovery tested quarterly
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Act Compliant</h3>
              <p className="text-sm text-gray-600">
                Full compliance with Australian Privacy Act 1988
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business Intelligence?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join Australian SMEs saving $53,500+ annually with automated reporting. From 10 hours of
            manual work to 30 minutes of insights.
          </p>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : buttonHover}
            whileTap={shouldReduceMotion ? undefined : buttonTap}
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
            >
              Book Your Demo Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
