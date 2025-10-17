# n8n vs Web App Separation of Concerns

**Version**: 1.1  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture  
**Status**: Defined

---

## BUSINESS CONTEXT: INTERNAL OPERATIONS PLATFORM

**Zixly is an open-source internal operations platform for the Zixly service business.**

This platform:

- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with the self-hostable SME stack
- Provides authentic expertise and continuous improvement
- Is open-source for demonstration and reuse purposes

---

## Overview

This document defines the clear boundaries between n8n (workflow automation platform) and Zixly's web application (business intelligence platform). The separation ensures zero duplication, leverages each platform's strengths, and creates a complementary architecture that scales efficiently.

---

## Core Principle: Complementary Architecture

**Philosophy**: Each platform does what it does best, with zero overlap in responsibilities.

- **n8n**: Workflow automation, data movement, API integrations
- **Web App**: Business intelligence, user experience, real-time communication, analytics

---

## CURRENT IMPLEMENTATION STATUS

### ✅ IMPLEMENTED (Web App)

- Basic dashboard UI with static charts
- Multi-tenant authentication (Supabase Auth) - single tenant (Zixly)
- API endpoints for data retrieval
- Static data visualization
- Basic UI components
- Internal operations data tracking

### ❌ NOT IMPLEMENTED (Web App)

- Real-time WebSocket connections
- Live dashboard updates
- Interactive filtering and drill-down
- Advanced analytics and ML
- Mobile application

### ❌ NOT IMPLEMENTED (n8n)

- n8n deployment and configuration
- Workflow execution engine
- OAuth integrations (Xero, HubSpot, Asana)
- Custom TypeScript nodes
- Automated data sync workflows

---

## INTERNAL OPERATIONS FOCUS

### What We Track (Zixly Service Business):

- **Service Clients**: Businesses using Zixly for n8n automation
- **Project Performance**: Service delivery metrics and timelines
- **Financial Performance**: Revenue, expenses, profit from service delivery
- **Team Productivity**: Billable hours, project velocity, efficiency
- **Client Satisfaction**: NPS scores, retention rates, feedback

### Data Flow (Internal Operations):

```
Zixly Service Clients → n8n Workflows → PostgreSQL → Dashboard → Zixly Team
```

### Open-Source Benefits:

- **Transparency**: Clients can see our actual operations
- **Trust Building**: Open codebase demonstrates confidence
- **Demonstration**: Live system shows capabilities to potential clients
- **Community**: Sharing knowledge and reusable patterns

---

## Detailed Separation of Concerns

### n8n Platform Responsibilities

#### ✅ What n8n Handles (Workflow Automation)

**Workflow Orchestration:**

- Visual workflow builder and execution engine
- Workflow scheduling and cron-based triggers
- Workflow execution monitoring and error handling
- Workflow retry logic and failure recovery
- Workflow versioning and deployment

**API Integrations:**

- OAuth 2.0 authentication with 50+ business systems
- API rate limiting and error handling
- Data extraction from external systems (Xero, HubSpot, Asana, etc.)
- Webhook handling for real-time data updates
- API pagination and bulk data processing

**Data Transformation:**

- Complex ETL logic and data normalization
- Data aggregation and enrichment
- Currency conversion and timezone handling
- Data validation and quality checks
- Custom business logic via TypeScript nodes

**Automation Management:**

- Scheduled job execution
- Event-driven workflow triggers
- Workflow dependency management
- Custom node development and deployment
- Integration configuration and management

#### ❌ What n8n Cannot Do (Web App Limitations)

**Real-Time Communication:**

- ❌ Persistent WebSocket connections to frontend clients
- ❌ Real-time push notifications to mobile devices
- ❌ Live dashboard updates without page refresh
- ❌ Multi-user collaboration features
- ❌ Real-time data streaming to UI components

**User Interface & Experience:**

- ❌ Interactive business intelligence dashboards
- ❌ Rich data visualization with drill-down capabilities
- ❌ Mobile-responsive user interfaces
- ❌ Multi-tenant user management and RBAC
- ❌ Custom business intelligence workflows

**Advanced Analytics:**

- ❌ Machine learning model hosting and inference
- ❌ Statistical analysis and predictive analytics
- ❌ Complex data correlation and trend analysis
- ❌ Business intelligence calculations
- ❌ Anomaly detection and forecasting

