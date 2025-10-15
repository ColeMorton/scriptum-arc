---
**← [Product Requirements](../product/product-requirements-document.md)** | **[Back to Documentation Index](../index.md)** | **[Financial Projections](../financial/financial-projections-unit-economics.md)** →
---

# Scriptum Arc - System Architecture Document

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Technical Architecture
**Status**: Production Architecture (MVP)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [C4 Model Documentation](#c4-model-documentation)
4. [Technology Stack](#technology-stack)
5. [Data Architecture](#data-architecture)
6. [Integration Architecture](#integration-architecture)
7. [Security Architecture](#security-architecture)
8. [Infrastructure & Deployment](#infrastructure--deployment)
9. [Performance & Scalability](#performance--scalability)
10. [Reliability & Disaster Recovery](#reliability--disaster-recovery)
11. [Monitoring & Observability](#monitoring--observability)
12. [Development Workflow](#development-workflow)
13. [Implementation Roadmap](#implementation-roadmap)
14. [Technical Debt & Future Enhancements](#technical-debt--future-enhancements)

---

## Executive Summary

### Purpose

Scriptum Arc is a bespoke Business Intelligence platform for Australian SMEs, consolidating data from multiple business systems (Xero, HubSpot, Asana, etc.) into unified, real-time dashboards with automated ETL pipelines.

### Architecture Philosophy

**Solo-Optimized, Cloud-Native, Serverless-First**

- **Minimal DevOps Overhead**: Managed services eliminate server maintenance
- **Type-Safe Development**: TypeScript across entire stack reduces runtime errors
- **Cost-Optimized**: Open-source ETL (n8n) avoids per-task SaaS fees
- **Scalable Foundation**: PostgreSQL + serverless functions scale from 1 to 1000+ customers
- **Security-First**: Australian data residency, OAuth authentication, encryption at rest/transit

### Key Architectural Decisions

| Decision                                    | Rationale                                              | Trade-offs                               |
| ------------------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| **Next.js (App Router)** for frontend + API | Unified codebase, Vercel hosting, serverless functions | Vendor lock-in to Vercel ecosystem       |
| **Prisma ORM** for data access              | Type safety, migration management, developer velocity  | Abstraction overhead for complex queries |
| **Supabase PostgreSQL** for data warehouse  | Managed PostgreSQL, pgvector support, AU region        | Cost scales with data volume             |
| **Self-hosted n8n** for ETL                 | No per-task fees, custom code nodes, full control      | Requires VPS management                  |
| **Visx** for visualizations                 | D3-based custom charts, React-native                   | Steeper learning curve than Chart.js     |

---

## Architecture Overview

### High-Level System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        Scriptum Arc                              │
│                  (Business Intelligence Platform)                │
│                                                                   │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │   Dashboard    │  │   API Layer  │  │  ETL Orchestration │  │
│  │   (Next.js)    │◄─┤  (Next.js    │◄─┤      (n8n)         │  │
│  │                │  │   API Routes)│  │                    │  │
│  └────────────────┘  └──────┬───────┘  └──────┬─────────────┘  │
│                              │                  │                 │
│                         ┌────▼──────────────────▼────┐           │
│                         │   PostgreSQL (Supabase)    │           │
│                         │   Data Warehouse           │           │
│                         └────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ OAuth / API Integrations
                                  ▼
        ┌──────────┬──────────┬──────────┬──────────┬──────────┐
        │   Xero   │ HubSpot  │  Asana   │ Shopify  │  Other   │
        │  (AU)    │  (CRM)   │   (PM)   │  (Ecom)  │  (50+)   │
        └──────────┴──────────┴──────────┴──────────┴──────────┘
```

### System Capabilities

1. **Data Ingestion**: Automated extraction from 50+ business systems via OAuth APIs
2. **Data Transformation**: Complex ETL logic (normalization, aggregation, enrichment)
3. **Data Storage**: Centralized PostgreSQL warehouse with optimized schemas
4. **Data Presentation**: Bespoke React dashboards with interactive Visx charts
5. **Alerting**: Threshold-based notifications (email, Slack) for anomaly detection
6. **Authentication**: Supabase Auth with JWT, role-based access control
7. **Multi-Tenancy**: Customer data isolation via tenant_id partitioning

---

## C4 Model Documentation

### Level 1: System Context Diagram

**Actors**:

- **SME Business Owner**: Primary user, consumes dashboards for decision-making
- **Accountant/Bookkeeper**: Secondary user, validates financial data accuracy
- **System Administrator**: Configures integrations, manages users (typically founder/IT)

**External Systems**:

- **Accounting Systems**: Xero, MYOB, QuickBooks (financial data source)
- **CRM Systems**: HubSpot, Salesforce, Pipedrive (sales pipeline data)
- **Project Management**: Asana, ClickUp, Jira (operational metrics)
- **E-Commerce**: Shopify, WooCommerce (transaction data)
- **Communication**: Slack, Microsoft Teams (alert destinations)

**System Boundary**: Scriptum Arc platform (Next.js app + PostgreSQL + n8n)

---

### Level 2: Container Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Scriptum Arc Platform                        │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Web Application (Next.js 15 + React 19)                     │   │
│  │  - SSR Dashboard Pages                                       │   │
│  │  - Client-side Visx Charts                                   │   │
│  │  - Supabase Auth Integration                                 │   │
│  │  Deployment: Vercel (Edge Network)                           │   │
│  └────────────────────────┬────────────────────────────────────┘   │
│                            │ HTTPS                                   │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │  API Layer (Next.js API Routes - Serverless Functions)      │   │
│  │  - /api/kpis - Client KPI endpoints                         │   │
│  │  - /api/financials - Financial data endpoints               │   │
│  │  - /api/leads - Sales pipeline endpoints                    │   │
│  │  - /api/metrics - Custom metrics endpoints                  │   │
│  │  - /api/auth - Authentication flows                         │   │
│  │  Deployment: Vercel Serverless (Auto-scaling)               │   │
│  └────────────────────────┬────────────────────────────────────┘   │
│                            │ Prisma Client                           │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │  Database (PostgreSQL 15 + pgvector)                        │   │
│  │  - Tables: ClientKPI, Financial, LeadEvent, CustomMetric    │   │
│  │  - Indexes: Optimized for time-series queries               │   │
│  │  - Row-Level Security (RLS) for multi-tenancy               │   │
│  │  Deployment: Supabase (Sydney Region)                       │   │
│  └────────────────────────▲────────────────────────────────────┘   │
│                            │                                         │
│  ┌────────────────────────┴────────────────────────────────────┐   │
│  │  ETL Orchestrator (n8n - Dockerized)                        │   │
│  │  - 50+ Integration Workflows                                │   │
│  │  - Custom Code Nodes (TypeScript)                           │   │
│  │  - Scheduled Triggers (cron-based)                          │   │
│  │  - Error Handling & Retry Logic                             │   │
│  │  Deployment: DigitalOcean Droplet (4GB RAM, Docker)         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────┘
```

**Container Responsibilities**:

1. **Web Application** (Next.js Frontend)
   - Renders dashboard UI with SSR for initial load performance
   - Fetches data from API layer using React Query (caching, optimistic updates)
   - Implements Visx charts with interactive filtering
   - Handles authentication state via Supabase Auth client

2. **API Layer** (Next.js Serverless Functions)
   - Validates JWT tokens from Supabase Auth
   - Executes type-safe Prisma queries against PostgreSQL
   - Formats API responses with standardized error handling
   - Enforces rate limiting and request validation (Zod schemas)

3. **Database** (Supabase PostgreSQL)
   - Central data warehouse (single source of truth)
   - Enforces data integrity via constraints and foreign keys
   - Row-Level Security (RLS) ensures tenant isolation
   - Stores vector embeddings (pgvector) for future RAG capabilities

4. **ETL Orchestrator** (n8n)
   - Scheduled workflows extract data from external APIs
   - Custom TypeScript nodes transform and clean data
   - Writes processed data to PostgreSQL via Prisma or direct SQL
   - Logs errors to monitoring system, retries with exponential backoff

---

### Level 3: Component Diagram (API Layer)

```
┌────────────────────────────────────────────────────────────┐
│              API Layer (Next.js API Routes)                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Pipeline                                  │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │ CORS Handler│→ │Auth Guard│→ │Rate Limiter    │  │  │
│  │  └─────────────┘  └──────────┘  └────────────────┘  │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route Handlers                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ GET /api/kpis                                    │ │  │
│  │  │  → KPIController.listKPIs()                     │ │  │
│  │  │    → KPIService.getKPIsForTenant(tenantId)      │ │  │
│  │  │      → Prisma.clientKPI.findMany()              │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ GET /api/financials?startDate=X&endDate=Y       │ │  │
│  │  │  → FinancialController.getFinancials()          │ │  │
│  │  │    → QueryValidator.validate(schema)            │ │  │
│  │  │    → FinancialService.getTimeSeries()           │ │  │
│  │  │      → Prisma.financial.findMany(filters)       │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ POST /api/auth/callback                         │ │  │
│  │  │  → AuthController.handleOAuthCallback()         │ │  │
│  │  │    → Supabase.auth.exchangeCodeForSession()     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Shared Services                                      │  │
│  │  - ErrorHandler: Standardized error responses        │  │
│  │  - Logger: Structured logging to DataDog             │  │
│  │  - CacheManager: Redis caching for frequent queries  │  │
│  │  - MetricsCollector: Request timing, error rates     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Component Patterns**:

- **Controller Layer**: HTTP request handling, validation, response formatting
- **Service Layer**: Business logic, data aggregation, complex calculations
- **Repository Layer**: Abstracted via Prisma ORM (database queries)
- **Middleware**: Cross-cutting concerns (auth, logging, rate limiting)

---

### Level 4: Code Structure (Example: Financial API Endpoint)

**File**: `app/api/financials/route.ts`

```typescript
// Middleware: Authentication guard
export async function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Attach tenant ID from user metadata
  request.headers.set('X-Tenant-ID', user.user_metadata.tenant_id)
}

// Route handler
export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('X-Tenant-ID')
  const { searchParams } = new URL(request.url)

  // Validation with Zod
  const querySchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    clientId: z.string().optional(),
  })

  const params = querySchema.parse({
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    clientId: searchParams.get('clientId'),
  })

  // Service layer call
  const financials = await FinancialService.getTimeSeries(tenantId, params)

  return NextResponse.json({ data: financials, count: financials.length })
}
```

**File**: `lib/services/financial-service.ts`

```typescript
export class FinancialService {
  static async getTimeSeries(
    tenantId: string,
    params: { startDate: string; endDate: string; clientId?: string }
  ) {
    return await prisma.financial.findMany({
      where: {
        clientKPI: { clientId: tenantId },
        recordDate: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate),
        },
        ...(params.clientId && { clientKPIId: params.clientId }),
      },
      include: { clientKPI: true },
      orderBy: { recordDate: 'asc' },
    })
  }
}
```

---

## Technology Stack

### Frontend Stack

| Layer             | Technology      | Version | Purpose                                              |
| ----------------- | --------------- | ------- | ---------------------------------------------------- |
| **Framework**     | Next.js         | 15.5.5  | React framework with SSR, App Router, serverless API |
| **UI Library**    | React           | 19.1.0  | Component-based UI development                       |
| **Styling**       | Tailwind CSS    | 4.x     | Utility-first CSS framework                          |
| **Charts**        | Visx            | 3.x     | D3-based React chart library                         |
| **Data Fetching** | React Query     | 5.x     | Client-side data caching and state management        |
| **Forms**         | React Hook Form | 7.x     | Form validation and state management                 |
| **Validation**    | Zod             | 3.x     | TypeScript-first schema validation                   |
| **Date Handling** | date-fns        | 3.x     | Date manipulation and formatting                     |

### Backend Stack

| Layer             | Technology         | Version | Purpose                                         |
| ----------------- | ------------------ | ------- | ----------------------------------------------- |
| **Runtime**       | Node.js            | 20 LTS  | JavaScript runtime for serverless functions     |
| **Language**      | TypeScript         | 5.x     | Type-safe development                           |
| **ORM**           | Prisma             | 5.x     | Type-safe database client and migrations        |
| **Database**      | PostgreSQL         | 15.x    | Relational database with pgvector extension     |
| **Auth**          | Supabase Auth      | Latest  | JWT-based authentication and session management |
| **API Framework** | Next.js API Routes | 15.5.5  | Serverless API endpoints                        |

### ETL Stack

| Layer            | Technology            | Version | Purpose                                         |
| ---------------- | --------------------- | ------- | ----------------------------------------------- |
| **Orchestrator** | n8n                   | 1.x     | Workflow automation and ETL pipeline management |
| **Runtime**      | Docker                | 24.x    | Containerization for consistent deployment      |
| **Language**     | TypeScript/JavaScript | ES2022  | Custom code nodes for data transformation       |
| **HTTP Client**  | Axios                 | 1.x     | API requests to external systems                |

### Infrastructure & DevOps

| Layer                      | Technology           | Purpose                                        |
| -------------------------- | -------------------- | ---------------------------------------------- |
| **Hosting (Frontend/API)** | Vercel               | Next.js deployment, edge network, auto-scaling |
| **Database Hosting**       | Supabase             | Managed PostgreSQL, Sydney region              |
| **ETL Hosting**            | DigitalOcean Droplet | Docker container for n8n                       |
| **Monitoring**             | DataDog              | APM, logs, error tracking                      |
| **Error Tracking**         | Sentry               | Frontend/backend exception monitoring          |
| **CDN**                    | Cloudflare           | DDoS protection, caching                       |
| **Email**                  | SendGrid             | Transactional emails, alerts                   |
| **Payment**                | Stripe               | Subscription billing                           |

---

## Data Architecture

### Entity Relationships

For a business-oriented explanation of the data model entities (Tenant, User, Client), including real-world examples and FAQ, see [Entity Relationship Explained](../concepts/entity-relationship-explained.md).

### Database Schema (Prisma)

**File**: `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Multi-tenancy: All tables include tenantId for data isolation
model Tenant {
  id              String   @id @default(cuid())
  name            String
  industry        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  clientKPIs      ClientKPI[]
  users           User[]

  @@map("tenants")
}

model User {
  id              String   @id @default(cuid())
  tenantId        String
  email           String   @unique
  role            UserRole @default(VIEWER)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@map("users")
}

enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

// Primary business entity
model ClientKPI {
  id              String   @id @default(cuid())
  tenantId        String
  clientId        String   // External client identifier (unique per tenant)
  clientName      String
  industry        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  financials      Financial[]
  leadEvents      LeadEvent[]
  customMetrics   CustomMetric[]

  @@unique([tenantId, clientId])
  @@index([tenantId])
  @@map("client_kpis")
}

// Time-series financial data
model Financial {
  id              String   @id @default(cuid())
  clientKPIId     String
  recordDate      DateTime @db.Date
  revenue         Decimal  @db.Decimal(12, 2)
  expenses        Decimal  @db.Decimal(12, 2)
  netProfit       Decimal  @db.Decimal(12, 2)
  cashFlow        Decimal  @db.Decimal(12, 2)
  currency        String   @default("AUD")
  sourceSystem    String?  // e.g., "xero", "myob"
  externalId      String?  // External system record ID
  metadata        Json?    // Flexible storage for system-specific fields
  createdAt       DateTime @default(now())

  clientKPI       ClientKPI @relation(fields: [clientKPIId], references: [id], onDelete: Cascade)

  @@unique([clientKPIId, recordDate, sourceSystem])
  @@index([clientKPIId, recordDate])
  @@index([recordDate])
  @@map("financials")
}

// CRM/Sales pipeline tracking
model LeadEvent {
  id              String   @id @default(cuid())
  clientKPIId     String
  eventDate       DateTime
  leadId          String   // External lead/deal identifier
  stage           String   // e.g., "prospect", "qualified", "proposal", "closed-won"
  value           Decimal? @db.Decimal(12, 2)
  status          String   // e.g., "active", "stale", "lost"
  sourceSystem    String?  // e.g., "hubspot", "pipedrive"
  externalId      String?
  metadata        Json?
  createdAt       DateTime @default(now())

  clientKPI       ClientKPI @relation(fields: [clientKPIId], references: [id], onDelete: Cascade)

  @@index([clientKPIId, eventDate])
  @@index([leadId])
  @@index([stage, status])
  @@map("lead_events")
}

// Flexible custom KPIs
model CustomMetric {
  id              String   @id @default(cuid())
  clientKPIId     String
  metricName      String   // e.g., "project_delivery_days", "customer_satisfaction"
  metricValue     Decimal  @db.Decimal(12, 4)
  unit            String?  // e.g., "days", "percent", "count"
  recordDate      DateTime
  sourceSystem    String?
  metadata        Json?
  embedding       Unsupported("vector(1536)")? // Future: OpenAI embeddings for RAG
  createdAt       DateTime @default(now())

  clientKPI       ClientKPI @relation(fields: [clientKPIId], references: [id], onDelete: Cascade)

  @@index([clientKPIId, metricName, recordDate])
  @@map("custom_metrics")
}

// Integration configuration (stores OAuth tokens securely)
model Integration {
  id              String   @id @default(cuid())
  tenantId        String
  provider        String   // e.g., "xero", "hubspot", "asana"
  status          IntegrationStatus @default(PENDING)
  accessToken     String   @db.Text // Encrypted at application layer
  refreshToken    String?  @db.Text // Encrypted
  expiresAt       DateTime?
  metadata        Json?    // Provider-specific config
  lastSyncAt      DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([tenantId, provider])
  @@index([tenantId])
  @@map("integrations")
}

enum IntegrationStatus {
  PENDING
  ACTIVE
  ERROR
  DISABLED
}
```

### Data Flow Architecture

```
External API → n8n Workflow → Transform/Clean → PostgreSQL → API Layer → Dashboard

Example: Xero Financial Data Flow
───────────────────────────────────
1. n8n Scheduled Trigger (daily at 2am AEST)
2. Xero API: GET /api.xro/2.0/Reports/ProfitAndLoss
3. Custom Code Node: Parse XML, normalize dates (UTC), convert to AUD
4. Custom Code Node: Calculate derived metrics (netProfit = revenue - expenses)
5. PostgreSQL Node: UPSERT into financials table (match on clientKPIId + recordDate)
6. Error Handling: On failure, retry 3x with exponential backoff, log to Sentry
7. Success: Update Integration.lastSyncAt timestamp
```

### Data Retention & Archival

| Data Type                                  | Retention Period            | Archival Strategy                                |
| ------------------------------------------ | --------------------------- | ------------------------------------------------ |
| **Transactional Data** (Financials, Leads) | 7 years (AU tax compliance) | Annual export to S3, compress with gzip          |
| **Custom Metrics**                         | 3 years                     | Aggregate to monthly averages after 1 year       |
| **Audit Logs**                             | 2 years                     | Archive to cold storage (Glacier) after 6 months |
| **User Sessions**                          | 90 days                     | Auto-delete via Supabase auth config             |
| **Integration Tokens**                     | Until revoked               | Rotate every 6 months (forced re-auth)           |

---

## Integration Architecture

### OAuth 2.0 Integration Flow

```
┌─────────────┐                                      ┌──────────────┐
│   User      │                                      │   Xero API   │
│  (Browser)  │                                      │              │
└──────┬──────┘                                      └──────▲───────┘
       │                                                     │
       │ 1. Click "Connect Xero"                           │
       ▼                                                     │
┌────────────────────────────────────┐                     │
│  Scriptum Arc Dashboard            │                     │
│  /integrations/xero/authorize      │                     │
└────────────┬───────────────────────┘                     │
             │                                              │
             │ 2. Redirect to Xero OAuth                  │
             │    with client_id, redirect_uri             │
             └──────────────────────────────────────────────┘
                                                            │
             ┌──────────────────────────────────────────────┘
             │ 3. User authorizes access
             │
             │ 4. Xero redirects with authorization code
             ▼
┌─────────────────────────────────────────┐
│  /api/integrations/xero/callback        │
│  1. Exchange code for access token      │
│  2. Fetch Xero tenant ID                │
│  3. Encrypt tokens with AES-256         │
│  4. Store in Integration table          │
│  5. Trigger initial data sync (n8n)     │
└─────────────────────────────────────────┘
```

### Integration Registry

**File**: `lib/integrations/registry.ts`

```typescript
export const INTEGRATION_REGISTRY = {
  xero: {
    name: 'Xero',
    category: 'accounting',
    authType: 'oauth2',
    authUrl: 'https://login.xero.com/identity/connect/authorize',
    tokenUrl: 'https://identity.xero.com/connect/token',
    scopes: ['accounting.transactions.read', 'accounting.reports.read'],
    dataSources: ['financials', 'invoices', 'expenses'],
  },
  hubspot: {
    name: 'HubSpot',
    category: 'crm',
    authType: 'oauth2',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    scopes: ['crm.objects.contacts.read', 'crm.objects.deals.read'],
    dataSources: ['leads', 'contacts', 'deals'],
  },
  // ... 50+ integrations
}
```

### n8n Workflow Template (Xero Financials)

**Workflow**: `n8n-workflows/xero-financials-sync.json`

```json
{
  "name": "Xero Financials Daily Sync",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [
            {
              "mode": "everyDay",
              "hour": 2,
              "minute": 0
            }
          ]
        }
      }
    },
    {
      "name": "Get Xero Credentials",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT access_token, tenant_id FROM integrations WHERE provider = 'xero' AND status = 'ACTIVE'"
      }
    },
    {
      "name": "Fetch Profit & Loss Report",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss",
        "authentication": "genericCredentialType",
        "headers": {
          "Authorization": "Bearer {{$node['Get Xero Credentials'].json['access_token']}}",
          "Xero-tenant-id": "{{$node['Get Xero Credentials'].json['tenant_id']}}"
        }
      }
    },
    {
      "name": "Transform Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "language": "javaScript",
        "code": "// Custom transformation logic\nconst report = $input.first().json.Reports[0];\nconst rows = report.Rows.find(r => r.RowType === 'Section' && r.Title === 'Income');\n\nreturn rows.Rows.map(row => ({\n  recordDate: new Date(),\n  revenue: parseFloat(row.Cells[1].Value),\n  expenses: parseFloat(row.Cells[2].Value),\n  netProfit: parseFloat(row.Cells[1].Value) - parseFloat(row.Cells[2].Value),\n  currency: 'AUD',\n  sourceSystem: 'xero'\n}));"
      }
    },
    {
      "name": "Upsert to PostgreSQL",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO financials (client_kpi_id, record_date, revenue, expenses, net_profit, currency, source_system) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (client_kpi_id, record_date, source_system) DO UPDATE SET revenue = EXCLUDED.revenue, expenses = EXCLUDED.expenses, net_profit = EXCLUDED.net_profit"
      }
    }
  ]
}
```

---

## Security Architecture

### Authentication & Authorization

**Authentication**: Supabase Auth (JWT-based)

```typescript
// Middleware: app/middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Attach user context to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.id)
  requestHeaders.set('x-tenant-id', user.user_metadata.tenant_id)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}
