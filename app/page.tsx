import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BarChart3,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight animate-fade-in">
              Save <span className="text-blue-600 animate-pulse">$53,500</span> annually
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Premium Business Intelligence for Australian SMEs.
              <br className="hidden sm:block" />
              From 10 hours of manual reporting to 30 minutes of automated insights.
            </p>
            <div className="mt-10 animate-fade-in-up">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
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
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">10 hrs</div>
              <div className="text-gray-600">Weekly manual reporting</div>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <DollarSign className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">$39,000</div>
              <div className="text-gray-600">Annual labor cost</div>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <TrendingUp className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">$8,000</div>
              <div className="text-gray-600">Data entry errors</div>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">2-3 weeks</div>
              <div className="text-gray-600">Decision delays</div>
            </Card>
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
            <Card className="p-8 border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Zap className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Automated Data Consolidation
              </h3>
              <p className="text-gray-600">
                Connects to Xero, HubSpot, Asana, and 50+ Australian business tools. Data syncs
                automatically, no manual entry required.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <BarChart3 className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom KPI Tracking</h3>
              <p className="text-gray-600">
                Bespoke visualizations designed for your industry. Track the metrics that matter to
                YOUR business, not generic templates.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Insights</h3>
              <p className="text-gray-600">
                Updated daily via automated ETL pipelines. See cash flow, sales pipeline, and
                operational efficiency in real-time.
              </p>
            </Card>
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
            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Matter profitability tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Utilization rates analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Client lifetime value metrics
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Construction & Trades</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Job costing and materials tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Equipment utilization monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Quote-to-completion cycle time
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">E-Commerce & Retail</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Inventory turnover analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Cart abandonment tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Product margin analysis
                </li>
              </ul>
            </Card>
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
            <Card className="p-6 text-center border-0 shadow-lg bg-white">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Australian Data Residency</h3>
              <p className="text-sm text-gray-600">
                Data stored in Sydney region, never leaves Australia
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg bg-white">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-gray-600">AES-256 encryption, OAuth 2.0 authentication</p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg bg-white">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">99.9% Uptime SLA</h3>
              <p className="text-sm text-gray-600">
                Automated backups, disaster recovery tested quarterly
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg bg-white">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Act Compliant</h3>
              <p className="text-sm text-gray-600">
                Full compliance with Australian Privacy Act 1988
              </p>
            </Card>
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
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
          >
            Book Your Demo Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
