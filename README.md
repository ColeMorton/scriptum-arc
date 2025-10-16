# Zixly

> **Integration Platform for Australian SMEs**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/cole-mortons-projects/zixly)
[![Documentation](https://img.shields.io/badge/Documentation-GitHub%20Pages-blue?style=flat-square&logo=github)](https://colemorton.github.io/zixly/)

**Zixly** is an integration platform designed specifically for Australian Small-to-Medium Enterprises (SMEs) with $1-10M annual revenue. The platform connects and automates data flow between disconnected business systems (accounting, CRM, project management, e-commerce), consolidating them into unified, real-time dashboards that eliminate manual reporting and enable data-driven decision-making.

## 🎯 Value Proposition

**"Integration Platform that Unifies Your Existing Tools"**

- **Integration Infrastructure**: Connects and automates data flow between 50+ business systems via OAuth integrations
- **Automated Data Consolidation**: Nightly syncs that eliminate manual data copying between systems
- **Bespoke Dashboards**: Custom-designed visualizations tailored to each customer's industry and KPIs
- **Zero Maintenance**: Fully managed platform with included support and ongoing optimization
- **Australian-Focused**: AU data residency, Privacy Act compliance, integrations with AU-specific tools (Xero, MYOB, Employment Hero)

## 🏗️ Architecture

### Technology Stack

| Layer        | Technology                | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| **Frontend** | Next.js 15.5.5 + React 19 | SSR dashboard with App Router        |
| **Styling**  | Tailwind CSS 4.x          | Utility-first responsive design      |
| **Charts**   | Visx                      | D3-based custom visualizations       |
| **Backend**  | Next.js API Routes        | Serverless functions                 |
| **Database** | PostgreSQL (Supabase)     | Multi-tenant data warehouse          |
| **ORM**      | Prisma 6.x                | Type-safe database access            |
| **Auth**     | Supabase Auth             | JWT-based authentication             |
| **ETL**      | n8n (Docker)              | Workflow automation & data pipelines |
| **Hosting**  | Vercel                    | Edge network deployment              |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Zixly                          │
│                  (Business Intelligence Platform)            │
│                                                               │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │   Dashboard    │  │   API Layer  │  │  ETL Orchestration │ │
│  │   (Next.js)    │◄─┤  (Next.js    │◄─┤      (n8n)         │ │
│  │                │  │   API Routes)│  │                    │ │
│  └────────────────┘  └──────┬───────┘  └──────┬─────────────┘ │
│                             │                  │               │
│                        ┌────▼──────────────────▼────┐         │
│                        │   PostgreSQL (Supabase)    │         │
│                        │   Data Warehouse           │         │
│                        └────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ OAuth / API Integrations
                              ▼
        ┌──────────┬──────────┬──────────┬──────────┬──────────┐
        │   Xero   │ HubSpot  │  Asana   │ Shopify  │  Other   │
        │  (AU)    │  (CRM)   │   (PM)   │  (Ecom)  │  (50+)   │
        └──────────┴──────────┴──────────┴──────────┴──────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ LTS
- npm or yarn
- PostgreSQL (or Supabase account)
- Docker (for n8n ETL)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/colemorton/platform.git
   cd platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Database setup**

   ```bash
   # Run migrations
   npm run db:migrate

   # Seed development data
   npm run db:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

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

## 📊 Features

### Core Capabilities

- **📈 Financial Performance Dashboard**: Revenue, expenses, profit, and cash flow trends
- **🎯 Sales Pipeline Analysis**: Funnel visualization with conversion rates
- **⚡ Operational Efficiency**: Task completion metrics and project velocity
- **🔧 Custom KPI Tracking**: User-defined metrics with flexible data sources
- **🚨 Threshold Alerts**: Automated notifications via email and Slack
- **📱 Mobile-Responsive**: Optimized for tablets and desktop (768px+)

### Integration Ecosystem

**Core Integration Platform**: Zixly connects these systems to create unified business insights

| Priority | Integration | Category     | Data Synced                    | Integration Value      |
| -------- | ----------- | ------------ | ------------------------------ | ---------------------- |
| **P1**   | Xero        | Accounting   | P&L, Balance Sheet, Invoices   | Financial foundation   |
| **P1**   | HubSpot     | CRM          | Deals, Contacts, Companies     | Sales pipeline data    |
| **P1**   | Asana       | Project Mgmt | Tasks, Projects, Time Tracking | Operational metrics    |
| **P2**   | Shopify     | E-Commerce   | Orders, Products, Customers    | Transaction data       |
| **P2**   | MYOB        | Accounting   | Same as Xero                   | Alternative accounting |
| **P2**   | Pipedrive   | CRM          | Deals, Contacts, Activities    | Alternative CRM        |

## 🎨 Dashboard Preview

### Financial Performance Dashboard

- **KPI Cards**: Revenue (MTD), Net Profit, Cash Flow, Accounts Receivable
- **Trend Charts**: Revenue, Expenses, Net Profit over time
- **Cash Flow Waterfall**: Inflows and outflows visualization
- **P&L Table**: Period comparison with drill-down capability

### Sales Pipeline Funnel

- **Funnel Visualization**: Lead → Qualified → Proposal → Closed Won
- **Conversion Metrics**: Stage-by-stage breakdown with conversion rates
- **Deal List**: Drill-down to individual deals with CRM integration

## 🔒 Security & Compliance

- **Australian Data Residency**: All data stored in Sydney region
- **Privacy Act Compliance**: Full compliance with Australian Privacy Act 1988
- **Multi-Tenancy**: Row-Level Security (RLS) ensures complete data isolation
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Authentication**: JWT-based with Supabase Auth
- **OAuth 2.0**: Secure integration with external systems

## 📈 Business Model

### Pricing Tiers

| Tier             | Monthly Price | Setup Fee | Target Customer                      |
| ---------------- | ------------- | --------- | ------------------------------------ |
| **Starter**      | $1,200        | $2,500    | $1-2M revenue, 3 integrations        |
| **Professional** | $1,800        | $2,500    | $2-5M revenue, 8 integrations        |
| **Enterprise**   | $3,500        | $4,000    | $5M+ revenue, unlimited integrations |

### Target Market

- **Primary**: Australian SMEs ($1-10M annual revenue)
- **Industries**: Construction, Professional Services, E-commerce
- **Personas**: Business Owners, COOs, Accountants/Bookkeepers

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

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[📖 Full Documentation](https://colemorton.github.io/zixly/)** - Complete documentation site
- **[Product Requirements](./docs/product/product-requirements-document.md)** - 35+ user stories, detailed personas
- **[System Architecture](./docs/architecture/system-architecture.md)** - C4 diagrams, security architecture
- **[Financial Projections](./docs/financial/financial-projections-unit-economics.md)** - 3-year business model
- **[Sales Strategy](./docs/sales/sales-deck-demo-script.md)** - Go-to-market approach
- **[Implementation Plan](./docs/implementation/phase-1-data-foundation.md)** - Technical roadmap

## 🚀 Deployment

### Production Environment

- **Frontend/API**: Vercel (Edge Network)
- **Database**: Supabase PostgreSQL (Sydney region)
- **ETL**: DigitalOcean Droplet (Docker + n8n)
- **Monitoring**: DataDog APM + Sentry error tracking
- **CDN**: Cloudflare (DDoS protection)

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
- Type checking (TypeScript)
- Unit tests (Vitest)
- Database migrations (Prisma)
- Deploy to Vercel (automatic)
```

## 📊 Performance Targets

| Metric                        | Target | Current |
| ----------------------------- | ------ | ------- |
| **Dashboard Load Time (LCP)** | <2.5s  | 1.8s    |
| **API Response Time (p95)**   | <500ms | 320ms   |
| **Database Query Time (p95)** | <100ms | 65ms    |
| **System Uptime**             | 99.9%  | 99.95%  |

## 🤝 Contributing

This is a solo-operator project optimized for rapid development. The architecture is designed to maximize developer velocity while maintaining enterprise-grade quality.

### Development Principles

- **SOLID, DRY, KISS, YAGNI**: Clean code principles
- **Fail-Fast**: No fallback mechanisms, throw exceptions
- **TypeScript Strict**: Type safety across entire stack
- **Documentation-Driven**: Comprehensive docs as single source of truth

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for Australian SMEs**