**Mobile Integration:**

- ❌ Mobile application development
- ❌ Native device feature integration (camera, GPS, sensors)
- ❌ Offline data synchronization
- ❌ Mobile push notification management
- ❌ Cross-platform mobile app development

---

### Web Application Responsibilities

#### ✅ What Web App Handles (Business Intelligence)

**Business Intelligence UI:**

- Interactive dashboards with Visx charts
- Real-time data visualization and filtering
- Drill-down capabilities and data exploration
- Custom KPI tracking and monitoring
- Business context presentation and insights

**Real-Time Communication:**

- WebSocket connections for live data updates
- Real-time push notifications to users
- Live dashboard updates without page refresh
- Multi-user collaboration and presence
- Real-time data synchronization across clients

**Multi-Tenant User Management:**

- User authentication and authorization
- Role-based access control (RBAC)
- Tenant isolation and data security
- User session management
- Permission-based data access controls

**Advanced Analytics:**

- Machine learning model hosting and serving
- Predictive analytics and forecasting
- Statistical analysis and trend detection
- Anomaly detection and alerting
- Business intelligence calculations

**Mobile Integration:**

- React Native mobile application
- Native device feature integration
- Offline-first data access
- Mobile push notification system
- Cross-platform mobile development

#### ❌ What Web App Never Does (n8n Responsibilities)

**Workflow Management:**

- ❌ Workflow execution or orchestration
- ❌ Workflow scheduling or cron management
- ❌ Workflow monitoring or error handling
- ❌ Custom node development
- ❌ Workflow versioning or deployment

**API Integrations:**

- ❌ OAuth authentication with external systems
- ❌ API rate limiting or error handling
- ❌ Data extraction from business systems
- ❌ Webhook handling or processing
- ❌ Integration configuration or management

**Data Transformation:**

- ❌ ETL logic or data transformation
- ❌ Data aggregation or enrichment
- ❌ Currency conversion or timezone handling
- ❌ Data validation or quality checks
- ❌ Custom business logic implementation

**Automation:**

- ❌ Scheduled job execution
- ❌ Event-driven automation
- ❌ Workflow dependency management
- ❌ Integration automation
- ❌ Data synchronization workflows

---

## SME Tools in the Architecture

### SME Tools as Data Sources

**Core Principle**: SME tools provide domain-specific functionality and serve as **data sources** for the unified Next.js BI dashboard. They do NOT replace the Next.js application's BI capabilities.

#### SME Tool Responsibilities

**Plane (Project Management):**

- ✅ Project and task management interface
- ✅ Sprint planning and issue tracking
- ✅ Team collaboration on projects
- ❌ NOT a replacement for Next.js service delivery dashboard
- **Data Flow**: Plane data → n8n → PostgreSQL → Next.js dashboard

**Invoice Ninja (Billing):**

- ✅ Invoice generation and payment tracking
- ✅ Client billing management
- ✅ Payment status tracking
- ❌ NOT a replacement for Next.js financial reporting
- **Data Flow**: Invoice data → n8n → PostgreSQL → Next.js dashboard

**Metabase (Static Analytics):**

- ✅ Ad-hoc SQL queries and static reports
- ✅ Pre-built dashboard templates
- ✅ Business intelligence for technical users
- ❌ NOT a replacement for Next.js real-time BI dashboards
- ❌ No real-time updates, limited interactivity
- **Use Case**: Complementary tool for data exploration, not primary BI layer

**Integration Pattern:**

```
┌──────────────────────────────────────────────────────┐
│                    SME Tools Layer                    │
│  (Domain-Specific Data Sources & Operations)         │
│                                                       │
│  Plane    Invoice Ninja    Metabase    Chatwoot     │
│  Mautic   Nextcloud        Xero        Others        │
└────────────────────┬─────────────────────────────────┘
                     │ APIs & Webhooks
┌────────────────────▼─────────────────────────────────┐
│              n8n (Integration Layer)                  │
│  - Extracts data from SME tools                      │
│  - Transforms and normalizes data                    │
│  - Loads into PostgreSQL data warehouse              │
└────────────────────┬─────────────────────────────────┘
                     │ Writes to Database
┌────────────────────▼─────────────────────────────────┐
│         Supabase PostgreSQL (Data Warehouse)         │
│  - Centralized business data storage                 │
│  - Real-time subscriptions                           │
│  - Row-level security for multi-tenancy             │
└────────────────────┬─────────────────────────────────┘
                     │ Reads from Database
┌────────────────────▼─────────────────────────────────┐
│        Next.js Application (Unified BI Layer)        │
│  - Real-time interactive dashboards                  │
│  - Aggregates data from ALL SME tools                │
│  - WebSocket live updates                            │
│  - Advanced analytics and ML models                  │
│  - Mobile app with offline sync                      │
└──────────────────────────────────────────────────────┘
```

