# Zixly - System Architecture Document

> **SME Business Automation Platform for Brisbane Businesses**

**Version**: 3.0  
**Last Updated**: 2025-10-25  
**Owner**: Technical Architecture
**Status**: Active

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Workflow Architecture](#workflow-architecture)
5. [Data Architecture](#data-architecture)
6. [Security Architecture](#security-architecture)
7. [Infrastructure & Deployment](#infrastructure--deployment)
8. [Monitoring & Observability](#monitoring--observability)
9. [Development Workflow](#development-workflow)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### Purpose

**Zixly is an SME business automation service** for Brisbane businesses (10-50 employees), using this internal operations platform to track service delivery and demonstrate workflow automation patterns for connecting business systems (Xero, HubSpot, Shopify, Asana).

### Architecture Philosophy

**Event-Driven, Cloud-Based, Scalable**

- **SME Automation Services**: Connect business systems to eliminate repetitive admin work
- **Internal Operations**: Track Zixly's own service delivery (single-tenant platform)
- **Modern Infrastructure**: Leverages cloud services (AWS), containerization, and infrastructure as code
- **Event-Driven**: Webhook-triggered workflow execution (e.g., invoice paid → update CRM)
- **Infrastructure as Code**: All infrastructure version-controlled with Terraform
- **Full Observability**: Prometheus + Grafana monitoring for workflow health

### Business Model

**Service Business + Internal Operations Platform**

- **Primary Business**: SME business automation services ($3K - $40K projects)
- **Internal Platform**: Single-tenant platform for tracking Zixly operations
- **Target Market**: Brisbane and South East Queensland SMEs (professional services, construction, e-commerce, manufacturing)

### Key Architectural Decisions

| Decision                            | Rationale                                       | Trade-offs                                 |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| **Docker Compose** → **Kubernetes** | Container orchestration for scalability         | Kubernetes complexity vs Docker simplicity |
| **LocalStack + Terraform**          | Zero-cost AWS development, production-ready IaC | LocalStack limitations vs real AWS         |
| **Redis/Bull + AWS SQS**            | Job queue flexibility (local vs cloud)          | Dual queue system complexity               |
| **Express.js Webhooks**             | Lightweight, fast webhook receivers             | More custom code vs framework overhead     |
| **Supabase PostgreSQL**             | Managed DB with AU region, pgvector support     | Vendor dependency vs self-hosted           |
| **Prometheus + Grafana**            | Industry-standard observability                 | Setup complexity vs managed solutions      |

---

## Architecture Overview

### High-Level System Context

```
┌─────────────────────────────────────────────────────────────┐
│                    Zixly Platform                            │
│        (SME Business Automation + Internal Operations)       │
│                                                               │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Dashboard    │  │   API Layer  │  │    Workflow    │  │
│  │   (Next.js)    │◄─┤  (Next.js    │◄─┤  Orchestration │  │
│  │                │  │   API Routes)│  │   (Docker)     │  │
│  └────────────────┘  └──────┬───────┘  └──────┬─────────┘  │
│                              │                  │             │
│                         ┌────▼──────────────────▼────┐       │
│                         │   PostgreSQL (Supabase)    │       │
│                         │   Business Data Store      │       │
│                         └────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                                  │
                                  │ REST/OAuth APIs
                                  ▼
        ┌──────────┬──────────┬──────────┬──────────┐
        │   Xero   │ HubSpot  │ Shopify  │  Asana   │
        │(Acctng)  │  (CRM)   │(Ecommerce)│ (PM)    │
        └──────────┴──────────┴──────────┴──────────┘
```

### System Capabilities

1. **Webhook-Triggered Workflows**: Event-driven automation (e.g., "invoice paid" triggers CRM update)
2. **Job Queue Management**: Redis/Bull (local) + AWS SQS (production)
3. **Worker Pool**: Scalable Node.js workers for executing business integrations
4. **Data Storage**: PostgreSQL for job tracking, S3 for result datasets
5. **Real-Time Dashboard**: Next.js with WebSocket updates
6. **Full Observability**: Prometheus metrics + Grafana dashboards
7. **Infrastructure as Code**: Terraform for all infrastructure
8. **Local Development**: LocalStack for zero-cost AWS emulation

---

## Technology Stack

### Current Stack (2025)

| Layer                 | Technology          | Version     | Purpose                         |
| --------------------- | ------------------- | ----------- | ------------------------------- |
| **Frontend**          | Next.js + React     | 15.5.5 / 19 | Workflow monitoring dashboard   |
| **Styling**           | Tailwind CSS        | 4.x         | Utility-first responsive design |
| **Backend**           | Next.js API Routes  | 15.5.5      | Workflow management APIs        |
| **Database**          | PostgreSQL          | 15.x        | Workflow execution tracking     |
| **ORM**               | Prisma              | 6.x         | Type-safe database access       |
| **Auth**              | Supabase Auth       | Latest      | JWT authentication              |
| **Orchestration**     | Docker Compose      | 24.x        | Local container orchestration   |
| **Job Queue (Local)** | Redis + Bull        | 4.x         | Async workflow processing       |
| **Job Queue (AWS)**   | AWS SQS             | -           | Production workflow processing  |
| **Storage**           | AWS S3              | -           | Business documents & reports    |
| **Secrets**           | AWS Secrets Manager | -           | OAuth tokens & API keys         |
| **Monitoring**        | Prometheus          | 2.x         | Metrics collection              |
| **Dashboards**        | Grafana             | 10.x        | Metrics visualization           |
| **Infrastructure**    | Terraform           | 1.6+        | Infrastructure as Code          |
| **Local AWS**         | LocalStack          | 3.x         | Local AWS emulation             |
| **CI/CD**             | GitHub Actions      | -           | Automated testing & deployment  |
| **Cloud Platform**    | AWS (EKS/ECS)       | -           | Production (planned)            |
| **Dashboard Hosting** | Vercel              | -           | Web application deployment      |

### Workflow Architecture Stack

| Component              | Technology              | Purpose                                 |
| ---------------------- | ----------------------- | --------------------------------------- |
| **Webhook Receiver**   | Express.js + TypeScript | HTTP endpoint for webhook events        |
| **Request Validation** | Zod                     | Schema validation and type safety       |
| **Job Queue**          | Bull + Redis (or SQS)   | Async workflow job management           |
| **Worker Pool**        | Node.js + Cluster       | Concurrent workflow execution           |
| **OAuth Integration**  | OAuth 2.0 Libraries     | Secure third-party system authorization |
| **API Client**         | Axios                   | External API integrations               |
| **Logging**            | Winston                 | Structured logging                      |
| **Metrics**            | Prom-client             | Prometheus metrics export               |

---

## Workflow Architecture

### Webhook-Triggered Workflow Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Architecture                     │
│           (Example: Invoice Paid → Update CRM)               │
│                                                               │
│  [Xero: Invoice Paid] ──POST→ [Webhook Receiver:3000]       │
│                                      │                        │
│                                      ↓ validate & enqueue    │
│                               [Redis/SQS Queue]              │
│                                      │                        │
│                                      ↓ pick up job           │
│                            [Workflow Worker] (x2+)           │
│                                      │                        │
│                                      ↓ fetch invoice data    │
│                            [Xero API via OAuth]              │
│                                      │                        │
│                                      ↓ update CRM contact    │
│                            [HubSpot API via OAuth]           │
│                                      │                        │
│                                      ↓ store execution log   │
│                            [PostgreSQL + S3]                 │
│                                      │                        │
│                                      ↓ notify (optional)     │
│                            [Email/Slack]                     │
│                                                               │
│  Monitoring: [Prometheus] ←metrics─ [All Services]          │
│                   │                                           │
│                   └──→ [Grafana] (Dashboards)                │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Components

#### 1. Webhook Receiver (Express.js)

**File**: `services/webhook-receiver/src/server.ts`

**Responsibilities**:

- Accept incoming HTTP POST requests from business systems (Xero, HubSpot, Shopify)
- Validate payloads with Zod schemas
- Enqueue workflow jobs to Redis/SQS
- Store workflow execution metadata in PostgreSQL
- Return 202 Accepted with job ID
- Handle webhook callbacks from external systems
- Export Prometheus metrics

**API Endpoints (Examples)**:

- `POST /webhook/xero-invoice` - Process Xero invoice event
- `POST /webhook/hubspot-deal` - Process HubSpot deal update
- `POST /webhook/shopify-order` - Process Shopify order event
- `GET /webhook/jobs/:id` - Get workflow execution status
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

**Technology**:

- Express.js for HTTP server
- Zod for request validation
- Bull for Redis queue management
- Prisma for database access
- Winston for structured logging
- Helmet for security headers

#### 2. Job Queue (Redis + Bull or AWS SQS)

**Local Development** (Redis + Bull):

```typescript
// services/webhook-receiver/src/services/queue.ts
import Bull from 'bull'

const queue = new Bull('business-workflows', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
})
```

**Production** (AWS SQS):

```typescript
// services/webhook-receiver/src/services/sqs-queue.ts
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

const sqsClient = new SQSClient({
  region: 'ap-southeast-2',
  endpoint: process.env.AWS_ENDPOINT_URL, // LocalStack or AWS
})
```

**Features**:

- Job retry with exponential backoff (3 attempts)
- Dead letter queue for failed jobs
- Job priority support
- Job timeout (1 hour)
- Metrics export (queue depth, processing rate)

#### 3. Workflow Worker (Node.js)

**File**: `services/pipeline-worker/src/worker.ts`

**Responsibilities**:

- Poll job queue (Bull or SQS)
- Execute workflow processing logic
- Call business system APIs (Xero, HubSpot, Shopify) via OAuth
- Store execution logs in PostgreSQL + documents in S3
- Handle errors and retries
- Send notifications on completion (optional)
- Export processing metrics

**Processing Flow (Example: Invoice Paid → Update CRM)**:

1. Pick up workflow job from queue
2. Update job status to `RUNNING`
3. Fetch invoice details from Xero API (OAuth)
4. Identify customer in HubSpot CRM
5. Update customer record in HubSpot (mark invoice as paid)
6. Store execution log in PostgreSQL
7. Update job status to `COMPLETED`
8. (Optional) Send notification email
9. Export metrics to Prometheus

**Concurrency**:

- Configurable worker pool (default: 2 replicas)
- Horizontal scaling via Docker Compose/Kubernetes
- Graceful shutdown (finish current jobs before exit)

**Technology**:

- Bull worker (Redis) or SQS polling (AWS)
- Axios for HTTP requests
- Prisma for database access
- AWS SDK for S3 and Secrets Manager
- Nodemailer for email notifications
- Winston for logging

#### 4. Result Storage

**PostgreSQL** (Job metadata and execution logs):

```prisma
model WorkflowJob {
  id            String    @id @default(cuid())
  tenantId      String
  workflowType  String    // e.g., "xero-invoice-to-hubspot"
  status        JobStatus // QUEUED, RUNNING, COMPLETED, FAILED
  triggerData   Json      // Webhook payload from external system
  executionLog  Json?     // Steps performed, API calls made
  result        Json?     // Summary results
  errorMessage  String?
  createdAt     DateTime
  startedAt     DateTime?
  completedAt   DateTime?

  relatedRecords WorkflowRelatedRecord[]
}

model WorkflowRelatedRecord {
  id          String @id
  jobId       String
  systemName  String // e.g., "Xero", "HubSpot"
  recordType  String // e.g., "Invoice", "Contact"
  recordId    String // External system's record ID
  action      String // e.g., "READ", "UPDATE", "CREATE"
  // ... workflow tracking
}
```

**S3** (Documents and reports):

- Business documents (invoices, reports) stored in S3
- Path: `s3://zixly-workflow-data/{tenantId}/{jobId}/document.pdf`
- Versioning enabled
- Lifecycle: Archive after 90 days, delete after 7 years (compliance)

### Workflow Patterns

#### Pattern 1: Synchronous Webhook → Async Processing

```
Client ─POST→ Webhook Receiver ─202 Accepted (job_id)→ Client
                    ↓ enqueue
                 [Queue]
                    ↓
              [Worker Pool] ─process→ [Result Storage]
                                          ↓
Client ←poll /jobs/:id─ Webhook Receiver ←read─ [Database]
```

#### Pattern 2: External API Callback

```
Webhook Receiver ─trigger→ External API
                              ↓ process (async)
Webhook Receiver ←callback─ External API
      ↓ fetch results
External API ─results→ Webhook Receiver ─store→ [Database + S3]
```

#### Pattern 3: Long-Running Jobs

```
Worker ─start job→ Database (status: RUNNING)
  ↓
Worker ─call API→ External API (returns job_id)
  ↓
Worker ─poll status→ External API (every 10s, max 1 hour)
  ↓ completed
Worker ─fetch results→ External API
  ↓
Worker ─store→ Database + S3 (status: COMPLETED)
```

---

## Data Architecture

### Database Schema

**Core Models** (Prisma):

```prisma
// Multi-tenancy foundation
model Tenant {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users     User[]
  jobs      PipelineJob[]
}

model User {
  id        String   @id @default(cuid())
  tenantId  String
  email     String   @unique
  role      UserRole @default(VIEWER)

  tenant    Tenant   @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
}

enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

// Pipeline job tracking
model PipelineJob {
  id            String    @id @default(cuid())
  tenantId      String
  jobType       String
  status        JobStatus
  parameters    Json
  result        Json?
  metrics       Json?
  errorMessage  String?
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  completedAt   DateTime?

  tenant        Tenant    @relation(fields: [tenantId], references: [id])

  @@index([tenantId, status])
  @@index([jobType, status])
  @@index([createdAt])
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}
```

### Data Flow

```
External Trigger → Webhook Receiver → PostgreSQL (job metadata)
                         ↓
                    Redis/SQS Queue
                         ↓
                   Pipeline Worker → External API → Worker
                         ↓
              PostgreSQL + S3 (results storage)
                         ↓
              Next.js Dashboard (read-only access)
```

### Row-Level Security (RLS)

**Multi-Tenant Isolation** (PostgreSQL):

```sql
-- Enable RLS on all tables
ALTER TABLE pipeline_jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their tenant's data
CREATE POLICY tenant_isolation_policy ON pipeline_jobs
  USING (tenant_id = current_setting('app.tenant_id')::text);

-- Set tenant context (in application middleware)
SET app.tenant_id = 'tenant_xyz123';
```

---

## Security Architecture

### Authentication & Authorization

**Authentication**: Supabase Auth (JWT-based)

**Authorization**: Role-Based Access Control (RBAC)

| Role       | Permissions                                           |
| ---------- | ----------------------------------------------------- |
| **ADMIN**  | Full access: manage users, pipelines, view all data   |
| **EDITOR** | Trigger pipelines, view all data, cannot manage users |
| **VIEWER** | Read-only access to dashboards                        |

### Data Encryption

**At Rest**:

- PostgreSQL: AES-256 (Supabase managed)
- S3: Server-side encryption (SSE-S3)
- Secrets Manager: AWS managed encryption

**In Transit**:

- All API communication: TLS 1.3
- Database connections: SSL enforced
- Internal services: mTLS (production)

### API Security

**Rate Limiting**: 100 requests/minute per tenant (Upstash Redis)

**Request Validation**: Zod schemas for all API inputs

**CORS Policy**: Restricted to production domains

**Security Headers**: Helmet.js in Express.js

### Secrets Management

**Local Development**: `.env.local` files (gitignored)

**Production**: AWS Secrets Manager

```typescript
// services/pipeline-worker/src/services/secrets-manager.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({
  region: 'ap-southeast-2',
  endpoint: process.env.AWS_ENDPOINT_URL, // LocalStack or AWS
})

export async function getSecret(secretId: string): Promise<Record<string, string>> {
  const command = new GetSecretValueCommand({ SecretId: secretId })
  const response = await client.send(command)
  return JSON.parse(response.SecretString!)
}
```

---

## Infrastructure & Deployment

### Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Vercel Edge Network (Global CDN)                  │    │
│  │  - Next.js Frontend (SSR + Static)                 │    │
│  │  - API Routes (Serverless Functions)               │    │
│  │  - Auto-scaling: 0 to ∞                            │    │
│  └────────────────────┬───────────────────────────────┘    │
│                        │ SSL/TLS 1.3                        │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │  Supabase (Sydney Region)                          │    │
│  │  - PostgreSQL 15 (Primary + Replica)               │    │
│  │  - Connection Pooling (PgBouncer)                  │    │
│  │  - Automated Backups (Daily)                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Docker Compose (Local) / ECS (Production)         │    │
│  │  - Webhook Receiver (Express.js)                   │    │
│  │  - Pipeline Worker (Node.js, 2+ replicas)          │    │
│  │  - Redis (job queue)                               │    │
│  │  - Prometheus (metrics)                            │    │
│  │  - Grafana (dashboards)                            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AWS Services (LocalStack Local / AWS Production)  │    │
│  │  - SQS (job queue)                                 │    │
│  │  - S3 (result storage)                             │    │
│  │  - Secrets Manager (credentials)                   │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Docker Compose Stack

**File**: `docker-compose.pipeline.yml`

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3

  webhook-receiver:
    build: ./services/webhook-receiver
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - AWS_ENDPOINT_URL=http://localstack:4566
    depends_on:
      - redis
      - localstack
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3

  pipeline-worker:
    build: ./services/pipeline-worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - AWS_ENDPOINT_URL=http://localstack:4566
    depends_on:
      - redis
      - localstack
  deploy:
      replicas: 2
    healthcheck:
      test: ['CMD', 'test', '-f', '/tmp/worker-healthy']
      interval: 30s
      timeout: 10s
      retries: 3

  localstack:
    image: localstack/localstack:latest
    ports:
      - '4566:4566'
    environment:
      - SERVICES=sqs,s3,secretsmanager
      - DEBUG=1
    volumes:
      - localstack_data:/var/lib/localstack
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:4566/_localstack/health']
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alerts.yml:/etc/prometheus/alerts.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
      - grafana_data:/var/lib/grafana

volumes:
  redis_data:
  localstack_data:
  prometheus_data:
  grafana_data:
```

### Terraform Infrastructure

**LocalStack (Local Development)**:

```hcl
# terraform/environments/local/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "ap-southeast-2"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    sqs             = "http://localhost:4566"
    s3              = "http://localhost:4566"
    secretsmanager  = "http://localhost:4566"
  }
}

module "queue" {
  source = "../../modules/queue"

  queue_name = "zixly-trading-sweeps-local"
  environment = "local"
}

module "storage" {
  source = "../../modules/storage"

  bucket_name = "zixly-pipeline-results-local"
  environment = "local"
}

module "secrets" {
  source = "../../modules/secrets"

  secret_name = "zixly/trading-api-local"
  environment = "local"
}
```

**AWS (Production)** - Same modules, different provider:

```hcl
# terraform/environments/aws/main.tf
provider "aws" {
  region = "ap-southeast-2"
  # Uses AWS credentials from environment
}

# Same modules, different configuration
module "queue" {
  source = "../../modules/queue"

  queue_name = "zixly-trading-sweeps-prod"
  environment = "production"
}
```

---

## Monitoring & Observability

### Prometheus Metrics

**Webhook Receiver Metrics**:

```typescript
// services/webhook-receiver/src/services/metrics.ts
import { Counter, Histogram, Gauge, register } from 'prom-client'

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
})

export const pipelineJobsQueued = new Counter({
  name: 'pipeline_jobs_queued_total',
  help: 'Total number of jobs queued',
  labelNames: ['job_type'],
})

export const pipelineJobs = new Gauge({
  name: 'pipeline_jobs',
  help: 'Current pipeline jobs by status',
  labelNames: ['status'],
})
```

**Pipeline Worker Metrics**:

```typescript
// services/pipeline-worker/src/services/metrics.ts
export const pipelineJobDuration = new Histogram({
  name: 'pipeline_job_duration_seconds',
  help: 'Duration of pipeline job processing',
  labelNames: ['job_type', 'status'],
  buckets: [1, 5, 10, 30, 60, 120, 300, 600],
})

export const pipelineJobsProcessed = new Counter({
  name: 'pipeline_jobs_processed_total',
  help: 'Total number of jobs processed',
  labelNames: ['job_type', 'status'],
})

export const tradingApiLatency = new Histogram({
  name: 'trading_api_latency_seconds',
  help: 'Trading API request latency',
  labelNames: ['endpoint'],
  buckets: [0.5, 1, 2, 5, 10, 30],
})
```

### Grafana Dashboards

**Pipeline Overview Dashboard** (`grafana/dashboards/pipeline-overview.json`):

- Total jobs queued (24h)
- Success rate (24h)
- P95 job duration
- Active workers
- Job flow over time
- Error rate

**Trading Pipeline Dashboard** (`grafana/dashboards/trading-pipeline.json`):

- Trading sweep jobs by ticker
- Execution time (p95)
- Completion rate
- API latency by endpoint
- Error breakdown

### Alert Rules

**File**: `prometheus/alerts.yml`

```yaml
groups:
  - name: pipeline_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(pipeline_jobs_processed_total{status="failed"}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }} jobs/sec'

      - alert: QueueBacklog
        expr: pipeline_jobs{status="queued"} > 100
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'Queue backlog detected'
          description: '{{ $value }} jobs waiting in queue'

      - alert: WorkerDown
        expr: up{job="pipeline-worker"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: 'Pipeline worker is down'

      - alert: SlowExecution
        expr: histogram_quantile(0.95, rate(pipeline_job_duration_seconds_bucket[5m])) > 300
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'Slow job execution'
          description: 'P95 duration is {{ $value }}s'
```

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/colemorton/zixly.git
cd zixly

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.template .env.local
# Edit .env.local with your Supabase credentials

# 4. Run database migrations
npm run db:migrate

# 5. Initialize LocalStack + Terraform
./scripts/init-localstack-terraform.sh

# 6. Start development server (Next.js)
npm run dev
# → http://localhost:3000

# 7. Start pipeline stack (separate terminal)
docker-compose -f docker-compose.pipeline.yml up
# → Webhook receiver: http://localhost:3000/webhook
# → Grafana: http://localhost:3001
# → Prometheus: http://localhost:9090
```

### Trigger a Pipeline Job

```bash
curl -X POST http://localhost:3000/webhook/trading-sweep \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "BTC-USD",
    "fast_range": [10, 20],
    "slow_range": [20, 30],
    "step": 5,
    "strategy_type": "SMA"
  }'
```

### Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js + TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Vitest**: Testing framework (275 tests, 70-75% coverage)

---

## Implementation Roadmap

### Completed Phases

✅ **Phase 1: Data Foundation** (Weeks 1-4)

- Supabase PostgreSQL setup
- Prisma schema and migrations
- Supabase Auth integration
- Core API endpoints

✅ **Phase 2: Infrastructure & Services** (Weeks 3-4)

- Docker Compose pipeline stack
- Webhook receiver service
- Pipeline worker service
- Redis job queue
- Prometheus + Grafana

✅ **Phase 1.5: LocalStack + Terraform** (Weeks 5-6)

- Terraform modules (SQS, S3, Secrets Manager)
- LocalStack integration
- AWS SDK services
- Zero-cost local development

### Current Phase

🔄 **Phase 3: Dashboard & API** (Weeks 7-8)

- Pipeline management API routes
- Real-time dashboard with WebSocket
- Job visualization components
- Result display and CSV export

### Upcoming Phases

⏳ **Phase 4: Production Readiness** (Weeks 9-12)

- Performance optimization
- Security hardening
- End-to-end testing
- Kubernetes deployment

---

## Performance Targets

| Metric                   | Target        | Current | Status |
| ------------------------ | ------------- | ------- | ------ |
| **API Response (p95)**   | <500ms        | 320ms   | ✅     |
| **Job Processing (p95)** | <5min         | TBD     | 🔄     |
| **Dashboard LCP**        | <2.5s         | 1.8s    | ✅     |
| **Queue Throughput**     | >100 jobs/min | TBD     | 🔄     |
| **Worker Utilization**   | >80%          | TBD     | 🔄     |

---

## Related Documentation

- **[Business Model](../business/business-model.md)** - Service business + internal operations + open-source
- **[Architecture Decisions](./decisions/)** - ADRs for key technical choices
- **[Pipeline Specifications](../pipelines/)** - Webhook pipelines and job patterns
- **[Deployment Guide](https://github.com/colemorton/zixly/blob/main/DEPLOYMENT.md)** - Local and production deployment
- **[Implementation Status](https://github.com/colemorton/zixly/blob/main/STATUS.md)** - Current progress and milestones

---

**Document Version**: 2.0  
**Last Updated**: 2025-01-27  
**Maintained By**: Zixly Technical Architecture  
**Review Cycle**: Monthly

**Previous Versions**:

- v1.0: Original architecture (n8n-focused SME stack model)
- v2.0: Updated to reflect Docker/Kubernetes/Terraform DevOps automation model (current)
