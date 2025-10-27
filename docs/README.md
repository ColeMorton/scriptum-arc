# Zixly Documentation

> **DevOps Automation Services for Brisbane Tech Companies**

Welcome to the comprehensive documentation for Zixly, a DevOps automation service business that uses this internal operations platform to track service delivery and demonstrate cloud-native infrastructure patterns (Docker, Kubernetes, Terraform, AWS).

---

## Quick Navigation

### 👥 For Internal Team

**Current Status & Planning**:

- **[Implementation Status](./implementation/status.md)** - Current progress, milestones, and phase tracking
- **[Implementation Plan](./implementation/plan.md)** - Phase-by-phase roadmap
- **[Deployment Guide](./operations/deployment-guide.md)** - Local and production deployment

**Architecture & Technical**:

- **[System Architecture](./architecture/system-architecture.md)** - Technical architecture overview
- **[Architecture Decisions](./architecture/decisions/)** - ADRs for key technical choices
- **[Pipeline Architecture](./pipelines/)** - Webhook pipelines and job orchestration
- **[Database Schema](./architecture/database-schema-diagram.md)** - Data model and relationships

**Development**:

- **[Local Development](./local-development/README.md)** - Setup and development environment
- **[Troubleshooting](./troubleshooting/)** - Common issues and solutions
- **[Testing](https://github.com/colemorton/zixly/blob/main/test/README.md)** - Testing strategy and implementation

---

### 🎯 For Potential Clients

**Service Overview**:

- **[Service Packages](./marketing/service-overview.md)** - DevOps automation service offerings
- **[Pricing Guide](./marketing/pricing-guide.md)** - Investment tiers and ROI
- **[FAQ](./marketing/faq.md)** - Frequently asked questions

**Capabilities**:

- **[Pipeline Capabilities](./pipelines/)** - Webhook-triggered pipelines and job orchestration
- **[Case Study: Internal Operations](https://github.com/colemorton/zixly/blob/main/README.md#service-capabilities)** - How we use our own platform

**Getting Started**:

- **[Service Catalog](./services/service-catalog.md)** - Available services and deliverables
- **[Client Onboarding](./services/client-onboarding.md)** - Onboarding process
- **[Delivery Process](./services/delivery-process.md)** - How we deliver projects

---

### 🌍 For Open-Source Contributors

**Getting Started**:

- **[Business Model](./business/business-model.md)** - Understanding the project context
- **[Architecture Decisions](./architecture/decisions/)** - Key technical decisions and rationale
- **[Technology Stack](https://github.com/colemorton/zixly/blob/main/README.md#technology-stack)** - Current stack and versions

**Contributing**:

- **[Implementation Status](./implementation/status.md)** - Current development focus
- **[Local Development](./local-development/README.md)** - Setup your development environment

**Patterns & Examples**:

- **[Pipeline Patterns](./pipelines/)** - Reusable webhook pipeline patterns
- **[Trading API Integration](./pipelines/trading-api-strategy-sweep.md)** - Example implementation

---

### 💼 For Business Stakeholders

**Strategy & Model**:

- **[Business Model](./business/business-model.md)** - Service business + internal operations + open-source
- **[Service Business Model](./financial/service-business-model.md)** - Financial model and projections
- **[Implementation Roadmap](./implementation/)** - Development phases and timeline

**Operations**:

- **[Internal Operations Guide](./operations/internal-operations-guide.md)** - Service delivery operations
- **[Project Estimation](./operations/project-estimation-guide.md)** - Estimating client projects
- **[Time Tracking System](./operations/time-tracking-system.md)** - Billable hours tracking

---

## Business Context

### What Zixly Is

**Zixly is a DevOps automation service business** for Brisbane tech companies.

**Business Model**:

1. **Service Business**: Provide DevOps automation services (Docker, K8s, Terraform, AWS)
2. **Internal Operations Platform**: Track Zixly's own service delivery (single-tenant)
3. **Open-Source Strategy**: Codebase available for demonstration and community benefit

**Target Market**: Brisbane and South East Queensland tech businesses

**Service Tiers**:

- **Pipeline MVP**: $5,000 - $8,000 (2-4 weeks)
- **DevOps Foundation**: $12,000 - $20,000 (6-8 weeks)
- **Enterprise Cloud**: $30,000 - $60,000 (12-16 weeks)

### What Zixly Is NOT

❌ **Not a multi-tenant SaaS platform** for external customers  
❌ **Not selling the platform** as a product  
✅ **Service business** using the platform internally  
✅ **Open-source** for demonstration and reuse

---

## Technology Stack

### Current Stack (2025)

| Layer              | Technology                | Purpose                       |
| ------------------ | ------------------------- | ----------------------------- |
| **Frontend**       | Next.js 15.5.5 + React 19 | Pipeline monitoring dashboard |
| **Styling**        | Tailwind CSS 4.x          | Responsive design             |
| **Backend**        | Next.js API Routes        | Pipeline management APIs      |
| **Database**       | PostgreSQL (Supabase)     | Job tracking and results      |
| **ORM**            | Prisma 6.x                | Type-safe database access     |
| **Auth**           | Supabase Auth             | JWT authentication            |
| **Orchestration**  | Docker Compose/Kubernetes | Container orchestration       |
| **Job Queue**      | Redis/Bull + AWS SQS      | Async job processing          |
| **Storage**        | S3 (LocalStack/AWS)       | Pipeline result datasets      |
| **Secrets**        | Secrets Manager           | Credential management         |
| **Monitoring**     | Prometheus + Grafana      | Metrics and observability     |
| **Infrastructure** | Terraform + LocalStack    | Infrastructure as Code        |
| **CI/CD**          | GitHub Actions            | Automated pipelines           |

---

## Documentation Structure

```
docs/
├── README.md (this file)           # Main documentation hub
├── business/                       # Business model and strategy
│   ├── business-model.md          # Comprehensive business model
│   └── service-business-model.md  # Financial projections
├── architecture/                   # Technical architecture
│   ├── system-architecture.md     # Overall system design
│   ├── decisions/                 # Architecture Decision Records
│   ├── database-schema-diagram.md # Data model
│   ├── security/                  # Security architecture
│   └── ...
├── implementation/                 # Development plans
│   ├── plan.md                    # Phase-by-phase roadmap
│   ├── status.md                   # Complete implementation status (consolidated)
│   ├── current-status.md           # Summary pointing to status.md
│   └── ...
├── pipelines/                      # Pipeline specifications
│   ├── trading-api-strategy-sweep.md  # Example pipeline
│   ├── testing-localstack.md          # LocalStack testing
│   └── ...
├── operations/                     # Service delivery operations
│   ├── internal-operations-guide.md
│   ├── project-estimation-guide.md
│   └── ...
├── services/                       # Client service delivery
│   ├── service-catalog.md
│   ├── client-onboarding.md
│   └── delivery-process.md
├── marketing/                      # Client-facing materials
│   ├── service-overview.md
│   ├── pricing-guide.md
│   ├── faq.md
│   └── proposal-template.md
├── security/                       # Security documentation
│   └── credential-management.md
├── troubleshooting/                # Common issues
│   ├── README.md
│   ├── docker-services.md
│   └── ...
└── local-development/              # Development setup
    └── README.md
```

---

## Key Concepts

### Dogfooding Strategy

**"Eat Your Own Dogfood"**: Zixly uses cloud-native DevOps patterns (Docker, K8s, Terraform) to run its own internal operations.

**Benefits**:

- **Authentic expertise**: Daily usage builds genuine knowledge
- **Real-world proof**: Demonstrate value to clients
- **Continuous improvement**: Daily usage drives optimization
- **Client credibility**: "We use these tools to run our own business"

### Open-Source Strategy

**Phase 1** (Current): Internal operations and expertise building  
**Phase 2** (Q2 2025): GitHub release with comprehensive documentation  
**Phase 3** (H2 2025): Community engagement and knowledge sharing

**Benefits**:

- **Transparency**: Builds trust with clients
- **Community**: Share patterns and knowledge
- **Demonstration**: Live system shows capabilities
- **Differentiation**: Unique competitive advantage

### Architecture Principles

- **Cloud-Native**: Docker, Kubernetes, Terraform, AWS
- **Infrastructure as Code**: All infrastructure version-controlled
- **Event-Driven**: Webhook-triggered pipeline orchestration
- **Full Observability**: Prometheus + Grafana monitoring
- **Local-First**: LocalStack enables zero-cost development

---

## Implementation Status

**Current Phase**: Phase 3 (Dashboard & API)  
**Progress**: 90% MVP Complete

**Completed**:

- ✅ Phase 1: Data Foundation (Database, Auth, APIs)
- ✅ Phase 2: Infrastructure & Services (Docker, Webhooks, Workers)
- ✅ Phase 1.5: LocalStack + Terraform (Infrastructure as Code)

**In Progress**:

- 🔄 Phase 3: Dashboard & API (Pipeline management UI)

**Planned**:

- ⏳ Phase 4: Production Readiness (Performance, Security, Testing)

See **[Implementation Status](./implementation/status.md)** for detailed milestone tracking.

---

## Contributing

### Internal Team

1. Read **[Implementation Status](./implementation/status.md)** for current focus
2. Review **[Architecture Decisions](./architecture/decisions/)** for context
3. Follow **[Local Development](./local-development/README.md)** setup
4. Reference **[System Architecture](./architecture/system-architecture.md)** for patterns

### Open-Source Contributors (Future)

When the project is open-sourced (Q2 2025):

1. Read **[Business Model](./business/business-model.md)** for context
2. Review **[Architecture Decisions](./architecture/decisions/)** for rationale
3. Set up **[Local Development](./local-development/README.md)** environment
4. Reference **[Pipeline Patterns](./pipelines/)** for examples

---

## Recent Updates

- **2025-01-27**: Documentation consolidation and optimization
- **2025-01-27**: Business model updated to reflect DevOps automation focus
- **2025-01-27**: Removed n8n references (business model pivot)
- **2025-01-27**: Consolidated all root-level documentation into ./docs directory
- **2025-01-27**: Phase 1.5 (LocalStack + Terraform) complete
- **2025-01-27**: Testing implementation complete (275 tests, 70-75% coverage)

---

## Support & Resources

### Internal Team

- **Slack**: #zixly-development
- **Project Management**: Linear/GitHub Projects
- **Documentation**: This directory

### Clients

- **Email**: support@zixly.com.au
- **Website**: [zixly.com.au](https://zixly.com.au)
- **Phone**: (Brisbane local number)

### Community (Future)

- **GitHub**: [github.com/colemorton/zixly](https://github.com/colemorton/zixly)
- **Discussions**: GitHub Discussions
- **Issues**: GitHub Issues

---

## Documentation Standards

### Tone & Style by Audience

- **Internal**: Technical, concise, assumes context
- **Clients**: Professional, ROI-focused, capabilities-driven
- **Open-source**: Educational, community-friendly, pattern-focused
- **Business**: Strategic, metrics-driven, objective-oriented

### Maintenance

- **Version Control**: All documentation in Git
- **Review Process**: Documentation updates with code changes
- **Living Documents**: Updated as system evolves
- **Cross-References**: Links maintained during reorganization

---

**Last Updated**: 2025-01-27  
**Documentation Version**: 2.0  
**Maintained By**: Zixly Development Team

**🌐 Repository**: [GitHub](https://github.com/colemorton/zixly) (Future open-source release)
