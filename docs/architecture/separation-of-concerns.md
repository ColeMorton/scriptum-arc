# Pipeline Services vs Dashboard Separation of Concerns

**Version**: 2.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture  
**Status**: Defined

---

## Business Context: DevOps Automation Service

**Zixly is a DevOps automation service business** for Brisbane tech companies, using this internal operations platform to track service delivery and demonstrate cloud-native infrastructure patterns (Docker, Kubernetes, Terraform, AWS).

---

## Overview

This document defines the clear boundaries between **Pipeline Services** (webhook receiver + workers) and **Dashboard Application** (Next.js monitoring UI). The separation ensures:

- **Zero duplication** of responsibilities
- **Clear data flow** patterns
- **Independent scalability** of each component
- **Focused development** on core strengths

---

## Core Principle: Complementary Architecture

**Philosophy**: Each system does what it does best, with zero overlap in responsibilities.

- **Pipeline Services**: Job orchestration, async processing, external API integration
- **Dashboard**: Business intelligence, real-time monitoring, user interface

---

## System Boundaries

### Pipeline Services Responsibilities

**What Pipeline Services Handle** (Webhook Receiver + Workers):

#### Job Orchestration

- **Webhook endpoints**: Accept incoming HTTP POST requests
- **Request validation**: Zod schema validation and type safety
- **Job enqueueing**: Queue jobs to Redis/Bull or AWS SQS
- **Job metadata tracking**: Store job status in PostgreSQL
- **Job callbacks**: Handle webhook callbacks from external APIs

#### Async Processing

- **Worker pool management**: Scalable Node.js workers
- **Job execution**: Process queued jobs with retry logic
- **External API calls**: Integrate with trading APIs, client systems
- **Result storage**: Save results to PostgreSQL + S3
- **Notifications**: Send email/Slack alerts on completion

#### Metrics & Monitoring

- **Prometheus metrics**: Export job processing metrics
- **Structured logging**: Winston for job execution logs
- **Health checks**: Endpoint monitoring for orchestration
- **Error tracking**: Capture and log job failures

#### Infrastructure

- **Docker Compose**: Local container orchestration
- **Kubernetes**: Production scaling (planned)
- **AWS Services**: SQS, S3, Secrets Manager integration
- **LocalStack**: Zero-cost local AWS emulation

**Technology Stack**:

- Express.js (webhook receiver)
- Bull + Redis (job queue)
- Node.js (workers)
- Prisma (database access)
- AWS SDK (cloud services)
- Prometheus (metrics)

---

### Dashboard Responsibilities

**What Dashboard Handles** (Next.js Application):

#### Business Intelligence UI

- **Interactive dashboards**: Real-time job monitoring
- **Data visualization**: Charts, graphs, job timelines
- **Job status display**: Current and historical job tracking
- **Result exploration**: View and download job results
- **Filter and search**: Query job history and results

#### Real-Time Communication

- **WebSocket updates**: Live job status updates
- **Push notifications**: Browser notifications for job completion
- **Real-time metrics**: Dashboard auto-refresh as data changes
- **SSE (Server-Sent Events)**: Real-time job progress streaming

#### User Management

- **Authentication**: Supabase Auth (JWT-based)
- **Authorization**: Role-based access control (RBAC)
- **Multi-tenant isolation**: Row-level security (RLS)
- **User session management**: Secure session handling
- **Audit logging**: User action tracking

#### API Endpoints (Read-Only)

- **Job status API**: GET /api/pipelines/jobs/:id
- **Job history API**: GET /api/pipelines/jobs
- **Result retrieval API**: GET /api/pipelines/results/:id
- **Metrics API**: GET /api/service-metrics
- **Health check API**: GET /api/health

**Technology Stack**:

- Next.js 15 (App Router)
- React 19 (UI components)
- Tailwind CSS (styling)
- Supabase (auth + database)
- Visx (charts)
- WebSocket (real-time)

---

## Data Flow Architecture

### Clear Data Flow Patterns

#### Write Operations (Pipeline Services → PostgreSQL)

```
External Trigger → Webhook Receiver → Redis/SQS Queue
                         ↓
                  Pipeline Worker → External API
                         ↓
              PostgreSQL + S3 (Results Storage)
```

#### Read Operations (Dashboard ← PostgreSQL)

```
PostgreSQL → Next.js API Routes → Dashboard UI → User
```

#### Real-Time Updates

