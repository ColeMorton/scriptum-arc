# SME Business Automation Integration Architecture

**Version**: 3.0  
**Last Updated**: 2025-10-25  
**Owner**: Technical Architecture  
**Status**: Active

---

## Overview

Zixly's business automation architecture seamlessly connects webhook receivers, job queues, background workers, and observability systems, creating a unified SME workflow automation platform. This document outlines the technical patterns, data flow, and integration strategies that enable reliable, scalable, webhook-triggered business workflows (e.g., Xero invoice paid → HubSpot CRM update).

---

## Architecture Philosophy

### Event-Driven Design

**Core Principle**: Every component responds to business events, enabling asynchronous, scalable workflow processing:

- **Webhook Receiver**: Accept HTTP requests from business systems, validate, queue workflow jobs immediately
- **Job Queue**: Reliable message broker (Redis/Bull or AWS SQS) for async workflow processing
- **Workflow Worker**: Execute business integrations independently, retry on failure, emit execution logs
- **Database**: Store workflow execution history and status for dashboard queries
- **Observability**: Prometheus metrics and Grafana dashboards for real-time workflow monitoring

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     External Trigger (Client)                    │
│                    HTTP POST /webhook/trigger                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Webhook Receiver (Express.js)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Validate payload (Zod schema)                          │  │
│  │  2. Authenticate request (JWT/API key)                     │  │
│  │  3. Create job record in PostgreSQL                        │  │
│  │  4. Enqueue job to Redis/SQS                              │  │
│  │  5. Return 202 Accepted + job_id                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               Job Queue (Redis/Bull or AWS SQS)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  - Persistent job storage                                  │  │
│  │  - Retry logic (exponential backoff)                       │  │
│  │  - Job prioritization                                      │  │
│  │  - Dead letter queue for failures                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            Workflow Worker (Node.js/TypeScript)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Poll queue for new workflow jobs                       │  │
│  │  2. Update job status: QUEUED → RUNNING                   │  │
│  │  3. Execute workflow (call business APIs via OAuth)        │  │
│  │     - Fetch from Xero, update in HubSpot, etc.            │  │
│  │  4. Store documents in S3 (invoices, reports)             │  │
│  │  5. Store execution log in PostgreSQL                      │  │
│  │  6. Update job status: RUNNING → COMPLETED/FAILED         │  │
│  │  7. Send notification (optional: email/Slack)              │  │
│  │  8. Emit Prometheus metrics                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────┬────────────────────────────┬───────────────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────────┐   ┌───────────────────────────────────┐
│   PostgreSQL         │   │   S3 Storage (Documents)          │
│   (Supabase)         │   │   - Business documents            │
│   - Workflow status  │   │   - Invoices, reports (PDF)       │
│   - Execution logs   │   │   - Workflow artifacts            │
│   - User data        │   └───────────────────────────────────┘
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                Next.js Dashboard (React 19)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  - Job status display (QUEUED/RUNNING/COMPLETED)           │  │
│  │  - Result visualization (charts, tables)                   │  │
│  │  - Trigger new jobs (forms)                                │  │
│  │  - Real-time updates (polling or WebSocket)                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Prometheus   │  │     Grafana      │  │ GitHub Actions   │
│  (Metrics)    │  │   (Dashboards)   │  │    (CI/CD)       │
└───────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Backend Integration (Webhook → Queue → Worker)

### Webhook Receiver Service

**Technology**: Express.js (TypeScript) running in Docker container

**Responsibilities**:

- Accept HTTP POST requests from external systems or client UI
- Validate payload using Zod schemas (type-safe validation)
- Authenticate requests (JWT for dashboard, API key for external webhooks)
- Create job record in PostgreSQL with QUEUED status
- Enqueue job to Redis/SQS with job parameters
- Return 202 Accepted immediately (don't wait for processing)

**API Endpoints**:

```typescript
// Trigger new job
POST /webhook/trading-sweep
Request:
{
  "ticker": "BTC-USD",
  "fast_range": [10, 20],
  "slow_range": [20, 30],
  "step": 5,
  "strategy_type": "SMA"
}

Response (202 Accepted):
{
  "job_id": "cm4x8y9z0000108l7a1b2c3d4",
  "status": "QUEUED",
  "message": "Trading sweep job queued successfully",
  "created_at": "2025-01-27T10:30:00Z"
}

// External system callback (trading API completion)
POST /webhook/sweep-callback
Request:
{
  "event_type": "sweep.completed",
  "job_id": "cm4x8y9z0000108l7a1b2c3d4",
  "sweep_run_id": "run_abc123",
  "status": "completed",
  "result_data": { "total_combinations": 8, "execution_time_seconds": 127 }
}

Response (200 OK):
{
  "message": "Callback received",
  "job_id": "cm4x8y9z0000108l7a1b2c3d4"
}

// Health check
GET /health
Response (200 OK):
{
  "status": "healthy",
  "version": "1.0.0",
  "redis_connected": true,
  "database_connected": true
}
```

**Error Handling**:

- 400 Bad Request: Invalid payload (Zod validation failure)
- 401 Unauthorized: Missing or invalid auth token
- 429 Too Many Requests: Rate limiting exceeded
- 503 Service Unavailable: Queue or database unavailable

---

### Job Queue Integration

**Technology Options**:

**Option 1: Redis + Bull (Local/MVP)**

- Lightweight, runs in Docker Compose
- Excellent Node.js integration with Bull library
- Built-in retry logic, job status tracking, job UI
- Cost: $0 locally, ~$20-50/month for managed Redis in production

**Option 2: AWS SQS (Production)**

- Fully managed, serverless queue
- Auto-scaling, no infrastructure management
- DLQ (Dead Letter Queue) for failed messages
- Cost: $0.40 per million requests (very cheap)

**Queue Configuration**:

```typescript
// Bull (Redis) configuration
const jobQueue = new Queue('trading-sweeps', {
  redis: { host: 'redis', port: 6379 },
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s backoff
    },
    timeout: 3600000, // 1 hour max per job
    removeOnComplete: 100, // Keep last 100 completed for debugging
    removeOnFail: 500, // Keep last 500 failed for analysis
  },
})

// SQS configuration
const sqsClient = new SQSClient({
  region: 'ap-southeast-2',
  endpoint: process.env.LOCALSTACK_ENDPOINT || undefined, // LocalStack for local dev
})

const queueUrl = process.env.SQS_QUEUE_URL
```

**Job Data Structure**:

```typescript
interface TradingSweepJob {
  job_id: string // Database job record ID
  tenant_id: string // Multi-tenant isolation
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
  min_trades: number
  strategy_type: 'SMA' | 'EMA' | 'MACD'
  webhook_url?: string // Optional callback for external systems
  created_at: Date
}
```

---

### Pipeline Worker Service

**Technology**: Node.js (TypeScript) running in Docker container (1-10 replicas for scaling)

**Responsibilities**:

- Poll job queue for new jobs (Bull worker or SQS long polling)
- Update job status in database: QUEUED → RUNNING
- Execute job logic (call external APIs, process data, run analysis)
- Handle external webhook callbacks (trading API completion)
- Fetch results from external systems
- Store large datasets in S3
- Store result summaries in PostgreSQL
- Update job status: RUNNING → COMPLETED or FAILED
- Send notifications (email, Slack)
- Emit Prometheus metrics (job duration, success/failure rates)

**Worker Process**:

```typescript
// Bull worker
tradingSweepQueue.process(async (job) => {
  const { job_id, ticker, fast_range, slow_range, step } = job.data

  try {
    // 1. Update status to RUNNING
    await prisma.pipelineJob.update({
      where: { id: job_id },
      data: { status: 'RUNNING', startedAt: new Date() },
    })

    // 2. Call external API (trading API)
    const apiResponse = await tradingApiClient.submitSweep({
      ticker,
      fast_range,
      slow_range,
      step,
      webhook_url: `${WEBHOOK_BASE_URL}/webhook/sweep-callback`,
    })

    // 3. Wait for async callback (trading API signals completion via webhook)
    const callbackData = await waitForCallback(apiResponse.job_id, 3600000) // 1 hour timeout

    // 4. Fetch results from trading API
    const results = await tradingApiClient.getBestResults(callbackData.sweep_run_id, ticker)

    // 5. Store large dataset in S3
    await s3Storage.uploadResults(job_id, results)

    // 6. Store summary in PostgreSQL
    await prisma.tradingSweepResult.createMany({ data: results.top10 })

    // 7. Update job status to COMPLETED
    await prisma.pipelineJob.update({
      where: { id: job_id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        result: { summary: results.summary },
      },
    })

    // 8. Send notification
    await emailService.sendSuccessNotification(job_id, results.summary)

    // 9. Emit metrics
    metricsService.recordJobCompleted(job.data.strategy_type, duration)

    return { status: 'COMPLETED', sweep_run_id: callbackData.sweep_run_id }
  } catch (error) {
    // Handle failure
    await prisma.pipelineJob.update({
      where: { id: job_id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage: error.message,
      },
    })

    metricsService.recordJobFailed(job.data.strategy_type)
    await emailService.sendFailureNotification(job_id, error.message)

    throw error // Bull will retry based on attempts config
  }
})
```

**Horizontal Scaling**:

- Docker Compose: `docker-compose up --scale pipeline-worker=5` (run 5 workers)
- Kubernetes: `kubectl scale deployment pipeline-worker --replicas=10`
- Auto-scaling: HorizontalPodAutoscaler based on CPU or queue depth

---

## Database Integration (PostgreSQL)

**Technology**: PostgreSQL 15+ (Supabase hosted or RDS)

**Schema**:

```prisma
model PipelineJob {
  id            String    @id @default(cuid())
  tenantId      String    // Multi-tenant isolation
  jobType       String    // "trading-sweep", "document-processing", etc.
  status        JobStatus @default(QUEUED)
  parameters    Json      // Job-specific parameters (Zod validated)
  result        Json?     // Summary results (for dashboard display)
  metrics       Json?     // { duration_seconds, items_processed, etc }
  errorMessage  String?
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  completedAt   DateTime?

  results       TradingSweepResult[] // One-to-many job results

  @@index([tenantId, status])
  @@index([createdAt])
  @@map("pipeline_jobs")
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
}

model TradingSweepResult {
  id                  String   @id @default(cuid())
  jobId               String
  sweepRunId          String   // External system reference
  ticker              String
  strategyType        String
  fastPeriod          Int
  slowPeriod          Int
  score               Decimal  @db.Decimal(10, 2)
  sharpeRatio         Decimal  @db.Decimal(10, 2)
  totalReturnPct      Decimal  @db.Decimal(10, 2)
  maxDrawdownPct      Decimal  @db.Decimal(10, 2)
  totalTrades         Int
  createdAt           DateTime @default(now())

  job                 PipelineJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  @@index([jobId])
  @@index([sweepRunId])
  @@index([ticker, score])
  @@map("trading_sweep_results")
}
```

**Query Patterns**:

```typescript
// Dashboard: Get recent jobs for tenant
const recentJobs = await prisma.pipelineJob.findMany({
  where: { tenantId },
  orderBy: { createdAt: 'desc' },
  take: 20,
  include: { results: { take: 5, orderBy: { score: 'desc' } } },
})

// Worker: Update job status
await prisma.pipelineJob.update({
  where: { id: jobId },
  data: { status: 'RUNNING', startedAt: new Date() },
})

// Dashboard: Get top performing strategies
const topStrategies = await prisma.tradingSweepResult.findMany({
  where: { ticker },
  orderBy: { score: 'desc' },
  take: 10,
})
```

---

## Frontend Integration (Next.js Dashboard)

**Technology**: Next.js 15.5.5 with React 19, deployed on Vercel

**Pages**:

```
/                       - Landing page (marketing)
/dashboard              - Job overview (list of recent jobs)
/dashboard/jobs/[id]    - Job detail page (results, charts)
/dashboard/new          - Trigger new job (form)
```

**API Routes** (Next.js):

```typescript
// app/api/pipelines/route.ts
// List jobs
GET /api/pipelines?tenant_id=xxx
→ Returns recent jobs

// Trigger new job
POST /api/pipelines
→ Validates payload, creates job, enqueues to Redis/SQS

// app/api/pipelines/[id]/route.ts
// Get job status and results
GET /api/pipelines/[id]
→ Returns job + results from PostgreSQL
```

**Real-Time Updates**:

**Option 1: Polling** (MVP, simple)

```typescript
// Client-side: Poll every 5 seconds for job status
useEffect(() => {
  const interval = setInterval(() => {
    fetch(`/api/pipelines/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
  }, 5000)

  return () => clearInterval(interval)
}, [jobId])
```

**Option 2: WebSocket** (Production, real-time)

```typescript
// Server: Supabase real-time subscriptions
const channel = supabase
  .channel('pipeline_jobs')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'pipeline_jobs',
      filter: `id=eq.${jobId}`,
    },
    (payload) => {
      // Broadcast to connected clients
      io.emit(`job:${jobId}:update`, payload.new)
    }
  )
  .subscribe()