```

**Authorization**: Role-Based Access Control (RBAC)

| Role       | Permissions                                                     |
| ---------- | --------------------------------------------------------------- |
| **ADMIN**  | Full access: manage integrations, users, billing, view all data |
| **EDITOR** | Edit dashboards, view all data, cannot manage users or billing  |
| **VIEWER** | Read-only access to dashboards                                  |

### Data Encryption

**At Rest**:

- PostgreSQL: AES-256 encryption enabled via Supabase
- OAuth tokens: Encrypted with AES-256-GCM before storage (application-level)
- Backups: Encrypted with AWS S3 server-side encryption (SSE-KMS)

**In Transit**:

- All API communication: TLS 1.3
- Database connections: SSL enforced (Supabase requires SSL)
- n8n webhooks: HTTPS only, verify TLS certificates

**Encryption Implementation**:

```typescript
// lib/crypto/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') // 32-byte key

export function encrypt(plaintext: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Format: iv:authTag:ciphertext
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

### Multi-Tenancy Isolation

**Database-Level**: Row-Level Security (RLS) in PostgreSQL

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access data for their tenant
CREATE POLICY tenant_isolation_policy ON client_kpis
  USING (tenant_id = current_setting('app.tenant_id')::text);

CREATE POLICY tenant_isolation_policy ON financials
  USING (client_kpi_id IN (
    SELECT id FROM client_kpis WHERE tenant_id = current_setting('app.tenant_id')::text
  ));

-- Set tenant context for each database session
-- (Called from API middleware before queries)
SET app.tenant_id = 'tenant_xyz123';
```

**Application-Level**: Tenant ID validation in all queries

```typescript
// All Prisma queries automatically filter by tenant
const financials = await prisma.financial.findMany({
  where: {
    clientKPI: {
      tenantId: request.headers.get('x-tenant-id')!,
    },
    recordDate: { gte: startDate },
  },
})
```

### API Security

**Rate Limiting**: 100 requests/minute per tenant (Vercel Edge Config)

```typescript
// lib/middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
})

