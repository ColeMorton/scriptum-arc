/**
 * Landing Page Content - SME Business Automation
 *
 * All content for public-facing website landing page.
 * Sources: docs/marketing/service-overview.md, docs/financial/service-business-model.md
 *
 * Version: 3.0 - Complete SME Business Automation Focus
 */

export const HERO_CONTENT = {
  headline: 'Stop Wasting Time on Repetitive Admin Work',
  subheadline:
    'We connect your business systems (Xero, HubSpot, Shopify, etc.) so they work together automatically. Save 10-20 hours per week on data entry, invoicing, and reporting.',
  primaryCTA: 'See How It Works',
  secondaryCTA: 'Calculate Time Savings',
}

export const PROBLEM_STATEMENT = {
  headline: 'Brisbane SMEs Waste Thousands on Manual Admin',
  painPoints: [
    {
      stat: '15+ hrs/week',
      description: 'Manual data entry',
      impact: 'Entering the same information into multiple systems',
    },
    {
      stat: '95% errors',
      description: 'From double handling',
      impact: 'Duplicate, conflicting, or missing information',
    },
    {
      stat: '30 minutes',
      description: 'Finding information',
      impact: '"Which system has the correct phone number?"',
    },
    {
      stat: '$50K-$150K',
      description: 'Wasted per year',
      impact: 'On admin work that could be automated',
    },
  ],
}

export const BUSINESS_AUTOMATION_BENEFITS = {
  headline: 'Why Automate Your Business Systems?',
  subheadline:
    'Connect your existing systems and eliminate repetitive work. Your team focuses on customers, not data entry.',
  benefits: [
    {
      title: 'Save Time',
      description: 'Eliminate 10-20 hours per week of manual data entry and double handling',
      icon: 'Clock',
    },
    {
      title: 'Reduce Errors',
      description: '95%+ reduction in data entry mistakes and duplicate information',
      icon: 'Shield',
    },
    {
      title: 'Improve Cash Flow',
      description: 'Faster invoicing and payment tracking means getting paid sooner',
      icon: 'DollarSign',
    },
    {
      title: 'Better Visibility',
      description: 'Real-time dashboard shows how your business is performing right now',
      icon: 'Activity',
    },
    {
      title: 'Enable Growth',
      description: 'Handle 30-50% more business without hiring additional admin staff',
      icon: 'TrendingUp',
    },
  ],
}

export const WHAT_WE_AUTOMATE = {
  headline: 'Workflows We Automate for Brisbane SMEs',
  subheadline:
    'Real automation we deliver to businesses like yours. Eliminate repetitive tasks and focus on what matters.',
  items: [
    {
      title: 'Automatic Invoice Generation',
      description:
        'Stop manually creating invoices. When work is done or time is logged, invoices generate automatically.',
      features: [
        'Time tracked → Automatic invoice creation',
        'Deal won in CRM → Invoice sent to customer',
        'Payment reminders sent automatically',
        'Payment received → Thank you email + CRM updated',
        'Real-time outstanding invoice dashboard',
      ],
      example: 'Law firm saves 12 hours/week on billing, billing accuracy up from 85% to 98%',
      icon: 'FileText',
    },
    {
      title: 'Business System Integration',
      description:
        'Connect Xero, HubSpot, Shopify, Asana and others. Data entered once, updated everywhere instantly.',
      features: [
        'Customer details synced across all systems',
        'No more "which system is correct?"',
        'Projects automatically created from sales',
        'Inventory levels synchronized across channels',
        'Single source of truth for your business',
      ],
      example: 'Construction company eliminates 14 hours/week of data re-entry between systems',
      icon: 'Link',
    },
    {
      title: 'Real-Time Business Dashboard',
      description:
        'See how your business is doing right now. No more waiting for reports or pulling data from multiple systems.',
      features: [
        'Outstanding invoices and cash flow',
        'Sales pipeline and conversion rates',
        'Project profitability in real-time',
        'Inventory levels and reorder alerts',
        'Access from phone, tablet, or computer',
      ],
      example:
        'E-commerce business makes better buying decisions with real-time inventory visibility',
      icon: 'BarChart',
    },
  ],
}

