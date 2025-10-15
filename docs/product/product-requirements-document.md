# Scriptum Arc - Product Requirements Document (PRD)

**Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Product Management
**Status**: MVP Requirements (Phase 1-3)
**Target Release**: Q2 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision & Strategy](#product-vision--strategy)
3. [User Personas](#user-personas)
4. [User Stories & Use Cases](#user-stories--use-cases)
5. [Functional Requirements](#functional-requirements)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [Feature Specifications](#feature-specifications)
8. [User Interface Requirements](#user-interface-requirements)
9. [Integration Requirements](#integration-requirements)
10. [Success Metrics](#success-metrics)
11. [Release Plan](#release-plan)
12. [Out of Scope](#out-of-scope)
13. [Assumptions & Dependencies](#assumptions--dependencies)

---

## Executive Summary

### Product Overview

**Scriptum Arc** is a bespoke Business Intelligence platform designed specifically for Australian SMEs (Small-to-Medium Enterprises) with $1-10M annual revenue. The platform consolidates data from disconnected business systems (accounting, CRM, project management, e-commerce) into unified, real-time dashboards, eliminating manual reporting and enabling data-driven decision-making.

### Problem Statement

Australian SME owners and managers spend 5-15 hours weekly on manual reporting, copying data between systems, and reconciling spreadsheets. Critical business decisions are delayed by 2-3 weeks due to lack of timely, consolidated data. Existing BI tools (Power BI, Tableau) require expensive consultants and ongoing maintenance, making them economically unviable for businesses under $10M revenue.

### Solution

Scriptum Arc provides:

- **Automated Data Consolidation**: Nightly (or hourly) syncs from 50+ business systems via OAuth integrations
- **Bespoke Dashboards**: Custom-designed visualizations tailored to each customer's industry and KPIs
- **Zero Maintenance**: Fully managed platform with included support and ongoing optimization
- **Australian-Focused**: AU data residency, Privacy Act compliance, integrations with AU-specific tools (Xero, MYOB, Employment Hero)

### Target Customers

**Primary**: SME Business Owners & COOs

- Revenue: $2-5M annually
- Employees: 10-50
- Industries: Professional services, construction/trades, e-commerce, manufacturing
- Pain: Lack of real-time visibility into business performance

**Secondary**: Accountants & Bookkeepers

- Use Case: Validate client data accuracy, prepare board reports, provide advisory services
- Pain: Clients request ad-hoc reports that require manual data extraction

### Business Goals

1. **Year 1**: Achieve 18 customers, $241K revenue, operational breakeven by Month 10
2. **Year 2**: Grow to 42 customers, $654K revenue, 43% EBITDA margin
3. **Year 3**: Reach 78 customers, $1.24M revenue, establish market leadership in AU SME BI
4. **Long-term**: Build defensible moat through proprietary industry templates and customer lock-in via integrated workflows

---

## Product Vision & Strategy

### Vision Statement

_"Empower every Australian SME to make data-driven decisions as confidently as enterprise companies, without the enterprise complexity or cost."_

### Product Strategy

**Positioning**: Premium bespoke BI at SaaS pricing

**Differentiation**:

- **Custom-built dashboards** (not templates) - Each customer gets unique visualizations designed for their business model
- **Included implementation & support** - No consultant dependency, no ongoing retainer fees
- **Australian-first** - Built for AU compliance, AU integrations, AU business models
- **Flat-rate pricing** - No per-user or per-integration fees (predictable costs)

**Competitive Moat**:

- **Proprietary industry templates** - Accumulated knowledge from 100+ customer implementations becomes defensible IP
- **High switching costs** - Integrated workflows and custom dashboards create lock-in
- **Direct customer relationships** - Solo operator model enables deep customer intimacy and rapid iteration

### Product Roadmap (3-Phase MVP)

**Phase 1: Data Foundation** (Weeks 1-4)

- PostgreSQL schema with multi-tenancy
- Supabase Auth integration
- Secure API endpoints for data access
- Prisma ORM with type-safe queries

**Phase 2: ETL Automation** (Weeks 5-10)

- n8n deployment with Docker
- 10 core integration workflows (Xero, HubSpot, Asana)
- Data transformation and cleaning logic
- Error handling and retry mechanisms

**Phase 3: Dashboard & Visualization** (Weeks 11-15)

- Responsive dashboard UI with Next.js
- 4 bespoke Visx chart types
- Interactive filtering and drill-down
- Real-time data refresh

**Post-MVP** (Months 4-12):

- Mobile app (React Native)
- AI-powered insights and alerts
- White-label solution for agency partners
- Advanced analytics (forecasting, cohort analysis)

---

## User Personas

### Primary Persona: SME Business Owner (Sarah)

**Demographics**:

- Age: 38-52
- Role: Owner/Director of $3.5M construction company
- Tech Savvy: Medium (comfortable with cloud software, not a developer)
- Team: 28 employees, no dedicated IT or data analyst

**Goals**:

- Understand profitability of each active project in real-time
- Reduce time spent on weekly reporting from 8 hours to <1 hour
- Make confident decisions about hiring, pricing, and resource allocation
- Provide board with professional reports without hiring an analyst

**Pain Points**:

- Data scattered across Xero (financials), Procore (project management), and spreadsheets
- Weekly cash flow reporting requires manual data entry and reconciliation
- Can't tell which projects are profitable until 30-60 days after completion
- Accountant charges $800 for ad-hoc reports, takes 5-7 days to deliver

**User Journey with Scriptum Arc**:

1. **Discovery**: Googles "construction business dashboard Australia", finds Scriptum Arc
2. **Evaluation**: Books demo, sees job profitability dashboard prototype
3. **Purchase**: Signs up for Professional tier ($1,800/month), $2,500 setup fee
4. **Onboarding**: Provides OAuth access to Xero and Procore, 1-hour requirements workshop
5. **Activation**: Receives custom dashboard 3 weeks later, sees all active jobs at a glance
6. **Retention**: Checks dashboard every Monday morning, catches budget overrun on $280k job in Week 4, saves $18k by course-correcting early

**Success Criteria**:

- Reduces reporting time from 8 hours/week to 30 minutes/week (94% reduction)
- Identifies 1-2 actionable insights per month (e.g., cash flow warnings, project delays)
- Renews subscription after 12 months (LTV: $21,600)

---

### Secondary Persona: Accountant (David)

**Demographics**:

- Age: 45-60
- Role: Chartered Accountant with 12 SME clients
- Tech Savvy: Medium-high (expert in Xero, familiar with BI tools)
- Pain: Clients constantly request custom reports

**Goals**:

- Provide clients with better advisory services (not just compliance)
- Reduce time spent on ad-hoc reporting requests
- Upsell higher-value strategic consulting

**Pain Points**:

- Clients call mid-month asking "how are we tracking?", requires 2-3 hours of data extraction
- Building custom reports in Excel is time-consuming and error-prone
- Can't scale advisory services without hiring more staff

**User Journey with Scriptum Arc**:

1. **Discovery**: Client (Sarah) shares Scriptum Arc dashboard, David sees value
2. **Adoption**: David recommends Scriptum Arc to 3 other clients
3. **Partnership**: Becomes referral partner (10% commission on signups)
4. **Value**: Uses Scriptum Arc dashboards in quarterly business review meetings, clients perceive higher value from accounting relationship

**Success Criteria**:

- Refers 5+ clients to Scriptum Arc in Year 1
- Reduces ad-hoc reporting time by 50%
- Upsells 2 clients to premium advisory services using dashboard insights

---

### Tertiary Persona: Operations Manager (James)

**Demographics**:

- Age: 30-42
- Role: COO of $4.2M e-commerce business
- Tech Savvy: High (technical background, comfortable with APIs)
- Responsibilities: Inventory, fulfillment, supplier management

**Goals**:

- Monitor inventory turnover and stock-out risks daily
- Track supplier performance (delivery times, defect rates)
- Identify top-selling products by margin (not just revenue)

**Pain Points**:

- Shopify shows revenue, but COGS data is in Xero - can't easily calculate true profitability
- Inventory forecasting requires manual spreadsheet with data from 3 systems
- No visibility into fulfillment speed by warehouse

**User Journey with Scriptum Arc**:

1. **Discovery**: Recommended by business coach
2. **Evaluation**: Tests dashboard with 30-day pilot ($2,500)
3. **Activation**: Dashboard shows real-time gross margin by product, identifies 3 SKUs with negative margin after shipping costs
4. **Expansion**: Requests second dashboard for supplier performance tracking (upgrade to Professional tier)
5. **Advocacy**: Writes testimonial, refers 2 e-commerce peers

**Success Criteria**:

- Improves inventory turnover from 6x to 8x per year (reduced holding costs)
- Eliminates 1 unprofitable product line (saves $12k/year)
- Detects supplier quality issue 2 weeks earlier than previous process

---

## User Stories & Use Cases

### Epic 1: Authentication & Onboarding

**US-1.1**: As a new customer, I want to create an account using email/password so that I can access the platform securely.

**Acceptance Criteria**:

- User can register with email and password (min 8 characters, 1 uppercase, 1 number)
- Email verification required before first login
- User is assigned to a tenant (multi-tenancy isolation)
- Default role: ADMIN (first user in tenant)

**US-1.2**: As a customer, I want to connect my Xero account via OAuth so that my financial data syncs automatically.

**Acceptance Criteria**:

- Clicking "Connect Xero" redirects to Xero authorization page
- After authorization, user is redirected back to Scriptum Arc
- Access token is encrypted and stored in database
- Initial data sync is triggered within 5 minutes
- User sees "Connected" status with last sync timestamp

**US-1.3**: As a customer, I want to invite team members to view dashboards so that they can access data without sharing my login.

**Acceptance Criteria**:

- User can send email invitation with role selection (ADMIN, EDITOR, VIEWER)
- Invitee receives email with signup link (expires in 7 days)
- Invitee creates account and is automatically added to inviter's tenant
- Role permissions enforced (VIEWER cannot edit dashboards)

---

### Epic 2: Data Integration & Syncing

**US-2.1**: As a customer, I want my Xero financial data to sync nightly so that my dashboard is always up-to-date.

**Acceptance Criteria**:

- n8n workflow triggers daily at 2am AEST
- Workflow extracts Profit & Loss and Balance Sheet reports from Xero API
- Data is transformed (normalize dates, convert to AUD, calculate derived metrics)
- Data is upserted into PostgreSQL (deduplication by date + source system)
- Sync errors are logged and user is notified via email
- Last sync timestamp displayed in dashboard

**US-2.2**: As a customer, I want to see a list of all my integrations and their sync status so that I can troubleshoot issues.

**Acceptance Criteria**:

- Integrations page shows all connected systems (Xero, HubSpot, etc.)
- Each integration displays: status (Active, Error, Disabled), last sync time, next sync time
- User can manually trigger a sync ("Sync Now" button)
- User can disconnect an integration (revokes OAuth token)
- Error logs are visible with actionable error messages (e.g., "Xero token expired - reconnect")

**US-2.3**: As a customer, I want to connect HubSpot so that my sales pipeline data appears in the dashboard.

**Acceptance Criteria**:

- OAuth flow identical to Xero (redirect, authorize, callback)
- n8n workflow syncs deals, contacts, and stages from HubSpot API
- Data mapped to LeadEvent table (deal value, stage, close date)
- Dashboard displays sales funnel visualization with HubSpot data

---

### Epic 3: Dashboard Viewing & Interaction

**US-3.1**: As a customer, I want to view a summary dashboard on login so that I immediately see my business health.

**Acceptance Criteria**:

- Dashboard loads within 2.5 seconds (LCP)
- Top section displays 4 KPI cards: Revenue (MTD), Cash Flow, Pipeline Value, Operational Metric
- Each KPI card shows: current value, trend indicator (up/down arrow), % change vs. prior period
- Color coding: green (on track), yellow (warning), red (urgent)
- Mobile-responsive layout (stacks vertically on <768px screens)

**US-3.2**: As a customer, I want to filter dashboard data by date range so that I can analyze specific periods.

**Acceptance Criteria**:

- Date range picker at top of dashboard (default: Last 90 days)
- Preset options: Last 7 days, Last 30 days, Last 90 days, Year to Date, Custom
- Selecting date range reloads all charts with filtered data
- Date range persists in URL query params (shareable links)
- Loading state shown while data fetches (<500ms)

**US-3.3**: As a customer, I want to drill down into a chart to see underlying data so that I can investigate anomalies.

**Acceptance Criteria**:

- Clicking on a chart segment (e.g., bar in revenue chart) opens detail modal
- Modal displays table with raw records (date, amount, source, notes)
- Table is sortable by column headers
- User can export table to CSV
- Close modal returns to dashboard (state preserved)

**US-3.4**: As a customer, I want to see a sales funnel chart showing conversion rates so that I can identify bottlenecks.

**Acceptance Criteria**:

- Funnel chart displays stages: Lead → Qualified → Proposal → Closed Won
- Each stage shows: count, total value, conversion rate to next stage
- Color gradient from blue (top) to green (bottom)
- Hovering over stage displays tooltip with details
- Clicking stage filters dashboard to show only deals in that stage

---

### Epic 4: Alerting & Notifications

**US-4.1**: As a customer, I want to receive an email alert when cash flow drops below $50k so that I can take action before a crisis.

**Acceptance Criteria**:

- User configures alert in Settings → Alerts
- Alert settings: metric (Cash Flow), condition (Less Than), threshold ($50,000), notification channel (Email)
- Alert evaluates after each data sync
- If triggered, email sent to user within 5 minutes
- Email includes: current value, threshold, chart showing recent trend, link to dashboard
- Alert does not re-trigger until value recovers above threshold + 10% buffer

**US-4.2**: As a customer, I want Slack notifications when a project goes over budget so that my team is immediately informed.

**Acceptance Criteria**:

- User connects Slack workspace via OAuth
- Alert configured: metric (Project Budget Variance), condition (Greater Than), threshold (10%)
- Alert posts message to designated Slack channel (e.g., #finance)
- Message includes: project name, current spend, budgeted amount, variance %, link to dashboard
- Message tagged with @channel for urgent alerts (threshold >20%)

**US-4.3**: As a customer, I want to see a notification history so that I can review past alerts.

**Acceptance Criteria**:

- Notifications page lists all alerts sent in last 90 days
- Each entry shows: date/time, alert name, triggered value, notification channel, status (Sent, Failed)
- User can filter by alert type and date range
- Failed notifications display error reason (e.g., "Slack webhook invalid")

---

### Epic 5: Custom Metrics & Calculations

**US-5.1**: As a customer, I want to track a custom KPI (e.g., "Average Project Delivery Time") so that I can monitor operational efficiency.

**Acceptance Criteria**:

- User creates custom metric in Settings → Custom Metrics
- Metric definition: name, calculation logic (manual entry or formula), unit (days, percent, dollars)
- Data entry: manual upload via CSV or API integration
- Metric appears as chart in dashboard
- Historical data retained for trend analysis

**US-5.2**: As a customer, I want to create a calculated metric (e.g., "Gross Profit Margin = (Revenue - COGS) / Revenue") so that I can track derived KPIs.

**Acceptance Criteria**:

- User defines formula using existing metrics (Revenue, COGS)
- Formula supports operators: +, -, \*, /, (), aggregate functions (SUM, AVG)
- Preview shows calculated values for last 30 days (validation)
- Calculated metric updates automatically when source data changes
- Errors in formula display helpful message (e.g., "Division by zero on 2025-03-15")

---

### Epic 6: Reporting & Exports

**US-6.1**: As a customer, I want to export my dashboard as a PDF so that I can share it with my board.

**Acceptance Criteria**:

- "Export PDF" button in dashboard header
- PDF includes: date range, all charts (rendered as images), KPI summary table
- PDF is branded with customer logo (uploaded in Settings)
- PDF generation completes within 10 seconds
- Download link emailed if user navigates away before completion

**US-6.2**: As a customer, I want to schedule a weekly email report so that my team receives updates automatically.

**Acceptance Criteria**:

- User configures scheduled report in Settings → Scheduled Reports
- Settings: frequency (daily, weekly, monthly), day/time, recipients (email addresses), dashboard to include
- Report sent as email with embedded charts (images) + PDF attachment
- Recipients can click link to view live dashboard (requires login)
- User can pause/resume/delete scheduled reports

---

### Epic 7: User Management & Permissions

**US-7.1**: As an admin, I want to deactivate a user so that they can no longer access the platform.

**Acceptance Criteria**:

- Admin navigates to Settings → Users
- User list displays: name, email, role, status (Active, Inactive), last login
- Admin clicks "Deactivate" on user row
- Confirmation modal: "Are you sure? User will lose access immediately."
- After confirmation, user status changes to Inactive
- User's active sessions are invalidated (logged out)
- User receives email notification of deactivation

**US-7.2**: As an admin, I want to change a user's role from Viewer to Editor so that they can customize dashboards.

**Acceptance Criteria**:

- Admin clicks "Edit Role" on user row
- Role dropdown: ADMIN, EDITOR, VIEWER
- Admin selects EDITOR, clicks Save
- User's permissions update immediately (no re-login required)
- User sees "Edit Dashboard" button appear in UI
- Audit log records role change with timestamp and admin user

---

### Epic 8: Billing & Subscription Management

**US-8.1**: As a customer, I want to upgrade from Starter to Professional tier so that I can add more integrations.

**Acceptance Criteria**:

- User navigates to Settings → Billing
- Current plan displayed: Starter ($1,200/month), next billing date
- User clicks "Upgrade to Professional"
- Stripe checkout page displays: new price ($1,800/month), prorated charge for current period
- After payment, plan updates immediately
- Integration limit increases from 3 to 8
- Confirmation email sent with updated invoice

**US-8.2**: As a customer, I want to update my payment method so that billing continues uninterrupted.

**Acceptance Criteria**:

- User navigates to Settings → Billing → Payment Method
- Current card displayed (last 4 digits, expiry date)
- User clicks "Update Card"
- Stripe payment form loads (PCI-compliant iframe)
- User enters new card details, submits
- Success message: "Payment method updated"
- Next billing charge uses new card

**US-8.3**: As a customer, I want to cancel my subscription so that I stop being charged.

**Acceptance Criteria**:

- User navigates to Settings → Billing → Cancel Subscription
- Cancellation flow: reason survey (optional), confirmation modal
- Modal warns: "Access continues until end of billing period (2025-11-15). Data will be deleted 30 days after."
- User confirms cancellation
- Subscription status changes to "Canceling" (active until period end)
- Cancellation confirmation email sent with data export link

---

## Functional Requirements

### FR-1: Authentication & Authorization

| ID     | Requirement                                     | Priority | Acceptance Criteria                                          |
| ------ | ----------------------------------------------- | -------- | ------------------------------------------------------------ |
| FR-1.1 | Email/password authentication via Supabase Auth | P0       | Users can register, login, reset password                    |
| FR-1.2 | JWT-based session management                    | P0       | Tokens expire after 7 days, refresh tokens rotate            |
| FR-1.3 | Multi-factor authentication (MFA)               | P1       | Admin users can enable TOTP-based MFA                        |
| FR-1.4 | Role-based access control (RBAC)                | P0       | Three roles: ADMIN, EDITOR, VIEWER with distinct permissions |
| FR-1.5 | OAuth 2.0 integration flow                      | P0       | Support Xero, HubSpot, Asana, Shopify OAuth                  |
| FR-1.6 | Password policy enforcement                     | P1       | Min 8 chars, 1 uppercase, 1 number, 1 special char           |

### FR-2: Data Integration

| ID     | Requirement                   | Priority | Acceptance Criteria                                         |
| ------ | ----------------------------- | -------- | ----------------------------------------------------------- |
| FR-2.1 | Xero financial data sync      | P0       | Daily sync of P&L, Balance Sheet, Invoices                  |
| FR-2.2 | HubSpot CRM sync              | P0       | Daily sync of Deals, Contacts, Companies                    |
| FR-2.3 | Asana project management sync | P1       | Daily sync of Tasks, Projects, Users                        |
| FR-2.4 | Shopify e-commerce sync       | P1       | Hourly sync of Orders, Products, Customers                  |
| FR-2.5 | Error handling & retry logic  | P0       | 3 retries with exponential backoff, error logging           |
| FR-2.6 | Data deduplication            | P0       | Upsert logic prevents duplicate records                     |
| FR-2.7 | Manual sync trigger           | P1       | Users can force sync via UI ("Sync Now" button)             |
| FR-2.8 | Integration health monitoring | P1       | Dashboard shows last sync time, error count per integration |

### FR-3: Data Storage & Querying

| ID     | Requirement                        | Priority | Acceptance Criteria                                                |
| ------ | ---------------------------------- | -------- | ------------------------------------------------------------------ |
| FR-3.1 | Multi-tenant database architecture | P0       | Tenant isolation via tenant_id + Row-Level Security                |
| FR-3.2 | Time-series financial data storage | P0       | Optimized schema for date-range queries, indexed on recordDate     |
| FR-3.3 | Data retention policy              | P1       | 7-year retention (AU tax compliance), archival to S3 after 3 years |
| FR-3.4 | API query performance              | P0       | p95 latency <500ms for dashboard data queries                      |
| FR-3.5 | Database backups                   | P0       | Daily automated backups, 30-day retention, point-in-time recovery  |
| FR-3.6 | Data export API                    | P1       | Users can export data via REST API (JSON, CSV formats)             |

### FR-4: Dashboard & Visualization

| ID     | Requirement                      | Priority | Acceptance Criteria                                          |
| ------ | -------------------------------- | -------- | ------------------------------------------------------------ |
| FR-4.1 | Summary dashboard with KPI cards | P0       | 4 KPI cards: Revenue, Cash Flow, Pipeline, Custom Metric     |
| FR-4.2 | Financial trend chart (Visx)     | P0       | Line chart showing Revenue, Expenses, Profit over time       |
| FR-4.3 | Sales funnel visualization       | P0       | Funnel chart with stages, conversion rates, deal values      |
| FR-4.4 | Custom metric chart              | P1       | User-defined metrics displayed as line/bar chart             |
| FR-4.5 | Date range filtering             | P0       | Global filter: Last 7/30/90 days, YTD, Custom range          |
| FR-4.6 | Interactive chart drill-down     | P1       | Click chart segment to view underlying data table            |
| FR-4.7 | Mobile-responsive layout         | P0       | Dashboard usable on tablets (768px+), limited mobile support |
| FR-4.8 | Dashboard load performance       | P0       | Largest Contentful Paint (LCP) <2.5s                         |

### FR-5: Alerting & Notifications

| ID     | Requirement                  | Priority | Acceptance Criteria                                         |
| ------ | ---------------------------- | -------- | ----------------------------------------------------------- |
| FR-5.1 | Threshold-based email alerts | P0       | Alert when metric crosses threshold (e.g., Cash Flow <$50k) |
| FR-5.2 | Slack integration for alerts | P1       | Post alerts to configured Slack channel                     |
| FR-5.3 | Alert configuration UI       | P0       | Users define: metric, condition, threshold, channel         |
| FR-5.4 | Alert history log            | P1       | View all triggered alerts (last 90 days)                    |
| FR-5.5 | Alert deduplication          | P0       | Don't re-trigger until value recovers (10% buffer)          |

### FR-6: Reporting & Exports

| ID     | Requirement             | Priority | Acceptance Criteria                                     |
| ------ | ----------------------- | -------- | ------------------------------------------------------- |
| FR-6.1 | PDF dashboard export    | P1       | Generate PDF with charts and KPI summary                |
| FR-6.2 | CSV data export         | P0       | Export raw data tables to CSV                           |
| FR-6.3 | Scheduled email reports | P1       | Weekly/monthly automated reports sent via email         |
| FR-6.4 | Custom branding         | P1       | Customer logo appears on exports (uploaded in Settings) |

### FR-7: User Management

| ID     | Requirement            | Priority | Acceptance Criteria                                       |
| ------ | ---------------------- | -------- | --------------------------------------------------------- |
| FR-7.1 | User invitation system | P0       | Admin can invite users with role assignment               |
| FR-7.2 | User deactivation      | P0       | Admin can deactivate users (revokes access)               |
| FR-7.3 | Role management        | P0       | Admin can change user roles (ADMIN, EDITOR, VIEWER)       |
| FR-7.4 | Audit logging          | P1       | Log all user actions (login, data access, config changes) |

### FR-8: Billing & Subscriptions

| ID     | Requirement                     | Priority | Acceptance Criteria                                                    |
| ------ | ------------------------------- | -------- | ---------------------------------------------------------------------- |
| FR-8.1 | Stripe subscription integration | P0       | Monthly billing via Stripe Checkout                                    |
| FR-8.2 | Tier upgrades/downgrades        | P0       | Prorated billing when changing plans                                   |
| FR-8.3 | Payment method management       | P0       | Users can update credit card via Stripe portal                         |
| FR-8.4 | Subscription cancellation       | P0       | Users can cancel (access until period end, data deleted after 30 days) |
| FR-8.5 | Invoice generation              | P0       | Automated invoices emailed monthly                                     |

---

## Non-Functional Requirements

### NFR-1: Performance

| ID      | Requirement               | Target                     | Measurement          |
| ------- | ------------------------- | -------------------------- | -------------------- |
| NFR-1.1 | Dashboard load time (LCP) | <2.5s                      | Core Web Vitals      |
| NFR-1.2 | API response time (p95)   | <500ms                     | DataDog APM          |
| NFR-1.3 | Database query time (p95) | <100ms                     | Prisma metrics       |
| NFR-1.4 | Time to Interactive (TTI) | <3.5s                      | Lighthouse score >90 |
| NFR-1.5 | Data sync completion time | <5 minutes per integration | n8n execution logs   |

### NFR-2: Scalability

| ID      | Requirement      | Target                       | Implementation              |
| ------- | ---------------- | ---------------------------- | --------------------------- |
| NFR-2.1 | Concurrent users | Support 500 concurrent users | Vercel auto-scaling         |
| NFR-2.2 | Database size    | Handle 1TB data              | PostgreSQL partitioning     |
| NFR-2.3 | API rate limits  | 100 req/min per tenant       | Upstash Redis rate limiting |
| NFR-2.4 | ETL throughput   | Process 1M records/day       | n8n parallelization         |

### NFR-3: Reliability

| ID      | Requirement                  | Target                         | Validation                      |
| ------- | ---------------------------- | ------------------------------ | ------------------------------- |
| NFR-3.1 | System uptime                | 99.9% (8.76 hrs downtime/year) | Uptime monitoring (Checkly)     |
| NFR-3.2 | Data durability              | 99.99% (no data loss)          | Automated backups + replication |
| NFR-3.3 | Mean Time To Recovery (MTTR) | <2 hours                       | Disaster recovery drills        |
| NFR-3.4 | Error rate                   | <0.1% of API requests          | Sentry error tracking           |

### NFR-4: Security

| ID      | Requirement                | Standard                    | Validation                |
| ------- | -------------------------- | --------------------------- | ------------------------- |
| NFR-4.1 | Data encryption at rest    | AES-256                     | Supabase config           |
| NFR-4.2 | Data encryption in transit | TLS 1.3                     | SSL Labs test (A+ rating) |
| NFR-4.3 | Authentication security    | JWT with rotation           | Supabase Auth audit       |
| NFR-4.4 | OAuth token storage        | AES-256-GCM encryption      | Code review               |
| NFR-4.5 | Vulnerability scanning     | Weekly automated scans      | Snyk integration          |
| NFR-4.6 | Privacy compliance         | Australian Privacy Act 1988 | Legal review              |

### NFR-5: Usability

| ID      | Requirement                    | Target                   | Measurement             |
| ------- | ------------------------------ | ------------------------ | ----------------------- |
| NFR-5.1 | Onboarding time to first value | <30 minutes              | User testing            |
| NFR-5.2 | Dashboard learnability         | No training required     | User feedback survey    |
| NFR-5.3 | Mobile responsiveness          | Support tablets (768px+) | Cross-device testing    |
| NFR-5.4 | Accessibility                  | WCAG 2.1 Level AA        | Automated testing (Axe) |

### NFR-6: Maintainability

| ID      | Requirement            | Implementation                                 |
| ------- | ---------------------- | ---------------------------------------------- |
| NFR-6.1 | Code test coverage     | >80% for critical paths (API, auth, data sync) |
| NFR-6.2 | TypeScript strict mode | Enabled across entire codebase                 |
| NFR-6.3 | API documentation      | OpenAPI spec for all endpoints                 |
| NFR-6.4 | Infrastructure as Code | Terraform for n8n deployment                   |

---

## Feature Specifications

### Feature 1: Financial Performance Dashboard

**Description**: Primary dashboard showing revenue, expenses, profit, and cash flow trends.

**User Value**: Replaces manual spreadsheet reporting, saves 5-10 hours/week, enables real-time financial visibility.

**Design Mockup**: [Link to Figma - TBD]

**Components**:

1. **KPI Summary Cards** (Top Row)
   - Revenue (Month-to-Date): Current value, % change vs. prior month, trend arrow
   - Net Profit: Current value, % margin, color-coded (green >10%, yellow 5-10%, red <5%)
   - Cash Flow: Current balance, 30-day projection, alert if <$50k
   - Accounts Receivable: Outstanding amount, avg days to payment

2. **Revenue Trend Chart** (Visx Line Chart)
   - X-axis: Date (monthly aggregation)
   - Y-axis: Revenue (AUD)
   - Multiple series: Revenue, Expenses, Net Profit
   - Interactive: Hover for exact values, click to drill down to transactions

3. **Cash Flow Waterfall Chart** (Visx Bar Chart)
   - Shows inflows and outflows over selected period
   - Categories: Sales, Expenses, Payroll, Taxes, Loans
   - Starting balance → ending balance visualization

4. **Profit & Loss Table**
   - Period comparison: Current month vs. Prior month vs. Same month last year
   - Categories: Revenue, COGS, Operating Expenses, EBITDA, Net Profit
   - Expandable rows for sub-categories

**Technical Implementation**:

- Data Source: `financials` table (Xero sync)
- API Endpoint: `GET /api/financials?startDate=X&endDate=Y`
- Caching: 5-minute client-side cache (React Query)
- Refresh: Manual refresh button + auto-refresh on interval (configurable)

**Acceptance Criteria**:

- Dashboard loads in <2.5s
- All charts render correctly with sample data
- Date range filter updates all charts simultaneously
- Mobile layout stacks charts vertically
- Export to PDF includes all charts and tables

---

### Feature 2: Sales Pipeline Funnel

**Description**: Visual representation of sales stages from lead to closed deal, with conversion rates.

**User Value**: Identifies bottlenecks in sales process, improves forecasting accuracy.

**Components**:

1. **Funnel Visualization** (Visx Custom Shape)
   - Stages: Lead → Qualified → Proposal → Negotiation → Closed Won
   - Each stage shows: count, total value (AUD), conversion rate to next stage
   - Width proportional to value (wider = more $)
   - Color gradient: Blue (top) → Green (bottom)

2. **Conversion Metrics Table**
   - Stage-by-stage breakdown
   - Metrics: Deals entered, Deals progressed, Conversion %, Avg time in stage
   - Highlight low-conversion stages (red <50%, yellow 50-70%, green >70%)

3. **Deal List** (Drill-Down)
   - Click on funnel stage to see all deals in that stage
   - Columns: Deal name, Value, Contact, Last activity, Days in stage
   - Sortable by column
   - Link to CRM (HubSpot) for full deal details

**Data Source**: `lead_events` table (HubSpot sync)

**API Endpoint**: `GET /api/leads?stage=X&startDate=Y&endDate=Z`

**Acceptance Criteria**:

- Funnel chart displays correctly with varying stage sizes
- Conversion rates calculated accurately (validated against HubSpot report)
- Clicking stage opens drill-down modal within 200ms
- Export includes funnel image + conversion table

---

### Feature 3: Custom Metric Builder

**Description**: Allow users to define and track custom KPIs specific to their business.

**User Value**: Flexibility to track unique metrics (e.g., "Project Delivery Days", "Customer Satisfaction Score").

**UI Flow**:

1. **Settings → Custom Metrics → Create New Metric**
2. **Metric Definition Form**:
   - Name: "Average Project Delivery Time"
   - Unit: "Days"
   - Data Source: Manual Upload (CSV) OR Formula (e.g., `SUM(project_days) / COUNT(projects)`)
   - Frequency: Daily / Weekly / Monthly
3. **Data Upload** (if manual):
   - CSV template download
   - Upload CSV with columns: Date, Value
   - Validation: Check for date format, numeric values
4. **Chart Configuration**:
   - Chart type: Line / Bar / Area
   - Color: User selects from palette
   - Target line (optional): e.g., "Goal: 30 days"
5. **Save & Add to Dashboard**
   - Metric appears as new chart widget
   - Historical data rendered immediately

**Technical Implementation**:

- Data Source: `custom_metrics` table
- API Endpoints:
  - `POST /api/metrics` - Create metric
  - `POST /api/metrics/:id/data` - Upload data
  - `GET /api/metrics/:id` - Fetch metric values
- Formula Parsing: Use mathjs library for calculation logic
- Validation: Zod schema for CSV structure

**Acceptance Criteria**:

- User can create metric and see data within 30 seconds
- CSV upload validates format and shows error messages for invalid rows
- Formula metrics recalculate automatically when source data updates
- Chart renders with same styling as built-in charts

---

### Feature 4: Threshold Alerts

**Description**: Automated notifications when metrics cross user-defined thresholds.

**User Value**: Proactive problem detection (e.g., cash flow warnings, budget overruns).

**UI Flow**:

1. **Settings → Alerts → Create Alert**
2. **Alert Configuration Form**:
   - Alert Name: "Cash Flow Low Alert"
   - Metric: Select from dropdown (Revenue, Cash Flow, Custom Metrics, etc.)
   - Condition: Less Than / Greater Than / Equal To
   - Threshold: $50,000
   - Frequency: Check after each data sync / Check hourly
   - Notification Channels: Email (default) / Slack (requires integration)
3. **Notification Template**:
   - Subject: "🚨 Alert: Cash Flow below $50,000"
   - Body: Current value, threshold, trend chart, link to dashboard
4. **Save**

**Alert Evaluation Logic**:

- Trigger: After each data sync (n8n workflow completion)
- Check: Compare latest metric value to threshold
- Action: If condition met AND alert not recently triggered (debounce: 24 hours), send notification
- Logging: Record in `alerts` table (triggered_at, metric_value, notification_sent)

**Notification Delivery**:

- Email: SendGrid transactional email
- Slack: POST to webhook URL (configured in Settings → Integrations → Slack)

**Acceptance Criteria**:

- User can create alert and receive test notification
- Alert triggers correctly when threshold crossed (validated via manual test)
- Alert does not re-trigger within 24-hour debounce period
- Email includes chart showing metric trend over last 30 days
- User can view alert history (last 90 days) in Settings → Alerts

---

### Feature 5: Integration Management

**Description**: Centralized UI for connecting, monitoring, and managing external integrations.

**User Value**: Single pane of glass for integration health, reduces support burden.

**UI Components**:

1. **Integration Dashboard** (Settings → Integrations)
   - Grid view showing all available integrations
   - Each card displays: Logo, Name, Status (Not Connected / Active / Error), Last Sync Time
   - "Connect" button for inactive integrations
   - "Configure" button for active integrations

2. **Connection Flow** (OAuth)
   - Click "Connect Xero"
   - Redirect to Xero authorization page
   - User approves access
   - Redirect back to Scriptum Arc
   - Success message: "Xero connected! Initial sync started."

3. **Integration Detail Page**
   - Status: Active, Last sync: 2 hours ago, Next sync: In 22 hours
   - Sync History Table: Date/Time, Status (Success/Failed), Records Synced, Duration, Error Message
   - Actions: "Sync Now", "Disconnect", "View Logs"
   - Configuration: Sync frequency (Daily / Hourly), Data filters (e.g., "Only sync invoices from last 12 months")

4. **Error Handling**:
   - If sync fails, integration status changes to "Error"
   - Error message displayed: "Xero token expired. Reconnect to resume syncing."
   - Email notification sent to admin users
   - Retry button available (attempts sync again)

**Technical Implementation**:

- OAuth Flow: Standard OAuth 2.0 authorization code flow
- Token Storage: Encrypted with AES-256-GCM, stored in `integrations` table
- Token Refresh: Automatic refresh before expiry (Xero tokens expire after 30 minutes)
- Sync Orchestration: n8n workflows triggered by cron schedule
- Error Logging: Write to `sync_logs` table + Sentry for exception tracking

**Acceptance Criteria**:

- User can connect integration and see "Active" status within 1 minute
- Sync history displays last 30 sync attempts with timestamps
- Disconnecting integration revokes OAuth token immediately
- Error states provide actionable guidance (e.g., "Reconnect" button, not generic "Error")
- Manual "Sync Now" triggers sync within 30 seconds

---

## User Interface Requirements

### Design System

**Color Palette**:

- Primary: #1E40AF (Blue 800) - CTAs, links, active states
- Secondary: #10B981 (Green 500) - Success states, positive trends
- Warning: #F59E0B (Amber 500) - Caution states, moderate alerts
- Error: #EF4444 (Red 500) - Error states, negative trends, critical alerts
- Neutral: #6B7280 (Gray 500) - Text, borders, backgrounds

**Typography**:

- Headings: Inter (sans-serif), weights 600-700
- Body: Inter, weight 400-500
- Monospace: JetBrains Mono (for data tables, code)

**Component Library**: Headless UI (React) + custom Tailwind CSS components

**Responsive Breakpoints**:

- Mobile: <768px (limited support - view-only)
- Tablet: 768px-1024px (full support)
- Desktop: >1024px (primary target)

### Navigation Structure

```
Top Navigation Bar
├── Logo (Scriptum Arc)
├── Dashboard (default landing page)
├── Integrations
├── Settings
│   ├── Profile
│   ├── Users
│   ├── Custom Metrics
│   ├── Alerts
│   ├── Billing
│   └── Integrations
└── User Menu
    ├── Account Settings
    ├── Help & Support
    └── Logout
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Date Range Picker | Refresh Button | Export Button │
├─────────────────────────────────────────────────────────────┤
│  KPI Cards (4 columns)                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │
│  │Revenue │ │Profit  │ │Cash    │ │Pipeline│               │
│  │$120K   │ │$45K    │ │Flow    │ │Value   │               │
│  │ ↑ 12%  │ │ ↑ 8%   │ │$68K    │ │$280K   │               │
│  └────────┘ └────────┘ └────────┘ └────────┘               │
├─────────────────────────────────────────────────────────────┤
│  Financial Trend Chart (Visx Line Chart)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Revenue, Expenses, Profit (3 lines)        │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Sales Funnel (Left) | Cash Flow Waterfall (Right)          │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │   Funnel Chart   │  │  Waterfall Chart │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Accessibility Requirements

- **WCAG 2.1 Level AA Compliance**:
  - Color contrast ratio ≥4.5:1 for normal text, ≥3:1 for large text
  - All interactive elements keyboard accessible (tab navigation)
  - ARIA labels on all charts and buttons
  - Screen reader support for data tables
  - Focus indicators on all focusable elements

- **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
- **Alt Text**: All images and charts have descriptive alt text
- **Form Validation**: Inline error messages, aria-invalid attributes

---

## Integration Requirements

### Priority 1 Integrations (MVP)

| Integration | Category     | Data Synced                            | Sync Frequency   | OAuth Provider    |
| ----------- | ------------ | -------------------------------------- | ---------------- | ----------------- |
| **Xero**    | Accounting   | P&L, Balance Sheet, Invoices, Expenses | Daily (2am AEST) | Xero OAuth 2.0    |
| **HubSpot** | CRM          | Deals, Contacts, Companies, Activities | Daily (3am AEST) | HubSpot OAuth 2.0 |
| **Asana**   | Project Mgmt | Tasks, Projects, Users, Time Tracking  | Daily (4am AEST) | Asana OAuth 2.0   |

### Priority 2 Integrations (Post-MVP)

| Integration           | Category      | Data Synced                            | Launch Target |
| --------------------- | ------------- | -------------------------------------- | ------------- |
| **Shopify**           | E-Commerce    | Orders, Products, Customers, Inventory | Month 4       |
| **MYOB**              | Accounting    | Same as Xero                           | Month 5       |
| **Pipedrive**         | CRM           | Deals, Contacts, Activities            | Month 6       |
| **Slack**             | Communication | Webhook for alerts (outbound only)     | Month 4       |
| **QuickBooks Online** | Accounting    | Same as Xero                           | Month 7       |

### Integration Requirements (Technical)

**Authentication**:

- All integrations use OAuth 2.0 (no API keys or passwords)
- Tokens encrypted with AES-256-GCM before storage
- Automatic token refresh before expiry
- Graceful handling of revoked tokens (prompt user to reconnect)

**Data Mapping**:

- Standardized schema mapping (external API → internal tables)
- Example: Xero `ProfitAndLoss.Revenue` → `financials.revenue`
- Configurable field mapping for custom data sources

**Error Handling**:

- Rate limiting: Respect API rate limits (e.g., Xero: 60 req/min)
- Retry logic: 3 retries with exponential backoff (1s, 4s, 16s)
- Error logging: Log all failures to `sync_logs` + Sentry
- User notification: Email on repeated failures (3+ consecutive)

**Data Quality**:

- Deduplication: Prevent duplicate records via unique constraints
- Validation: Reject invalid data (e.g., negative revenue, future dates)
- Reconciliation: Daily checksum validation against source system

---

## Success Metrics

### Product Metrics (KPIs)

| Metric                         | Target (Month 12) | Measurement Method                            |
| ------------------------------ | ----------------- | --------------------------------------------- |
| **Active Customers**           | 20                | Count of paid subscriptions                   |
| **Monthly Active Users (MAU)** | 60                | Users logging in at least once/month          |
| **Dashboard Views per User**   | 15/month          | Analytics tracking (Amplitude)                |
| **Average Session Duration**   | 8 minutes         | Analytics tracking                            |
| **Feature Adoption Rate**      | 80%               | % of users who created custom alert or metric |
| **Net Promoter Score (NPS)**   | 50+               | Quarterly survey                              |

### Business Metrics

| Metric                    | Target (Year 1)  | Measurement Method         |
| ------------------------- | ---------------- | -------------------------- |
| **MRR Growth Rate**       | 15%/month avg    | Stripe analytics           |
| **Customer Churn Rate**   | <3.5%/month      | Subscription cancellations |
| **CAC Payback Period**    | <3 months        | (CAC ÷ MRR) ÷ Gross Margin |
| **Time to First Value**   | <30 minutes      | User onboarding analytics  |
| **Support Ticket Volume** | <5/customer/year | Support ticket system      |

### Technical Metrics

| Metric                        | Target | Alerting Threshold       |
| ----------------------------- | ------ | ------------------------ |
| **API Error Rate**            | <0.1%  | >1% for 5 minutes        |
| **Dashboard Load Time (p95)** | <2.5s  | >3.5s for 15 minutes     |
| **Uptime**                    | 99.9%  | <99.5% in any week       |
| **Data Sync Success Rate**    | >99%   | <95% for any integration |
| **Database Query Time (p95)** | <100ms | >250ms for 10 minutes    |

---

## Release Plan

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Establish secure backend and authentication

**Deliverables**:

- ✅ Supabase PostgreSQL setup with multi-tenancy
- ✅ Prisma schema with 4 core tables (ClientKPI, Financial, LeadEvent, CustomMetric)
- ✅ Supabase Auth integration (email/password)
- ✅ 4 API endpoints (KPIs, Financials, Leads, Metrics) with JWT auth
- ✅ Prisma seed script with sample data

**Release Criteria**:

- All API endpoints return 200 OK with valid JWT
- Database migrations run successfully
- Type-safe Prisma queries validated
- Postman collection for API testing created

---

### Phase 2: ETL & Integrations (Weeks 5-10)

**Goal**: Automate data ingestion from external systems

**Deliverables**:

- ✅ n8n deployed on DigitalOcean Droplet
- ✅ Xero integration workflow (P&L, Balance Sheet sync)
- ✅ HubSpot integration workflow (Deals, Contacts sync)
- ✅ Asana integration workflow (Tasks, Projects sync)
- ✅ Error handling and retry logic in all workflows
- ✅ Integration management UI (connect, sync, view logs)

**Release Criteria**:

- All 3 integrations successfully sync sample data
- Sync logs visible in UI with timestamps and error messages
- Manual "Sync Now" trigger works
- OAuth token encryption validated

---

### Phase 3: Dashboard & Visualization (Weeks 11-15)

**Goal**: Deliver customer-facing dashboard

**Deliverables**:

- ✅ Next.js dashboard UI with responsive layout
- ✅ 4 KPI summary cards with real-time data
- ✅ Financial trend chart (Visx line chart)
- ✅ Sales funnel chart (Visx funnel)
- ✅ Date range filtering
- ✅ PDF export functionality
- ✅ Mobile-responsive design (tablet support)

**Release Criteria**:

- Dashboard loads in <2.5s with sample data
- All charts render correctly on desktop and tablet
- Date filter updates all charts simultaneously
- PDF export includes all charts and tables
- Lighthouse score >90 for performance

---

### Phase 4: Beta Launch (Weeks 16-18)

**Goal**: Onboard first 5 beta customers

**Deliverables**:

- ✅ Billing integration (Stripe subscriptions)
- ✅ User management UI (invite, deactivate, role changes)
- ✅ Custom metric builder
- ✅ Threshold alert system (email notifications)
- ✅ Help documentation and onboarding guide
- ✅ Customer feedback survey

**Release Criteria**:

- 5 beta customers fully onboarded
- Each customer has at least 2 active integrations
- Zero critical bugs in production
- Average NPS score >40 from beta cohort
- Support response time <4 hours

---

### Phase 5: General Availability (Month 6)

**Goal**: Public launch and scale to 20 customers

**Deliverables**:

- ✅ Marketing website (landing page, pricing, case studies)
- ✅ Self-service signup flow
- ✅ Automated onboarding emails
- ✅ Slack integration for alerts
- ✅ Scheduled reports (weekly email)
- ✅ Advanced analytics dashboard (for internal monitoring)

**Release Criteria**:

- 20 paying customers (3-month retention >80%)
- <5 support tickets/customer/month
- Uptime >99.9% in previous 60 days
- All critical bugs from beta resolved

---

## Out of Scope (MVP)

The following features are **explicitly excluded** from the MVP to maintain focus and accelerate launch:

### Excluded Features

| Feature                                         | Rationale                               | Future Phase                     |
| ----------------------------------------------- | --------------------------------------- | -------------------------------- |
| **Mobile App (iOS/Android)**                    | Mobile web sufficient for MVP           | Year 2 (React Native)            |
| **White-Label/Multi-Brand**                     | Single-brand focus initially            | Phase 6 (agency partnerships)    |
| **AI/ML Insights**                              | Requires critical mass of data          | Phase 7 (predictive analytics)   |
| **Multi-Currency Support**                      | Target market is AU-only (AUD)          | International expansion (Year 3) |
| **SSO/SAML**                                    | Enterprise feature, not needed for SMEs | Enterprise tier (50+ users)      |
| **Custom Workflow Builder**                     | Too complex for MVP, use n8n directly   | Phase 8 (low-code automation)    |
| **Real-Time Data (WebSockets)**                 | Daily sync sufficient for SMEs          | Phase 9 (real-time dashboards)   |
| **Data Warehouse Export (Snowflake, BigQuery)** | Overkill for SME data volumes           | Enterprise tier                  |
| **Advanced Permissions (Field-Level)**          | Role-based is sufficient                | Phase 10 (enterprise security)   |
| **API Rate Limiting (per user)**                | Tenant-level limiting sufficient        | Scale optimization               |

### Explicitly Not Building

- ❌ No accounting features (invoicing, expense tracking) - Xero does this
- ❌ No CRM features (lead management, email campaigns) - HubSpot does this
- ❌ No project management (task assignment, time tracking) - Asana does this
- ❌ No data entry UI (customers enter data in source systems, we consolidate)

**Philosophy**: Scriptum Arc is a **read-only BI layer**. We aggregate and visualize data from systems of record, but we do not become a system of record ourselves.

---

## Assumptions & Dependencies

### Assumptions

1. **Customer Data Access**: Customers are willing and able to grant OAuth access to their business systems
2. **Data Quality**: Source systems (Xero, HubSpot) contain reasonably accurate data (garbage in = garbage out)
3. **Internet Connectivity**: Customers have reliable internet (cloud-based platform)
4. **Browser Compatibility**: Customers use modern browsers (Chrome, Safari, Edge, Firefox - last 2 versions)
5. **Billing**: Customers have credit cards and are comfortable with subscription billing
6. **AU Market**: Initial focus is Australia only (data residency, compliance, integrations)

### Dependencies

| Dependency                    | Owner           | Risk Level | Mitigation                                               |
| ----------------------------- | --------------- | ---------- | -------------------------------------------------------- |
| **Vercel Availability**       | Vercel Inc.     | Medium     | Backup deployment to Netlify (manual)                    |
| **Supabase Availability**     | Supabase Inc.   | Medium     | Daily backups to S3, can restore to self-hosted Postgres |
| **Xero API Stability**        | Xero Ltd.       | Low        | API versioning, maintain compatibility layer             |
| **HubSpot API Stability**     | HubSpot Inc.    | Low        | Same as Xero                                             |
| **Stripe Payment Processing** | Stripe Inc.     | Low        | Industry standard, 99.99% uptime SLA                     |
| **n8n Open Source**           | n8n GmbH        | Low        | Self-hosted, code is open source (can fork if abandoned) |
| **SendGrid Email Delivery**   | Twilio/SendGrid | Low        | Can swap to AWS SES or Postmark                          |
| **OAuth Provider Uptime**     | Various         | Medium     | Provide manual CSV upload as fallback for initial data   |

### External Constraints

1. **Australian Privacy Act Compliance**: Must store data in Australia, implement privacy controls
2. **OAuth Scopes**: Limited by what scopes external APIs provide (e.g., Xero read-only scopes)
3. **API Rate Limits**: Must respect rate limits (Xero: 60 req/min, HubSpot: 100 req/10s)
4. **Browser Limitations**: Chart rendering performance varies by browser (optimize for Chrome first)

---

## Appendix

### User Story Template

```
As a [persona],
I want to [action],
So that [benefit/outcome].

Acceptance Criteria:
- Given [context], when [action], then [expected result]
- ...
```

### Definition of Done (DoD)

A feature is considered "done" when:

- ✅ Code is merged to `main` branch
- ✅ Unit tests written and passing (>80% coverage for critical paths)
- ✅ Integration tests passing (API contracts validated)
- ✅ Manual testing completed (happy path + error cases)
- ✅ Code reviewed and approved by at least 1 reviewer (or solo: self-review checklist)
- ✅ Documentation updated (API docs, user guide, release notes)
- ✅ Deployed to staging environment and smoke tested
- ✅ Performance benchmarks met (load time, query time)
- ✅ Accessibility validated (Axe scan, keyboard navigation tested)
- ✅ No critical or high-severity bugs
- ✅ Product owner (founder) approval

### Glossary

**Business Entities**:

- **Tenant**: A company or organization that subscribes to Scriptum Arc (Scriptum Arc's customer). Each tenant has isolated data and pays subscription fees. Example: ABC Construction Pty Ltd.
- **User**: An individual employee of a tenant company who has access to the platform. Users belong to exactly one tenant and have role-based permissions (ADMIN, EDITOR, VIEWER). Example: Sarah Chen (sarah@abcconstruction.com.au).
- **Client**: A business entity, customer, or project that the tenant company is tracking metrics for (stored as `ClientKPI` in database). This is the tenant's customer, not Scriptum Arc's customer. Example: Harbor Bridge Renovation Project.

For detailed entity relationship explanations with real-world examples, see [Entity Relationship Explained](../concepts/entity-relationship-explained.md).

**Technical Terms**:

- **CAC**: Customer Acquisition Cost (sales/marketing spend per new customer)
- **KPI**: Key Performance Indicator (measurable value demonstrating effectiveness)
- **LCP**: Largest Contentful Paint (web performance metric, Core Web Vitals)
- **LTV**: Lifetime Value (total revenue expected from a customer)
- **MAU**: Monthly Active Users (count of users active in last 30 days)
- **MRR**: Monthly Recurring Revenue (predictable monthly subscription revenue)
- **NPS**: Net Promoter Score (customer satisfaction metric, scale -100 to +100)
- **OAuth**: Open Authorization (standard for delegated authorization)
- **p95**: 95th percentile (95% of values are below this threshold)
- **RBAC**: Role-Based Access Control (permissions based on user role)
- **TTI**: Time to Interactive (when page becomes fully interactive)

---

**Document End**

**Review Cycle**: Bi-weekly during development, monthly post-launch
**Next Review**: 2025-11-01
**Change History**:

- 2025-10-15: Initial version (v1.0) - MVP requirements documented
- TBD: Version updates as features evolve

**Approval**:

- Product Owner: [Founder Name] - Approved 2025-10-15
- Technical Lead: [Founder Name] - Approved 2025-10-15