// Client: Listen for updates
socket.on(`job:${jobId}:update`, (updatedJob) => {
  setJob(updatedJob)
})
```

---

## Observability Stack (Prometheus + Grafana)

### Prometheus Metrics

**Custom Metrics** (emitted by webhook receiver and pipeline worker):

```typescript
// services/webhook-receiver/src/services/metrics.ts
import { Counter, Histogram, Gauge } from 'prom-client'

export const jobsQueued = new Counter({
  name: 'pipeline_jobs_queued_total',
  help: 'Total jobs queued',
  labelNames: ['job_type', 'tenant_id'],
})

export const jobsProcessed = new Counter({
  name: 'pipeline_jobs_processed_total',
  help: 'Total jobs processed',
  labelNames: ['job_type', 'status'], // status: completed/failed
})

export const jobDuration = new Histogram({
  name: 'pipeline_job_duration_seconds',
  help: 'Job execution duration',
  labelNames: ['job_type', 'status'],
  buckets: [1, 5, 15, 30, 60, 300, 600, 1800], // 1s to 30min
})

export const queueDepth = new Gauge({
  name: 'pipeline_queue_depth',
  help: 'Current number of jobs in queue',
  labelNames: ['status'], // QUEUED, RUNNING
})

// Usage in worker
jobsQueued.inc({ job_type: 'trading-sweep', tenant_id: tenantId })