export async function rateLimitMiddleware(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id')!
  const { success, limit, remaining } = await ratelimit.limit(tenantId)

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  return NextResponse.next()
}
```

**Request Validation**: Zod schemas for all API inputs

```typescript
// Prevent SQL injection, XSS, and invalid data
const querySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metric: z.enum(['revenue', 'profit', 'cashflow']),
})

const validated = querySchema.safeParse(request.query)
if (!validated.success) {
  throw new ValidationError(validated.error)
}
```

**CORS Policy**: Restrict to production domains

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://app.scriptumarc.com.au' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}
```

---

## Infrastructure & Deployment

### Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Vercel Edge Network (Global CDN)                  │    │
│  │  - Next.js Frontend (SSR + Static)                 │    │
│  │  - API Routes (Serverless Functions)               │    │
│  │  - Auto-scaling: 0 to ∞ based on traffic           │    │
│  └────────────────────┬───────────────────────────────┘    │
│                        │                                     │
│                        │ SSL/TLS 1.3                        │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Supabase (Sydney Region)                          │    │
│  │  - PostgreSQL 15 (Primary + Replica)               │    │
│  │  - Connection Pooling (PgBouncer)                  │    │
│  │  - Automated Backups (Daily, 30-day retention)     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  DigitalOcean Droplet (Sydney)                     │    │
│  │  - 4GB RAM, 2 vCPUs, 80GB SSD                      │    │
│  │  - Docker: n8n container                           │    │
│  │  - Volume: Persistent workflow/execution storage   │    │
│  │  - Monitoring: Datadog agent                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

