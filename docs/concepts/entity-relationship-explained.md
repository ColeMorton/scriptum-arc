# Entity Relationship Explained: Tenant, User, and Client

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Business Architecture
**Status**: Reference Guide

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
- **TENANT** = A company that subscribes to Scriptum Arc (your customer)
- **USER** = An employee of that company who logs into the platform
- **CLIENT** = A business entity or project that the company tracks metrics for

**Business Model**: Scriptum Arc is a **B2B SaaS platform**. Each tenant pays for the service and invites their own users to track their own clients' performance.

---

## Detailed Explanation

### 1. Tenant (The Company Account)

**Definition**: A **Tenant** is a company or organization that subscribes to Scriptum Arc.

**Business Context**:
- This is **Scriptum Arc's customer** (the entity that pays the subscription fee)
- Each tenant has their own **isolated data environment** (multi-tenant architecture)
- Tenants cannot see each other's data (enforced by Row-Level Security)

**Database Entity**: `Tenant` table
- Fields: `id`, `name`, `industry`, `createdAt`, `updatedAt`
- Root entity for all tenant-scoped data

**Examples**:
- ABC Construction Pty Ltd (tenant_id: `tenant_001`)
- Sydney Property Group (tenant_id: `tenant_002`)
- Melbourne Marketing Agency (tenant_id: `tenant_003`)

**Lifecycle**:
- Created when a company signs up for Scriptum Arc
- Cannot be deleted while active users or data exist (cascade protection)
- Deactivation triggers data retention policies

---

### 2. User (The Employee)

**Definition**: A **User** is an individual employee of a tenant company who has access to the Scriptum Arc platform.

**Business Context**:
- This is **NOT** Scriptum Arc's customer (the tenant is the customer)
- This is an **employee** of the tenant company
- Users belong to exactly one tenant (no cross-tenant user accounts)
- Users have role-based permissions: ADMIN, EDITOR, VIEWER

**Database Entity**: `User` table
- Fields: `id`, `tenantId`, `email`, `role`, `createdAt`, `updatedAt`
- Each user is scoped to a single tenant via `tenantId` foreign key

**Examples** (within ABC Construction):
- Sarah Chen (sarah@abcconstruction.com.au) - Role: ADMIN
- John Smith (john@abcconstruction.com.au) - Role: EDITOR
- Emma Brown (emma@abcconstruction.com.au) - Role: VIEWER

**User Roles**:
- **ADMIN**: Full access (manage users, integrations, data)
- **EDITOR**: Can modify data, view reports, but cannot manage users
- **VIEWER**: Read-only access to dashboards and reports

**Lifecycle**:
- Created when a tenant ADMIN invites a new team member
- Authentication via email/password (Supabase Auth)
- Deletion cascades: User deleted → all their audit logs archived

---

### 3. Client (The Business Entity or Project Being Tracked)

**Definition**: A **Client** (technically `ClientKPI` in the database) is a business entity, customer, or project that the tenant company is tracking performance metrics for.

**Business Context**:
- This is **NOT** Scriptum Arc's customer (Scriptum Arc's customer is the Tenant)
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
│                      SCRIPTUM ARC PLATFORM                     │
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
- Scriptum Arc : Tenant = **1 : N** (one platform, many customers)
- Tenant : User = **1 : N** (one company, many employees)
- Tenant : Client = **1 : N** (one company, many clients/projects)
- Client : Financials = **1 : N** (one client, many time-series financial records)
- Client : LeadEvents = **1 : N** (one client, many lead conversion events)
- Client : CustomMetrics = **1 : N** (one client, many custom KPI measurements)

**Data Isolation**: Each tenant's data is completely isolated via PostgreSQL Row-Level Security (RLS). Sarah (ABC Construction) can NEVER see Michael's data (Sydney Property), even if they query the same database tables.

---

## Real-World Scenario

### ABC Construction Pty Ltd (Tenant)

**Context**: ABC Construction is a mid-sized Australian construction company that subscribes to Scriptum Arc to track profitability across their multiple projects.