const startTime = Date.now()
// ... process job ...
const duration = (Date.now() - startTime) / 1000
jobDuration.observe({ job_type: 'trading-sweep', status: 'completed' }, duration)
jobsProcessed.inc({ job_type: 'trading-sweep', status: 'completed' })
```

**Metrics Endpoint**:

```
GET http://webhook-receiver:3000/metrics
GET http://pipeline-worker:3001/metrics
```

**Prometheus Scrape Config**:

```yaml
# prometheus/prometheus.yml
scrape_configs:
  - job_name: 'webhook-receiver'
    static_configs:
      - targets: ['webhook-receiver:3000']

  - job_name: 'pipeline-worker'
    static_configs:
      - targets: ['pipeline-worker:3001']

  - job_name: 'next-dashboard'
    static_configs:
      - targets: ['next-app:3000']
```

### Grafana Dashboards

**Pipeline Performance Dashboard**:

- Jobs queued per minute (rate)
- Job success rate (completed / total \* 100)
- Average job duration (p50, p95, p99)
- Queue depth over time
- Jobs by status (pie chart: QUEUED, RUNNING, COMPLETED, FAILED)
- Top 5 tickers by job count

**System Health Dashboard**:

- Container CPU usage
- Container memory usage
- Redis connection pool stats
- PostgreSQL query latency
- HTTP request latency (p50, p95, p99)

**Business Metrics Dashboard**:

- Total jobs processed (all time)
- Active tenants (unique tenant_ids with jobs today)
- Revenue opportunity (jobs \* avg deal size)

---

## Security Architecture

### Authentication & Authorization

**Dashboard Users**:

- Supabase Auth (JWT tokens)
- Row-Level Security (RLS) in PostgreSQL isolates tenant data
- API routes validate JWT on every request

**External Webhooks**:

- API key authentication (stored in AWS Secrets Manager or env vars)
- Rate limiting (10 requests/minute per API key)
- IP whitelist (optional, for known external systems)

**Database Access**:

- Prisma ORM (prevents SQL injection)
- RLS policies enforce tenant isolation
- No direct database credentials in code (env vars only)

### Secrets Management

**Local Development**:

- `.env.local` for development secrets
- Git-ignored (never committed)

**Production (AWS)**:

- AWS Secrets Manager for API keys, database passwords
- IAM roles for service authentication (no hardcoded credentials)
- Secrets rotated automatically (30-90 days)

**Kubernetes**:

- Kubernetes Secrets for sensitive data
- Sealed Secrets for version-controlled encrypted secrets
- External Secrets Operator syncs from AWS Secrets Manager

---

## Deployment Architecture

### Phase 1: Docker Compose (Local/MVP)

```yaml
# docker-compose.pipeline.yml
services:
  redis:
    image: redis:7-alpine
    ports: ['6379:6379']

  webhook-receiver:
    build: ./services/webhook-receiver
    ports: ['3000:3000']
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
    depends_on: [redis]

  pipeline-worker:
    build: ./services/pipeline-worker
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
    depends_on: [redis]
    deploy:
      replicas: 2

  prometheus:
    image: prom/prometheus:latest
    ports: ['9090:9090']
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports: ['3001:3000']
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
```

**Scaling**: `docker-compose up --scale pipeline-worker=5`

---

### Phase 2: AWS ECS/EKS (Production)

**ECS (Simpler, Managed Containers)**:

- Fargate launch type (serverless containers)
- Task definitions for webhook-receiver and pipeline-worker
- Application Load Balancer for HTTPS ingress
- Auto Scaling based on CPU/memory

**EKS (Kubernetes, More Flexible)**:

- Kubernetes Deployments for services
- HorizontalPodAutoscaler for worker scaling
- Ingress controller (AWS Load Balancer Controller)
- Helm charts for easy configuration

**Infrastructure as Code** (Terraform):

```hcl
# terraform/modules/pipeline/main.tf
resource "aws_eks_cluster" "main" {
  name     = "zixly-pipeline"
  role_arn = aws_iam_role.eks_cluster.arn
  # ...
}