### Why Next.js Cannot Be Replaced by SME Tools

**Real-Time Capabilities:**

- SME tools lack WebSocket connections for live updates
- Next.js provides real-time dashboard refreshes as data changes
- Metabase requires manual refresh, no push notifications

**Unified View:**

- SME tools are siloed (Plane doesn't show Invoice Ninja data)
- Next.js aggregates data from ALL sources into unified dashboards
- Cross-functional insights require centralized BI layer

**Advanced Analytics:**

- SME tools lack ML model hosting and predictive analytics
- Next.js provides statistical analysis, forecasting, anomaly detection
- Custom business logic and KPI calculations

**Multi-Tenant Architecture:**

- SME tools have limited multi-tenancy support
- Next.js provides RBAC, row-level security, tenant isolation
- User authentication and authorization across all data sources

**Mobile Integration:**

- SME tools lack native mobile apps or have limited functionality
- Next.js React Native app provides offline sync and push notifications
- Unified mobile experience across all business operations

---

## Data Flow Architecture

### Clear Data Flow Patterns

**n8n → PostgreSQL (Write Operations):**

```
External APIs → n8n Workflows → Data Transformation → PostgreSQL
```

**PostgreSQL → Web App (Read Operations):**

```
PostgreSQL → Web App API → Business Intelligence UI → User
```

**Real-Time Updates:**

```
n8n Workflow Completion → PostgreSQL Update → Supabase Real-time → WebSocket → UI Update
```

### Integration Points

**Single Integration Point:**

- **PostgreSQL Database**: The only shared resource between n8n and web app
- **n8n writes**: Processed business data, workflow metadata, sync status
- **Web app reads**: Business data for presentation, metadata for UI, status for indicators

**No Direct Communication:**

- ❌ Web app NEVER calls n8n APIs directly
- ❌ n8n NEVER calls web app APIs directly
- ❌ No workflow execution from web app
- ❌ No data transformation in web app

---

## API Boundaries

### Web App API Endpoints (Read-Only)

**Business Intelligence APIs:**

```typescript
GET / api / dashboards // Read aggregated business data
GET / api / kpis // Read KPI metrics and trends
GET / api / analytics // Read analytics and insights
GET / api / reports // Read business reports
```

**Data Status APIs:**

```typescript
GET / api / sync - status // Read data freshness indicators
GET / api / workflow - status // Read workflow metadata (UI only)
GET / api / data - sources // Read integration status
```

**Real-Time APIs:**

```typescript
WebSocket / api / notifications // Real-time updates and alerts
WebSocket / api / dashboard // Live dashboard data
```

### What Web App APIs NEVER Include

**Workflow Management (n8n handles):**

- ❌ POST /api/workflows/execute
- ❌ POST /api/workflows/schedule
- ❌ PUT /api/workflows/configure
- ❌ DELETE /api/workflows/delete

**Integration Management (n8n handles):**

- ❌ POST /api/integrations/connect
- ❌ PUT /api/integrations/configure
- ❌ POST /api/integrations/sync
- ❌ DELETE /api/integrations/disconnect

**Data Transformation (n8n handles):**

- ❌ POST /api/data/transform
- ❌ POST /api/data/process
- ❌ POST /api/etl/execute

---

## Database Schema Boundaries

### Tables n8n Writes To

**Business Data (n8n workflows write, web app reads):**

```prisma
model Financial {
  // n8n workflows write financial data
  // Web app reads for dashboards
}

model LeadEvent {
  // n8n workflows write CRM data
  // Web app reads for sales analytics
}

model CustomMetric {
  // n8n workflows write KPI data
  // Web app reads for business intelligence
}
```

**Workflow Metadata (UI display only):**

```prisma
model WorkflowMetadata {
  // n8n writes workflow info for UI display
  // Web app reads for workflow status indicators
}

model DataSyncStatus {
  // n8n writes sync status for UI indicators
  // Web app reads for data freshness display
}
```

### Tables Web App Writes To

**User Management (web app writes, n8n never touches):**

```prisma
model User {
  // Web app manages user authentication
  // n8n never accesses user data
}

model Tenant {
  // Web app manages tenant configuration
  // n8n uses tenant_id for data isolation only
}
```

---

## Implementation Guidelines

### Development Principles

**For n8n Development:**

- Focus on workflow automation and data movement
- Use custom TypeScript nodes for complex business logic
- Implement robust error handling and retry logic
- Design for scalability and performance
- Maintain workflow portability and exportability

**For Web App Development:**

- Focus on user experience and business intelligence
- Implement real-time communication and WebSocket connections
- Build responsive and mobile-optimized interfaces
- Develop advanced analytics and ML capabilities
- Ensure multi-tenant security and isolation

### Code Organization

**n8n Code Structure:**

```
n8n/
├── workflows/           // Workflow definitions
├── custom-nodes/       // TypeScript custom nodes
├── credentials/        // OAuth and API credentials
└── executions/        // Workflow execution logs
```

**Web App Code Structure:**

```
app/
├── api/               // Read-only API endpoints
├── components/        // Business intelligence UI
├── lib/              // Analytics and ML services
└── mobile/           // React Native mobile app
```

### Testing Boundaries

**n8n Testing:**

- Workflow execution and data transformation
- API integration and error handling
- Custom node functionality
- Workflow scheduling and triggers

**Web App Testing:**

- User interface and user experience
- Real-time communication and WebSocket connections
- Business intelligence and analytics
- Mobile application functionality

---

## Benefits of This Architecture

### Technical Benefits

**Zero Duplication:**

- No overlap between n8n and web app responsibilities
- Each platform focuses on its core strengths
- Reduced complexity and maintenance overhead

**Leverage Platform Strengths:**

- n8n excels at workflow automation and data movement
- Web app excels at user experience and business intelligence
- Complementary capabilities create powerful combination

**Clear Boundaries:**

- Well-defined integration points and data flow
- Easy to understand and maintain
- Reduced cognitive load for developers

**Scalable Architecture:**

- n8n scales workflow execution and data processing
- Web app scales user experience and real-time features
- Independent scaling based on usage patterns

### Business Benefits

**Faster Development:**

- No reinventing n8n's existing capabilities
- Focus on unique value proposition
- Reduced time to market

**Better User Experience:**

- Dedicated focus on business intelligence
- Real-time features and mobile integration
- Advanced analytics and predictive insights

**Defensible Competitive Advantage:**

- Complementary architecture creates moat
- Difficult for competitors to replicate
- Platform ownership provides control

**Cost Efficiency:**

- No duplication of development effort
- Leverage open-source n8n platform
- Focus resources on differentiation

---

## Anti-Patterns to Avoid

### ❌ Web App Anti-Patterns

**DO NOT build in web app:**

- Workflow execution or management
- API integrations or OAuth handling
- Data transformation or ETL logic
- Scheduled jobs or automation
- Custom node development

**DO NOT duplicate n8n functionality:**

- Workflow builder UI
- Integration configuration
- Workflow monitoring
- Data processing logic
- Automation scheduling

### ❌ n8n Anti-Patterns

**DO NOT build in n8n:**

- User interface components
- Real-time WebSocket connections
- Mobile application features
- Advanced analytics hosting
- Multi-tenant user management

**DO NOT duplicate web app functionality:**

- Business intelligence dashboards
- User authentication and authorization
- Mobile push notifications
- Real-time data visualization
- Advanced analytics and ML

---

## Conclusion

This separation of concerns creates a **complementary architecture** where:

- **n8n handles**: Workflow automation, data movement, API integrations
- **Web app handles**: Business intelligence, user experience, real-time communication

The result is a **powerful combination** that leverages each platform's strengths while avoiding duplication and complexity. This architecture provides:

1. **Clear boundaries** between platforms
2. **Zero duplication** of functionality
3. **Leverage strengths** of each platform
4. **Scalable architecture** for growth
5. **Defensible competitive advantage**

This approach ensures Zixly delivers maximum value to customers while maintaining technical excellence and business differentiation.