**Tenant Details**:
- **Tenant Name**: ABC Construction Pty Ltd
- **Industry**: Construction
- **Subscription Plan**: Professional (50 users, 200 clients)
- **Tenant ID**: `tenant_001`

---

### Users (Employees at ABC Construction)

**1. Sarah Chen - Operations Director (ADMIN)**
- **Email**: sarah@abcconstruction.com.au
- **Role**: ADMIN
- **Permissions**:
  - Invite new users (John, Emma)
  - Configure integrations (Xero, HubSpot)
  - Delete clients/projects
  - View all dashboards and reports

**2. John Smith - Project Manager (EDITOR)**
- **Email**: john@abcconstruction.com.au
- **Role**: EDITOR
- **Permissions**:
  - Add new clients/projects
  - Update financial data manually
  - Create custom metrics
  - View all dashboards and reports
  - **CANNOT**: Invite users or configure integrations

**3. Emma Brown - Finance Analyst (VIEWER)**
- **Email**: emma@abcconstruction.com.au
- **Role**: VIEWER
- **Permissions**:
  - View dashboards and reports
  - Export data to CSV
  - **CANNOT**: Modify data, add clients, or configure settings

---

### Clients (Projects Being Tracked)

**Client 1: Harbor Bridge Renovation Project**
- **Client ID**: `HBR-2024-001` (external identifier from Xero)
- **Client Name**: Harbor Bridge Renovation
- **Industry**: Infrastructure
- **Currency**: AUD
- **Status**: Active
- **Data Tracked**:
  - **Financials**: Monthly revenue ($2.5M), expenses ($1.8M), profit ($700K)
  - **Lead Events**: Initial consultation (2024-01-15), contract signed (2024-02-10)
  - **Custom Metrics**:
    - "Construction Milestones Completed" (15 out of 20)
    - "Safety Incidents" (0 in past 90 days)

**Client 2: Bondi Residential Development**
- **Client ID**: `BRD-2024-002`
- **Client Name**: Bondi Residential Development
- **Industry**: Residential Construction
- **Currency**: AUD
- **Status**: Active
- **Data Tracked**:
  - **Financials**: Monthly revenue ($1.2M), expenses ($950K), profit ($250K)
  - **Lead Events**: Pre-sale consultation (2024-03-01), deposit received (2024-03-20)
  - **Custom Metrics**:
    - "Units Sold" (8 out of 12)
    - "Customer Satisfaction Score" (4.7/5.0)

**Client 3: Sydney CBD Office Fit-Out**
- **Client ID**: `SCO-2024-003`
- **Client Name**: Sydney CBD Office Fit-Out
- **Industry**: Commercial Construction
- **Currency**: AUD
- **Status**: Completed
- **Data Tracked**:
  - **Financials**: Total revenue ($800K), expenses ($600K), profit ($200K)
  - **Lead Events**: Initial inquiry (2024-01-05), proposal sent (2024-01-12), contract signed (2024-01-20)
  - **Custom Metrics**:
    - "Project Completion Rate" (100%)
    - "Delivered On-Time" (Yes)

---

### User Workflows

**Workflow 1: Sarah (ADMIN) adds John (EDITOR)**

1. Sarah logs into Scriptum Arc (authenticated as `tenant_001`)
2. Navigates to "Team Management" → "Invite User"
3. Enters John's email: `john@abcconstruction.com.au`
4. Assigns role: **EDITOR**
5. System creates `User` record:
   ```prisma
   {
     id: "user_002",
     tenantId: "tenant_001",  // Scoped to ABC Construction
     email: "john@abcconstruction.com.au",
     role: "EDITOR",
   }
   ```
6. John receives invitation email and sets password

**Workflow 2: John (EDITOR) adds a new client**

1. John logs into Scriptum Arc (authenticated as `tenant_001`)
2. Navigates to "Clients" → "Add Client"
3. Enters details:
   - Client Name: "Parramatta Warehouse Conversion"
   - External ID: `PWC-2024-004`
   - Industry: "Commercial Construction"
   - Currency: "AUD"
