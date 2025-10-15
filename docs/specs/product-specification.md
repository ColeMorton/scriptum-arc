# Scriptum Arc: Product Specification

**Version**: 1.0
**Last Updated**: 2025-10-15
**Status**: MVP Definition

---

## Product Identity

**Name**: Scriptum Arc
**Category**: Automated Business Intelligence (ABI) Console
**Target Market**: Small-to-Medium Australian Businesses ($1-10M annual revenue)

**Product Definition**: A bespoke data consolidation and visualization platform that eliminates 5-15 hours per week of manual reporting by unifying data from 50+ business systems (Xero, HubSpot, Asana, Shopify, etc.) into real-time, custom-built dashboards.

---

## Value Proposition

### Core Promise

**"Bespoke Business Intelligence at SaaS Pricing"**

Scriptum Arc delivers enterprise-grade, custom-built data dashboards at predictable SaaS subscription rates—eliminating the traditional trade-off between generic template solutions (Power BI, Tableau) and expensive bespoke consulting engagements.

### Target Customer Profile

**Primary Personas** (See [Product Requirements Document](../product/product-requirements-document.md) for detailed personas):
- **Sarah** - SME Owner (Construction, Professional Services, E-commerce)
- **David** - External Accountant/Bookkeeper
- **James** - Operations Manager/COO

**Revenue Range**: $1M - $10M annual revenue
**Industry Focus**: Construction, Professional Services, E-commerce
**Geographic Focus**: Australia (data residency, compliance, local integrations)

**Pain Points Addressed**:
1. Manual data consolidation across disconnected systems (Xero + HubSpot + project management tools)
2. Delayed business insights (weekly/monthly reporting cycles instead of real-time)
3. Generic BI templates that don't match unique business workflows
4. Expensive custom consulting (AU$50K+ for bespoke dashboards)

---

## Competitive Positioning

### Differentiation Matrix

| Feature | Scriptum Arc | Power BI / Tableau | Klipfolio / Databox | Bespoke Consulting |
|---------|--------------|-------------------|---------------------|-------------------|
| **Customization** | Fully bespoke per client | Template-based | Template-based | Fully bespoke |
| **Pricing** | $1,200-$3,500/mo | $10-70/user/mo + consulting | $90-700/mo | $50K+ upfront |
| **Setup Time** | 4-6 weeks | Self-service (weeks-months) | Self-service (hours-days) | 3-6 months |
| **Australian Focus** | Native (Xero, MYOB, AU compliance) | International (add-ons) | International | Varies |
| **Support Included** | Unlimited (flat-rate) | Pay-per-incident | Limited tiers | Project-based |

**Unique Value**:
1. **Flat-rate pricing** (no per-user fees, no consulting hour surprises)
2. **Included implementation** (custom dashboard build included in subscription)
3. **Australian-first compliance** (Privacy Act, local data residency)
4. **Unified support** (single vendor for integrations, dashboards, ETL)

---

## MVP Scope

### In-Scope Features (MVP)

**Phase 1: Data Foundation** (Weeks 1-4)
- Multi-tenant PostgreSQL database (Supabase)
- Core data models: Financial, Sales/Leads, Custom Metrics
- Secure API endpoints with JWT authentication
- Prisma ORM for type-safe data access

**Phase 2: ETL & Orchestration** (Weeks 5-10)
- n8n-powered ETL pipelines
- 3 priority integrations: Xero (financial), HubSpot (CRM), Asana (operations)
- Automated daily/hourly data sync
- Error handling and sync status monitoring

**Phase 3: Visualization** (Weeks 11-15)
- Custom dashboard UI (Next.js + React)
- 4 core visualizations (Visx):
  - Financial performance dashboard (revenue, expenses, cash flow)
  - Sales funnel/conversion analysis
  - Operational efficiency metrics
  - Custom KPI tracking
- Time-range filtering and drill-down interactivity

**Phase 4: Operationalization** (Weeks 16-18)
- Performance optimization (< 2.5s dashboard load, < 500ms API p95)
- Security hardening (Australian Privacy Act compliance audit)
- Automated testing (E2E for critical workflows)
- Production deployment and monitoring

### Explicitly Out of Scope (MVP)

Per [Product Requirements Document](../product/product-requirements-document.md) (Out of Scope section):

- ❌ Mobile native apps (iOS/Android) - Planned Year 2
- ❌ Real-time WebSocket data streaming - Post-MVP (Phase 9)
- ❌ Multi-language support - English only for MVP
- ❌ SSO/SAML authentication - Planned for Enterprise tier (Year 2)
- ❌ White-label/reseller capabilities - Not in roadmap
- ❌ Predictive analytics/ML models - Post-MVP backlog
- ❌ Data warehouse export (Snowflake, BigQuery) - Year 2+ feature

---

## Success Metrics

### Product Success Criteria

**Performance Targets** (Per [Product Requirements Document](../product/product-requirements-document.md)):
- Dashboard load time: < 2.5 seconds (LCP)
- API response time: < 500ms (p95)
- System uptime: 99.9% (SLA)
- Data freshness: Hourly sync for Professional tier, daily for Starter

**User Experience**:
- NPS (Net Promoter Score): > 50
- Monthly active usage: > 80% of subscribers
- Time-to-first-value: < 7 days from signup to first dashboard

### Business Success Metrics