resource "aws_sqs_queue" "pipeline_jobs" {
  name                       = "pipeline-jobs"
  visibility_timeout_seconds = 3600
  # ...
}

resource "aws_s3_bucket" "pipeline_results" {
  bucket = "zixly-pipeline-results"
  # ...
}
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy-pipeline.yml
name: Deploy Pipeline Services

on:
  push:
    branches: [main]
    paths:
      - 'services/**'
      - 'docker-compose.pipeline.yml'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  build-and-deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker images
        run: |
          docker build -t webhook-receiver:${{ github.sha }} ./services/webhook-receiver
          docker build -t pipeline-worker:${{ github.sha }} ./services/pipeline-worker

      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker push $ECR_REGISTRY/webhook-receiver:${{ github.sha }}
          docker push $ECR_REGISTRY/pipeline-worker:${{ github.sha }}

      - name: Deploy to EKS
        run: |
          kubectl set image deployment/webhook-receiver webhook-receiver=$ECR_REGISTRY/webhook-receiver:${{ github.sha }}
          kubectl set image deployment/pipeline-worker pipeline-worker=$ECR_REGISTRY/pipeline-worker:${{ github.sha }}
```

---

## Performance Characteristics

### Latency

**Webhook Ingress**: < 100ms p95

- Payload validation: ~5ms
- Database insert: ~10ms
- Queue enqueue: ~5ms

**Job Processing**: 2-10 minutes (depends on external API)

- Trading API sweep: 2-10 min (external dependency)
- Document processing: 10-60 seconds
- Data ETL: 30-300 seconds

**Dashboard Queries**: < 200ms p95

- Job list: ~50ms (indexed queries)
- Job detail: ~100ms (includes results join)
- Real-time updates: < 5s (polling) or instant (WebSocket)

### Throughput

**Docker Compose (MVP)**:

- 2 workers: ~12-30 jobs/hour
- 5 workers: ~30-75 jobs/hour

**Kubernetes (Production)**:

- 10 workers: ~60-150 jobs/hour
- 50 workers: ~300-750 jobs/hour
- Auto-scaling: Handles bursts to 1000+ jobs/hour

### Reliability

**Retry Logic**:

- Failed jobs retry 3x with exponential backoff (2s, 4s, 8s)
- Dead letter queue for permanently failed jobs (manual investigation)

**Failure Recovery**:

- Worker crash: Job returns to queue (visibility timeout)
- Database failure: Queue persists jobs until database recovers
- External API timeout: Job fails, user notified, can re-trigger

---

## Migration Path

### From Docker Compose to Kubernetes

1. **Keep application code identical** (same Docker images)
2. **Convert docker-compose.yml to Kubernetes manifests**:
   - Services → Deployments + Services
   - Volumes → PersistentVolumeClaims
   - Environment variables → ConfigMaps + Secrets

3. **Infrastructure changes**:
   - Redis container → ElastiCache Redis or Redis on Kubernetes
   - PostgreSQL (Supabase) → No change (external)
   - Local disk → S3 for result storage

4. **Testing**: Deploy to local Kubernetes (Minikube) before AWS EKS

---

## References

- [ADR-006: Kubernetes Pipeline Orchestration](./decisions/adr-006-kubernetes-pipeline-orchestration.md)
- [ADR-007: Webhook Event-Driven Pipeline Architecture](./decisions/adr-007-webhook-event-architecture.md)
- [ADR-008: Local Docker Compose First Strategy](./decisions/adr-008-local-docker-first-strategy.md)
- [ADR-009: LocalStack + Terraform Phase](./decisions/adr-009-localstack-terraform-phase.md)
- [Trading API Pipeline Documentation](../pipelines/trading-api-strategy-sweep.md)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [AWS SQS Documentation](https://docs.aws.amazon.com/sqs/)
- [Kubernetes Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

---

**Document Version**: 2.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Architecture  
**Review Cycle**: Quarterly  
**Next Review**: 2025-04-27
