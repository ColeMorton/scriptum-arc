# Zixly Documentation

> **Open-Source Internal Operations Platform**

Welcome to the comprehensive documentation for Zixly, an open-source internal operations platform for the Zixly service business that tracks and automates our own service delivery operations.

## BUSINESS CONTEXT

**Zixly is an open-source internal operations platform for the Zixly service business.**

This platform:

- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with the self-hostable SME stack
- Provides authentic expertise and continuous improvement
- Is open-source for demonstration and reuse purposes

**Zixly is NOT a multi-tenant SaaS platform for external customers.**

## 📚 Documentation Sections

### 🏢 Business & Strategy

- **[Business Model Clarification](./business/business-model-clarification.md)** - Internal operations platform context
- **[Open-Source Strategy](./business/open-source-strategy.md)** - Community contribution and demonstration strategy
- **[Dogfooding Strategy](./architecture/dogfooding-strategy.md)** - Using our own tools to run our business

### 🏗️ Architecture & Technical

- **[System Architecture](./architecture/system-architecture.md)** - Technical architecture and implementation status
- **[Separation of Concerns](./architecture/separation-of-concerns.md)** - n8n vs web app boundaries
- **[Entity Relationship Explained](./concepts/entity-relationship-explained.md)** - Internal operations data model
- **[Architecture Decision Records](./architecture/decisions/README.md)** - Key architectural decisions
- **[Database Schema Diagram](./architecture/database-schema-diagram.md)** - Complete ERD with relationships
- **[Row-Level Security Policies](./architecture/row-level-security-policies.md)** - Multi-tenant security implementation

### 🚀 Implementation

- **[Implementation Status](./implementation/current-status.md)** - What's built vs. planned
- **[Missing Features Roadmap](./implementation/missing-features-roadmap.md)** - Implementation priorities
- **[Phase Plans](./implementation/README.md)** - 4-phase implementation approach
- **[Phase 1: Data Foundation](./implementation/phase-1-data-foundation.md)** - Database and API implementation

### 🔗 Integrations & Workflows

- **[n8n Workflow Capabilities](./integrations/n8n-workflow-capabilities.md)** - Advanced workflow features
- **[n8n Automation Workflows](./integrations/n8n-automation-workflows.md)** - Pre-built workflow templates
- **[SME Software Comparison](./integrations/sme-software-comparison.md)** - Tool comparison matrix

### 🛠️ Operations & Support

- **[Internal Operations](./operations/internal-operations-guide.md)** - Service delivery operations
- **[Troubleshooting](./troubleshooting/README.md)** - Common issues and solutions
- **[Docker Services](./troubleshooting/docker-services.md)** - Container management

## 🚀 Quick Start

### For Developers

1. **[Business Model Clarification](./business/business-model-clarification.md)** - Understand the business context
2. **[Implementation Status](./implementation/current-status.md)** - See what's built vs. planned
3. **[System Architecture](./architecture/system-architecture.md)** - Understand the technical architecture
4. **[Missing Features Roadmap](./implementation/missing-features-roadmap.md)** - Implementation priorities

### For Business Stakeholders

1. **[Business Model Clarification](./business/business-model-clarification.md)** - Internal operations platform
2. **[Open-Source Strategy](./business/open-source-strategy.md)** - Community engagement strategy
3. **[Implementation Status](./implementation/current-status.md)** - Current development status

### For Community Contributors

1. **[Open-Source Strategy](./business/open-source-strategy.md)** - Community contribution strategy
2. **[Architecture Decision Records](./architecture/decisions/README.md)** - Key architectural decisions
3. **[Implementation Status](./implementation/current-status.md)** - Current development status

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

## Key Concepts

### Business Model

Zixly is a **service business** that provides n8n automation services to clients, using this platform to track our own service delivery operations.

### Technical Architecture

- **Frontend**: Next.js with React and TypeScript
- **Backend**: n8n for workflow automation
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (frontend) + DigitalOcean (n8n)

### Implementation Status

- **Phase 1**: ✅ Completed (Data Foundation)
- **Phase 2**: 📋 Planned (ETL & Orchestration)
- **Phase 3**: 📋 Planned (Visualization)
- **Phase 4**: 📋 Planned (Operationalization)

## Current Implementation Status

### ✅ COMPLETED FEATURES

- Database schema and migrations
- Multi-tenant authentication (single tenant: Zixly)
- API endpoints for internal data retrieval
- Basic dashboard UI for service metrics
- Comprehensive testing suite

### 📋 PLANNED FEATURES

- n8n deployment and workflow automation
- Real-time WebSocket connections
- Interactive dashboard features
- Mobile application
- Advanced analytics

### ❌ DOCUMENTED BUT NOT IMPLEMENTED

- WebSocket connections
- Mobile app
- n8n workflows
- Real-time features
- Advanced analytics

## Recent Updates

- **2025-01-27**: Updated business model clarification for internal operations
- **2025-01-27**: Added open-source strategy documentation
- **2025-01-27**: Created implementation status document
- **2025-01-27**: Added missing features roadmap
- **2025-01-27**: Created Architecture Decision Records (ADRs)
- **2025-01-27**: Updated entity relationship for internal operations context

---

**Last Updated**: 2025-01-27  
**Documentation Version**: 2.1  
**Maintained By**: Zixly Development Team

**🌐 Repository**: [GitHub Repository](https://github.com/colemorton/platform)