**Year 1 Targets** (Per [Financial Projections](../financial/financial-projections-unit-economics.md)):
- Customers: 18 (Month 12)
- MRR: $32,400 (Month 12)
- Churn rate: < 3.5% monthly
- Customer payback period: < 1.8 months

**Unit Economics**:
- Customer Acquisition Cost (CAC): $2,850
- Lifetime Value (LTV): $38,880
- LTV:CAC Ratio: 13.6:1
- Gross margin: > 85%

---

## Pricing Model

### Subscription Tiers

Per [Sales Deck](../sales/sales-deck-demo-script.md):

**Starter**: $1,200/month
- 1 primary data source integration (Xero OR HubSpot)
- 2 pre-built dashboard templates
- Daily data sync
- Email support (24-hour response)

**Professional**: $1,800/month
- 3 integrated data sources
- 4 custom dashboards
- Hourly data sync
- Priority support + Slack channel

**Enterprise**: $3,500/month
- Unlimited integrations
- Custom dashboard builds (unlimited)
- Real-time sync capability
- Dedicated account manager + SLA

**Implementation Fee**: $2,500 (one-time, credited if annual subscription)

---

## Strategic Objectives

### Solo-Operator Optimization

**Architectural Decision Drivers** (See [System Architecture](../architecture/system-architecture.md)):

The entire product architecture is explicitly designed to maximize developer velocity for a solo senior full-stack operator:

1. **Unified TypeScript ecosystem** - Eliminates context switching (Next.js frontend + API, Prisma type-safe ORM, n8n JavaScript nodes)
2. **Managed services** - Zero DevOps overhead (Vercel hosting, Supabase managed PostgreSQL, n8n Docker orchestration)
3. **Premium deliverable** - Visx custom visualizations justify premium pricing, avoiding commoditized template competition
4. **Automation-first** - n8n workflows automate ETL, reducing per-customer manual configuration

### Market Positioning

**Primary Go-To-Market Strategy** (Per [Sales Deck](../sales/sales-deck-demo-script.md)):

1. **Target acquisition**: Australian accounting firms (David persona - gateway to 10-50 SME clients)
2. **Sales approach**: 30-day pilot at $2,500 (credited if convert), demonstrating ROI with real customer data
3. **Conversion hook**: ROI calculator showing 297% Year 1 return (time savings + better decision-making)
4. **Retention**: Flat-rate pricing eliminates "per-user" growth penalties, incentivizes dashboard expansion

---

## Implementation Roadmap

### MVP Timeline (18 Weeks Total)

| Phase | Duration | Key Deliverables | Success Gate |
|-------|----------|------------------|--------------|
| **Phase 1: Data Foundation** | 4 weeks | Supabase setup, Prisma schema, secure API routes | All 4 API endpoints functional with JWT auth |
| **Phase 2: ETL & Orchestration** | 6 weeks | n8n workflows, 3 core integrations, sync monitoring | Xero + HubSpot + Asana daily sync operational |
| **Phase 3: Visualization** | 5 weeks | Dashboard UI, 4 Visx charts, interactivity | < 2.5s dashboard load, functional filtering |
| **Phase 4: Operationalization** | 3 weeks | Performance tuning, security audit, testing | 99.9% uptime, Australian Privacy Act compliant |

**Detailed Phase Plans**:
- [Phase 1: Data Foundation Implementation Plan](../implementation/phase-1-data-foundation.md)
- Phase 2: ETL & Orchestration (planned)
- Phase 3: Visualization (planned)

### Post-MVP Roadmap (Year 1)

**Months 5-7** (Customer Acquisition):
- First 5 paying customers onboarded
- Sales deck refinement based on objections
- Case study development (1-2 reference customers)

**Months 8-10** (Feature Expansion):
- Priority 2 integrations (Shopify, MYOB, Pipedrive)
- Advanced alerting (Slack notifications, threshold triggers)
- Mobile web optimization (responsive < 768px)

**Months 11-12** (Scale Preparation):
- Automated customer onboarding flow
- Self-service integration configuration
- Enterprise tier launch (dedicated account management)

---

## Related Documentation

**Product & Requirements**:
- [Product Requirements Document](../product/product-requirements-document.md) - 35+ user stories, 38 functional requirements, detailed personas
- [Documentation Analysis](../Documentation Analysis.md) - Recommended additional documentation roadmap

**Architecture & Technical**:
- [System Architecture](../architecture/system-architecture.md) - C4 diagrams, security architecture, Technology Decision Records
- [Phase 1 Implementation Plan](../implementation/phase-1-data-foundation.md) - Detailed technical execution plan

**Business & GTM**:
- [Sales Deck & Demo Script](../sales/sales-deck-demo-script.md) - 14-slide deck, ROI calculator, objection handling
- [Financial Projections & Unit Economics](../financial/financial-projections-unit-economics.md) - 3-year model, LTV:CAC analysis

**Integrations**:
- [n8n Automation Workflows](../integrations/n8n-automation-workflows.md) - 35 pre-defined workflow templates
- [SME Software Comparison](../integrations/sme-software-comparison.md) - Integration priority matrix

---

## Document Control

**Ownership**: Product Strategy
**Review Cadence**: Monthly (or after major feature releases)
**Approval Authority**: Product Owner
**Version History**:
- v1.0 (2025-10-15): Initial product specification consolidating strategic vision and MVP scope