```
Pipeline Worker → PostgreSQL Update → Supabase Realtime → WebSocket → Dashboard Update
```

### Integration Points

**Single Shared Resource**: PostgreSQL Database

- **Pipeline Services writes**: Job metadata, job status, job results
- **Dashboard reads**: Job tracking, result display, status indicators

**No Direct Communication**:

- ❌ Dashboard NEVER triggers jobs directly (uses webhook receiver)
- ❌ Pipeline services NEVER calls dashboard APIs
- ❌ No job execution from dashboard
- ❌ No data transformation in dashboard

---

## API Boundaries

### Pipeline Services API Endpoints (Write Operations)

**Webhook Endpoints**:

```typescript
POST / webhook / trading - sweep // Trigger trading strategy sweep
POST / webhook / sweep - callback // Handle external API callbacks
POST / webhook / generic - job // Generic job trigger
```

**Management Endpoints**:

```typescript
GET  /webhook/jobs/:id            // Get job status (for internal use)
GET  /health                      // Health check
GET  /metrics                     // Prometheus metrics
```

### Dashboard API Endpoints (Read Operations)

**Job Management APIs**:

```typescript
GET /api/pipelines/jobs           // List all jobs (filtered, paginated)
GET /api/pipelines/jobs/:id       // Get specific job details
GET /api/pipelines/results/:id    // Get job results
```

**Monitoring APIs**:

```typescript
GET / api / service - metrics // System metrics
GET / api / dashboards // Dashboard configurations
GET / api / sync - status // Data freshness indicators
```

**Real-Time APIs**:

```typescript
WebSocket / api / jobs / subscribe // Subscribe to job updates
```

### What Dashboard APIs NEVER Include

**Job Execution (Pipeline Services handles)**:

- ❌ POST /api/jobs/execute
- ❌ POST /api/jobs/cancel
- ❌ PUT /api/jobs/retry

**External API Integration (Pipeline Services handles)**:

- ❌ POST /api/integrations/call
- ❌ POST /api/external/fetch
- ❌ POST /api/data/process

**Data Transformation (Pipeline Services handles)**:

- ❌ POST /api/data/transform
- ❌ POST /api/etl/execute

---

## Database Schema Boundaries

### Tables Pipeline Services Writes To

**Job Tracking** (Pipeline services writes, dashboard reads):

```prisma
model PipelineJob {
  id            String    @id @default(cuid())
  tenantId      String
  jobType       String
  status        JobStatus // QUEUED, RUNNING, COMPLETED, FAILED
  parameters    Json
  result        Json?
  metrics       Json?
  errorMessage  String?
  createdAt     DateTime
  startedAt     DateTime?
  completedAt   DateTime?

  // Pipeline services writes all fields
  // Dashboard reads all fields
}

model TradingSweepResult {
  id                String   @id
  jobId             String
  ticker            String
  strategyType      String
  score             Decimal
  // ... more fields

  // Pipeline services writes result data
  // Dashboard reads for display
}
```

### Tables Dashboard Writes To

**User Management** (Dashboard writes, pipeline services never touches):

```prisma
model User {
  id        String   @id
  tenantId  String
  email     String
  role      UserRole

  // Dashboard manages user data
  // Pipeline services uses tenantId for data isolation only
}

model Tenant {
  id        String   @id
  name      String

  // Dashboard manages tenant configuration
  // Pipeline services filters data by tenant_id
}
```

---

## Implementation Guidelines

### Development Principles

**For Pipeline Services Development**:

- Focus on job orchestration and async processing
- Implement robust error handling and retry logic
- Design for horizontal scalability (multiple workers)
- Export Prometheus metrics for all operations
- Use structured logging (Winston) for debugging

**For Dashboard Development**:

- Focus on user experience and data visualization
- Implement real-time communication (WebSockets)
- Build responsive and mobile-optimized interfaces
- Ensure multi-tenant security and isolation
- Use read-only database access (no writes)

### Code Organization

**Pipeline Services Code Structure**:

```
services/
├── webhook-receiver/
│   ├── src/
│   │   ├── server.ts           // Express.js HTTP server
│   │   ├── routes/             // Webhook endpoints
│   │   ├── services/           // Queue, database, metrics
│   │   └── middleware/         // Validation, auth, logging
│   ├── Dockerfile
│   └── package.json
└── pipeline-worker/
    ├── src/
    │   ├── worker.ts           // Job processor
    │   ├── jobs/               // Job handlers
    │   ├── services/           // External APIs, storage
    │   └── utils/              // Helpers, logging
    ├── Dockerfile
    └── package.json
```

