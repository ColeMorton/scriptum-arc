/**
 * Landing Page Content
 *
 * All content extracted from documentation to maintain single source of truth.
 * Sources: docs/marketing/service-overview.md, docs/financial/service-business-model.md
 */

export const HERO_CONTENT = {
  headline: 'DevOps Automation Services for Brisbane Tech Companies',
  subheadline:
    'Docker, Kubernetes, Terraform infrastructure implementation. Reduce cloud costs 20-50%. Production-grade reliability.',
  primaryCTA: 'View Our Capabilities',
  secondaryCTA: 'See Pricing',
}

export const PROBLEM_STATEMENT = {
  headline: 'Brisbane Tech Companies Face Infrastructure Challenges',
  painPoints: [
    {
      stat: '40+ hrs/month',
      description: 'Manual deployment time',
      impact: 'Slows release cycles and developer velocity',
    },
    {
      stat: '$2K-5K/mo',
      description: 'Wasted AWS spend',
      impact: 'Cloud costs spiral without optimization',
    },
    {
      stat: '99.0% uptime',
      description: 'Without proper monitoring',
      impact: 'Outages surprise teams and customers',
    },
    {
      stat: '3-6 months',
      description: 'To hire DevOps engineer',
      impact: 'Local DevOps expertise is scarce',
    },
  ],
}

export const CLOUD_NATIVE_BENEFITS = {
  headline: 'Why Cloud-Native Infrastructure?',
  subheadline:
    'Modern infrastructure patterns that scale with your business and reduce operational overhead.',
  benefits: [
    {
      title: 'Scalability',
      description: 'Auto-scaling handles traffic spikes without manual intervention',
      icon: 'TrendingUp',
    },
    {
      title: 'Reliability',
      description: '99.5-99.9% uptime with automated failover and health checks',
      icon: 'Shield',
    },
    {
      title: 'Cost Efficiency',
      description:
        'Pay only for resources used, right-sized infrastructure reduces AWS bills 20-50%',
      icon: 'DollarSign',
    },
    {
      title: 'Developer Velocity',
      description: 'CI/CD pipelines enable multiple deployments per day',
      icon: 'Zap',
    },
    {
      title: 'Observability',
      description: 'Real-time dashboards show every metric, alert before issues become outages',
      icon: 'Activity',
    },
  ],
}

export const CAPABILITIES = {
  headline: 'Production Infrastructure We Build',
  subheadline:
    'Real implementations we deliver to Brisbane tech companies. Technical depth backed by production experience.',
  items: [
    {
      title: 'Webhook-Triggered Data Pipelines',
      description:
        'Event-driven architecture for reliable async processing. Production-tested patterns from our own operations.',
      features: [
        'Docker containerization for portability',
        'Redis/Bull or AWS SQS job queues',
        'Retry logic with exponential backoff',
        'Prometheus + Grafana monitoring',
        'PostgreSQL for job tracking and results',
      ],
      example: 'Trading strategy backtesting pipeline processing 10-50 jobs/day',
      icon: 'Webhook',
    },
    {
      title: 'Production Kubernetes Deployments',
      description:
        'Full AWS EKS implementation with infrastructure as code. Scale from local development to multi-region production.',
      features: [
        'AWS EKS cluster provisioning',
        'Horizontal Pod Autoscaling (2-50 pods)',
        'Application Load Balancer + ingress',
        'Terraform modules for repeatability',
        'GitOps deployment workflows',
      ],
      example: '99.5% uptime SLA, 100-1000 jobs/day capacity',
      icon: 'Kubernetes',
    },
    {
      title: 'Complete Observability Stack',
      description:
        'Know exactly what your infrastructure is doing. Alert on issues before they become outages.',
      features: [
        'Prometheus metrics collection',
        'Custom Grafana dashboards',
        'PagerDuty/OpsGenie integration',
        'SLO/SLI tracking and alerting',
        'Cost monitoring and budget alerts',
      ],
      example: 'Real-time visibility into every job, API call, and system metric',
      icon: 'Activity',
    },
  ],
}