### Environment Configuration

**Vercel Environment Variables**:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # Direct connection (bypasses pooling for migrations)

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Server-side only

# Encryption
ENCRYPTION_KEY="64-char-hex-string" # AES-256 key

# Integrations (OAuth credentials)
XERO_CLIENT_ID="..."
XERO_CLIENT_SECRET="..."
HUBSPOT_CLIENT_ID="..."
HUBSPOT_CLIENT_SECRET="..."

# External Services
SENDGRID_API_KEY="SG...."
STRIPE_SECRET_KEY="sk_live_..."
DATADOG_API_KEY="..."

# Rate Limiting
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

**n8n Environment Variables** (Docker):

```yaml
# docker-compose.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - '5678:5678'
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=n8n.scriptumarc.internal
      - N8N_PROTOCOL=https
      - DATABASE_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=${POSTGRES_HOST}
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168 # 7 days
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped
```

### CI/CD Pipeline

**GitHub Actions Workflow**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm test

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance & Scalability

### Performance Targets

| Metric                           | Target | Current (MVP) | Measurement     |
| -------------------------------- | ------ | ------------- | --------------- |
| **Dashboard Load Time (LCP)**    | <2.5s  | 1.8s          | Core Web Vitals |
| **API Response Time (p95)**      | <500ms | 320ms         | DataDog APM     |
| **Database Query Time (p95)**    | <100ms | 65ms          | Prisma metrics  |
| **Time to Interactive (TTI)**    | <3.5s  | 2.9s          | Lighthouse      |
| **First Contentful Paint (FCP)** | <1.8s  | 1.2s          | Core Web Vitals |

