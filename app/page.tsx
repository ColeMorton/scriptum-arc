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
  Settings,
  Package,
  Code2,
  Brain,
  FileSearch,
  Cpu,
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
              Own Your Integration Platform. Connect Your Business Systems.
              <br className="hidden sm:block" />
              Stop copying data between Xero, HubSpot, and spreadsheets—automate it with custom
              workflows impossible with Zapier or Make.
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
              Your Business Systems Don&apos;t Talk to Each Other
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Australian SMEs waste thousands of hours copying data between disconnected systems
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
              Your Business Systems, Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integration platform that connects 50+ tools. Zero manual work. Unified insights from
              all your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Integration Platform Ownership"
              description="Get your own n8n instance with visual workflow builder. Own it, control it, export it. Choose full-service management or run it yourself. Zero vendor lock-in."
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
            <FeatureCard
              icon={Code2}
              title="Advanced Capabilities"
              description="Custom TypeScript nodes, ML/AI integration, and real-time processing. Enterprise-grade automation impossible with simple automation tools."
            />
          </div>
        </div>
      </section>

      {/* Management Flexibility */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Management Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with full-service management, transition to self-service as you grow. You own
              the platform, you choose the support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Full Service"
              description="We handle everything—setup, workflows, monitoring, optimization. Focus on your business, we handle the integrations."
            />
            <FeatureCard
              icon={Zap}
              title="Hybrid"
              description="You own and access your n8n instance. We provide training, optional management, and expert support when needed."
            />
            <FeatureCard
              icon={Settings}
              title="Self-Service"
              description="Complete control of your platform. Manage workflows yourself with our training and optional consultation."
            />
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Advanced Workflow Capabilities Beyond Simple Automation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Custom workflows impossible with Zapier or Make. Enterprise-grade automation at SME
              pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Code2}
              title="Custom TypeScript Nodes"
              description="Complex business logic impossible in visual-only tools. Build sophisticated automation that requires a team of developers."
            />
            <FeatureCard
              icon={Brain}
              title="ML/AI Integration"
              description="Predictive analytics, anomaly detection, and demand forecasting. Make data-driven decisions with machine learning."
            />
            <FeatureCard
              icon={Cpu}
              title="Real-Time Processing"
              description="WebSocket connections, live dashboard updates, and instant alerts. React to business events as they happen."
            />
            <FeatureCard
              icon={FileSearch}
              title="Document Intelligence"
              description="OCR + AI for invoice processing, contract analysis, and automated data extraction. Turn documents into actionable insights."
            />
          </div>
        </div>
      </section>

      {/* Why Zixly vs Zapier/Make */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Zixly vs. Zapier or Make?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade automation capabilities that simple automation tools can&apos;t
              deliver
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Zixly Advantages</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom TypeScript code nodes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  ML/AI integration capabilities
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  You own your platform
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  No per-task fees
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time processing
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Zapier/Make Limitations</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Visual-only interface
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  No custom code capabilities
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  SaaS dependency
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Per-task pricing at scale
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Limited data processing
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Your Benefits</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Custom workflows for your industry
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Predictive business insights
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Complete platform ownership
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Predictable flat-rate pricing
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Enterprise-grade capabilities
                </li>
              </ul>
            </div>
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
                'Matter profitability with ML-powered case outcome prediction',
                'Time tracking automation with billable hours optimization',
                'Client communication with automated document generation',
              ]}
            />
            <IndustryCard
              title="Construction & Trades"
              features={[
                'Job costing with IoT sensor integration and real-time material tracking',
                'Equipment monitoring with predictive maintenance alerts',
                'Client progress reports with photo capture and OCR processing',
              ]}
            />
            <IndustryCard
              title="E-Commerce & Retail"
              features={[
                'Inventory intelligence with demand forecasting and dynamic pricing',
                'Customer analytics with behavioral segmentation and churn prediction',
                'Supply chain optimization with supplier performance tracking',
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
                <div className="text-4xl font-bold text-blue-600 mb-2">0%</div>
                <div className="text-gray-600">Vendor lock-in risk</div>
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
              Enterprise-Grade Integration Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with the same integration platform used by BMW and Telstra—enterprise power at
              SME pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Package className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">You Own Your Platform</h3>
              <p className="text-sm text-gray-600">
                Your n8n instance, your workflows, your data. Export and migrate anytime.
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Code2 className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Custom Code Nodes</h3>
              <p className="text-sm text-gray-600">
                TypeScript for complex business logic impossible in visual-only tools
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Brain className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">ML/AI Ready</h3>
              <p className="text-sm text-gray-600">
                Predictive analytics, anomaly detection, and demand forecasting
              </p>
            </AnimatedCard>

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
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Own Your Advanced Automation Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join Australian SMEs saving $53,500+ annually with custom workflows impossible with
            Zapier or Make. Enterprise-grade automation at SME pricing.
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
