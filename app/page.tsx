'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/animated/stat-card'
import { FeatureCard } from '@/components/animated/feature-card'
import { AnimatedCard } from '@/components/animated/animated-card'
import {
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Settings,
  Code2,
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
              N8N Integration Services for <span className="text-blue-600">Brisbane SMEs</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              viewport={viewportConfig}
            >
              Expert n8n automation implementation, workflow development, and ongoing support.
              <br className="hidden sm:block" />
              Own your automation platform—no vendor lock-in. Brisbane-based service delivery.
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
                  Book Free Consultation
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
              Manual Processes Cost Brisbane SMEs Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Local businesses waste time and money on manual data entry, disconnected systems, and
              repetitive tasks that n8n automation can eliminate
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
              Expert n8n Automation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Brisbane-based n8n experts who set up, configure, and manage your automation platform.
              Own your workflows, control your data, eliminate manual processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="n8n Platform Setup & Configuration"
              description="Complete n8n implementation on your infrastructure. Security hardening, backup setup, user management, and initial workflow templates. You own the platform."
            />
            <FeatureCard
              icon={Code2}
              title="Custom Workflow Development"
              description="Bespoke n8n workflows tailored to your business processes. Integration with Xero, HubSpot, and 50+ business systems. Brisbane-based development team."
            />
            <FeatureCard
              icon={Users}
              title="Training & Knowledge Transfer"
              description="Comprehensive training for your team. Documentation, best practices, and ongoing support. Transition from full-service to self-management when ready."
            />
            <FeatureCard
              icon={Settings}
              title="Flexible Management Options"
              description="Choose your support level: full-service management, hybrid support, or self-service with on-demand consulting. Scale up or down as needed."
            />
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Service Packages for Brisbane SMEs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the service level that fits your business needs. Start with n8n automation,
              expand to full self-hostable stack when ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Package</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">$3,500 - $5,000</div>
                <p className="text-gray-600">Perfect for small businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  n8n platform setup & configuration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  3-5 basic workflows
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>1 integration (Xero or CRM)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Basic training & documentation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  30-day support included
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Package</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">$7,500 - $12,000</div>
                <p className="text-gray-600">Perfect for growing businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  n8n platform setup & configuration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  5-10 custom workflows
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  2-3 integrations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Advanced training & documentation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>3 months support included
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Optional monthly management
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Package</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">$15,000 - $30,000</div>
                <p className="text-gray-600">Perfect for established businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  n8n platform setup & configuration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Unlimited custom workflows
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Multiple integrations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Full stack expansion (Metabase, Nextcloud, etc.)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Comprehensive training
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>6 months support + monthly
                  management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Service Delivery Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven methodology for successful n8n implementations. From discovery to go-live, we
              ensure your automation delivers real business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                Free consultation to understand your business processes and automation opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup</h3>
              <p className="text-gray-600">
                n8n platform implementation, security configuration, and initial workflow templates
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Development</h3>
              <p className="text-gray-600">
                Custom workflow development, system integrations, and thorough testing
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training</h3>
              <p className="text-gray-600">
                Comprehensive training, documentation, and ongoing support options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* n8n Workflow Process */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              How n8n Automation Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your business systems connect through n8n workflows, automating data flow and
              eliminating manual processes. You own the platform and control the automation.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Business Systems */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-xl p-6 mb-4">
                  <Settings className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Business Systems</h3>
                  <p className="text-gray-700 text-sm">Xero, HubSpot, Asana, etc.</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Accounting (Xero, MYOB)</li>
                  <li>• CRM (HubSpot, Pipedrive)</li>
                  <li>• Project Management</li>
                  <li>• E-commerce platforms</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 ml-2">connects via</span>
              </div>

              {/* n8n Workflows */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-xl p-6 mb-4">
                  <Zap className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-blue-900 mb-2">n8n Workflows</h3>
                  <p className="text-blue-700 text-sm">Automation Engine</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Data synchronization</li>
                  <li>• Process automation</li>
                  <li>• Custom business logic</li>
                  <li>• Error handling</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 ml-2">results in</span>
              </div>

              {/* Automated Processes */}
              <div className="text-center">
                <div className="bg-green-100 rounded-xl p-6 mb-4">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">Automated Processes</h3>
                  <p className="text-green-700 text-sm">Business Value</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eliminated manual work</li>
                  <li>• Real-time data sync</li>
                  <li>• Reduced errors</li>
                  <li>• Time savings</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">
                  Result: Automated business processes with complete platform ownership
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* n8n Service Advantages */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose n8n Over Zapier or Make?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade automation capabilities that simple automation tools can&apos;t
              deliver. Own your platform, control your data, scale without limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Platform Ownership"
              description="You own your n8n instance. No vendor lock-in, no monthly fees per task. Export and migrate anytime."
            />
            <FeatureCard
              icon={Code2}
              title="Custom Development"
              description="TypeScript custom nodes for complex business logic. Build sophisticated automation that simple tools can't handle."
            />
            <FeatureCard
              icon={Shield}
              title="Data Sovereignty"
              description="Your data stays on your infrastructure. Australian data residency, complete control, no third-party dependencies."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Unlimited Scale"
              description="No per-task pricing limits. Run thousands of workflows without cost increases. Scale with your business."
            />
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Zixly n8n Services vs. DIY or Other Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why choose Brisbane-based n8n experts over DIY implementation or generic automation
              services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Zixly n8n Services</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Brisbane-based expert team
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Complete platform setup
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom workflow development
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Training and knowledge transfer
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Ongoing support options
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">DIY Implementation</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Steep learning curve
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Time-consuming setup
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Security configuration risks
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  No ongoing support
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  Trial and error approach
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Your Benefits</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Fast, professional implementation
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Secure, optimized platform
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Custom workflows for your business
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Team training and documentation
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Local support and expertise
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Brisbane SME Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real n8n automation implementations for local businesses. See how Brisbane SMEs are
              saving time and money with automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Professional Services</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Automated lead management and client reporting
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Time tracking automation with billable hours
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Client communication workflows
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Construction & Trades</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Job costing automation and equipment tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Client progress reports with photo capture
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Material ordering and inventory sync
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">E-Commerce & Retail</h3>
              <ul className="space-y-3 text-purple-800">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Inventory sync and customer communication
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Order processing and fulfillment automation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Customer service and support workflows
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Hours saved per week</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">$50K+</div>
                <div className="text-gray-600">Annual labor cost savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Platform ownership</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Trust */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Brisbane-Based n8n Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Local expertise, proven methodology, and complete platform ownership. Your automation
              platform, your control, your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Zap className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Platform Ownership</h3>
              <p className="text-sm text-gray-600">
                Your n8n instance, your workflows, your data. Export and migrate anytime.
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Code2 className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Custom Development</h3>
              <p className="text-sm text-gray-600">
                TypeScript custom nodes for complex business logic and integrations
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Users className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-sm text-gray-600">
                Brisbane-based team with deep n8n and Australian business knowledge
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Settings className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Support</h3>
              <p className="text-sm text-gray-600">
                Full-service, hybrid, or self-service options. Scale up or down as needed.
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Data Sovereignty</h3>
              <p className="text-sm text-gray-600">
                Australian data residency, complete control, no third-party dependencies
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-6 text-center border-0 shadow-lg bg-white" hasHover={false}>
              <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-sm text-gray-600">
                Successful implementations across Brisbane SMEs with measurable ROI
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Automate Your Business with n8n?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join Brisbane SMEs with automated workflows, eliminated manual processes, and complete
            platform ownership. Expert n8n implementation, training, and ongoing support.
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
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