export const SERVICE_PACKAGES = [
  {
    name: 'Business Automation Starter',
    tagline: 'Quick Wins for Small Businesses',
    price: '$3,000 - $5,000',
    priceNote: 'one-time',
    timeline: '1-2 weeks',
    bestFor: 'Small businesses (5-15 employees) wanting to prove automation value',
    includes: [
      'Connect 2-3 business systems (e.g., Xero + HubSpot)',
      '2-3 core automation workflows',
      'Simple dashboard with key metrics',
      'Team training (2 hours)',
      'Documentation and workflow diagrams',
      '30 days post-launch support',
    ],
    useCases: [
      'Invoice paid → Update CRM',
      'Deal won → Create invoice',
      'Time tracked → Compile timesheet',
    ],
    successMetrics: [
      '5-10 hours per week saved',
      'Zero data entry errors between systems',
      'ROI achieved within 3 months',
    ],
    featured: false,
  },
  {
    name: 'Complete Business Automation',
    tagline: 'Comprehensive Multi-System Integration',
    price: '$8,000 - $15,000',
    priceNote: 'one-time',
    timeline: '4-6 weeks',
    bestFor: 'Growing businesses (15-50 employees) with multiple systems',
    includes: [
      'Everything in Starter, PLUS',
      'Connect 5-8 business systems',
      '5-10 custom automation workflows',
      'Advanced dashboard with analytics',
      'Real-time business intelligence',
      'Team training (8 hours)',
      'Comprehensive documentation',
      '60 days post-launch support',
    ],
    useCases: [
      'Complete customer lifecycle automation',
      'Financial workflow (time → invoice → payment)',
      'Inventory management and reordering',
      'Project coordination and billing',
    ],
    successMetrics: [
      '15-20 hours per week saved',
      '95%+ data accuracy across systems',
      'Real-time business visibility',
      'ROI achieved within 4-6 months',
    ],
    featured: true,
  },
  {
    name: 'Enterprise Business Suite',
    tagline: 'Industry-Specific Custom Solutions',
    price: '$20,000 - $40,000',
    priceNote: 'one-time',
    timeline: '8-12 weeks',
    bestFor: 'Established businesses (40-100 employees) needing customization',
    includes: [
      'Everything in Complete, PLUS',
      'Unlimited system integrations',
      'Industry-specific workflows (legal, construction, e-commerce, manufacturing)',
      'Advanced analytics and forecasting',
      'Multi-location support',
      'Compliance automation',
      'Comprehensive training (12+ hours)',
      '90 days full support with dedicated contact',
    ],
    useCases: [
      'Construction: Job costing and progress billing',
      'Legal: Matter management and trust accounting',
      'E-commerce: Multi-channel inventory sync',
      'Manufacturing: Production scheduling and procurement',
    ],
    successMetrics: [
      '20-30 hours per week saved',
      'Complete business visibility across locations',
      'Industry-specific compliance maintained',
      'ROI achieved within 6-12 months',
    ],
    featured: false,
  },
  {
    name: 'Monthly Management',
    tagline: 'Ongoing Optimization and Support',
    price: '$500 - $2,000',
    priceNote: 'per month',
    timeline: 'Ongoing',
    bestFor: 'Businesses wanting hands-off automation management',
    includes: [
      'Workflow monitoring and health checks',
      'Bug fixes and optimization',
      'New workflow development (1-2 per month)',
      'Integration updates as systems change',
      'Monthly performance reports',
      'Priority support (4 hour to same-day response)',
      'Strategy calls to identify new opportunities',
      'Keeps automation current as business evolves',
    ],
    tiers: [
      {
        name: 'Basic Management',
        price: '$500/month',
        features: [
          'Monitoring and bug fixes',
          'Email support within 24 hours',
          'Monthly performance report',
        ],
      },
      {
        name: 'Professional Management',
        price: '$1,200/month',
        features: [
          '1 new workflow per month',
          'Priority support within 4 hours',
          'Monthly strategy call',
        ],
      },
      {
        name: 'Enterprise Management',
        price: '$2,000/month',
        features: [
          '2 new workflows per month',
          'Same-day support response',
          'Dedicated Slack/Teams channel',
        ],
      },
    ],
    useCases: [
      'Continuous improvement and optimization',
      'Expert backup for in-house teams',
      'Adapt automation as business grows',
      'Keep workflows current with system updates',
    ],
    successMetrics: [],
    featured: false,
  },
]