### Scalability Strategy

**Database Scaling**:

1. **Vertical Scaling** (0-100 customers)
   - Supabase: Start with Small instance (2GB RAM)
   - Upgrade to Medium (4GB) at 50 customers
   - Upgrade to Large (8GB) at 100 customers

2. **Read Replicas** (100-500 customers)
   - Add read replica for dashboard queries
   - Write queries to primary, read queries to replica
   - Prisma client configured with read/write splitting

3. **Partitioning** (500+ customers)
   - Time-based partitioning on `financials`, `lead_events` (monthly partitions)
   - Tenant-based partitioning (shard by `tenant_id`)
   - Archived data moved to cold storage (S3)

**API Scaling**:

- Vercel serverless functions auto-scale (no manual intervention)
- Edge caching for static dashboard assets (Vercel Edge Network)
- React Query client-side caching reduces API calls by ~60%

**ETL Scaling**:

- n8n: Upgrade to 8GB Droplet at 50 customers
- Parallelize workflows (separate containers for different integrations)
- At 200+ customers, migrate to n8n Cloud or Kubernetes cluster

### Caching Strategy

**Client-Side** (React Query):

```typescript
// 5-minute cache for dashboard data, stale-while-revalidate
const { data: kpis } = useQuery({
  queryKey: ['kpis', tenantId],
  queryFn: () => fetchKPIs(tenantId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})
```

**Server-Side** (Redis via Upstash):

```typescript
// Cache expensive aggregations
const cacheKey = `financials:${tenantId}:${startDate}:${endDate}`
const cached = await redis.get(cacheKey)

if (cached) {
  return JSON.parse(cached)
}

const data = await computeExpensiveAggregation()
await redis.set(cacheKey, JSON.stringify(data), { ex: 3600 }) // 1 hour TTL

return data
```

**CDN** (Vercel Edge):

- Static assets: Cached indefinitely (immutable filenames)
- API routes: No caching (always fresh data)
- Dashboard HTML: Cached for 60s (ISR - Incremental Static Regeneration)

---

## Reliability & Disaster Recovery

### Availability Targets

| Component     | SLA    | Uptime Target | Downtime/Year |
| ------------- | ------ | ------------- | ------------- |
| **Dashboard** | 99.9%  | 3 nines       | 8.76 hours    |
| **API**       | 99.9%  | 3 nines       | 8.76 hours    |
| **Database**  | 99.95% | 3.5 nines     | 4.38 hours    |
| **ETL (n8n)** | 99.5%  | 2.5 nines     | 43.8 hours    |

### Backup Strategy

**Database Backups** (Supabase Automated):

- **Frequency**: Daily at 3am AEST
- **Retention**: 30 days (Point-in-Time Recovery available)
- **Location**: S3-compatible storage (Sydney region)
- **Testing**: Monthly restore test to staging environment

**Application Backups** (Git + Vercel):

- **Code**: GitHub repository (main branch = production)
- **Deployments**: Vercel maintains deployment history (instant rollback)
- **Environment Variables**: Encrypted backup in 1Password

**n8n Workflow Backups**:

- **Frequency**: Weekly export of all workflows (JSON)
- **Storage**: GitHub private repository (`n8n-workflows/`)
- **Versioning**: Git history tracks workflow changes

### Disaster Recovery Plan

**Scenario 1: Database Failure**

1. **Detection**: Supabase health check fails (monitored by DataDog)
2. **Notification**: PagerDuty alert to on-call (founder)
3. **Mitigation**:
   - Supabase automatically fails over to replica (RTO: 30 seconds)
   - If catastrophic failure, restore from latest backup (RTO: 2 hours)
4. **Recovery**:
   - Verify data integrity via checksum comparison
   - Resume ETL workflows
   - Customer notification if downtime >1 hour

