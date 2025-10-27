# Zixly

> **DevOps Automation Services for Brisbane Businesses**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=flat-square&logo=kubernetes)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=flat-square&logo=terraform)](https://terraform.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/cole-mortons-projects/zixly)
[![Documentation](https://img.shields.io/badge/Documentation-GitHub%20Pages-blue?style=flat-square&logo=github)](https://colemorton.github.io/zixly/)

**Zixly** provides expert DevOps automation services for Brisbane and South East Queensland businesses. We help organizations implement cloud-native infrastructure, automated CI/CD pipelines, and webhook-triggered data analysis workflows. Our service-based approach leverages modern DevOps practices with Docker, Kubernetes, Terraform, and AWS.

## 🎯 Service Value Proposition

**"Expert DevOps Automation Services for Brisbane Businesses"**

- **Cloud-Native Infrastructure**: Modern infrastructure automation with Docker, Kubernetes, and AWS
- **Brisbane-Based Expertise**: Local team with deep DevOps knowledge and Australian business understanding
- **Webhook-Triggered Pipelines**: Event-driven data analysis workflows for real-time insights
- **Infrastructure as Code**: Terraform-managed infrastructure for repeatability and version control
- **CI/CD Automation**: Automated deployment pipelines with GitHub Actions and GitOps practices
- **Full Observability**: Prometheus and Grafana monitoring for complete system visibility

## 🏗️ Service Architecture

### Service Delivery Stack

| Layer                 | Technology                | Purpose                                |
| --------------------- | ------------------------- | -------------------------------------- |
| **Frontend**          | Next.js 15.5.5 + React 19 | Pipeline monitoring dashboard          |
| **Styling**           | Tailwind CSS 4.x          | Utility-first responsive design        |
| **Backend**           | Next.js API Routes        | Pipeline management APIs               |
| **Database**          | PostgreSQL (Supabase)     | Pipeline results and job tracking      |
| **ORM**               | Prisma 6.x                | Type-safe database access              |
| **Auth**              | Supabase Auth             | User authentication and access control |
| **Orchestration**     | Docker Compose/Kubernetes | Container orchestration                |
| **Job Queue**         | SQS (LocalStack/AWS)      | Async job processing                   |
| **Storage**           | S3 (LocalStack/AWS)       | Pipeline result datasets               |
| **Secrets**           | Secrets Manager           | Credential management                  |
| **Monitoring**        | Prometheus + Grafana      | Metrics and observability              |
| **Infrastructure**    | Terraform + LocalStack    | Infrastructure as Code (local & AWS)   |
| **CI/CD**             | GitHub Actions            | Automated deployment pipelines         |
| **Cloud Platform**    | AWS (EKS/ECS)             | Production cloud infrastructure        |
| **Dashboard Hosting** | Vercel                    | Web application deployment             |

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zixly Pipeline Platform                   │
│                                                               │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │   Webhook    │────▶│  Redis Job   │────▶│   Pipeline   │ │
│  │   Receiver   │     │    Queue     │     │    Worker    │ │
│  │  (Express)   │     │   (Bull)     │     │   (Node.js)  │ │
│  └──────────────┘     └──────────────┘     └──────┬───────┘ │
│         │                                           │         │
│         │                                           ▼         │
│         │                                  ┌────────────────┐ │
│         │                                  │  External API  │ │
│         │                                  │ (Trading API)  │ │
│         │                                  └────────┬───────┘ │
│         │                                           │         │
│         │              ┌────────────────────────────┘         │
│         ▼              ▼                                      │
│  ┌───────────────────────────────┐                           │
│  │   PostgreSQL (Supabase)       │                           │
│  │   Job Tracking & Results      │                           │
│  └───────────────┬───────────────┘                           │
│                  │                                            │
│                  ▼                                            │
│  ┌───────────────────────────────┐                           │
│  │   Next.js Dashboard           │                           │
│  │   Pipeline Monitoring & Control│                          │
│  └───────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Prometheus     Grafana      GitHub Actions
   (Metrics)    (Dashboards)     (CI/CD)
```

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/colemorton/zixly.git
cd zixly

# Install dependencies
npm install

# Setup environment
cp .env.local.template .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npm run db:migrate

# Initialize LocalStack + Terraform (AWS services emulation)
./scripts/init-localstack-terraform.sh
# Creates SQS queue, S3 bucket, and Secrets Manager

# Start development server
npm run dev
# → http://localhost:3000

# Start pipeline stack (separate terminal)
docker-compose -f docker-compose.pipeline.yml up
# → Webhook receiver: http://localhost:3000/webhook
# → Grafana: http://localhost:3001
# → Prometheus: http://localhost:9090
# → LocalStack: http://localhost:4566
```

### Trigger a Pipeline Job

```bash
# Manual trigger via API
curl -X POST http://localhost:3000/api/pipelines/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ticker": "BTC-USD",
    "fast_range": [10, 20],
    "slow_range": [20, 30],
    "step": 5,
    "strategy_type": "SMA"
  }'
```

### Service Delivery Process

1. **Infrastructure Assessment** (Free)
   - Current infrastructure review
   - DevOps maturity assessment
   - Automation opportunities identification
   - Service recommendations

2. **Pipeline Implementation**
   - Docker containerization
   - Kubernetes deployment setup
   - CI/CD pipeline configuration
   - Monitoring and observability setup

3. **Documentation & Training**
   - Infrastructure as Code documentation
   - Team DevOps training
   - Runbook creation
   - Best practices transfer

4. **Managed Services** (Optional)
   - 24/7 infrastructure monitoring
   - Incident response and resolution
   - Performance optimization
   - Security updates and patches

### Service Packages

| Package               | Investment        | Timeline    | Best For                          |
| --------------------- | ----------------- | ----------- | --------------------------------- |
| **Pipeline MVP**      | $5,000 - $8,000   | 2-4 weeks   | Single webhook-triggered pipeline |
| **DevOps Foundation** | $12,000 - $20,000 | 6-8 weeks   | Full CI/CD + monitoring setup     |
| **Enterprise Cloud**  | $30,000 - $60,000 | 12-16 weeks | Multi-tenant AWS infrastructure   |

### Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (WARNING: destroys data)
```

## 📊 Service Capabilities

### Core Service Offerings

- **🐳 Container Orchestration**: Docker and Kubernetes infrastructure for scalable applications
- **⚡ Webhook Pipelines**: Event-driven data analysis workflows with real-time processing
- **🔗 API Integration**: Connect external APIs with secure authentication and error handling
- **📚 Infrastructure as Code**: Terraform modules for repeatable, version-controlled infrastructure
- **🛠️ CI/CD Automation**: GitHub Actions pipelines for automated testing and deployment
- **📊 Observability**: Prometheus metrics and Grafana dashboards for complete visibility
- **☁️ AWS Cloud**: EKS/ECS deployment with production-grade security and scaling

### Example Pipeline Implementations

**Webhook-Triggered Data Analysis Pipeline**: Real-time processing for trading strategy optimization

| Component            | Technology           | Purpose                          | Delivery Time |
| -------------------- | -------------------- | -------------------------------- | ------------- |
| **Webhook Receiver** | Express.js           | Accept incoming webhook requests | 1-2 days      |
| **Job Queue**        | Redis + Bull         | Async task processing            | 1-2 days      |
| **Pipeline Worker**  | Node.js + Prisma     | Execute analysis jobs            | 3-5 days      |
| **Results Storage**  | PostgreSQL           | Store analysis results           | 1-2 days      |
| **Monitoring**       | Prometheus + Grafana | Track pipeline metrics           | 2-3 days      |
| **Dashboard**        | Next.js + React      | View results and job status      | 3-5 days      |

## 🎨 Service Delivery Examples

### DevOps Pipeline Automation

- **Trading Strategy Analysis**: Webhook-triggered backtesting with parameter optimization
- **Data ETL Pipelines**: Extract, transform, load workflows with error handling and retries
- **ML Model Inference**: Containerized machine learning pipelines with model versioning
- **Real-Time Processing**: Stream processing for high-frequency data analysis

### Infrastructure Automation

- **Docker Compose**: Multi-container local development environments
- **Kubernetes Deployment**: Production-grade container orchestration on AWS EKS
- **Terraform Modules**: Reusable infrastructure components for rapid deployment
- **CI/CD Pipelines**: Automated testing, building, and deployment workflows

## 🔒 Security & Compliance

- **Infrastructure Security**: AWS security best practices with IAM roles and security groups
- **Container Security**: Image scanning and vulnerability detection with Trivy
- **Secrets Management**: AWS Secrets Manager for sensitive credentials
- **Network Security**: VPC isolation and private subnets for internal services
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit for all communications
- **Access Control**: Role-based access control (RBAC) with Kubernetes and AWS IAM
- **Audit Logging**: Complete audit trail for all infrastructure changes via CloudTrail
- **Compliance**: SOC 2 readiness with documented security controls

## 📈 Service Business Model

### Service Investment Tiers

| Tier                  | Investment Range  | Timeline    | Target Customer                   |
| --------------------- | ----------------- | ----------- | --------------------------------- |
| **Pipeline MVP**      | $5,000 - $8,000   | 2-4 weeks   | Startups and small teams          |
| **DevOps Foundation** | $12,000 - $20,000 | 6-8 weeks   | Growing tech companies            |
| **Enterprise Cloud**  | $30,000 - $60,000 | 12-16 weeks | Established businesses with scale |

### Target Market

- **Primary**: Brisbane and South East Queensland tech businesses
- **Industries**: FinTech, Data Analytics, SaaS, E-commerce
- **Personas**: CTOs, DevOps Engineers, Engineering Managers, Data Scientists

## 🛠️ Development

### Project Structure

```
zixly/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   └── pipelines/      # Pipeline management APIs
│   ├── pipelines/          # Pipeline dashboard pages
│   └── globals.css         # Global styles
├── services/                # Pipeline microservices
│   ├── webhook-receiver/   # Express.js webhook service
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── pipeline-worker/    # Job processing worker
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── lib/                     # Shared utilities
│   ├── prisma.ts           # Database client
│   └── supabase/           # Auth configuration
├── prisma/                  # Database schema & migrations
│   ├── schema.prisma       # Prisma schema with pipeline models
│   └── seed.ts             # Development data
├── docs/                    # Comprehensive documentation
│   ├── architecture/       # Technical architecture & ADRs
│   ├── pipelines/          # Pipeline specifications
│   ├── business/           # Business model
│   └── implementation/     # Phase plans
├── docker-compose.pipeline.yml  # Pipeline stack
└── middleware.ts            # Next.js middleware
```

### Code Quality

- **TypeScript**: Strict mode enabled across entire codebase
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Prisma**: Type-safe database queries

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[🏗️ System Architecture](./docs/architecture/system-architecture.md)** - Pipeline architecture and infrastructure
- **[📋 Pipeline Specifications](./docs/pipelines/)** - Webhook pipelines and API integrations
- **[🔧 Architecture Decisions](./docs/architecture/decisions/)** - ADRs for technical choices
- **[💰 Business Model](./docs/business/business-model-clarification.md)** - Service model and positioning
- **[📊 Implementation Plans](./docs/implementation/)** - Phase-by-phase roadmap
- **[🚀 Deployment Guide](./docs/operations/deployment-guide.md)** - Local and production deployment

## 🚀 Infrastructure

### Pipeline Stack Components

- **Dashboard**: Vercel (Edge Network) - Next.js application
- **Database**: Supabase PostgreSQL (Sydney region) - Job tracking and results
- **Job Queue**: Redis + Bull - Async task processing
- **Webhook Receiver**: Express.js - Event ingestion
- **Pipeline Worker**: Node.js + Prisma - Job execution
- **Monitoring**: Prometheus + Grafana - Metrics and observability
- **Cloud Platform**: AWS EKS (Production) - Container orchestration

### DevOps Pipeline Workflow

```yaml
# Webhook-triggered pipeline
1. External system sends webhook → Webhook Receiver
2. Validate payload and create job → Redis Queue
3. Pipeline Worker picks up job → Execute analysis
4. Store results in PostgreSQL → Update job status
5. Send notifications → Email/Slack alerts
6. Dashboard displays results → Real-time monitoring
```

## 📊 Performance Targets

| Metric                      | Target | Status  |
| --------------------------- | ------ | ------- |
| **Pipeline Latency (p95)**  | <5s    | MVP     |
| **Job Success Rate**        | >99%   | MVP     |
| **Dashboard Load Time**     | <2.5s  | ✅ 1.8s |
| **API Response Time (p95)** | <500ms | MVP     |
| **Container Start Time**    | <10s   | MVP     |

## 🤝 About Zixly

Brisbane-based DevOps automation services focused on helping businesses implement cloud-native infrastructure and data analysis pipelines.

### Service Principles

- **Infrastructure as Code**: All infrastructure version-controlled and repeatable
- **Event-Driven Architecture**: Webhook-triggered pipelines for real-time processing
- **Full Observability**: Complete visibility into system performance and health
- **Local Expertise**: Brisbane-based team with Australian cloud infrastructure knowledge

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for Brisbane Tech Businesses**

_Empowering organizations with cloud-native DevOps automation_