export const IMPLEMENTATION_PROCESS = {
  headline: 'Our Delivery Process',
  subheadline:
    'Proven methodology for successful business automation. From assessment to go-live in 1-12 weeks.',
  steps: [
    {
      number: 1,
      title: 'Free Assessment',
      description:
        'Free 30-60 minute discussion of your systems, pain points, and automation opportunities.',
      deliverables: [
        'Current systems inventory',
        'Pain point identification',
        'Quick win opportunities',
        'Service tier recommendation',
      ],
      duration: 'Free, 30-60 minutes',
    },
    {
      number: 2,
      title: 'Business Process Review',
      description:
        'Deep-dive into your workflows, ROI calculations, and detailed proposal with exact scope.',
      deliverables: [
        'Workflow mapping and documentation',
        'ROI calculation per workflow',
        'Detailed proposal with pricing',
        'Timeline and milestones',
      ],
      duration: '$500, credited to project',
    },
    {
      number: 3,
      title: 'Implementation',
      description:
        'We build, test, and deploy your automation. Weekly check-ins keep you informed throughout.',
      deliverables: [
        'System connections configured',
        'Workflows built and tested',
        'Dashboard customized for your business',
        'Quality assurance completed',
      ],
      duration: '1-12 weeks (tier dependent)',
    },
    {
      number: 4,
      title: 'Training & Go-Live',
      description:
        'Your team learns how it all works. Test with real data, make adjustments, then go live.',
      deliverables: [
        'Team training sessions',
        'Documentation and diagrams',
        'Test period with adjustments',
        'Post-launch support plan',
      ],
      duration: 'Final 1-2 weeks',
    },
  ],
}

export const COMPETITIVE_DIFFERENTIATORS = {
  headline: 'Why Choose Zixly?',
  subheadline:
    'Brisbane-based, business-focused automation that speaks your language and delivers results.',
  comparisons: [
    {
      category: 'vs DIY Automation Platforms (Zapier, Make)',
      advantages: [
        {
          title: 'Done For You',
          description: "We build and maintain everything - you don't need to learn tools",
        },
        {
          title: 'Complex Workflows',
          description: 'Handle multi-step workflows DIY platforms struggle with',
        },
        {
          title: 'Business Consulting',
          description: 'We understand your processes and suggest improvements',
        },
      ],
    },
    {
      category: 'vs Traditional IT Consultants',
      advantages: [
        {
          title: 'Business Focus',
          description: 'We speak business language, not technical jargon',
        },
        {
          title: 'Fixed Pricing',
          description: 'No surprise hourly billings, clear project costs upfront',
        },
        {
          title: 'Fast Turnaround',
          description: '1-12 weeks vs months of IT projects',
        },
      ],
    },
    {
      category: 'vs Large Automation Consultancies',
      advantages: [
        {
          title: 'SME-Appropriate Pricing',
          description: '$3K-$40K projects, not $100K+ enterprise pricing',
        },
        {
          title: 'Brisbane Local',
          description: 'In-person meetings, same timezone, understand local market',
        },
        {
          title: 'Personal Service',
          description: 'Direct access to senior consultants, no account managers',
        },
      ],
    },
  ],
}

export const USE_CASES = {
  headline: 'Built for Brisbane SMEs',
  subheadline:
    'Real implementations across different industries. See how we solve business challenges.',
  cases: [
    {
      title: 'Professional Services',
      problem:
        'Timesheets scattered, billing inaccurate, WIP tracking manual, trust accounting errors',
      solution:
        'Time tracking → Automatic timesheet compilation → Invoice generation → Trust accounting entries → WIP dashboard',
      metrics: [
        '12 hours/week saved on billing',
        'Billing accuracy 85% → 98%',
        'Zero trust accounting errors',
      ],
      technologies: ['Practice Management', 'Xero', 'CRM', 'Document Management'],
    },
    {
      title: 'Construction & Trades',
      problem:
        'Quote tracking chaos, job costing done after job complete, progress billing takes hours',
      solution:
        'Quote template → Auto-PDF generation → CRM tracking → Real-time job costing → Automatic progress invoices',
      metrics: [
        'Quote prep: 3-4 hrs → 30 mins',
        'Real-time job profitability',
        'Progress billing: 6 hrs → 45 mins',
      ],
      technologies: ['Job Management', 'Xero', 'CRM', 'Estimating Tools'],
    },
    {
      title: 'E-commerce & Retail',
      problem:
        'Inventory out of sync across channels, 20 hrs/week manual order processing, frequent stockouts',
      solution:
        'Multi-channel inventory sync → Automatic order processing → Customer notifications → Reorder automation',
      metrics: [
        'Order processing: 20 hrs → 3 hrs/week',
        'Stockouts reduced 70%',
        'Sales increased 25%',
      ],
      technologies: ['Shopify', 'eBay/Amazon', 'Xero', 'Inventory Management'],
    },
  ],
}