**Scenario 2: Vercel Outage**

1. **Detection**: Vercel status page + synthetic monitoring alerts
2. **Mitigation**:
   - Wait for Vercel resolution (historical MTTR: 15 minutes)
   - If extended (>1 hour), deploy to backup Netlify account
3. **Recovery**:
   - Update DNS to point to backup deployment
   - RTO: 90 minutes (manual DNS propagation)

**Scenario 3: Data Corruption (Bad ETL Logic)**

1. **Detection**: Data anomaly alerts (e.g., revenue suddenly 10x normal)
2. **Mitigation**:
   - Pause affected n8n workflow
   - Identify corrupt records via audit logs
   - Delete corrupt data: `DELETE FROM financials WHERE created_at > '2025-01-15 14:00'`
3. **Recovery**:
   - Fix ETL workflow bug
   - Re-run workflow for affected date range
   - Customer notification + data validation report

**Recovery Time Objectives (RTO) / Recovery Point Objectives (RPO)**:

| Scenario                        | RTO                           | RPO                                |
| ------------------------------- | ----------------------------- | ---------------------------------- |
| Database failure                | 30 seconds (auto-failover)    | 5 minutes (replication lag)        |
| Application deployment rollback | 2 minutes                     | 0 (instant rollback)               |
| Complete data center loss       | 2 hours (backup restore)      | 24 hours (daily backups)           |
| Data corruption                 | 4 hours (manual intervention) | Varies (depends on detection time) |

---

## Monitoring & Observability

### Monitoring Stack

| Layer                                        | Tool                           | Purpose                                                   |
| -------------------------------------------- | ------------------------------ | --------------------------------------------------------- |
| **Application Performance Monitoring (APM)** | DataDog                        | Request tracing, performance metrics, error rates         |
| **Error Tracking**                           | Sentry                         | Exception monitoring, stack traces, release tracking      |
| **Uptime Monitoring**                        | Checkly                        | Synthetic monitoring, API health checks (5-min intervals) |
| **Infrastructure Monitoring**                | DigitalOcean Metrics + DataDog | CPU, memory, disk, network for n8n Droplet                |
| **Log Aggregation**                          | DataDog Logs                   | Centralized logging from Vercel + n8n + Supabase          |

### Key Metrics Dashboard

**DataDog Dashboard**: "Scriptum Arc Production Overview"

**System Health**:

- Request rate (requests/min)
- Error rate (% of requests with 5xx)
- Latency (p50, p95, p99)
- Database connection pool utilization

**Business Metrics**:

- Active tenants (daily active users)
- API calls per tenant (usage tracking)
- ETL workflow success rate (%)
- Data sync lag (time since last successful sync per integration)

**Alerting Rules**:

```yaml
# datadog-alerts.yml
- name: 'High API Error Rate'
  query: 'avg(last_5m):sum:api.errors{env:production} > 10'
  message: 'API error rate exceeded 10 errors/5min. Investigate immediately.'
  priority: P1
  notify: ['pagerduty', 'slack']

- name: 'Database Connection Pool Exhausted'
  query: 'avg(last_5m):max:postgres.connections.active{} / max:postgres.connections.max{} > 0.9'
  message: 'Database connection pool at 90% capacity. Consider scaling.'
  priority: P2
  notify: ['slack']

- name: 'ETL Workflow Failure'
  query: 'sum(last_1h):n8n.workflow.failed{workflow:xero-financials} > 3'
  message: 'Xero financials workflow failed 3+ times in 1 hour. Check n8n logs.'
  priority: P2
  notify: ['email', 'slack']

- name: 'Dashboard Load Time Regression'
  query: 'avg(last_15m):p95:browser.page.load_time{page:dashboard} > 3000'
  message: 'Dashboard load time (p95) exceeded 3s. Performance degradation.'
  priority: P3
  notify: ['slack']
```

### Structured Logging

**Log Format** (JSON):

```typescript
// lib/logger.ts
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'scriptum-arc-api' },
  transports: [
    new winston.transports.Console(),
    new DatadogTransport({ apiKey: process.env.DATADOG_API_KEY }),
  ],
})

// Usage in API route
logger.info('Financial data fetched', {
  tenantId,
  recordCount: financials.length,
  startDate,
  endDate,
  duration: Date.now() - startTime,
})
```

**Log Retention**:

- Info/Debug logs: 7 days
- Warning logs: 30 days
- Error logs: 90 days
- Audit logs (auth, data access): 2 years

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone git@github.com:scriptumarc/platform.git
cd platform

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with local Supabase credentials

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed development data
npx prisma db seed

# 6. Start development server
npm run dev
# → http://localhost:3000

