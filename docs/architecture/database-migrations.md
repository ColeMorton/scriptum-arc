# Database Migrations Strategy

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Database Architecture
**Status**: Production Migration Standard

---

## Table of Contents

1. [Overview](#overview)
2. [Migration Philosophy](#migration-philosophy)
3. [Prisma Migration Workflow](#prisma-migration-workflow)
4. [Migration Naming Convention](#migration-naming-convention)
5. [Testing Requirements](#testing-requirements)
6. [Production Deployment](#production-deployment)
7. [Data Migrations](#data-migrations)
8. [Rollback Strategy](#rollback-strategy)
9. [Zero-Downtime Migrations](#zero-downtime-migrations)

---

## Overview

### Purpose

This document defines the **authoritative migration strategy** for Zixly's PostgreSQL database, covering:

- Schema migrations (DDL changes)
- Data migrations (data transformation)
- Testing procedures
- Production deployment protocols
- Emergency rollback procedures

### Migration Tools

**Prisma Migrate**: Primary tool for schema migrations

- Generates SQL migrations from Prisma schema changes
- Maintains migration history in `prisma/migrations/` directory
- Tracks applied migrations in `_prisma_migrations` table

---

## Migration Philosophy

### Fail-Fast Principle

Per [Global Development Standards](~/.claude/CLAUDE.md):

> Do not use fallback mechanisms, instead take a fail fast approach and throw meaningful exceptions.

**Applied to Migrations**:

- ❌ **No automatic rollback on failure** — Migrations fail loudly, require manual intervention
- ✅ **Validate before apply** — Test migrations in staging, never deploy untested migrations
- ✅ **Explicit error messages** — Failed migrations must log clear cause (constraint violation, syntax error, etc.)

### No Backward Compatibility

Per [Global Development Standards](~/.claude/CLAUDE.md):

> No backwards compatibility whatsoever, as that is completely out of scope and handled by git.

**Applied to Migrations**:

- ❌ **No dual-write patterns** — Schema changes are immediate and forward-only
- ❌ **No feature flags for schema** — Database schema matches code version in `main` branch
- ✅ **Git history is truth** — Rollback = restore from backup + re-deploy previous commit

---

## Prisma Migration Workflow

### Development Environment

**Step 1: Modify Prisma Schema**

Edit `prisma/schema.prisma`:

```prisma
// Example: Adding a new field to ClientKPI
model ClientKPI {
  // ... existing fields
  companySize  String?  // NEW FIELD
}
```

**Step 2: Create Migration**

```bash
npx prisma migrate dev --name add_company_size_to_client_kpi
```

**Prisma Actions**:

1. Generates SQL migration file in `prisma/migrations/YYYYMMDDHHMMSS_add_company_size_to_client_kpi/migration.sql`
2. Applies migration to development database
3. Regenerates Prisma Client with new field

**Step 3: Review Generated SQL**

```bash
cat prisma/migrations/20251015093045_add_company_size_to_client_kpi/migration.sql
```

**Example Output**:

```sql
-- AlterTable
ALTER TABLE "client_kpis" ADD COLUMN "company_size" TEXT;
```

**Validation**:

- ✅ SQL syntax is correct
- ✅ No destructive operations (e.g., DROP COLUMN) without backups
- ✅ Indexes are created CONCURRENTLY (non-blocking)

**Step 4: Test Migration**

```bash
# Run seed script to populate test data
npm run db:seed

# Verify application works with new schema
npm run dev
# Test affected features manually

# Run integration tests
npm test
```

**Step 5: Commit Migration**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): add companySize field to ClientKPI for segmentation analysis"
git push origin main
```

---

### Production Environment

**Step 1: Deploy Code**

Push to `main` branch triggers Vercel deployment:

```bash
git push origin main
# → Vercel auto-deploys Next.js app
# → But database schema NOT yet updated (code ahead of schema)
```

**Step 2: Apply Migration**

**Manual Approach** (MVP Phase):

```bash
# SSH into production environment or use Supabase SQL Editor
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

**Prisma Actions**:

1. Connects to production database (uses `DATABASE_URL` from env)
2. Checks `_prisma_migrations` table for unapplied migrations
3. Applies migrations in chronological order
4. Updates `_prisma_migrations` table

**Automated Approach** (Post-MVP):

Add to GitHub Actions CI/CD:

```yaml
# .github/workflows/deploy.yml
- name: Run Prisma migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Step 3: Verify Migration**

```bash
# Check migration status
npx prisma migrate status

# Expected output:
# ✅ All migrations have been applied
```

---

## Migration Naming Convention

### Format

```
npx prisma migrate dev --name <action>_<entity>_<reason>
```

### Naming Patterns

| Pattern                            | Example                                           | When to Use          |
| ---------------------------------- | ------------------------------------------------- | -------------------- |
| `add_<field>_to_<table>`           | `add_company_size_to_client_kpi`                  | Adding new column    |
| `remove_<field>_from_<table>`      | `remove_deprecated_field_from_users`              | Dropping column      |
| `rename_<old>_to_<new>_in_<table>` | `rename_client_id_to_external_id_in_integrations` | Renaming column      |
| `create_<table>`                   | `create_audit_logs`                               | Adding new table     |
| `drop_<table>`                     | `drop_deprecated_logs`                            | Removing table       |
| `add_index_<column>_<table>`       | `add_index_tenant_id_client_kpis`                 | Adding index         |
| `enable_rls_<table>`               | `enable_rls_financials`                           | RLS policy changes   |
| `migrate_<description>`            | `migrate_currency_to_uppercase`                   | Data transformations |

### Examples

✅ **Good**:

- `add_embedding_to_custom_metrics`
- `enable_rls_all_tables`
- `migrate_financial_dates_to_utc`

❌ **Bad**:

- `update_schema` (too vague)
- `fix` (no context)
- `2025-10-15-changes` (use Prisma's timestamp prefix)

---

## Testing Requirements

### Pre-Production Checklist

Before deploying any migration to production:

- [ ] **Schema Review**: SQL reviewed for correctness and performance impact
- [ ] **Staging Test**: Migration applied to staging environment successfully
- [ ] **Data Validation**: Test data matches expected schema
- [ ] **Application Test**: API endpoints work with new schema (no 500 errors)
- [ ] **Performance Test**: Query performance meets targets (<100ms database queries)
- [ ] **Rollback Plan**: Backup created, rollback SQL prepared (if destructive)

### Staging Environment Testing

**Setup Staging Database**:

```bash
# Create staging Supabase project
# Copy production data snapshot to staging (anonymized)

# Set staging DATABASE_URL in .env.staging
DATABASE_URL="postgresql://staging..."

# Apply migration to staging
npx prisma migrate deploy
```

**Validation Queries**:

```sql
-- Verify column added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'client_kpis';

-- Verify data integrity
SELECT COUNT(*) FROM client_kpis WHERE company_size IS NOT NULL;

-- Verify RLS policies active
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'client_kpis';
```

---

## Production Deployment

### Pre-Deployment Steps

1. **Announce Maintenance Window** (if downtime expected):

   ```
   Subject: Scheduled Database Maintenance - 15 Oct 2025 10:00 PM AEST
   Duration: 10 minutes
   Impact: Read-only mode during migration
   ```

2. **Create Database Backup**:

   ```bash
   # Supabase automatic daily backups retained for 30 days
   # Manual snapshot for critical migrations:
   # Supabase Dashboard → Database → Backups → Create Snapshot
   ```

3. **Verify Application Health**:
   ```bash
   # Check DataDog: Zero error rate, <500ms API latency
   # Check Sentry: No unresolved critical errors
   ```

### Deployment Execution

**Deployment Script**:

```bash
#!/bin/bash
set -e  # Exit on any error (fail-fast)

echo "🔍 Checking migration status..."
npx prisma migrate status

echo "⏸️  Enabling maintenance mode..."
# Set Vercel environment variable: MAINTENANCE_MODE=true
vercel env add MAINTENANCE_MODE true production

echo "🚀 Applying migrations..."
npx prisma migrate deploy

echo "✅ Verifying migrations..."
npx prisma migrate status

echo "🔍 Running smoke tests..."
curl -f https://app.colemorton.com.au/api/health || exit 1

echo "✅ Disabling maintenance mode..."
vercel env rm MAINTENANCE_MODE production

echo "🎉 Migration complete!"
```

### Post-Deployment Validation

```bash
# Monitor DataDog for 15 minutes:
# - Error rate < 0.1%
# - API latency < 500ms
# - Database connection pool < 80%

# Check Sentry for new exceptions
# Review application logs for migration-related errors
```

---

## Data Migrations

### When to Use Data Migrations

**Scenarios**:

1. **Schema change requires data transformation** (e.g., split `full_name` into `first_name` + `last_name`)
2. **Backfill new columns** (e.g., populate `currency` field with "AUD" for existing records)
3. **Data cleanup** (e.g., remove duplicate records before adding unique constraint)

### Data Migration Pattern

**File**: `prisma/migrations/YYYYMMDDHHMMSS_migrate_<description>/migration.sql`

```sql
-- Step 1: Add new column (nullable initially)
ALTER TABLE "financials" ADD COLUMN "currency_code" TEXT;

-- Step 2: Backfill data
UPDATE "financials"
SET "currency_code" = UPPER("currency")
WHERE "currency_code" IS NULL;

-- Step 3: Make column required
ALTER TABLE "financials" ALTER COLUMN "currency_code" SET NOT NULL;

-- Step 4: Drop old column (optional, can defer to separate migration)
-- ALTER TABLE "financials" DROP COLUMN "currency";
```

**Performance Consideration**:

- Large data migrations (>1M rows) should use batching:

```sql
-- Batch update to avoid long locks
DO $$
DECLARE
  batch_size INT := 10000;
  rows_updated INT;
BEGIN
  LOOP
    UPDATE financials
    SET currency_code = UPPER(currency)
    WHERE id IN (
      SELECT id FROM financials
      WHERE currency_code IS NULL
      LIMIT batch_size
    );

    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;

    RAISE NOTICE 'Updated % rows', rows_updated;
    COMMIT;  -- Commit each batch
  END LOOP;
END $$;
```

---

## Rollback Strategy

### Automatic Rollback (NOT SUPPORTED)

Per fail-fast principle:

- ❌ Prisma does **NOT** support automatic migration rollback
- ❌ No `prisma migrate rollback` command exists

**Rationale**: Rollbacks can corrupt data. Manual intervention ensures correctness.

### Manual Rollback Procedure

**Scenario**: Migration `20251015_add_embedding_to_custom_metrics` fails in production.

**Step 1: Stop Application**

```bash
# Enable maintenance mode
vercel env add MAINTENANCE_MODE true production
```

**Step 2: Restore Database from Backup**

```bash
# Supabase Dashboard → Database → Backups → Restore
# Select backup from before migration (e.g., daily snapshot)
# Restore time: ~5-15 minutes for <100GB database
```

**Step 3: Revert Code**

```bash
# Find last working commit before migration
git log --oneline

# Revert to previous commit
git reset --hard <commit-hash-before-migration>
git push origin main --force
```

**Step 4: Verify Application**

```bash
# Check application health
curl https://app.colemorton.com.au/api/health

# Verify database schema matches code
npx prisma migrate status
```

**Step 5: Re-enable Application**

```bash
vercel env rm MAINTENANCE_MODE production
```

**Step 6: Post-Mortem**

Document failure in `docs/postmortems/YYYY-MM-DD-migration-failure.md`:

- Root cause
- Impact (downtime, data loss)
- Resolution steps
- Prevention measures

---

## Zero-Downtime Migrations

### Expand-Contract Pattern

For breaking schema changes, use **expand-contract** pattern:

**Example**: Renaming column `clientId` → `externalClientId`

**Phase 1: EXPAND (Add new column)**

```prisma
model ClientKPI {
  clientId         String  // OLD (keep temporarily)
  externalClientId String? // NEW (nullable during transition)
}
```

Migration SQL:

```sql
ALTER TABLE "client_kpis" ADD COLUMN "external_client_id" TEXT;
UPDATE "client_kpis" SET "external_client_id" = "client_id";
```

Deploy code that writes to **both** columns.

**Phase 2: MIGRATE (Update application)**

Update application code to read from `externalClientId`:

```typescript
// Before
const clientId = clientKPI.clientId

// After
const externalClientId = clientKPI.externalClientId || clientKPI.clientId
```

Deploy updated code (no migration required).

**Phase 3: CONTRACT (Remove old column)**

After verifying all code uses new column:

```prisma
model ClientKPI {
  externalClientId String  // Only new column
}
```

Migration SQL:

```sql
ALTER TABLE "client_kpis" DROP COLUMN "client_id";
```

**Timeline**: Phases 1-3 deployed over 2-4 weeks to ensure zero downtime.

---

### Adding Indexes Without Blocking

**Problem**: `CREATE INDEX` locks table, causing downtime.

**Solution**: Use `CREATE INDEX CONCURRENTLY`:

```sql
-- Prisma generates:
CREATE INDEX "client_kpis_tenant_id_idx" ON "client_kpis"("tenant_id");

-- Manually edit migration to add CONCURRENTLY:
CREATE INDEX CONCURRENTLY "client_kpis_tenant_id_idx" ON "client_kpis"("tenant_id");
```

**Trade-off**: `CONCURRENTLY` takes longer but doesn't block writes.

---

## Related Documentation

- [System Architecture - Data Architecture](./system-architecture.md#data-architecture)
- [Database Schema Diagram](./database-schema-diagram.md)
- [Row-Level Security Policies](./row-level-security-policies.md)
- [Phase 1 Implementation Plan](../implementation/phase-1-data-foundation.md)

---

**Document End**

**Review Cycle**: After each production migration or schema change
**Next Review**: 2025-11-15 (Post-Phase 1 completion)
**Change History**:

- 2025-10-15: Initial version (v1.0) - Migration strategy defined for MVP

**Approval**:

- Database Architect: [Founder Name] - Approved 2025-10-15