export const SERVICE_PACKAGES = [
  {
    name: 'Pipeline MVP',
    tagline: 'Webhook-Triggered Data Analysis',
    price: '$5,000 - $8,000',
    priceNote: 'one-time',
    timeline: '2-4 weeks',
    bestFor: 'Startups and small teams needing reliable automation',
    includes: [
      'Docker Compose infrastructure',
      'Webhook receiver (Express.js)',
      'Job queue (Redis/Bull or AWS SQS)',
      'Pipeline workers with retry logic',
      'Prometheus + Grafana dashboards',
      'PostgreSQL integration (Supabase)',
      'GitHub Actions CI/CD',
      'Documentation and runbooks',
      'Team training session',
      '30 days post-launch support',
    ],
    useCases: [
      'Trading strategy backtesting',
      'Document processing pipelines',
      'Data ETL workflows',
      'ML model batch inference',
    ],
    successMetrics: [
      'Processes 10-50 jobs/day reliably',
      '< 5 minute job completion latency',
      'Full observability dashboards',
      'Team operates pipelines independently',
    ],
    featured: false,
  },
  {
    name: 'DevOps Foundation',
    tagline: 'Production Kubernetes Infrastructure',
    price: '$12,000 - $20,000',
    priceNote: 'one-time',
    timeline: '6-8 weeks',
    bestFor: 'Growing tech companies needing scalable, production-grade infrastructure',
    includes: [
      'Everything in Pipeline MVP',
      'Local Kubernetes (Minikube/Docker Desktop)',
      'AWS EKS cluster deployment',
      'Terraform infrastructure as code',
      'ElastiCache Redis or AWS SQS',
      'S3 storage integration',
      'AWS Secrets Manager',
      'Horizontal Pod Autoscaling',
      'CloudWatch + Prometheus monitoring',
      'Disaster recovery procedures',
      'Team training (8 hours)',
      '60 days post-launch support',
    ],
    useCases: [
      'Scalable microservices deployment',
      'High-throughput data processing',
      'Multi-environment CI/CD',
      'Auto-scaling web applications',
    ],
    successMetrics: [
      'Auto-scaling handles 100-1000 jobs/day',
      '99.5% uptime SLA',
      'Infrastructure fully codified in Terraform',
      'Team deploys via GitOps',
    ],
    featured: true,
  },
  {
    name: 'Enterprise Cloud',
    tagline: 'Multi-Region High Availability',
    price: '$30,000 - $60,000',
    priceNote: 'one-time',
    timeline: '12-16 weeks',
    bestFor: 'Established businesses requiring enterprise-grade infrastructure',
    includes: [
      'Everything in DevOps Foundation',
      'Multi-region AWS (Sydney + Singapore)',
      'RDS PostgreSQL with read replicas',
      'Lambda functions for serverless',
      'API Gateway for webhook ingress',
      'AWS WAF (Web Application Firewall)',
      'GuardDuty threat detection',
      'CloudTrail audit logging',
      'SOC 2 readiness documentation',
      'Quarterly disaster recovery drills',
      'Comprehensive training',
      '3 months managed services included',
    ],
    useCases: [
      'Mission-critical SaaS platforms',
      'Compliance-driven applications',
      'Global customer base',
      'Enterprise B2B platforms',
    ],
    successMetrics: [
      '99.9% uptime SLA',
      '< 100ms p95 latency for ingress',
      'Auto-scaling 0 to 1000+ workers',
      'Complete audit trail for compliance',
    ],
    featured: false,
  },
  {
    name: 'Managed Services',
    tagline: '24/7 Infrastructure Management',
    price: '$2,000 - $5,000',
    priceNote: 'per month',
    timeline: 'Ongoing',
    bestFor: 'Teams wanting hands-off infrastructure management',
    includes: [
      '24/7 infrastructure monitoring',
      'Alert response (business hours or 24/7)',
      'Monthly performance reports',
      'Security patch management',
      'Quarterly infrastructure reviews',
      'Incident response SLA',
      'Weekly optimization reviews',
      'New feature development hours included',
      'Slack channel support',
      'Cost monitoring and optimization',
    ],
    tiers: [
      {
        name: 'Basic Monitoring',
        price: '$2,000/month',
        features: [
          'Business hours alert response',
          'Monthly reports',
          'Email support < 4 hour response',
        ],
      },
      {
        name: 'Full Managed Services',
        price: '$3,500/month',
        features: [
          '24/7 alert response',
          '< 1 hour incident SLA',
          '4 hours/month feature development',
          'Slack support',
        ],
      },
      {
        name: 'Enterprise Support',
        price: '$5,000/month',
        features: [
          '< 30 minute incident SLA',
          '8 hours/month feature development',
          'Dedicated Slack channel',
          'Compliance reporting assistance',
        ],
      },
    ],
    useCases: [
      'Focus on product, not infrastructure',
      'Expert backup for in-house teams',
      'Compliance maintenance',
      'Continuous optimization',
    ],
    successMetrics: [],
    featured: false,
  },
]

