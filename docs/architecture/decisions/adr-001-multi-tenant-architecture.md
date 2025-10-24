# ADR-001: Multi-Tenant Architecture

**Status**: Accepted  
**Date**: 2025-01-27  
**Deciders**: Technical Architecture Team

## Context

Zixly is an open-source internal operations platform for the Zixly service business. We need to decide on the data architecture approach for supporting multiple data isolation requirements.

**Business Context**:

- Zixly is a DevOps automation service business for Brisbane tech companies
- This platform tracks Zixly's internal service delivery operations
- Single tenant architecture (only Zixly organization data)
- Open-source for demonstration and reuse purposes

**Options Considered**:

1. Database-per-tenant (separate databases)
2. Schema-per-tenant (separate schemas)
3. Row-level security (shared database, RLS policies)

## Decision

We will use **Row-Level Security (RLS)** with a shared PostgreSQL database.

**Rationale**:

- Simpler operations and maintenance for single tenant
- Cost-effective for internal operations scale
- Supabase provides built-in RLS support
- Easier to implement cross-tenant analytics (if needed in future)
- Single database backup and monitoring
- Aligns with open-source strategy for simplicity

## Consequences

**Positive**:

- Lower operational complexity
- Cost-effective scaling
- Built-in Supabase RLS support
- Easier cross-tenant analytics (future)
- Single database backup and monitoring
- Simpler development and testing

**Negative**:

- Potential performance impact at scale (not relevant for single tenant)
- More complex data migration (not relevant for single tenant)
- Shared resource contention (minimal with single tenant)
- Security requires careful RLS policy management

## Implementation

### Database Schema

- All tables include `tenantId` foreign key
- RLS policies enforce tenant isolation
- Prisma queries automatically scope by tenant
- Supabase middleware sets tenant context

### RLS Policies

```sql
-- Set tenant context on login
SET app.tenant_id = 'zixly-org-001';

-- RLS policy ensures only Zixly data is accessible
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::text);

CREATE POLICY tenant_isolation_clients ON client_kpis
  USING (tenant_id = current_setting('app.tenant_id', true)::text);
```

### Prisma Integration

```typescript
// All queries automatically scoped by tenant
const clients = await prisma.clientKPI.findMany({
  where: { tenantId }, // Automatically enforced by RLS
  include: {
    financials: true,
    leadEvents: true,
    customMetrics: true,
  },
})
```

## Future Considerations

### Multi-Tenant SaaS (Not Planned)

If Zixly were to become a multi-tenant SaaS platform in the future:

- Current RLS architecture would support multiple tenants
- No database schema changes required
- Additional RLS policies for new tenants
- Tenant management UI would need to be added

### Open-Source Community

- RLS architecture is well-documented and understood
- Community can easily adapt for their own single-tenant needs
- Clear patterns for tenant isolation
- Reusable RLS policy templates

## Related Decisions

- **ADR-002 (REMOVED)**: n8n vs Web App Separation
- **ADR-003**: Real-Time Data Strategy
- **ADR-005**: Open-Source Strategy

## Review

**Next Review**: 2025-04-27  
**Reviewers**: Technical Architecture Team  
**Status**: Accepted and implemented

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture Team
