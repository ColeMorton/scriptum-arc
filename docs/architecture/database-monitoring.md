# Database Monitoring & Observability

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Database Operations
**Status**: Production Monitoring Standard

---

## Table of Contents

1. [Overview](#overview)
2. [DataDog Integration](#datadog-integration)
3. [Key Database Metrics](#key-database-metrics)
4. [Critical Alerts](#critical-alerts)
5. [Performance Queries](#performance-queries)
6. [Troubleshooting Playbooks](#troubleshooting-playbooks)
7. [Capacity Planning](#capacity-planning)

---

## Overview

### Purpose

This document defines **production-grade database monitoring** for Scriptum Arc's PostgreSQL database (Supabase), covering:

- Connection pool utilization
- Query performance degradation
- Table growth and partitioning thresholds
- Index efficiency
- Replication lag
- Disk space exhaustion

### Monitoring Philosophy

Per [Global Development Standards](~/.claude/CLAUDE.md):

> Fail-fast is superior to fallbacks because it exposes problems immediately for proper fixing rather than hiding them behind degraded functionality.

**Applied to Monitoring**:
- ✅ **Alert on degradation**, not failure — Catch slow queries before they cause timeouts
- ✅ **Expose problems loudly** — PagerDuty alerts for P1 issues (connection pool exhaustion)
- ✅ **No silent failures** — Every failed query logged to Sentry + DataDog

---

## DataDog Integration

### Setup

**DataDog Agent**: Installed on Supabase infrastructure (automatic for Supabase customers).

**Metrics Collection**:
- PostgreSQL integration (automatic)
- Custom metrics via Prisma middleware
- Application-level metrics from Next.js API

**Dashboard**: `Scriptum Arc - Database Health`

**Retention**: 15 months of metrics (DataDog Pro plan)

---

## Key Database Metrics

### Connection Pool Metrics

**Metric 1: Active Connections**

**Query** (DataDog):
```
postgres.connections.active{env:production}
```

**Thresholds**:
- ⚠️ **Warning**: > 80% of max_connections (e.g., 80/100)
- 🚨 **Critical**: > 90% of max_connections (e.g., 90/100)

**Why It Matters**: Connection exhaustion causes `FATAL: remaining connection slots are reserved` errors, preventing new API requests.

**Mitigation**:
- Upgrade Supabase plan (increase connection limit)
- Enable PgBouncer connection pooling (Supabase built-in)

---

**Metric 2: Idle Connections**

**Query** (PostgreSQL):
```sql
SELECT COUNT(*) AS idle_connections
FROM pg_stat_activity
WHERE state = 'idle' AND state_change < NOW() - INTERVAL '5 minutes';
```

**Threshold**:
- ⚠️ **Warning**: > 20 connections idle for >5 minutes

**Why It Matters**: Idle connections waste resources. May indicate connection leak in application code.

**Investigation**:
```sql
-- Find long-running idle connections
SELECT pid, usename, application_name, state, state_change, query
FROM pg_stat_activity
WHERE state = 'idle' AND state_change < NOW() - INTERVAL '10 minutes'
ORDER BY state_change;
```

---

### Query Performance Metrics

**Metric 3: Slow Query Count**

**Query** (DataDog via Prisma middleware):
```typescript
// lib/prisma-middleware.ts
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  // Log to DataDog if query >100ms
  if (duration > 100) {
    datadogClient.increment('prisma.slow_query', 1, {
      model: params.model,
      action: params.action,
      duration: duration.toString(),
    });
  }

  return result;
});
```

**Threshold**:
- ⚠️ **Warning**: > 10 slow queries/min (p95 > 100ms)
- 🚨 **Critical**: > 50 slow queries/min (p95 > 500ms)

**Why It Matters**: Slow queries degrade user experience (dashboard load time >2.5s). May indicate missing indexes or inefficient queries.

---

**Metric 4: Query Latency (p95)**

**Query** (DataDog):
```
avg:postgres.query.time.p95{env:production}
```

**Target**: < 100ms (per [NFR-1.3](../product/product-requirements-document.md#nfr-1-performance))

**Thresholds**:
- ⚠️ **Warning**: > 150ms (p95)
- 🚨 **Critical**: > 500ms (p95)

**Investigation**:
```sql
-- Find slowest queries (requires pg_stat_statements extension)
SELECT
  query,
  calls,
  mean_exec_time AS avg_ms,
  max_exec_time AS max_ms,
  stddev_exec_time AS stddev_ms
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

### Table Growth Metrics

**Metric 5: Table Size Growth Rate**

**Query** (PostgreSQL):
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

**DataDog Query**:
```
sum:postgres.table.size{table:financials,env:production}
```

**Thresholds** (for time-series tables):
- ⚠️ **Warning**: `financials` table > 10 GB (plan partitioning)
- 🚨 **Critical**: `financials` table > 50 GB (implement partitioning immediately)

**Why It Matters**: Large tables slow down queries (sequential scans). Partitioning required at 500+ customers (per [System Architecture](./system-architecture.md#performance--scalability)).

---

**Metric 6: Row Count Growth**

**Query** (PostgreSQL):
```sql
SELECT
  schemaname,
  tablename,
  n_live_tup AS estimated_rows,
  n_dead_tup AS dead_rows,
  ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_row_percent
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

**Threshold**:
- ⚠️ **Warning**: `financials` table > 1M rows (review index efficiency)
- ⚠️ **Warning**: Dead row percent > 20% (schedule VACUUM ANALYZE)

---

### Index Efficiency Metrics

**Metric 7: Index Usage Rate**

**Query** (PostgreSQL):
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;  -- Least used indexes first
```

**Action**: Identify unused indexes (idx_scan = 0) and drop to save disk space.

**Example**:
```sql
-- If index never used after 30 days, consider dropping
DROP INDEX CONCURRENTLY idx_unused_example;
```

---

**Metric 8: Index Bloat**

**Query** (PostgreSQL):
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
  100 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) / NULLIF(pg_relation_size(indexrelid), 0) AS bloat_percent
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

**Threshold**:
- ⚠️ **Warning**: Index bloat > 30% (schedule REINDEX)

**Remediation**:
```sql
REINDEX INDEX CONCURRENTLY idx_bloated_example;
```

---

### Replication Lag (High Availability)

**Metric 9: Replication Lag** (if read replica configured)

**Query** (PostgreSQL on primary):
```sql
SELECT
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lsn,
  sync_state,
  pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;
```

**Threshold**:
- ⚠️ **Warning**: Lag > 100 MB
- 🚨 **Critical**: Lag > 500 MB (replica diverging)

**Why It Matters**: High replication lag means read replica serves stale data. Dashboard queries return outdated metrics.

---

### Disk Space Metrics

**Metric 10: Disk Space Utilization**

**Query** (Supabase Dashboard or PostgreSQL):
```sql
SELECT pg_size_pretty(pg_database_size('postgres')) AS database_size;
```

**DataDog Query**:
```
avg:system.disk.used{env:production} / avg:system.disk.total{env:production} * 100
```

**Thresholds**:
- ⚠️ **Warning**: Disk > 70% full
- 🚨 **Critical**: Disk > 85% full

**Why It Matters**: PostgreSQL requires ~20% free space for VACUUM operations. Disk full = database writes fail.

**Mitigation**:
- Archive old data to S3 (see [Data Retention](./system-architecture.md#data-retention--archival))
- Upgrade Supabase plan (increase disk capacity)

---

## Critical Alerts

### Alert Configuration (DataDog)

**Alert 1: Connection Pool Exhaustion**

```yaml
name: "[P1] PostgreSQL Connection Pool Exhausted"
query: "avg(last_5m):max:postgres.connections.active{env:production} / max:postgres.max_connections{env:production} > 0.9"
message: |
  🚨 **Connection pool at 90% capacity!**

  Current: {{value}}% of max connections
  Impact: New API requests will fail with connection errors

  **Actions**:
  1. Check DataDog APM for connection leak (dashboard: Scriptum Arc - Database Health)
  2. Identify slow queries holding connections: `SELECT * FROM pg_stat_activity WHERE state = 'active' ORDER BY query_start`
  3. Consider upgrading Supabase plan for more connections

priority: P1
notify:
  - pagerduty
  - slack:#alerts-production
```

---

**Alert 2: Slow Query Spike**

```yaml
name: "[P2] Database Query Performance Degradation"
query: "avg(last_15m):avg:postgres.query.time.p95{env:production} > 500"
message: |
  ⚠️ **Query latency exceeded 500ms (p95)**

  Current p95: {{value}}ms
  Target: <100ms
  Impact: Dashboard load time >2.5s (violates NFR-1.1)

  **Actions**:
  1. Identify slow queries: `SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10`
  2. Check for missing indexes (investigate EXPLAIN ANALYZE output)
  3. Review application code for N+1 query patterns

priority: P2
notify:
  - slack:#alerts-production
```

---

**Alert 3: Disk Space Warning**

```yaml
name: "[P2] Database Disk Space >80%"
query: "avg(last_1h):avg:system.disk.used{env:production} / avg:system.disk.total{env:production} * 100 > 80"
message: |
  ⚠️ **Database disk usage exceeded 80%**

  Current: {{value}}%
  Recommended action: Archive old data or upgrade storage

  **Actions**:
  1. Check table sizes: `SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC`
  2. Archive financial data >3 years old to S3
  3. Upgrade Supabase plan if needed

priority: P2
notify:
  - slack:#alerts-production
```

---

## Performance Queries

### Query 1: Current Active Queries

**Purpose**: Identify currently running queries (useful during incidents).

```sql
SELECT
  pid,
  now() - query_start AS duration,
  state,
  query,
  wait_event_type,
  wait_event
FROM pg_stat_activity
WHERE state <> 'idle'
  AND pid <> pg_backend_pid()  -- Exclude this query itself
ORDER BY query_start;
```

**Interpretation**:
- `duration > 10s`: Slow query, investigate
- `wait_event_type = 'Lock'`: Blocked by another query (deadlock risk)

---

### Query 2: Top 10 Slowest Queries (Historical)

**Purpose**: Identify queries to optimize.

**Requires**: `pg_stat_statements` extension (enabled by default in Supabase).

```sql
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time,
  rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Action**: For each slow query, run `EXPLAIN ANALYZE` to identify missing indexes.

---

### Query 3: Table Bloat (Dead Tuples)

**Purpose**: Identify tables needing VACUUM.

```sql
SELECT
  schemaname,
  tablename,
  n_live_tup AS live_rows,
  n_dead_tup AS dead_rows,
  ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_percent,
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000  -- Only tables with >1k dead rows
ORDER BY dead_percent DESC;
```

**Action**:
```sql
VACUUM ANALYZE financials;  -- Manual vacuum if dead_percent >20%
```

---

### Query 4: Index Hit Rate

**Purpose**: Ensure queries use indexes (not sequential scans).

```sql
SELECT
  'index hit rate' AS metric,
  ROUND(100 * sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit + idx_blks_read), 0), 2) AS percent
FROM pg_statio_user_indexes
UNION ALL
SELECT
  'table hit rate' AS metric,
  ROUND(100 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0), 2) AS percent
FROM pg_statio_user_tables;
```

**Target**: > 99% index/table hit rate (data served from cache, not disk).

**If < 95%**: Increase `shared_buffers` (requires Supabase plan upgrade).

---

## Troubleshooting Playbooks

### Playbook 1: API Timeout Errors

**Symptoms**:
- Sentry: `PrismaClientKnownRequestError: Query timeout`
- DataDog: API response time >5s

**Investigation**:
1. Check active queries:
   ```sql
   SELECT * FROM pg_stat_activity WHERE state = 'active' ORDER BY query_start;
   ```
2. Identify long-running query (duration >5s)
3. Run `EXPLAIN ANALYZE` on query to find bottleneck

**Resolution**:
- Add missing index
- Optimize query (reduce joins, add WHERE clauses)
- Cancel stuck query: `SELECT pg_cancel_backend(<pid>);`

---

### Playbook 2: Connection Pool Exhausted

**Symptoms**:
- API errors: `FATAL: remaining connection slots are reserved for non-replication superuser connections`
- DataDog: `postgres.connections.active = 100/100`

**Investigation**:
1. Identify queries holding connections:
   ```sql
   SELECT pid, usename, state, query, state_change
   FROM pg_stat_activity
   ORDER BY state_change
   LIMIT 20;
   ```
2. Check for connection leaks in application code (Prisma client not closed)

**Resolution**:
- Short-term: Restart application (releases connections)
- Long-term: Fix connection leak + enable PgBouncer

---

### Playbook 3: Slow Dashboard Load Time

**Symptoms**:
- Core Web Vitals: LCP > 2.5s
- DataDog: `/api/financials` response time > 1s

**Investigation**:
1. Profile slow API route:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM financials
   WHERE client_kpi_id = 'client_123'
     AND record_date BETWEEN '2025-01-01' AND '2025-12-31';
   ```
2. Check if index used (should see "Index Scan" not "Seq Scan")

**Resolution**:
- Add missing composite index
- Cache frequently accessed data (Redis)

---

## Capacity Planning

### Growth Projections

| Metric | Current (MVP) | 100 Customers | 500 Customers | 1,000 Customers |
|--------|---------------|---------------|---------------|-----------------|
| **Financials rows** | 10K | 1M | 5M | 10M |
| **Database size** | 100 MB | 10 GB | 50 GB | 100 GB |
| **Daily queries** | 10K | 1M | 5M | 10M |
| **Connections (avg)** | 10 | 50 | 200 | 500 |

### Upgrade Triggers

| Threshold | Action |
|-----------|--------|
| **Disk > 70% full** | Archive old data + upgrade Supabase plan |
| **Connections > 80%** | Enable PgBouncer + upgrade connection limit |
| **Financials > 10M rows** | Implement monthly partitioning (see [Schema Evolution](./database-schema-diagram.md#schema-evolution)) |
| **Query p95 > 500ms** | Add read replica for dashboard queries |

---

## Related Documentation

- [System Architecture - Performance & Scalability](./system-architecture.md#performance--scalability)
- [Database Schema Diagram](./database-schema-diagram.md)
- [Row-Level Security Policies](./row-level-security-policies.md)
- [Database Migrations Strategy](./database-migrations.md)

---

**Document End**

**Review Cycle**: Monthly (review metrics dashboard, adjust thresholds)
**Next Review**: 2025-11-15
**Change History**:
- 2025-10-15: Initial version (v1.0) - Production monitoring standards defined

**Approval**:
- Database Operations: [Founder Name] - Approved 2025-10-15
