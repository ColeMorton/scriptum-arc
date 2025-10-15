# Scriptum Arc Documentation

> **Bespoke Business Intelligence for Australian SMEs**

Welcome to the comprehensive documentation for Scriptum Arc, a premium Business Intelligence platform designed specifically for Australian Small-to-Medium Enterprises.

## 📚 Documentation Sections

### 🎯 Product Documentation

- **[Product Requirements Document](./product/product-requirements-document.md)** - 35+ user stories, detailed personas
- **[Product Specification](./specs/product-specification.md)** - Product vision, MVP scope, success metrics

### 🏗️ Architecture & Technical

- **[System Architecture](./architecture/system-architecture.md)** - C4 diagrams, security architecture
- **[Database Schema Diagram](./architecture/database-schema-diagram.md)** - Complete ERD with relationships
- **[Database Migrations](./architecture/database-migrations.md)** - Migration workflow and procedures
- **[Database Monitoring](./architecture/database-monitoring.md)** - Performance monitoring and alerts
- **[Row-Level Security Policies](./architecture/row-level-security-policies.md)** - Multi-tenant security implementation
- **[RAG Strategy](./architecture/rag-strategy.md)** - Vector search and AI integration plan

### 💰 Business & Financial

- **[Financial Projections](./financial/financial-projections-unit-economics.md)** - 3-year business model and unit economics
- **[Sales Strategy](./sales/sales-deck-demo-script.md)** - Go-to-market approach and demo scripts

### 🚀 Implementation

- **[Implementation Overview](./implementation/README.md)** - Technical roadmap and phases
- **[Phase 1: Data Foundation](./implementation/phase-1-data-foundation.md)** - Database and API implementation

### 🔗 Integrations & Concepts

- **[Entity Relationship Explained](./concepts/entity-relationship-explained.md)** - Business entity relationships
- **[n8n Automation Workflows](./integrations/n8n-automation-workflows.md)** - ETL pipeline documentation
- **[SME Software Comparison](./integrations/sme-software-comparison.md)** - Competitive analysis

## 🚀 Quick Start

### For Developers

1. **[System Architecture](./architecture/system-architecture.md)** - Understand the technical stack
2. **[Phase 1 Implementation](./implementation/phase-1-data-foundation.md)** - Database setup and API development
3. **[Database Schema](./architecture/database-schema-diagram.md)** - Data model and relationships

### For Business Stakeholders

1. **[Product Requirements](./product/product-requirements-document.md)** - User stories and feature specifications
2. **[Financial Projections](./financial/financial-projections-unit-economics.md)** - Business model and unit economics
3. **[Sales Strategy](./sales/sales-deck-demo-script.md)** - Go-to-market approach

## 📖 Documentation Standards

- **Version Control**: All documentation is version-controlled with the codebase
- **Review Process**: Documentation updates require review alongside code changes
- **Living Documents**: Documentation is updated as the system evolves
- **Cross-References**: Documents link to related sections for easy navigation

## 🔧 Technology Stack

| Layer          | Technology    | Version | Purpose                                              |
| -------------- | ------------- | ------- | ---------------------------------------------------- |
| **Framework**  | Next.js       | 15.5.5  | React framework with SSR, App Router, serverless API |
| **UI Library** | React         | 19.1.0  | Component-based UI development                       |
| **Styling**    | Tailwind CSS  | 4.x     | Utility-first CSS framework                          |
| **Charts**     | Visx          | 3.x     | D3-based React chart library                         |
| **Database**   | PostgreSQL    | 15.x    | Relational database with pgvector extension          |
| **ORM**        | Prisma        | 6.x     | Type-safe database client and migrations             |
| **Auth**       | Supabase Auth | Latest  | JWT-based authentication and session management      |
| **ETL**        | n8n           | 1.x     | Workflow automation and ETL pipeline management      |

## 🎯 Key Features

- **📈 Financial Performance Dashboard**: Revenue, expenses, profit, and cash flow trends
- **🎯 Sales Pipeline Analysis**: Funnel visualization with conversion rates
- **⚡ Operational Efficiency**: Task completion metrics and project velocity
- **🔧 Custom KPI Tracking**: User-defined metrics with flexible data sources
- **🚨 Threshold Alerts**: Automated notifications via email and Slack
- **📱 Mobile-Responsive**: Optimized for tablets and desktop (768px+)

## 🏢 Target Market

- **Primary**: Australian SMEs ($1-10M annual revenue)
- **Industries**: Construction, Professional Services, E-commerce
- **Personas**: Business Owners, COOs, Accountants/Bookkeepers

## 💡 Value Proposition

**"Bespoke Business Intelligence at SaaS Pricing"**

- **Automated Data Consolidation**: Nightly syncs from 50+ business systems via OAuth integrations
- **Bespoke Dashboards**: Custom-designed visualizations tailored to each customer's industry and KPIs
- **Zero Maintenance**: Fully managed platform with included support and ongoing optimization
- **Australian-Focused**: AU data residency, Privacy Act compliance, integrations with AU-specific tools

---

**Last Updated**: 2025-01-27  
**Documentation Version**: 1.0  
**Maintained By**: Scriptum Arc Development Team

**🌐 Repository**: [GitHub Repository](https://github.com/scriptumarc/platform)