export const IMPLEMENTATION_PROCESS = {
  headline: 'Our Delivery Process',
  subheadline:
    'Proven methodology for successful DevOps implementations. From infrastructure audit to production deployment.',
  steps: [
    {
      number: 1,
      title: 'Discovery & Assessment',
      description:
        'Free infrastructure audit, DevOps maturity evaluation, and automation opportunities identification.',
      deliverables: [
        'Current infrastructure assessment',
        'DevOps maturity scorecard',
        'Automation opportunity analysis',
        'Custom service recommendation',
      ],
      duration: 'Free consultation',
    },
    {
      number: 2,
      title: 'Architecture Design',
      description:
        'Design Terraform modules, Kubernetes manifests, and CI/CD pipeline architecture tailored to your needs.',
      deliverables: [
        'Terraform module structure',
        'Kubernetes resource definitions',
        'CI/CD pipeline design',
        'Architecture decision records',
      ],
      duration: '1-2 weeks',
    },
    {
      number: 3,
      title: 'Phased Implementation',
      description:
        'Start with Docker Compose locally, progress through local Kubernetes, deploy to AWS EKS production.',
      deliverables: [
        'Local Docker Compose setup',
        'Staging Kubernetes environment',
        'Production AWS EKS deployment',
        'Infrastructure as Code repository',
      ],
      duration: '2-14 weeks (tier dependent)',
    },
    {
      number: 4,
      title: 'Training & Handover',
      description:
        'Comprehensive team training on infrastructure operations, runbooks, and ongoing support options.',
      deliverables: [
        'Team training workshops',
        'Comprehensive runbooks',
        'Incident response procedures',
        'Post-launch support plan',
      ],
      duration: '1-2 weeks',
    },
  ],
}

export const COMPETITIVE_DIFFERENTIATORS = {
  headline: 'Why Choose Zixly?',
  subheadline:
    'Brisbane-based DevOps expertise with authentic implementation experience and transparent methodology.',
  comparisons: [
    {
      category: 'vs Traditional DevOps Consultants',
      advantages: [
        {
          title: 'Authentic Expertise',
          description: 'We use these tools daily for our own operations',
        },
        {
          title: 'Open-Source Transparency',
          description: 'Full codebase visibility builds trust',
        },
        {
          title: 'Real-World Proof',
          description: 'Actual business operations demonstrate value',
        },
      ],
    },
    {
      category: 'vs SaaS DevOps Platforms',
      advantages: [
        {
          title: 'No Vendor Lock-In',
          description: 'You own your infrastructure and can migrate anytime',
        },
        {
          title: 'Full Customization',
          description: 'Complete control over every aspect of your infrastructure',
        },
        {
          title: 'Cost Transparency',
          description: 'No hidden fees, usage limits, or per-seat pricing',
        },
      ],
    },
    {
      category: 'vs Enterprise Solutions',
      advantages: [
        {
          title: 'Brisbane-Appropriate',
          description: 'Right-sized for local tech businesses, not enterprise overhead',
        },
        {
          title: 'Modern Stack',
          description: 'Latest Docker, Kubernetes, Terraform versions',
        },
        {
          title: 'Quick Implementation',
          description: 'Weeks not months, proven patterns accelerate delivery',
        },
      ],
    },
  ],
}

export const USE_CASES = {
  headline: 'Built for Brisbane Tech Companies',
  subheadline:
    'Concrete implementations across different business types. See how we solve infrastructure challenges.',
  cases: [
    {
      title: 'SaaS Startups',
      problem: 'Manual deployments limiting release velocity, no auto-scaling for traffic spikes',
      solution:
        'Full CI/CD pipeline enabling multiple daily deployments, Kubernetes auto-scaling from 2 to 50 pods',
      metrics: [
        '10x deployment frequency',
        '3 hours/week saved on deployments',
        'Auto-scaled to handle 10x traffic spike',
      ],
      technologies: ['Docker', 'AWS EKS', 'GitHub Actions', 'Horizontal Pod Autoscaler'],
    },
    {
      title: 'Data-Driven Companies',
      problem: 'Long-running data jobs blocking infrastructure, no observability into processing',
      solution:
        'Webhook-triggered pipeline workers with Redis queue, Prometheus + Grafana monitoring dashboards',
      metrics: [
        '50+ jobs/day processed reliably',
        '< 5 min job submission latency',
        'Complete job history and metrics',
      ],
      technologies: ['Docker Compose', 'Redis/Bull', 'PostgreSQL', 'Prometheus', 'Grafana'],
    },
    {
      title: 'B2B Tech Platforms',
      problem:
        'Single-region deployment risking customer access, no compliance documentation for enterprise sales',
      solution:
        'Multi-region AWS deployment (Sydney + Singapore), CloudTrail audit logging, SOC 2 readiness docs',
      metrics: [
        '99.9% uptime SLA achieved',
        '< 100ms p95 latency globally',
        'SOC 2 audit preparation complete',
      ],
      technologies: ['Multi-region AWS', 'RDS replicas', 'CloudTrail', 'WAF', 'GuardDuty'],
    },
  ],
}