# 7. Start n8n (optional, for ETL testing)
docker-compose up n8n
# → http://localhost:5678
```

### Git Workflow

**Branch Strategy**: Trunk-based development

- `main`: Production-ready code (auto-deploys to Vercel)
- `feat/*`: Feature branches (merge via PR)
- `fix/*`: Bug fixes (merge via PR)

**Commit Convention**: Conventional Commits

```bash
feat(api): add financial aggregation endpoint
fix(dashboard): correct chart date formatting
chore(deps): upgrade Next.js to 15.5.5
```

### Code Quality Standards

**Pre-Commit Hooks** (Husky + lint-staged):

```json
// .husky/pre-commit
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.prisma": ["prisma format"]
  }
}
```

**ESLint Configuration**:

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**TypeScript Configuration**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

---

## Implementation Roadmap

### MVP Phases Overview

The implementation follows a 4-phase approach optimized for solo senior full-stack developer velocity, spanning 18 weeks total.

| Phase                            | Duration | Focus Area                          | Key Deliverables                                                          | Success Gate                                            |
| -------------------------------- | -------- | ----------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Phase 1: Data Foundation**     | 4 weeks  | Backend infrastructure & data layer | Supabase setup, Prisma schema, secure API routes, JWT auth                | All 4 core API endpoints functional with authentication |
| **Phase 2: ETL & Orchestration** | 6 weeks  | Data ingestion pipelines            | n8n workflows, 3 core integrations (Xero, HubSpot, Asana), automated sync | Daily sync operational for all P1 integrations          |
| **Phase 3: Visualization**       | 5 weeks  | Dashboard UI & charts               | Next.js dashboard, 4 Visx charts, interactivity, filtering                | <2.5s dashboard load time achieved                      |
| **Phase 4: Operationalization**  | 3 weeks  | Production readiness                | Performance tuning, security audit, testing, monitoring                   | 99.9% uptime SLA met, compliance validated              |

**Total MVP Timeline**: 18 weeks (4.5 months)

**Related Documentation**:

- Detailed phase plans: [Implementation Directory](../implementation/)
- Product requirements: [Product Requirements Document](../product/product-requirements-document.md)
- Product vision: [Product Specification](../specs/product-specification.md)

---

### Phase 1: Data Foundation (Weeks 1-4)

**Objective**: Establish secure, scalable, type-safe backend and data layer

**Deliverables**:

1. **Project Setup & Integration** (Week 1)
   - Initialize Next.js 15.5.5 with TypeScript, App Router
   - Configure Vercel deployment pipeline
   - Set up Supabase PostgreSQL (Sydney region)
   - Environment variable management (.env.local, Vercel secrets)

2. **Core Schema Definition** (Week 1-2)
   - Design Prisma schema (Tenant, ClientKPI, Financial, LeadEvent, CustomMetric, Integration)
   - Implement multi-tenancy with Row-Level Security (RLS)
   - Run migrations to Supabase
   - Generate type-safe Prisma Client

3. **RAG Readiness** (Week 2)
   - Enable pgvector extension in Supabase
   - Add vector embedding column to CustomMetric table
   - Document future RAG architecture strategy

4. **Secure API Endpoints** (Week 3-4)
   - Implement Supabase Auth with JWT validation
   - Create authentication middleware for API routes
   - Build 4 core endpoints: `/api/kpis`, `/api/financials`, `/api/leads`, `/api/metrics`
   - Add Zod request validation
   - Implement error handling utilities

**Success Criteria**:

- ✅ Supabase operational with pgvector enabled
- ✅ All core tables migrated with proper indexes
- ✅ Prisma Client generating type-safe queries
- ✅ JWT authentication protecting all API routes
- ✅ API endpoints return valid data with tenant isolation enforced

---

### Phase 2: ETL & Orchestration (Weeks 5-10)

**Objective**: Implement robust, cost-effective data ingestion and transformation using n8n

**Deliverables**:

1. **n8n Self-Hosting** (Week 5)
   - Deploy n8n via Docker on DigitalOcean Droplet (Sydney)
   - Configure secure access with HTTPS and basic auth
   - Set up PostgreSQL connection for workflow persistence
   - Implement logging to DataDog

2. **Core Connector Workflows** (Weeks 6-8)
   - **Xero Integration**: Daily P&L report sync (financial data)
   - **HubSpot Integration**: Daily deals/contacts sync (CRM pipeline)
   - **Asana Integration**: Daily task completion metrics (operational data)
   - OAuth 2.0 token management (refresh token rotation)
   - Scheduled triggers (cron: daily at 2am AEST)

3. **Custom ETL Logic** (Weeks 8-9)
   - TypeScript code nodes for data transformation
   - Date normalization (UTC timezone handling)
   - Currency conversion (all to AUD)
   - KPI aggregation calculations
   - API pagination handling
   - Retry logic with exponential backoff (3x attempts)

4. **Data Loading & Integrity** (Week 10)
   - Upsert logic (INSERT ... ON CONFLICT DO UPDATE)
   - Data validation before write (fail-fast on schema violations)
   - Sync status tracking (Integration.lastSyncAt updates)
   - Error notification (email + Slack on 3+ consecutive failures)

**Success Criteria**:

- ✅ n8n operational on DigitalOcean with 99.5%+ uptime
- ✅ Xero, HubSpot, Asana workflows running daily without manual intervention
- ✅ < 1% error rate across all ETL workflows
- ✅ Data integrity checks passing (no duplicate records, correct tenant isolation)

---

### Phase 3: Visualization (Weeks 11-15)

**Objective**: Build premium, bespoke dashboard UI with interactive Visx charts

**Deliverables**:

1. **Dashboard UI Scaffolding** (Week 11)
   - Responsive dashboard layout (Tailwind CSS)
   - Navigation structure (sidebar, header, breadcrumbs)
   - SSR for initial data fetch (Server Components)
   - Client-side routing (App Router)

2. **Data Fetching Layer** (Week 12)
   - React Query setup (caching, optimistic updates)
   - API client with TypeScript types (generated from API routes)
   - Loading states and error boundaries
   - Stale-while-revalidate caching (5-minute stale time)

3. **Visx Chart Implementation** (Weeks 13-14)
   - **Financial Performance Dashboard**: Revenue, expenses, profit trends (line + bar charts)
   - **Sales Funnel Analysis**: Stage conversion rates (custom funnel visualization)
   - **Cash Flow Tracking**: Monthly burn rate, runway projection (area chart)
   - **Operational Efficiency**: Task completion metrics, project velocity (time-series)

4. **Interactivity & UX** (Week 15)
   - Date range filtering (last 7/30/90 days, custom range)
   - Drill-down capability (click chart to view underlying data)
   - Export functionality (CSV download)
   - Responsive design (1024px+, tablet support 768px+)

**Success Criteria**:

- ✅ Dashboard Largest Contentful Paint (LCP) < 2.5 seconds
- ✅ All 4 core charts rendering with real customer data
- ✅ Interactive filtering functional without performance degradation
- ✅ Lighthouse score > 90 (Performance, Accessibility, Best Practices)

---

### Phase 4: Operationalization (Weeks 16-18)

**Objective**: Harden application, finalize deployment, prepare for production traffic

**Deliverables**:

1. **Container Finalization** (Week 16)
   - Docker Compose configuration for n8n with persistent volumes
   - Health check endpoints for monitoring
   - Automated deployment scripts (Ansible/Terraform consideration)

2. **Performance Tuning** (Week 16-17)
   - Database query optimization (analyze slow queries, add missing indexes)
   - Prisma query batching and caching
   - API route optimization (reduce cold start times)
   - Vercel Edge Function migration for high-traffic endpoints
   - Image optimization (Next.js Image component, WebP format)

3. **Security Hardening** (Week 17)
   - Environment variable audit (no secrets in code)
   - OAuth token encryption verification (AES-256-GCM)
   - CORS policy enforcement (production domain whitelist)
   - Rate limiting implementation (100 req/min per tenant)
   - Australian Privacy Act compliance audit
   - Penetration testing (OWASP Top 10 validation)

4. **Testing & Documentation** (Week 18)
   - End-to-end tests for critical workflows (Playwright)
   - API integration tests (Vitest)
   - Load testing (simulate 100 concurrent users, K6)
   - System documentation update (architecture diagrams, runbooks)
   - Developer onboarding guide (README, local setup instructions)

**Success Criteria**:

- ✅ 99.9% uptime SLA achieved in staging environment (7-day observation)
- ✅ All performance targets met (API <500ms p95, Dashboard <2.5s LCP)
- ✅ Security audit passing with zero critical/high vulnerabilities
- ✅ Load tests passing at 2x expected traffic (100 concurrent users)
- ✅ Automated backups operational (daily database, weekly workflow exports)

---

### Post-MVP Roadmap (Months 5-12)

**Months 5-7: Customer Acquisition**

- Onboard first 5 paying customers
- Refine sales process based on pilot feedback
- Develop 1-2 customer case studies
- Implement customer feedback loop (NPS surveys, feature requests)

**Months 8-10: Feature Expansion**

- Priority 2 integrations (Shopify, MYOB, Pipedrive)
- Advanced alerting (Slack notifications, threshold-based triggers)
- Dashboard sharing (read-only public links, PDF export)
- Mobile web optimization (responsive <768px)

**Months 11-12: Scale Preparation**

- Automated customer onboarding workflow
- Self-service integration configuration UI
- Enterprise tier launch (dedicated support, custom SLA)
- SOC 2 Type I audit initiation (if targeting enterprise)

---

## Technical Debt & Future Enhancements

### Known Technical Debt

| Item                               | Impact | Effort | Priority | Mitigation Plan                                         |
| ---------------------------------- | ------ | ------ | -------- | ------------------------------------------------------- |
| **No automated E2E tests**         | High   | Medium | P1       | Implement Playwright tests for critical flows (Q2 2026) |
| **n8n manual deployment**          | Medium | Low    | P2       | Create Terraform config for IaC (Q3 2026)               |
| **No feature flags system**        | Medium | Medium | P2       | Integrate LaunchDarkly (Q4 2026)                        |
| **Hard-coded integration configs** | Low    | Low    | P3       | Move to database-backed registry (Q1 2027)              |
| **Single n8n instance**            | High   | High   | P1       | Implement n8n clustering at 100 customers               |

### Future Architecture Enhancements

**Phase 2 (Months 7-12)**:

- **Real-time Data**: Implement WebSocket connections for live dashboard updates
- **Advanced Analytics**: Add predictive models (forecasting, anomaly detection) via Python microservice
- **White-Label**: Multi-domain support for agency partners

**Phase 3 (Year 2)**:

- **RAG Implementation**: Vector search on unstructured data (invoices, emails) using OpenAI embeddings
- **Mobile App**: React Native app with offline-first architecture
- **Advanced Alerting**: AI-powered insight generation (e.g., "Revenue 15% below forecast, investigate X")

**Phase 4 (Year 3+)**:

- **Multi-Region**: Deploy to US + EU regions for international expansion
- **Enterprise SSO**: SAML/OIDC integration for enterprise customers
- **Data Mesh**: Federated data architecture for customers with complex org structures

---

## Appendix

### Technology Decision Records (TDRs)

**TDR-001: Why Next.js over Remix/Astro?**

**Context**: Need full-stack framework with SSR and API routes

**Decision**: Next.js App Router

**Rationale**:

- Vercel hosting provides best-in-class developer experience (zero-config deployments)
- Largest ecosystem and community support
- Built-in image optimization, edge runtime support
- Team already familiar with React paradigm

**Trade-offs**:

- Vendor lock-in to Vercel (mitigation: can self-host on Node.js)
- Framework complexity (App Router learning curve)

---

**TDR-002: Why Self-Hosted n8n over Zapier/Make?**

**Context**: Need ETL orchestration for high-volume data syncs

**Decision**: Self-hosted n8n on DigitalOcean

**Rationale**:

- Cost: Zapier charges per task ($0.01-0.03/task) = $500-1500/month at scale. n8n = $40/month VPS.
- Flexibility: Custom TypeScript code nodes for complex transformations
- Data residency: Data never leaves our infrastructure (compliance requirement)

**Trade-offs**:

- Infrastructure management overhead (mitigation: Docker simplifies deployment)
- Less polished UI than Zapier (acceptable for solo operator)

---

**TDR-003: Why Supabase over AWS RDS?**

**Context**: Need managed PostgreSQL with Australian data residency

**Decision**: Supabase PostgreSQL (Sydney region)

**Rationale**:

- Zero-config pgvector support (required for future RAG features)
- Built-in auth system (saves development time)
- Superior developer experience (dashboard, migrations, backups)
- Competitive pricing ($25/month startup vs $50+/month AWS RDS)

**Trade-offs**:

- Smaller company (vs AWS stability) - mitigation: export backups to S3
- Limited customization of PostgreSQL config - acceptable for MVP

---

### Glossary

- **ARPA**: Average Revenue Per Account
- **ETL**: Extract, Transform, Load (data pipeline process)
- **JWT**: JSON Web Token (authentication token format)
- **OAuth**: Open Authorization (delegated authorization framework)
- **ORM**: Object-Relational Mapping (database abstraction layer)
- **RAG**: Retrieval-Augmented Generation (AI technique using vector search)
- **RBAC**: Role-Based Access Control
- **RLS**: Row-Level Security (PostgreSQL feature)
- **RTO**: Recovery Time Objective (max acceptable downtime)
- **RPO**: Recovery Point Objective (max acceptable data loss)
- **SSR**: Server-Side Rendering
- **TDR**: Technology Decision Record

---

---

## Database Documentation

### Comprehensive Database Architecture

For detailed database-specific documentation, see:

**Schema & Design**:

- [Database Schema Diagram](./database-schema-diagram.md) - Complete ERD with tables, relationships, indexes
- [Row-Level Security Policies](./row-level-security-policies.md) - PostgreSQL RLS DDL for multi-tenant isolation

**Operations & Maintenance**:

- [Database Migrations Strategy](./database-migrations.md) - Prisma migration workflow, testing, rollback procedures
- [Database Monitoring](./database-monitoring.md) - DataDog queries, alerts, performance troubleshooting

**Advanced Features**:

- [RAG Strategy](./rag-strategy.md) - pgvector configuration, embedding generation, similarity search

**Schema Version**: 1.0 (MVP)
**Last Schema Update**: 2025-10-15

---

**Document End**

**Review Cycle**: Quarterly or after major architecture changes
**Next Review**: 2026-01-15
**Change History**:

- 2025-10-15: Initial version (v1.0) - MVP architecture documented
- 2025-10-15: Added database documentation cross-references