**Dashboard Code Structure**:

```
app/
├── api/                        // Read-only API routes
│   ├── pipelines/
│   ├── service-metrics/
│   └── dashboards/
├── dashboard/                  // UI pages
│   └── jobs/
├── components/                 // React components
│   ├── pipelines/
│   └── charts/
└── lib/                        // Utilities
    ├── supabase/
    └── websocket-client.ts
```

### Testing Boundaries

**Pipeline Services Testing**:

- Job enqueueing and processing
- External API integration and error handling
- Job retry logic and failure scenarios
- Webhook validation and security
- Metrics export and health checks

**Dashboard Testing**:

- User interface and user experience
- Real-time communication and WebSocket updates
- Data visualization and filtering
- Authentication and authorization
- API endpoint responses

---

## Anti-Patterns to Avoid

### ❌ Dashboard Anti-Patterns

**DO NOT build in dashboard**:

- Job execution or orchestration
- External API integrations
- Data transformation logic
- Scheduled jobs or automation
- Worker pool management

**DO NOT duplicate pipeline services functionality**:

- Webhook handling
- Job queue management
- Job processing logic
- External API clients
- Retry and error handling

### ❌ Pipeline Services Anti-Patterns

**DO NOT build in pipeline services**:

- User interface components
- User authentication and RBAC
- Data visualization dashboards
- Real-time WebSocket servers (for UI)
- Multi-tenant user management

**DO NOT duplicate dashboard functionality**:

- Business intelligence UI
- Interactive charts and graphs
- User session management
- Dashboard configuration
- UI state management

---

## Benefits of This Architecture

### Technical Benefits

**Zero Duplication**:

- No overlap between pipeline services and dashboard responsibilities
- Each system focuses on its core strengths
- Reduced complexity and maintenance overhead

**Independent Scaling**:

- Scale workers horizontally for job processing
- Scale dashboard separately for UI traffic
- Different resource requirements (CPU vs memory)

**Clear Boundaries**:

- Well-defined integration points (PostgreSQL)
- Single data flow direction (write → read)
- Easy to understand and maintain

**Resilience**:

- Dashboard failure doesn't affect job processing
- Pipeline service failure doesn't affect monitoring
- Graceful degradation

### Business Benefits

**Faster Development**:

- Focus on unique value proposition
- Leverage existing patterns (Express.js, Next.js)
- Reduced cognitive load for developers

**Better User Experience**:

- Dedicated focus on monitoring and visualization
- Real-time updates without polling
- Responsive and mobile-optimized interface

**Cost Efficiency**:

- No duplication of development effort
- Efficient resource utilization
- Scale components independently based on usage

---

## Migration from Old Architecture

### Previous Architecture (v1.0 - n8n-based)

The previous architecture used n8n for workflow automation. This has been completely replaced with Docker-based pipeline services.

**What Changed**:

- ❌ Removed: n8n workflow platform
- ✅ Added: Express.js webhook receiver
- ✅ Added: Node.js pipeline workers
- ✅ Added: Redis/Bull job queue
- ✅ Added: Prometheus metrics

**Why Changed**:

- Greater control over job orchestration
- Lower operational costs (no per-task fees)
- Better integration with cloud-native tooling
- More flexibility for custom business logic
- Aligns with DevOps automation service business

---

## Conclusion

This separation of concerns creates a **complementary architecture** where:

- **Pipeline Services handle**: Job orchestration, async processing, external API integration
- **Dashboard handles**: Business intelligence, real-time monitoring, user experience

The result is a **powerful combination** that:

1. **Leverages platform strengths** (Express.js + Next.js)
2. **Maintains clear boundaries** (write vs read)
3. **Scales independently** (workers vs UI)
4. **Provides resilience** (failure isolation)
5. **Enables focused development** (backend vs frontend)

This architecture ensures Zixly delivers maximum value while maintaining technical excellence and business differentiation.

---

**Version History**:

- v1.0: Original architecture (n8n-based workflow automation)
- v2.0: Updated architecture (Docker-based pipeline services) - Current

**Related Documentation**:

- [System Architecture](./system-architecture.md)
- [Pipeline Architecture](../pipelines/)
- [Implementation Plan](../implementation/plan.md)