export const TECHNOLOGY_STACK = {
  headline: 'Our Technology Stack',
  subheadline:
    'Production-tested tools and platforms. We use these daily to run our own operations.',
  categories: [
    {
      category: 'Containerization & Orchestration',
      technologies: [
        { name: 'Docker', description: 'Container runtime and build system' },
        { name: 'Docker Compose', description: 'Local multi-container orchestration' },
        { name: 'Kubernetes', description: 'Production container orchestration' },
        { name: 'AWS EKS', description: 'Managed Kubernetes on AWS' },
      ],
    },
    {
      category: 'Infrastructure as Code',
      technologies: [
        { name: 'Terraform', description: 'Declarative infrastructure provisioning' },
        { name: 'LocalStack', description: 'Local AWS emulation for development' },
        { name: 'Helm', description: 'Kubernetes package manager' },
      ],
    },
    {
      category: 'Data & Queues',
      technologies: [
        { name: 'PostgreSQL', description: 'Relational database (Supabase)' },
        { name: 'Redis', description: 'In-memory cache and job queue' },
        { name: 'AWS SQS', description: 'Managed message queue service' },
        { name: 'AWS S3', description: 'Object storage for results and datasets' },
      ],
    },
    {
      category: 'Monitoring & Observability',
      technologies: [
        { name: 'Prometheus', description: 'Time-series metrics collection' },
        { name: 'Grafana', description: 'Metrics visualization and dashboards' },
        { name: 'CloudWatch', description: 'AWS native monitoring' },
      ],
    },
    {
      category: 'CI/CD & Deployment',
      technologies: [
        { name: 'GitHub Actions', description: 'Automated testing and deployment' },
        { name: 'AWS Secrets Manager', description: 'Credential management' },
      ],
    },
  ],
}

export const TRUST_SIGNALS = {
  headline: 'Brisbane-Based DevOps Expertise',
  subheadline:
    'Local team with authentic infrastructure experience. We use these patterns to run our own business.',
  signals: [
    {
      title: 'Brisbane-Based Team',
      description:
        'Local expertise with deep understanding of Australian tech business needs and data residency requirements.',
      icon: 'MapPin',
    },
    {
      title: 'Dogfooding Approach',
      description:
        'We use Docker, Kubernetes, and Terraform daily to run Zixly operations. Authentic expertise from real usage.',
      icon: 'CheckCircle2',
    },
    {
      title: 'Open-Source Strategy',
      description:
        'Our operations platform codebase will be released on GitHub. Full transparency builds trust.',
      icon: 'Github',
    },
    {
      title: 'Australian Data Residency',
      description:
        'Your infrastructure stays in Australia. Complete control over data sovereignty and compliance.',
      icon: 'Shield',
    },
    {
      title: 'Production Experience',
      description:
        'Real-world implementations running in production. Not theoretical consulting, actual operational knowledge.',
      icon: 'Zap',
    },
    {
      title: 'No Vendor Lock-In',
      description:
        'You own your infrastructure and code. Export and migrate anytime with full Terraform modules.',
      icon: 'Unlock',
    },
  ],
}

export const FINAL_CTA = {
  headline: 'Ready to Modernize Your Infrastructure?',
  subheadline:
    'Join Brisbane tech companies with production-grade Kubernetes, automated CI/CD, and complete observability. Expert DevOps implementation without the hiring headache.',
  primaryCTA: {
    text: 'Book Infrastructure Assessment',
    subtitle: 'Free consultation',
  },
  secondaryCTA: {
    text: 'Download Service Overview',
    subtitle: 'PDF guide',
  },
  tertiaryCTA: {
    text: 'View Open-Source Platform',
    subtitle: 'GitHub (coming Q2 2025)',
  },
}
