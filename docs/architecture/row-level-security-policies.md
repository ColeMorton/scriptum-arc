# Row-Level Security (RLS) Policies

> **Note**: This document describes our internal security architecture and multi-tenant data isolation for pipeline services service implementations. It is maintained for service delivery consistency and technical documentation purposes.

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Database Architecture
**Status**: Service Delivery Infrastructure

---

## Table of Contents

1. [Overview](#overview)
2. [RLS Architecture](#rls-architecture)
3. [Policy Definitions](#policy-definitions)
4. [Implementation Steps](#implementation-steps)
5. [Testing & Validation](#testing--validation)
6. [Performance Considerations](#performance-considerations)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

Row-Level Security (RLS) provides **defense-in-depth** for multi-tenant data isolation in Zixly. RLS policies enforce tenant boundaries at the **PostgreSQL database level**, ensuring that:

1. Application-level bugs cannot leak data across tenants
2. Direct database access (e.g., via Prisma Studio) respects tenant isolation
3. Backup restores and data migrations maintain security boundaries

### Security Model

**Multi-Layered Security**:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Application Logic (Prisma Queries)            │
│  → Filter by tenantId in WHERE clauses                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: API Middleware (JWT Validation)               │
│  → Extract tenantId from user JWT claims                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Row-Level Security (PostgreSQL Policies)      │
│  → Enforce tenantId filtering at database level         │
└─────────────────────────────────────────────────────────┘
```

**Defense-in-Depth**: Even if application logic fails, RLS prevents cross-tenant data access.

---

## RLS Architecture

### Tenant Context Pattern

**Session Variable**: Each database session sets `app.tenant_id` to identify the current tenant:

```sql
-- Set at the start of each API request (via Prisma middleware or direct query)
SET LOCAL app.tenant_id = 'tenant_xyz123';
```

**Policy Enforcement**: RLS policies check `current_setting('app.tenant_id')` in WHERE clauses.

### Tables with RLS

| Table            | RLS Enabled | Policy Type              | Rationale                                   |
| ---------------- | ----------- | ------------------------ | ------------------------------------------- |
| `tenants`        | ❌ No       | N/A                      | Root table, not tenant-scoped               |
| `users`          | ✅ Yes      | Tenant isolation         | Users belong to exactly one tenant          |
| `client_kpis`    | ✅ Yes      | Tenant isolation         | Business entities scoped to tenant          |
| `financials`     | ✅ Yes      | Transitive via ClientKPI | Time-series data linked to tenant's clients |
| `lead_events`    | ✅ Yes      | Transitive via ClientKPI | CRM data linked to tenant's clients         |
| `custom_metrics` | ✅ Yes      | Transitive via ClientKPI | Custom KPIs linked to tenant's clients      |
| `integrations`   | ✅ Yes      | Tenant isolation         | OAuth tokens scoped to tenant               |

---

## Policy Definitions

### Enable RLS on Tables

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
```

---

### Policy 1: Users Table

**Purpose**: Users can only access their own tenant's user records.

```sql
-- Policy: tenant_isolation_users
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::text);
```

**Explanation**:

- `USING`: Applies to SELECT, UPDATE, DELETE operations
- `current_setting('app.tenant_id', true)`: Reads session variable (true = don't error if not set)
- `::text`: Cast to match tenant_id column type

**Test Query**:

```sql
-- Set tenant context
SET app.tenant_id = 'tenant_123';

-- This query will only return users for tenant_123
SELECT * FROM users;
```

---

### Policy 2: ClientKPI Table

**Purpose**: Clients can only access their own tenant's business entities.

```sql
-- Policy: tenant_isolation_client_kpis
CREATE POLICY tenant_isolation_client_kpis ON client_kpis
  USING (tenant_id = current_setting('app.tenant_id', true)::text);
```

**Index Requirement**: Ensure index exists for performance:

```sql
-- Already defined in Prisma schema: @@index([tenantId])
-- Verifies efficient policy enforcement
```

---

### Policy 3: Financials Table (Transitive)

**Purpose**: Financial data is accessible only if the related ClientKPI belongs to the current tenant.

```sql
-- Policy: tenant_isolation_financials
CREATE POLICY tenant_isolation_financials ON financials
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );
```

**Explanation**:

- **Transitive Isolation**: Financials don't have direct `tenant_id`, so we join to `client_kpis`
- **Subquery**: PostgreSQL optimizer will use indexes on `client_kpis(tenant_id)`

**Performance Note**: This pattern requires indexes on both:

1. `client_kpis(tenant_id)` — for subquery
2. `financials(client_kpi_id)` — for join

---

### Policy 4: LeadEvents Table (Transitive)

```sql
-- Policy: tenant_isolation_lead_events
CREATE POLICY tenant_isolation_lead_events ON lead_events
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );
```

---

### Policy 5: CustomMetrics Table (Transitive)

```sql
-- Policy: tenant_isolation_custom_metrics
CREATE POLICY tenant_isolation_custom_metrics ON custom_metrics
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );
```

---

### Policy 6: Integrations Table

**Purpose**: OAuth tokens are isolated by tenant.

```sql
-- Policy: tenant_isolation_integrations
CREATE POLICY tenant_isolation_integrations ON integrations
  USING (tenant_id = current_setting('app.tenant_id', true)::text);
```

---

## Implementation Steps

### Step 1: Apply RLS Policies (Migration)

**Migration File**: `prisma/migrations/YYYYMMDDHHMMSS_enable_rls/migration.sql`

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::text);

CREATE POLICY tenant_isolation_client_kpis ON client_kpis
  USING (tenant_id = current_setting('app.tenant_id', true)::text);

CREATE POLICY tenant_isolation_financials ON financials
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );

CREATE POLICY tenant_isolation_lead_events ON lead_events
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );

CREATE POLICY tenant_isolation_custom_metrics ON custom_metrics
  USING (
    client_kpi_id IN (
      SELECT id FROM client_kpis
      WHERE tenant_id = current_setting('app.tenant_id', true)::text
    )
  );

CREATE POLICY tenant_isolation_integrations ON integrations
  USING (tenant_id = current_setting('app.tenant_id', true)::text);
```

**Run Migration**:

```bash
npx prisma migrate dev --name enable_rls
```

---

### Step 2: Prisma Middleware (Set Tenant Context)

**File**: `lib/prisma-middleware.ts`

```typescript
import { PrismaClient } from '@prisma/client'

export function configureTenantIsolation(prisma: PrismaClient, tenantId: string) {
  // Set tenant context for all queries in this Prisma instance
  return prisma.$executeRawUnsafe(`SET LOCAL app.tenant_id = '${tenantId.replace(/'/g, "''")}'`)
}
```

**Usage in API Routes**:

```typescript
// app/api/financials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { configureTenantIsolation } from '@/lib/prisma-middleware'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // Extract tenantId from JWT (set by auth middleware)
  const tenantId = request.headers.get('x-tenant-id')

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Set tenant context for this request
  await configureTenantIsolation(prisma, tenantId)

  // Now all queries are automatically filtered by tenant
  const financials = await prisma.financial.findMany({
    where: {
      recordDate: { gte: new Date('2025-01-01') },
    },
  })

  return NextResponse.json({ data: financials })
}
```

---

### Step 3: Authentication Middleware (Extract Tenant ID)

**File**: `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Attach tenant ID from user metadata to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-id', user.user_metadata.tenant_id)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
```

---

## Testing & Validation

### Test Scenario 1: Cross-Tenant Data Access Prevention

```sql
-- Create test data for two tenants
INSERT INTO tenants (id, name) VALUES
  ('tenant_a', 'Company A'),
  ('tenant_b', 'Company B');

INSERT INTO client_kpis (id, tenant_id, client_id, client_name) VALUES
  ('client_a1', 'tenant_a', 'cli_001', 'Client A1'),
  ('client_b1', 'tenant_b', 'cli_002', 'Client B1');

INSERT INTO financials (id, client_kpi_id, record_date, revenue, expenses, net_profit, cash_flow) VALUES
  ('fin_a1', 'client_a1', '2025-01-01', 100000, 60000, 40000, 50000),
  ('fin_b1', 'client_b1', '2025-01-01', 200000, 120000, 80000, 90000);

-- Test: Tenant A can only see their financial data
SET app.tenant_id = 'tenant_a';
SELECT * FROM financials;
-- Expected: Only fin_a1 (revenue 100,000)

-- Test: Tenant B can only see their financial data
SET app.tenant_id = 'tenant_b';
SELECT * FROM financials;
-- Expected: Only fin_b1 (revenue 200,000)

-- Test: No tenant context = no data (fail-secure)
RESET app.tenant_id;
SELECT * FROM financials;
-- Expected: 0 rows (current_setting returns NULL, policy denies all)
```

---

### Test Scenario 2: Verify Policy Performance

```sql
-- Explain query plan to verify index usage
SET app.tenant_id = 'tenant_a';

EXPLAIN ANALYZE
SELECT f.*
FROM financials f
WHERE f.record_date >= '2025-01-01'
  AND f.record_date <= '2025-12-31';

-- Expected execution plan:
-- 1. Index scan on financials(client_kpi_id, record_date)
-- 2. Nested loop join to client_kpis for RLS policy check
-- 3. Index scan on client_kpis(tenant_id)
-- Target: <100ms for 10,000 financial records
```

---

## Performance Considerations

### Index Requirements

**Critical Indexes** (already defined in Prisma schema):

```prisma
// Ensures efficient RLS policy enforcement
model ClientKPI {
  @@index([tenantId])  // Required for subquery in transitive policies
}

model Financial {
  @@index([clientKPIId, recordDate])  // Composite for common queries
}

model LeadEvent {
  @@index([clientKPIId, eventDate])
}

model CustomMetric {
  @@index([clientKPIId, metricName, recordDate])
}
```

---

### RLS Overhead

**Performance Impact**:

- **Direct tenant_id policies**: ~5-10µs overhead (negligible)
- **Transitive policies (subquery)**: ~20-50µs overhead
- **Total API impact**: <1% increase in p95 latency

**Mitigation**:

- Indexes on `client_kpis(tenant_id)` and `financials(client_kpi_id)` reduce subquery cost
- Connection pooling (PgBouncer) reduces session setup overhead

---

### Bypassing RLS (Admin Operations)

**Use Case**: Admin scripts, data exports, backups

```sql
-- Disable RLS for superuser/admin role (use with caution)
ALTER TABLE financials FORCE ROW LEVEL SECURITY;  -- Never bypass RLS
-- OR use a separate admin role with BYPASSRLS privilege

-- Recommended: Use service role with explicit tenant filtering
SET ROLE service_role;
SELECT * FROM financials WHERE client_kpi_id IN (
  SELECT id FROM client_kpis WHERE tenant_id = 'tenant_a'
);
```

---

## Troubleshooting

### Issue 1: "Row-level security policy violated"

**Symptom**: Queries fail with RLS policy error.

**Cause**: `app.tenant_id` session variable not set.

**Solution**:

```typescript
// Ensure configureTenantIsolation() is called before Prisma queries
await configureTenantIsolation(prisma, tenantId)
```

---

### Issue 2: Users See No Data After RLS Enabled

**Symptom**: Valid queries return 0 rows.

**Diagnosis**:

```sql
-- Check if app.tenant_id is set correctly
SELECT current_setting('app.tenant_id', true);
-- Should return: tenant_xyz123

-- Verify tenant exists
SELECT * FROM tenants WHERE id = current_setting('app.tenant_id', true);
```

**Solution**: Ensure middleware sets correct tenant ID in user JWT claims.

---

### Issue 3: Slow Query Performance After RLS

**Symptom**: Queries take >500ms (exceeded performance target).

**Diagnosis**:

```sql
EXPLAIN ANALYZE SELECT * FROM financials;
-- Look for "Seq Scan" (table scan) instead of "Index Scan"
```

**Solution**: Add missing indexes:

```sql
CREATE INDEX CONCURRENTLY idx_financials_client_kpi_id
  ON financials(client_kpi_id);
```

---

## Related Documentation

- [System Architecture - Security Architecture](./system-architecture.md#security-architecture)
- [Phase 1 Implementation Plan](../implementation/phase-1-data-foundation.md)
- [Database Schema Diagram](./database-schema-diagram.md)
- [Database Monitoring](./database-monitoring.md)

---

**Document End**

**Review Cycle**: After any schema changes or security audits
**Next Review**: 2026-01-15
**Change History**:

- 2025-10-15: Initial version (v1.0) - RLS policies defined for MVP

**Approval**:

- Security Lead: [Founder Name] - Approved 2025-10-15
- Database Architect: [Founder Name] - Approved 2025-10-15