export const INTEGRATIONS_WE_SUPPORT = {
  headline: 'Business Systems We Connect',
  subheadline:
    'The tools you already use, working together automatically. If it has an API, we can integrate it.',
  categories: [
    {
      category: 'Accounting & Finance',
      technologies: [
        { name: 'Xero', description: 'Cloud accounting platform (most popular)' },
        { name: 'MYOB', description: 'Australian accounting software' },
        { name: 'QuickBooks', description: 'Intuit accounting platform' },
        { name: 'Stripe', description: 'Payment processing' },
      ],
    },
    {
      category: 'CRM & Sales',
      technologies: [
        { name: 'HubSpot', description: 'CRM and marketing automation' },
        { name: 'Pipedrive', description: 'Sales-focused CRM' },
        { name: 'Salesforce', description: 'Enterprise CRM platform' },
        { name: 'Zoho CRM', description: 'Affordable CRM option' },
      ],
    },
    {
      category: 'Project Management',
      technologies: [
        { name: 'Asana', description: 'Team collaboration and projects' },
        { name: 'Monday.com', description: 'Visual project management' },
        { name: 'Trello', description: 'Simple kanban boards' },
        { name: 'ClickUp', description: 'All-in-one work platform' },
      ],
    },
    {
      category: 'E-commerce',
      technologies: [
        { name: 'Shopify', description: 'Leading e-commerce platform' },
        { name: 'WooCommerce', description: 'WordPress e-commerce' },
        { name: 'Magento', description: 'Enterprise e-commerce' },
        { name: 'eBay/Amazon', description: 'Marketplace integrations' },
      ],
    },
    {
      category: 'Communication & Collaboration',
      technologies: [
        { name: 'Email', description: 'Gmail, Outlook, any email provider' },
        { name: 'Slack', description: 'Team messaging platform' },
        { name: 'Microsoft Teams', description: 'Microsoft collaboration suite' },
        { name: 'Google Workspace', description: 'Docs, Sheets, Drive' },
      ],
    },
    {
      category: 'HR & Scheduling',
      technologies: [
        { name: 'Employment Hero', description: 'Australian HR and payroll' },
        { name: 'Deputy', description: 'Staff scheduling and timesheets' },
        { name: 'KeyPay', description: 'Cloud payroll software' },
        { name: 'Calendly', description: 'Appointment scheduling' },
      ],
    },
  ],
}

export const TRUST_SIGNALS = {
  headline: 'Brisbane-Based Business Automation Experts',
  subheadline:
    'Local team who understands Brisbane businesses. We use these workflows to run our own operations.',
  signals: [
    {
      title: 'Brisbane-Based and Local',
      description:
        'In-person meetings, same timezone, understand Australian business needs and data residency requirements.',
      icon: 'MapPin',
    },
    {
      title: 'We Use It Ourselves',
      description:
        'These exact workflows run Zixly operations. Authentic expertise from real daily usage, not theory.',
      icon: 'CheckCircle2',
    },
    {
      title: 'No Vendor Lock-In',
      description:
        'You own everything. Can leave us anytime, take documentation, manage yourself or hire someone else.',
      icon: 'Unlock',
    },
    {
      title: 'Australian Data Residency',
      description:
        'Your data stays in Australia. Complete control over data sovereignty and compliance.',
      icon: 'Shield',
    },
    {
      title: 'Fixed-Price Projects',
      description:
        "No hourly surprises. Clear scope and cost upfront. You know exactly what you're paying.",
      icon: 'DollarSign',
    },
    {
      title: 'Business-Focused',
      description:
        'We speak business language, not tech jargon. Focus on ROI and time saved, not APIs and code.',
      icon: 'Zap',
    },
  ],
}

export const FINAL_CTA = {
  headline: 'Ready to Stop Wasting Time on Admin Work?',
  subheadline:
    'Join Brisbane SMEs saving 10-20 hours per week with automated workflows between their business systems. No technical knowledge required.',
  primaryCTA: {
    text: 'Book Free Assessment',
    subtitle: 'Free, 30-60 minutes',
  },
  secondaryCTA: {
    text: 'Calculate Your Savings',
    subtitle: 'ROI calculator',
  },
  tertiaryCTA: {
    text: 'See Case Studies',
    subtitle: 'Real client results',
  },
}
