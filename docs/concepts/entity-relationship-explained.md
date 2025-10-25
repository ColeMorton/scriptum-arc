# Entity Relationship Explained: Zixly Internal Operations

**Version**: 2.1
**Last Updated**: 2025-01-27
**Owner**: Business Architecture
**Status**: Internal Operations Guide

---

## BUSINESS MODEL CLARIFICATION

**Zixly is an open-source internal operations platform for the Zixly service business.**

This platform:

- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with the self-hostable SME stack
- Provides authentic expertise and continuous improvement
- Is open-source for demonstration and reuse purposes

**Zixly is NOT a multi-tenant SaaS platform for external customers.**

---

## Table of Contents

1. [Quick Summary](#quick-summary)
2. [Detailed Explanation](#detailed-explanation)
3. [Visual Hierarchy](#visual-hierarchy)
4. [Real-World Scenario](#real-world-scenario)
5. [FAQ: Common Confusions](#faq-common-confusions)
6. [Technical Implementation](#technical-implementation)

---

## Quick Summary

**Three-Second Version**:

- **TENANT** = Zixly organization (the service business itself)
- **USER** = Zixly team members (cole@zixly.com.au, support@zixly.com.au)
- **CLIENT** = Service clients (businesses using Zixly for pipeline services automation)

**Business Model**: Zixly is a **service business** that uses its own platform to track service delivery operations, demonstrating "eating our own dogfood" with the self-hostable SME stack.

### What This Means:

1. **Single Tenant**: Only Zixly organization data
2. **Internal Users**: Only Zixly team members
3. **Service Clients**: Businesses that hire Zixly for pipeline services automation services
4. **Open-Source**: Code available for demonstration and reuse
5. **Dogfooding**: Using our own tools to run our business

---

## Detailed Explanation

### 1. Tenant (Zixly Organization)

**Definition**: The **Tenant** represents the Zixly service business itself.

**Business Context**:

- This is **Zixly's own organization** (the service business)
- Single tenant for internal operations (Zixly organization)
- All data is Zixly's internal business operations

**Database Entity**: `Tenant` table

- Fields: `id`, `name` ("Zixly"), `industry` ("pipeline services Automation Services"), `createdAt`, `updatedAt`
- Root entity for all Zixly internal operations data

**Examples**:

- Zixly (tenant_id: `zixly-org-001`)
- Industry: "pipeline services Automation Services"
- Single tenant for all Zixly internal operations

**Lifecycle**:

- Represents the Zixly service business organization
- Contains all Zixly internal operations data
- Single tenant for all Zixly business operations
- Deactivation triggers data retention policies

---

### 2. User (Zixly Team Members)

**Definition**: A **User** is a Zixly team member who has access to the internal operations platform.

**Business Context**:

- These are **Zixly team members** (employees of the Zixly service business)
- Users belong to the Zixly organization (single tenant)
- Users have role-based permissions: ADMIN, EDITOR, VIEWER
- All users access Zixly internal operations data

**Database Entity**: `User` table

- Fields: `id`, `tenantId`, `email`, `role`, `createdAt`, `updatedAt`
- Each user is scoped to the Zixly tenant via `tenantId` foreign key

**Examples** (Zixly team members):

- Cole (cole@zixly.com.au) - Role: ADMIN
- Support (support@zixly.com.au) - Role: EDITOR

**User Roles**:

- **ADMIN**: Full access (manage users, integrations, all Zixly data)
- **EDITOR**: Can modify data, view reports, but cannot manage users
- **VIEWER**: Read-only access to Zixly internal operations dashboards

**Lifecycle**:

- Created when Zixly team members are added to the platform
- Authentication via email/password (Supabase Auth)
- All users access Zixly internal operations data

---

### 3. Client (The Business Entity or Project Being Tracked)

**Definition**: A **Client** (technically `ClientKPI` in the database) is a business entity, customer, or project that the tenant company is tracking performance metrics for.

**Business Context**:

- This is **NOT** Zixly's customer (Zixly's customer is the Tenant)
- This is the **tenant's customer or project**
- A tenant can have multiple clients (1:N relationship)
- Each client has time-series data: financials, lead events, custom metrics

**Database Entity**: `ClientKPI` table

- Fields: `id`, `tenantId`, `clientId`, `clientName`, `industry`, `currency`, `createdAt`, `updatedAt`
- Each client belongs to exactly one tenant via `tenantId` foreign key

**Examples** (within ABC Construction's account):

- Harbor Bridge Renovation Project (clientKPI_id: `ckpi_001`)
- Bondi Residential Development (clientKPI_id: `ckpi_002`)
- Sydney CBD Office Fit-Out (clientKPI_id: `ckpi_003`)

**Associated Data**:

- **Financials**: Revenue, expenses, profit for each client/project
- **Lead Events**: Lead generation, conversion events
- **Custom Metrics**: Project-specific KPIs (e.g., "Construction Milestones Completed")

**Lifecycle**:

- Created when a tenant adds a new client/project to track
- Updated as financial and lead data is synced from integrations (Xero, HubSpot)
- Deletion cascades: ClientKPI deleted → all financials, lead events, and custom metrics for that client are also deleted

---

## Visual Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                      ZIXLY PLATFORM                     │
│                         (The Product)                          │
└────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐
    │  TENANT #1         │          │  TENANT #2         │
    │  ABC Construction  │          │  Sydney Property   │
    │  (The Customer)    │          │  (The Customer)    │
    └────────────────────┘          └────────────────────┘
                │                               │
    ┌───────────┴────────────┐                 │
    │                        │                 │
    ▼                        ▼                 ▼
┌──────────┐          ┌──────────┐      ┌──────────┐
│ USER #1  │          │ USER #2  │      │ USER #3  │
│ Sarah    │          │ John     │      │ Michael  │
│ (Admin)  │          │ (Editor) │      │ (Admin)  │
└──────────┘          └──────────┘      └──────────┘
                │
    ┌───────────┴────────────┐
    │                        │
    ▼                        ▼
┌──────────┐          ┌──────────┐
│ CLIENT 1 │          │ CLIENT 2 │
│ Harbor   │          │ Bondi    │
│ Bridge   │          │ Resi Dev │
│ (Project)│          │ (Project)│
└──────────┘          └──────────┘
    │                        │
    ▼                        ▼
┌──────────┐          ┌──────────┐
│Financials│          │Financials│
│LeadEvents│          │LeadEvents│
│CustomKPIs│          │CustomKPIs│
└──────────┘          └──────────┘
```

**Cardinalities**:

- Zixly : Tenant = **1 : N** (one platform, many customers)
- Tenant : User = **1 : N** (one company, many employees)
- Tenant : Client = **1 : N** (one company, many clients/projects)
- Client : Financials = **1 : N** (one client, many time-series financial records)
- Client : LeadEvents = **1 : N** (one client, many lead conversion events)
- Client : CustomMetrics = **1 : N** (one client, many custom KPI measurements)

**Data Isolation**: Each tenant's data is completely isolated via PostgreSQL Row-Level Security (RLS). Sarah (ABC Construction) can NEVER see Michael's data (Sydney Property), even if they query the same database tables.

---

## Real-World Scenario

### Zixly Service Business (Tenant)

**Context**: Zixly is a service business that provides pipeline services automation services to clients. This platform tracks Zixly's internal service delivery operations.

**Tenant Details**:

- **Tenant Name**: Zixly
- **Industry**: pipeline services Automation Services
- **Business Model**: Service provider (not SaaS)
- **Tenant ID**: `zixly-org-001`

---

### Users (Zixly Team Members)

**1. Cole Morton - Founder (ADMIN)**

- **Email**: cole@zixly.com.au
- **Role**: ADMIN
- **Permissions**:
  - Full access to all Zixly internal operations
  - Configure integrations (Xero, HubSpot, etc.)
  - Manage team members
  - View all dashboards and reports

**2. Support Team - Operations (EDITOR)**

- **Email**: support@zixly.com.au
- **Role**: EDITOR
- **Permissions**:
  - Track service client projects
  - Update financial data
  - Create custom metrics for service delivery
  - View all dashboards and reports
  - **CANNOT**: Manage team members or configure integrations

---

### Clients (Zixly's Service Clients)

**Client 1: Harbor Bridge Construction Project**

- **Client ID**: `HBC-2024-001` (external identifier from Xero)
- **Client Name**: Harbor Bridge Construction
- **Industry**: Construction
- **Currency**: AUD
- **Status**: Active Service Client
- **Data Tracked**:
  - **Financials**: Zixly revenue from this client ($15K/month), expenses ($8K), profit ($7K)
  - **Lead Events**: Initial consultation (2024-01-15), contract signed (2024-02-10)
  - **Custom Metrics**:
    - "Billable Hours" (120 hours/month)
    - "Project Velocity" (85% on-time delivery)
    - "Client Satisfaction" (4.8/5.0)

**Client 2: Bondi E-commerce Store**

- **Client ID**: `BES-2024-002`
- **Client Name**: Bondi E-commerce Store
- **Industry**: E-commerce
- **Currency**: AUD
- **Status**: Active Service Client
- **Data Tracked**:
  - **Financials**: Zixly revenue ($8K/month), expenses ($4K), profit ($4K)
  - **Lead Events**: Discovery call (2024-03-01), proposal accepted (2024-03-20)
  - **Custom Metrics**:
    - "Automation Workflows" (12 active)
    - "Data Sync Accuracy" (99.2%)
    - "Client Retention" (12 months)

**Client 3: Sydney Law Firm**

- **Client ID**: `SLF-2024-003`
- **Client Name**: Sydney Law Firm
- **Industry**: Professional Services
- **Currency**: AUD
- **Status**: Completed Project
- **Data Tracked**:
  - **Financials**: Total Zixly revenue ($25K), expenses ($12K), profit ($13K)
  - **Lead Events**: Initial inquiry (2024-01-05), proposal sent (2024-01-12), contract signed (2024-01-20)
  - **Custom Metrics**:
    - "Project Completion Rate" (100%)
    - "Delivered On-Time" (Yes)
    - "Client Satisfaction" (5.0/5.0)

---

### User Workflows

**Workflow 1: Cole (ADMIN) adds Support Team (EDITOR)**

1. Cole logs into Zixly (authenticated as `zixly-org-001`)
2. Navigates to "Team Management" → "Invite User"
3. Enters support email: `support@zixly.com.au`
4. Assigns role: **EDITOR**
5. System creates `User` record:
   ```prisma
   {
     id: "user_002",
     tenantId: "zixly-org-001",  // Scoped to Zixly organization
     email: "support@zixly.com.au",
     role: "EDITOR",
   }
   ```
6. Support team receives invitation email and sets password

**Workflow 2: Support Team (EDITOR) adds a new service client**

1. Support team logs into Zixly (authenticated as `zixly-org-001`)
2. Navigates to "Service Clients" → "Add Client"
3. Enters details:
   - Client Name: "Melbourne Accounting Firm"
   - External ID: `MAF-2024-004`
   - Industry: "Professional Services"
   - Currency: "AUD"
4. System creates `ClientKPI` record:
   ```prisma
   {
     id: "ckpi_004",
     tenantId: "zixly-org-001",  // Scoped to Zixly organization
     clientId: "MAF-2024-004",
     clientName: "Melbourne Accounting Firm",
     industry: "Professional Services",
     currency: "AUD",
   }
   ```
5. System syncs financial data from Xero integration (if configured)

**Workflow 3: Cole (ADMIN) generates service delivery profitability report**

1. Cole logs into Zixly (authenticated as `zixly-org-001`)
2. Navigates to "Reports" → "Service Delivery Profitability"
3. Selects date range: Q1 2024 (Jan 1 - Mar 31)
4. System queries financials:
   ```sql
   SELECT ck.client_name, SUM(f.revenue) as total_revenue, SUM(f.expenses) as total_expenses
   FROM client_kpis ck
   JOIN financials f ON ck.id = f.client_kpi_id
   WHERE ck.tenant_id = 'zixly-org-001'  -- RLS enforces this automatically
     AND f.record_date BETWEEN '2024-01-01' AND '2024-03-31'
   GROUP BY ck.client_name;
   ```
5. Cole views report showing:
   - Harbor Bridge Construction: $45K revenue, $24K expenses, $21K profit
   - Bondi E-commerce: $24K revenue, $12K expenses, $12K profit
   - Sydney Law Firm: $25K revenue, $12K expenses, $13K profit
6. Cole exports report to CSV for business analysis

---

## FAQ: Common Confusions

### Q1: Is a "Client" the same as a "Customer"?

**Answer**: It depends on context:

- **Zixly's customer**: The **Tenant** (ABC Construction pays Zixly subscription fees)
- **Tenant's customer**: The **Client** (Harbor Bridge Project is ABC Construction's customer/project)

**Best Practice**: Always specify whose customer you're referring to:

- ✅ "Zixly's customer = Tenant"
- ✅ "ABC Construction's customer = Client"
- ❌ "Customer" (ambiguous)

---

### Q2: Can a User belong to multiple Tenants?

**Answer**: **No**. Each user belongs to exactly **one tenant**.

**Rationale**: Multi-tenant SaaS architecture enforces strict data isolation. If someone works for two companies (e.g., consultant), they must have two separate accounts:

- `sarah@abcconstruction.com.au` (Tenant: ABC Construction)
- `sarah@consultingfirm.com.au` (Tenant: Consulting Firm)

**Why**: This simplifies Row-Level Security (RLS) and prevents accidental data leaks.

---

### Q3: Why is the table called `ClientKPI` and not just `Client`?

**Answer**: Naming reflects business purpose:

- **ClientKPI**: Emphasizes that this table stores **KPI tracking data** for clients
- **Semantics**: "We're tracking this client's KPIs" (financials, lead events, custom metrics)

**Historical Context**: The product focuses on **performance metrics**, not CRM functionality. If this were a CRM, the table would be named `Client` or `Contact`.

---

### Q4: What happens when a Tenant deletes a Client?

**Answer**: **Cascade delete** (fail-fast approach):

1. ClientKPI record deleted
2. All associated **Financials** deleted
3. All associated **LeadEvents** deleted
4. All associated **CustomMetrics** deleted
5. Deletion is **irreversible** (no soft deletes)

**Rationale**: Per Global Development Standards:

> No backwards compatibility whatsoever, as that is completely out of scope and handled by git.

**Best Practice**: Backups are handled at the infrastructure layer (Supabase daily snapshots). No application-level rollback mechanisms.

---

### Q5: Can a Client belong to multiple Tenants?

**Answer**: **No**. Each client belongs to exactly **one tenant**.

**Example**: If ABC Construction and Sydney Property both work on "Harbor Bridge Project", they would each create separate `ClientKPI` records:

- ABC Construction's view: `clientKPIId: "ckpi_001"`, `tenantId: "tenant_001"`, `clientName: "Harbor Bridge Renovation"`
- Sydney Property's view: `clientKPIId: "ckpi_099"`, `tenantId: "tenant_002"`, `clientName: "Harbor Bridge Renovation"`

**Why**: Data isolation prevents cross-contamination. Each tenant tracks their own version of the project.

---

### Q6: What's the difference between `clientId` and `id` in the ClientKPI table?

**Answer**:

- **`id`**: Zixly's internal primary key (e.g., `"ckpi_001"`)
- **`clientId`**: External identifier from integration (e.g., Xero customer ID: `"XERO-12345"`)

**Use Cases**:

- `id`: Used for database relationships (foreign keys in `financials`, `lead_events`)
- `clientId`: Used for API syncing (matching Xero invoices to Zixly clients)

**Example**:

```prisma
model ClientKPI {
  id       String  @id @default(cuid())        // Internal: "ckpi_001"
  clientId String                               // External: "XERO-12345"
}
```

---

### Q7: Who is the "owner" of the data in Zixly?

**Answer**: The **Tenant** owns all data within their account.

**Ownership Hierarchy**:

1. **Tenant** owns:
   - All `User` records (employees they invited)
   - All `ClientKPI` records (clients/projects they added)
   - All time-series data (`Financials`, `LeadEvents`, `CustomMetrics`)
   - All `Integration` credentials (Xero, HubSpot API tokens)

2. **Zixly** owns:
   - Platform infrastructure (servers, databases)
   - Application code
   - Aggregated anonymized analytics (for product improvement)

**Data Portability**: Tenants can export all their data via API or CSV. Zixly cannot access tenant data for commercial purposes without explicit consent.

---

### Q8: What happens when a User leaves the company?

**Answer**: ADMIN can **deactivate** or **delete** the user:

**Option 1: Soft Deactivation** (Post-MVP):

- Set `user.status = "INACTIVE"`
- User cannot log in
- Historical audit logs preserved

**Option 2: Hard Delete** (MVP):

- Delete `User` record
- Cascade: All audit logs archived to cold storage
- User's email freed for re-invitation

**Best Practice**: Deactivate rather than delete to preserve audit trail (compliance requirement).

---

## Technical Implementation

### Database Schema (Prisma)

```prisma
// Root entity: Zixly's customer
model Tenant {
  id              String   @id @default(cuid())
  name            String
  industry        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  clientKPIs      ClientKPI[]
  users           User[]
  integrations    Integration[]

  @@map("tenants")
}

// Employee of a tenant company
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

// Tenant's customer/project
model ClientKPI {
  id              String   @id @default(cuid())
  tenantId        String
  clientId        String
  clientName      String
  industry        String?
  currency        String   @default("AUD")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  financials      Financial[]
  leadEvents      LeadEvent[]
  customMetrics   CustomMetric[]

  @@unique([tenantId, clientId])
  @@index([tenantId])
  @@map("client_kpis")
}
```

### Row-Level Security (RLS)

**Isolation Enforcement**:

```sql
-- Set tenant context on login
SET app.tenant_id = 'tenant_001';

-- RLS policy ensures Sarah (ABC Construction) only sees ABC's data
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::text);

CREATE POLICY tenant_isolation_clients ON client_kpis
  USING (tenant_id = current_setting('app.tenant_id', true)::text);

-- Even if Sarah tries to query tenant_002's data, RLS blocks it
SELECT * FROM client_kpis WHERE tenant_id = 'tenant_002';
-- Returns: 0 rows (RLS filtering applied transparently)
```

**Testing Isolation**:

```typescript
// Test: User from Tenant A cannot access Tenant B's data
describe('Multi-tenant isolation', () => {
  it('prevents cross-tenant data access', async () => {
    const tenantA = await createTenant({ name: 'ABC Construction' })
    const tenantB = await createTenant({ name: 'Sydney Property' })

    const userA = await createUser({ tenantId: tenantA.id, email: 'sarah@abc.com' })
    const clientB = await createClient({ tenantId: tenantB.id, clientName: 'Bondi Project' })

    // Authenticate as userA (tenant_001)
    const session = await authenticate(userA)

    // Attempt to access tenant_002's client
    const result = await db.clientKPI.findUnique({
      where: { id: clientB.id },
    })

    expect(result).toBeNull() // RLS blocks access
  })
})
```

---

## Related Documentation

**Business Context**:

- [Business Model](../business/business-model.md) - Business objectives and service strategy
- [Service Catalog](../services/service-catalog.md) - Service definitions and deliverables

**Technical Schema**:

- [Database Schema Diagram](../architecture/database-schema-diagram.md) - Complete ERD with all 7 tables
- [System Architecture - Data Architecture](../architecture/system-architecture.md#data-architecture) - PostgreSQL and Prisma setup
- [Row-Level Security Policies](../architecture/row-level-security-policies.md) - RLS DDL and testing

**Operations**:

- [Database Migrations Strategy](../architecture/database-migrations.md) - Prisma workflow
- [Phase 1 Implementation Plan](../implementation/phase-1-data-foundation.md) - Schema implementation tasks

---

**Document End**

**Review Cycle**: Quarterly or after major schema changes
**Next Review**: 2025-12-15
**Change History**:

- 2025-10-15: Initial version (v1.0) - Business-oriented entity relationship guide created

**Approval**:

- Business Architecture: [Founder Name] - Approved 2025-10-15
