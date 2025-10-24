# Database Schema Diagram

> **Note**: This document describes our internal database architecture and schema design for pipeline services service implementations. It is maintained for service delivery consistency and technical documentation purposes.

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Database Architecture
**Status**: Service Delivery Infrastructure

---

## Table of Contents

1. [Entity-Relationship Diagram](#entity-relationship-diagram)
2. [Table Descriptions](#table-descriptions)
3. [Relationships & Cardinality](#relationships--cardinality)
4. [Indexes Strategy](#indexes-strategy)
5. [Data Flow Patterns](#data-flow-patterns)
6. [Schema Evolution](#schema-evolution)

---

## Entity-Relationship Diagram

### Conceptual ERD

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         ZIXLY DATABASE                             │
│                      Multi-Tenant Time-Series Schema                      │
└──────────────────────────────────────────────────────────────────────────┘

                           ┌─────────────────┐
                           │     Tenant      │
                           │─────────────────│
                           │ id (PK)         │
                           │ name            │
                           │ industry        │
                           │ createdAt       │
                           │ updatedAt       │
                           └─────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌─────────────────┐          ┌─────────────────┐
          │      User       │          │   Integration   │
          │─────────────────│          │─────────────────│
          │ id (PK)         │          │ id (PK)         │
          │ tenantId (FK)   │          │ tenantId (FK)   │
          │ email (UQ)      │          │ provider        │
          │ role (ENUM)     │          │ status (ENUM)   │
          │ createdAt       │          │ accessToken ⚿   │
          │ updatedAt       │          │ refreshToken ⚿  │
          └─────────────────┘          │ expiresAt       │
                                       │ metadata (JSON) │
                                       │ lastSyncAt      │
                                       │ createdAt       │
                                       │ updatedAt       │
                                       └─────────────────┘


                           ┌─────────────────┐
                           │    ClientKPI    │
                           │─────────────────│
                           │ id (PK)         │
                           │ tenantId (FK)   │
                           │ clientId        │
                           │ clientName      │
                           │ industry        │
                           │ createdAt       │
                           │ updatedAt       │
                           └─────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
          ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
          │  Financial  │  │  LeadEvent  │  │CustomMetric │
          │─────────────│  │─────────────│  │─────────────│
          │ id (PK)     │  │ id (PK)     │  │ id (PK)     │
          │clientKPIId  │  │clientKPIId  │  │clientKPIId  │
          │   (FK)      │  │   (FK)      │  │   (FK)      │
          │recordDate ⏱ │  │eventDate ⏱  │  │metricName   │
          │revenue ($)  │  │leadId       │  │metricValue  │
          │expenses ($) │  │stage        │  │unit         │
          │netProfit ($)│  │value ($)    │  │recordDate ⏱ │
          │cashFlow ($) │  │status       │  │sourceSystem │
          │currency     │  │sourceSystem │  │metadata(JSON│
          │sourceSystem │  │externalId   │  │embedding 🧠 │
          │externalId   │  │metadata(JSON│  │createdAt    │
          │metadata(JSON│  │createdAt    │  └─────────────┘
          │createdAt    │  └─────────────┘
          └─────────────┘

Legend:
  (PK) = Primary Key
  (FK) = Foreign Key
  (UQ) = Unique Constraint
  ⏱   = Time-series indexed field
  ($) = Financial amount (Decimal)
  ⚿   = Encrypted field (AES-256-GCM)
  🧠  = Vector embedding (pgvector)
```

---

## Table Descriptions

### Core Tables

#### 1. `tenants` (Multi-Tenancy Root)

**Purpose**: Root entity for multi-tenant isolation. Every data record traces back to a tenant.

| Column      | Type            | Constraints             | Description                                            |
| ----------- | --------------- | ----------------------- | ------------------------------------------------------ |
| `id`        | `String` (cuid) | PRIMARY KEY             | Unique tenant identifier                               |
| `name`      | `String`        | NOT NULL                | Company/organization name                              |
| `industry`  | `String?`       | NULLABLE                | Business industry (e.g., "Construction", "E-commerce") |
| `createdAt` | `DateTime`      | NOT NULL, DEFAULT now() | Tenant creation timestamp                              |
| `updatedAt` | `DateTime`      | NOT NULL, auto-updated  | Last modification timestamp                            |

**Indexes**:

- Primary key index on `id` (automatic)

**Row-Level Security**: ❌ Not applicable (root table)

---

#### 2. `users` (Authentication & RBAC)

**Purpose**: Application users with role-based access control.

| Column      | Type              | Constraints                        | Description                        |
| ----------- | ----------------- | ---------------------------------- | ---------------------------------- |
| `id`        | `String` (cuid)   | PRIMARY KEY                        | Unique user identifier             |
| `tenantId`  | `String`          | FOREIGN KEY → tenants.id, NOT NULL | Tenant ownership                   |
| `email`     | `String`          | UNIQUE, NOT NULL                   | User email (login identifier)      |
| `role`      | `UserRole` (ENUM) | NOT NULL, DEFAULT VIEWER           | Access level (ADMIN/EDITOR/VIEWER) |
| `createdAt` | `DateTime`        | NOT NULL, DEFAULT now()            | User creation timestamp            |
| `updatedAt` | `DateTime`        | NOT NULL, auto-updated             | Last modification timestamp        |

**Indexes**:

- Primary key: `id`
- Foreign key: `tenantId` (with index for RLS performance)
- Unique constraint: `email`

**Row-Level Security**: ✅ Yes — Users filtered by `tenantId`

**Enums**:

```prisma
enum UserRole {
  ADMIN   // Full access: manage users, integrations, billing
  EDITOR  // Edit dashboards, view all data
  VIEWER  // Read-only access to dashboards
}
```

---

#### 3. `client_kpis` (Business Entities)

**Purpose**: Represents a customer's business client (e.g., a construction project, e-commerce store).

| Column       | Type            | Constraints                        | Description                                     |
| ------------ | --------------- | ---------------------------------- | ----------------------------------------------- |
| `id`         | `String` (cuid) | PRIMARY KEY                        | Unique identifier                               |
| `tenantId`   | `String`        | FOREIGN KEY → tenants.id, NOT NULL | Tenant ownership                                |
| `clientId`   | `String`        | NOT NULL                           | External client identifier (from source system) |
| `clientName` | `String`        | NOT NULL                           | Human-readable client name                      |
| `industry`   | `String?`       | NULLABLE                           | Client's industry (for segmentation)            |
| `createdAt`  | `DateTime`      | NOT NULL, DEFAULT now()            | Creation timestamp                              |
| `updatedAt`  | `DateTime`      | NOT NULL, auto-updated             | Last modification timestamp                     |

**Indexes**:

- Primary key: `id`
- Foreign key: `tenantId` (critical for RLS)
- Unique constraint: `(tenantId, clientId)` — Prevents duplicate clients per tenant

**Row-Level Security**: ✅ Yes — Filtered by `tenantId`

---

### Time-Series Data Tables

#### 4. `financials` (Financial Metrics)

**Purpose**: Time-series financial data from accounting systems (Xero, MYOB).

| Column         | Type            | Constraints                            | Description                                    |
| -------------- | --------------- | -------------------------------------- | ---------------------------------------------- |
| `id`           | `String` (cuid) | PRIMARY KEY                            | Unique identifier                              |
| `clientKPIId`  | `String`        | FOREIGN KEY → client_kpis.id, NOT NULL | Related business entity                        |
| `recordDate`   | `Date`          | NOT NULL                               | Date of financial record                       |
| `revenue`      | `Decimal(12,2)` | NOT NULL                               | Revenue (AUD)                                  |
| `expenses`     | `Decimal(12,2)` | NOT NULL                               | Operating expenses (AUD)                       |
| `netProfit`    | `Decimal(12,2)` | NOT NULL                               | Net profit (calculated: revenue - expenses)    |
| `cashFlow`     | `Decimal(12,2)` | NOT NULL                               | Cash flow for period (AUD)                     |
| `currency`     | `String`        | NOT NULL, DEFAULT "AUD"                | Currency code                                  |
| `sourceSystem` | `String?`       | NULLABLE                               | Integration source (e.g., "xero", "myob")      |
| `externalId`   | `String?`       | NULLABLE                               | External system record ID (for reconciliation) |
| `metadata`     | `JSON?`         | NULLABLE                               | System-specific fields (flexible schema)       |
| `createdAt`    | `DateTime`      | NOT NULL, DEFAULT now()                | ETL ingestion timestamp                        |

**Indexes**:

- Primary key: `id`
- Composite: `(clientKPIId, recordDate)` — Optimized for time-range queries
- Single: `recordDate` — For cross-client analytics
- Unique constraint: `(clientKPIId, recordDate, sourceSystem)` — Prevents duplicate records

**Row-Level Security**: ✅ Yes — Transitive via `clientKPIId → client_kpis.tenantId`

---

#### 5. `lead_events` (CRM/Sales Pipeline)

**Purpose**: Tracks sales pipeline events from CRM systems (HubSpot, Pipedrive).

| Column         | Type             | Constraints                            | Description                                    |
| -------------- | ---------------- | -------------------------------------- | ---------------------------------------------- |
| `id`           | `String` (cuid)  | PRIMARY KEY                            | Unique identifier                              |
| `clientKPIId`  | `String`         | FOREIGN KEY → client_kpis.id, NOT NULL | Related business entity                        |
| `eventDate`    | `DateTime`       | NOT NULL                               | Event timestamp                                |
| `leadId`       | `String`         | NOT NULL                               | External lead/deal identifier                  |
| `stage`        | `String`         | NOT NULL                               | Pipeline stage (e.g., "qualified", "proposal") |
| `value`        | `Decimal(12,2)?` | NULLABLE                               | Deal value (AUD)                               |
| `status`       | `String`         | NOT NULL                               | Status (e.g., "active", "stale", "lost")       |
| `sourceSystem` | `String?`        | NULLABLE                               | CRM source (e.g., "hubspot", "pipedrive")      |
| `externalId`   | `String?`        | NULLABLE                               | External system record ID                      |
| `metadata`     | `JSON?`          | NULLABLE                               | System-specific fields                         |
| `createdAt`    | `DateTime`       | NOT NULL, DEFAULT now()                | ETL ingestion timestamp                        |

**Indexes**:

- Primary key: `id`
- Composite: `(clientKPIId, eventDate)` — Time-range queries
- Single: `leadId` — Lookup by external lead ID
- Composite: `(stage, status)` — Funnel analysis queries

**Row-Level Security**: ✅ Yes — Transitive via `clientKPIId → client_kpis.tenantId`

---

#### 6. `custom_metrics` (User-Defined KPIs)

**Purpose**: Flexible storage for custom operational metrics and future RAG embeddings.

| Column         | Type            | Constraints                            | Description                                   |
| -------------- | --------------- | -------------------------------------- | --------------------------------------------- |
| `id`           | `String` (cuid) | PRIMARY KEY                            | Unique identifier                             |
| `clientKPIId`  | `String`        | FOREIGN KEY → client_kpis.id, NOT NULL | Related business entity                       |
| `metricName`   | `String`        | NOT NULL                               | Metric name (e.g., "project_delivery_days")   |
| `metricValue`  | `Decimal(12,4)` | NOT NULL                               | Metric value (4 decimal precision)            |
| `unit`         | `String?`       | NULLABLE                               | Unit of measurement (e.g., "days", "percent") |
| `recordDate`   | `DateTime`      | NOT NULL                               | Metric measurement date                       |
| `sourceSystem` | `String?`       | NULLABLE                               | Data source (manual upload or integration)    |
| `metadata`     | `JSON?`         | NULLABLE                               | Additional context                            |
| `embedding`    | `vector(1536)?` | NULLABLE                               | OpenAI embedding for RAG (future)             |
| `createdAt`    | `DateTime`      | NOT NULL, DEFAULT now()                | Creation timestamp                            |

**Indexes**:

- Primary key: `id`
- Composite: `(clientKPIId, metricName, recordDate)` — Metric time-series queries

**Row-Level Security**: ✅ Yes — Transitive via `clientKPIId → client_kpis.tenantId`

**Special Field**: `embedding vector(1536)` requires pgvector extension (see [RAG Strategy](./rag-strategy.md))

---

#### 7. `integrations` (OAuth Tokens)

**Purpose**: Stores encrypted OAuth tokens for external system integrations.

| Column         | Type                       | Constraints                        | Description                                    |
| -------------- | -------------------------- | ---------------------------------- | ---------------------------------------------- |
| `id`           | `String` (cuid)            | PRIMARY KEY                        | Unique identifier                              |
| `tenantId`     | `String`                   | FOREIGN KEY → tenants.id, NOT NULL | Tenant ownership                               |
| `provider`     | `String`                   | NOT NULL                           | Integration provider (e.g., "xero", "hubspot") |
| `status`       | `IntegrationStatus` (ENUM) | NOT NULL, DEFAULT PENDING          | Connection status                              |
| `accessToken`  | `Text`                     | NOT NULL                           | **Encrypted** OAuth access token               |
| `refreshToken` | `Text?`                    | NULLABLE                           | **Encrypted** OAuth refresh token              |
| `expiresAt`    | `DateTime?`                | NULLABLE                           | Token expiration timestamp                     |
| `metadata`     | `JSON?`                    | NULLABLE                           | Provider-specific configuration                |
| `lastSyncAt`   | `DateTime?`                | NULLABLE                           | Last successful data sync timestamp            |
| `createdAt`    | `DateTime`                 | NOT NULL, DEFAULT now()            | Connection creation timestamp                  |
| `updatedAt`    | `DateTime`                 | NOT NULL, auto-updated             | Last modification timestamp                    |

**Indexes**:

- Primary key: `id`
- Unique constraint: `(tenantId, provider)` — One integration per provider per tenant
- Foreign key: `tenantId` (for RLS)

**Row-Level Security**: ✅ Yes — Filtered by `tenantId`

**Enums**:

```prisma
enum IntegrationStatus {
  PENDING   // Initial state, not yet authorized
  ACTIVE    // Connected and syncing
  ERROR     // Sync failures (token expired, API error)
  DISABLED  // User manually disconnected
}
```

**Security Note**: `accessToken` and `refreshToken` are encrypted at the application layer using AES-256-GCM before storage. See [Security Architecture](./system-architecture.md#security-architecture).

---

## Relationships & Cardinality

### Primary Relationships

```
Tenant (1) ─────────────── (N) User
  └─ One tenant has many users

Tenant (1) ─────────────── (N) ClientKPI
  └─ One tenant has many business clients

Tenant (1) ─────────────── (N) Integration
  └─ One tenant has many integrations

ClientKPI (1) ─────────────── (N) Financial
  └─ One client has many financial records (time-series)

ClientKPI (1) ─────────────── (N) LeadEvent
  └─ One client has many lead events (CRM history)

ClientKPI (1) ─────────────── (N) CustomMetric
  └─ One client has many custom metrics (time-series)
```

### Cascade Delete Behavior

**All foreign keys use `onDelete: Cascade`** to prevent orphaned records:

- **Delete Tenant** → Cascades to Users, ClientKPIs, Integrations
- **Delete ClientKPI** → Cascades to Financials, LeadEvents, CustomMetrics

**Rationale**: When a tenant is deleted (subscription canceled), all associated data must be removed to comply with data retention policies.

---

## Indexes Strategy

### Index Types

| Index Type            | Purpose                   | Example                                   |
| --------------------- | ------------------------- | ----------------------------------------- |
| **Primary Key**       | Unique row identifier     | `id` on all tables                        |
| **Foreign Key**       | Relationship joins, RLS   | `tenantId`, `clientKPIId`                 |
| **Unique Constraint** | Business rule enforcement | `(tenantId, provider)` on integrations    |
| **Composite**         | Multi-column queries      | `(clientKPIId, recordDate)` on financials |
| **Single Column**     | High-cardinality lookups  | `email` on users                          |

### Query-Driven Index Design

**Financial Time-Range Query**:

```sql
-- Query pattern: Dashboard fetching last 90 days of financial data
SELECT * FROM financials
WHERE client_kpi_id = 'client_123'
  AND record_date BETWEEN '2025-01-01' AND '2025-03-31';

-- Optimized by: @@index([clientKPIId, recordDate])
```

**Sales Funnel Analysis**:

```sql
-- Query pattern: Count deals by stage and status
SELECT stage, status, COUNT(*), SUM(value)
FROM lead_events
WHERE client_kpi_id = 'client_123'
GROUP BY stage, status;

-- Optimized by: @@index([stage, status])
```

**Custom Metric Lookup**:

```sql
-- Query pattern: Fetch specific metric over time
SELECT * FROM custom_metrics
WHERE client_kpi_id = 'client_123'
  AND metric_name = 'project_delivery_days'
  AND record_date >= '2025-01-01'
ORDER BY record_date;

-- Optimized by: @@index([clientKPIId, metricName, recordDate])
```

---

## Data Flow Patterns

### ETL Ingestion Flow

```
┌─────────────┐
│   Xero API  │───┐
└─────────────┘   │
                  │
┌─────────────┐   │      ┌──────────────┐      ┌──────────────┐
│ HubSpot API │───┼─────→│  pipeline services ETL     │─────→│  PostgreSQL  │
└─────────────┘   │      │  Workflows   │      │  (Supabase)  │
                  │      └──────────────┘      └──────────────┘
┌─────────────┐   │              │                     │
│  Asana API  │───┘              │                     │
└─────────────┘                  ▼                     ▼
                        ┌────────────────┐    ┌────────────────┐
                        │  Transform &   │    │  Prisma ORM    │
                        │  Normalize     │    │  API Layer     │
                        │  - Dates (UTC) │    └────────────────┘
                        │  - Currency    │             │
                        │  - Dedup       │             ▼
                        └────────────────┘    ┌────────────────┐
                                              │   Dashboard    │
                                              │   (Next.js)    │
                                              └────────────────┘
```

**Key Steps**:

1. **Extract**: pipeline services scheduled workflows pull data from external APIs (OAuth authenticated)
2. **Transform**: Custom TypeScript nodes normalize dates, convert currencies, calculate derived metrics
3. **Load**: Upsert into PostgreSQL using unique constraints to prevent duplicates
4. **Serve**: API layer reads via Prisma with tenant isolation enforced by RLS
5. **Display**: Next.js dashboard renders Visx charts from API data

---

## Schema Evolution

### Version Tracking

**Current Schema Version**: 1.0 (MVP)

**Future Enhancements** (Post-MVP):

| Version | Changes                                          | Rationale                                     | Phase                        |
| ------- | ------------------------------------------------ | --------------------------------------------- | ---------------------------- |
| **1.1** | Add `audit_logs` table                           | Track user actions for compliance             | Phase 4 (Operationalization) |
| **1.2** | Add `alerts` table                               | Store alert history and configuration         | Phase 3 (Visualization)      |
| **1.3** | Add `dashboards` table                           | Support multiple custom dashboards per tenant | Post-MVP (Month 6)           |
| **1.4** | Partition `financials` by month                  | Optimize query performance at 500+ customers  | Year 2 (Scale)               |
| **2.0** | Add `vector_index` on `custom_metrics.embedding` | Enable RAG semantic search                    | Year 2 (RAG feature)         |

### Backward Compatibility

**Policy**: Zero backward compatibility required. Schema changes are forward-only (no rollbacks).

**Rationale**: Git history provides versioning. Database migrations are one-way. Failed migrations require manual rollback via backup restore.

See [Database Migrations Strategy](./database-migrations.md) for detailed migration procedures.

---

## Related Documentation

- [System Architecture - Data Architecture](./system-architecture.md#data-architecture)
- [Row-Level Security Policies](./row-level-security-policies.md)
- [Database Migrations Strategy](./database-migrations.md)
- [RAG Strategy (pgvector)](./rag-strategy.md)
- [Database Monitoring](./database-monitoring.md)
- [Phase 1 Implementation Plan](../implementation/phase-1-data-foundation.md)

---

**Document End**

**Review Cycle**: After each schema change or migration
**Next Review**: 2025-11-15 (Post-Phase 1 completion)
**Change History**:

- 2025-10-15: Initial version (v1.0) - MVP schema documented

**Approval**:

- Database Architect: [Founder Name] - Approved 2025-10-15
