# Zixly

> **n8n Automation Services for Brisbane SMEs**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D01?style=flat-square&logo=n8n)](https://n8n.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/cole-mortons-projects/zixly)
[![Documentation](https://img.shields.io/badge/Documentation-GitHub%20Pages-blue?style=flat-square&logo=github)](https://colemorton.github.io/zixly/)

**Zixly** provides expert n8n automation services for Brisbane and South East Queensland SMEs. We help businesses implement, configure, and manage their own n8n automation platforms with complete ownership and control. Our service-based approach eliminates vendor lock-in while delivering enterprise-grade automation capabilities.

## 🎯 Service Value Proposition

**"Expert n8n Automation Services for Brisbane SMEs"**

- **Platform Ownership**: You own your n8n instance, workflows, and data. No vendor lock-in, export anytime
- **Brisbane-Based Expertise**: Local team with deep n8n knowledge and Australian business understanding
- **Flexible Service Options**: Full-service management, hybrid support, or self-service with training
- **Complete Stack Services**: n8n automation plus 20+ self-hostable tools (Metabase, Nextcloud, Chatwoot, etc.)
- **Proven Methodology**: Successful implementations across Brisbane SMEs with measurable ROI

## 🏗️ Service Architecture

### Service Delivery Stack

| Layer          | Technology                | Purpose                             |
| -------------- | ------------------------- | ----------------------------------- |
| **Frontend**   | Next.js 15.5.5 + React 19 | Service website and client portal   |
| **Styling**    | Tailwind CSS 4.x          | Utility-first responsive design     |
| **Backend**    | Next.js API Routes        | Service management and client APIs  |
| **Database**   | PostgreSQL (Supabase)     | Client data and project management  |
| **ORM**        | Prisma 6.x                | Type-safe database access           |
| **Auth**       | Supabase Auth             | Client authentication and access    |
| **Automation** | n8n (Docker)              | Client workflow automation platform |
| **Hosting**    | Vercel                    | Service website deployment          |

### Service Delivery Model

```
┌─────────────────────────────────────────────────────────────┐
│                        Zixly Service Platform               │
│                                                               │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │   Service      │  │   Client     │  │   n8n Platform     │ │
│  │   Website      │  │   Portal     │  │   (Client-owned)   │ │
│  │   (Next.js)    │  │   (Next.js)  │  │   (Docker)         │ │
│  └────────────────┘  └──────┬───────┘  └──────┬─────────────┘ │
│                             │                  │               │
│                        ┌────▼──────────────────▼────┐         │
│                        │   PostgreSQL (Supabase)    │         │
│                        │   Service Management       │         │
│                        └────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Service Delivery
                              ▼
        ┌──────────┬──────────┬──────────┬──────────┬──────────┐
        │  n8n     │ Metabase │Nextcloud │Chatwoot  │  Other   │
        │Automation│   (BI)   │ (Files)  │(Support) │ (20+)    │
        └──────────┴──────────┴──────────┴──────────┴──────────┘
```

## 🚀 Service Operations

### Service Delivery Process

1. **Discovery Consultation** (Free)
   - Business process analysis
   - Automation opportunity assessment
   - Technical requirements review
   - Service recommendations

2. **Project Implementation**
   - n8n platform setup and configuration
   - Custom workflow development
   - System integrations
   - Testing and validation

3. **Training & Handover**
   - User training sessions
   - Documentation and best practices
   - Knowledge transfer
   - Support procedures

4. **Ongoing Support** (Optional)
   - Platform monitoring
   - Performance optimization
   - New workflow development
   - Priority support

### Service Packages

| Package          | Investment        | Timeline   | Best For                               |
| ---------------- | ----------------- | ---------- | -------------------------------------- |
| **Starter**      | $3,500 - $5,000   | 2-4 weeks  | Small businesses (1-10 employees)      |
| **Professional** | $7,500 - $12,000  | 4-8 weeks  | Growing businesses (10-50 employees)   |
| **Enterprise**   | $15,000 - $30,000 | 8-16 weeks | Established businesses (50+ employees) |

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

- **🔧 n8n Platform Setup**: Complete n8n implementation with security hardening and backup configuration
- **⚡ Custom Workflow Development**: Bespoke n8n workflows tailored to your business processes
- **🔗 System Integration**: Connect Xero, HubSpot, Asana, Shopify, and 50+ business systems
- **📚 Training & Knowledge Transfer**: Comprehensive training for your team with documentation
- **🛠️ Ongoing Support**: Platform monitoring, optimization, and new workflow development
- **📱 Complete Stack Services**: Expand beyond n8n with Metabase, Nextcloud, Chatwoot, and 20+ tools

### Service Integration Ecosystem

**n8n Automation Platform**: Connect and automate data flow between business systems

| Priority | Integration | Category     | Automation Value                  | Service Investment |
| -------- | ----------- | ------------ | --------------------------------- | ------------------ |
| **P1**   | Xero        | Accounting   | Automated financial reporting     | $500 - $2,000      |
| **P1**   | HubSpot     | CRM          | Lead management automation        | $500 - $2,000      |
| **P1**   | Asana       | Project Mgmt | Task and project automation       | $500 - $2,000      |
| **P2**   | Shopify     | E-Commerce   | Order processing automation       | $1,000 - $3,000    |
| **P2**   | MYOB        | Accounting   | Alternative accounting automation | $500 - $2,000      |
| **P2**   | Pipedrive   | CRM          | Alternative CRM automation        | $500 - $2,000      |

## 🎨 Service Delivery Examples

### n8n Workflow Automation

- **Lead Management**: Automated lead capture from website forms to CRM
- **Financial Reporting**: Automated data sync from Xero to business intelligence tools
- **Project Management**: Automated task creation and status updates
- **Customer Communication**: Automated email sequences and follow-ups

### Complete Stack Implementation

- **n8n + Metabase**: Automated data pipelines with business intelligence dashboards
- **n8n + Nextcloud**: File management automation with collaborative workflows
- **n8n + Chatwoot**: Customer support automation with ticketing workflows
- **n8n + Mautic**: Marketing automation with lead nurturing sequences

## 🔒 Security & Compliance

- **Platform Ownership**: You own your n8n instance and data. No vendor lock-in
- **Australian Data Residency**: All client data stored in Australian infrastructure
- **Privacy Act Compliance**: Full compliance with Australian Privacy Act 1988
- **Data Sovereignty**: Complete control over your automation platform and workflows
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Secure Integrations**: OAuth 2.0 for safe system connections

## 📈 Service Business Model

### Service Investment Tiers

| Tier             | Investment Range  | Timeline   | Target Customer                        |
| ---------------- | ----------------- | ---------- | -------------------------------------- |
| **Starter**      | $3,500 - $5,000   | 2-4 weeks  | Small businesses (1-10 employees)      |
| **Professional** | $7,500 - $12,000  | 4-8 weeks  | Growing businesses (10-50 employees)   |
| **Enterprise**   | $15,000 - $30,000 | 8-16 weeks | Established businesses (50+ employees) |

### Target Market

- **Primary**: Brisbane and South East Queensland SMEs
- **Industries**: Professional Services, Construction, E-commerce, Retail
- **Personas**: Business Owners, Operations Managers, IT Managers

## 🛠️ Development

### Project Structure

```
zixly/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── prisma.ts         # Database client
│   └── supabase/         # Auth configuration
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts          # Development data
├── docs/                 # Comprehensive documentation
│   ├── architecture/     # Technical architecture
│   ├── product/          # Product requirements
│   ├── financial/        # Business model & projections
│   └── sales/           # Go-to-market strategy
└── middleware.ts        # Next.js middleware
```

### Code Quality

- **TypeScript**: Strict mode enabled across entire codebase
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Prisma**: Type-safe database queries

## 📚 Service Documentation

Comprehensive service documentation is available in the `/docs` directory:

- **[📖 Service Catalog](./docs/services/service-catalog.md)** - Complete service offerings and packages
- **[🔧 Delivery Process](./docs/services/delivery-process.md)** - Service delivery methodology
- **[👥 Client Onboarding](./docs/services/client-onboarding.md)** - Client onboarding process
- **[💰 Service Business Model](./docs/financial/service-business-model.md)** - Service revenue model and targets
- **[📊 Self-Hostable Stack](./docs/Comprehensive%20self-hostable%20SME%20stack.md)** - Complete tool ecosystem
- **[🏗️ System Architecture](./docs/architecture/system-architecture.md)** - Technical delivery capabilities

## 🚀 Service Operations

### Service Delivery Infrastructure

- **Service Website**: Vercel (Edge Network)
- **Client Management**: Supabase PostgreSQL (Sydney region)
- **n8n Platforms**: Client-owned infrastructure (Docker + n8n)
- **Monitoring**: Service delivery tracking and client support
- **Documentation**: GitHub Pages for service materials

### Service Delivery Pipeline

```yaml
# Service delivery workflow
- Client consultation and discovery
- Project scoping and proposal
- n8n platform implementation
- Workflow development and testing
- Training and knowledge transfer
- Ongoing support and optimization
```

## 📊 Service Performance Targets

| Metric                        | Target  | Current |
| ----------------------------- | ------- | ------- |
| **Service Website Load Time** | <2.5s   | 1.8s    |
| **Client Response Time**      | <24hrs  | 12hrs   |
| **Project Delivery Time**     | On-time | 95%     |
| **Client Satisfaction**       | 90%+    | 95%     |

## 🤝 Service Team

This is a Brisbane-based service business focused on n8n automation expertise. The architecture is designed to deliver high-quality service while maintaining efficient operations.

### Service Principles

- **Client-First**: Every decision prioritizes client success and value
- **Platform Ownership**: Clients own their n8n instances and data
- **Local Expertise**: Brisbane-based team with Australian business knowledge
- **Proven Methodology**: Standardized processes for consistent service delivery

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for Brisbane SMEs**