4. System creates `ClientKPI` record:
   ```prisma
   {
     id: "ckpi_004",
     tenantId: "tenant_001",  // Scoped to ABC Construction
     clientId: "PWC-2024-004",
     clientName: "Parramatta Warehouse Conversion",
     industry: "Commercial Construction",
     currency: "AUD",
   }
   ```
5. System syncs financial data from Xero integration (if configured)

**Workflow 3: Emma (VIEWER) generates a profitability report**

1. Emma logs into Scriptum Arc (authenticated as `tenant_001`)
2. Navigates to "Reports" → "Client Profitability"
3. Selects date range: Q1 2024 (Jan 1 - Mar 31)
4. System queries financials:
   ```sql
   SELECT ck.client_name, SUM(f.revenue) as total_revenue, SUM(f.expenses) as total_expenses
   FROM client_kpis ck
   JOIN financials f ON ck.id = f.client_kpi_id
   WHERE ck.tenant_id = 'tenant_001'  -- RLS enforces this automatically
     AND f.record_date BETWEEN '2024-01-01' AND '2024-03-31'
   GROUP BY ck.client_name;
   ```
5. Emma views report showing:
   - Harbor Bridge: $7.5M revenue, $5.4M expenses, $2.1M profit
   - Bondi Residential: $3.6M revenue, $2.85M expenses, $750K profit
   - Sydney CBD Office: $800K revenue, $600K expenses, $200K profit
6. Emma exports report to CSV (read-only action)

---

## FAQ: Common Confusions

### Q1: Is a "Client" the same as a "Customer"?

**Answer**: It depends on context:
- **Scriptum Arc's customer**: The **Tenant** (ABC Construction pays Scriptum Arc subscription fees)
- **Tenant's customer**: The **Client** (Harbor Bridge Project is ABC Construction's customer/project)

**Best Practice**: Always specify whose customer you're referring to:
- ✅ "Scriptum Arc's customer = Tenant"
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

**Rationale**: Per [Global Development Standards](~/.claude/CLAUDE.md):
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
- **`id`**: Scriptum Arc's internal primary key (e.g., `"ckpi_001"`)
- **`clientId`**: External identifier from integration (e.g., Xero customer ID: `"XERO-12345"`)

**Use Cases**:
- `id`: Used for database relationships (foreign keys in `financials`, `lead_events`)
- `clientId`: Used for API syncing (matching Xero invoices to Scriptum Arc clients)

**Example**:
```prisma
model ClientKPI {
  id       String  @id @default(cuid())        // Internal: "ckpi_001"
  clientId String                               // External: "XERO-12345"
}
```

---

### Q7: Who is the "owner" of the data in Scriptum Arc?

**Answer**: The **Tenant** owns all data within their account.

**Ownership Hierarchy**:
1. **Tenant** owns:
   - All `User` records (employees they invited)
   - All `ClientKPI` records (clients/projects they added)
   - All time-series data (`Financials`, `LeadEvents`, `CustomMetrics`)
   - All `Integration` credentials (Xero, HubSpot API tokens)

2. **Scriptum Arc** owns:
   - Platform infrastructure (servers, databases)
   - Application code
   - Aggregated anonymized analytics (for product improvement)

**Data Portability**: Tenants can export all their data via API or CSV. Scriptum Arc cannot access tenant data for commercial purposes without explicit consent.

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
// Root entity: Scriptum Arc's customer
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
    const tenantA = await createTenant({ name: 'ABC Construction' });
    const tenantB = await createTenant({ name: 'Sydney Property' });

    const userA = await createUser({ tenantId: tenantA.id, email: 'sarah@abc.com' });
    const clientB = await createClient({ tenantId: tenantB.id, clientName: 'Bondi Project' });

    // Authenticate as userA (tenant_001)
    const session = await authenticate(userA);

    // Attempt to access tenant_002's client
    const result = await db.clientKPI.findUnique({
      where: { id: clientB.id },
    });

    expect(result).toBeNull();  // RLS blocks access
  });
});
```

---

## Related Documentation

**Business Context**:
- [Product Requirements Document](../product/product-requirements-document.md) - Business objectives and user stories
- [Product Specification](../specs/product-specification.md) - Feature definitions

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
