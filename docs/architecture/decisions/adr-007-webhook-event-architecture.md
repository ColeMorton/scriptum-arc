# ADR-007: Webhook Event-Driven Pipeline Architecture

**Status**: Accepted
**Date**: 2025-01-27
**Decision Makers**: Technical Architecture Team
**Affected Components**: Event ingestion, job triggering, async processing

---

## Context

With the pivot to DevOps automation, we need an event-driven architecture for triggering data analysis pipelines. The primary use case is webhook callbacks from external APIs (specifically the trading API) signaling job completion.

### Requirements

1. **Async Processing**: Accept webhook immediately, process in background
2. **Reliability**: Ensure no events are lost, even under load
3. **Idempotency**: Handle duplicate webhooks gracefully
4. **Observability**: Track event flow from ingestion to completion
5. **Scalability**: Support multiple concurrent webhooks
6. **Developer Experience**: Easy local testing and debugging

### Current Trading API Pattern

From existing pipeline workflows, the trading API provides:

- **Webhook Submission**: Client submits job with callback URL
- **Async Execution**: Job runs in background (can take minutes/hours)
- **Webhook Callback**: Trading API POSTs to callback URL when complete
- **Result Retrieval**: Client fetches results using sweep_run_id

---

## Options Considered

### Option 1: Direct Synchronous Processing

**Architecture**: Webhook receiver processes job synchronously, blocks until complete

**Pros**:

- Simplest implementation
- No queue infrastructure needed
- Immediate response to client

**Cons**:

- Timeout risk for long-running jobs
- No horizontal scaling
- Client must wait (bad UX for hours-long jobs)
- Server resources tied up during execution

**Verdict**: ❌ Rejected - Not suitable for long-running analysis jobs

---

### Option 2: Event Queue with Redis + Bull

**Architecture**: Webhook receiver queues job in Redis, Bull workers process async

```
Webhook POST → Validate → Redis Queue → Bull Worker → Execute Job → Store Results
```

**Pros**:

- Industry-standard pattern
- Excellent Node.js/TypeScript support (Bull library)
- Built-in retry logic and error handling
- Job prioritization and rate limiting
- Observable job status
- Lightweight (Redis is fast and simple)
- Docker Compose friendly for local dev

**Cons**:

- Requires Redis infrastructure
- Not natively distributed (single Redis instance)
- Manual worker scaling (no auto-scale in MVP)

**Verdict**: ✅ **Recommended for MVP** - Best balance of simplicity and capability

---

### Option 3: Kafka Event Streaming

**Architecture**: Webhook publishes to Kafka topic, consumer processes events

**Pros**:

- True distributed event streaming
- Horizontal scalability
- Event replay capability
- High throughput

**Cons**:

- Complex infrastructure (Zookeeper/KRaft + Kafka brokers)
- Overkill for MVP workload
- Steep learning curve
- Higher operational overhead
- Expensive for low-volume use case

**Verdict**: ❌ Rejected for MVP - Too complex, revisit at scale (1000+ jobs/day)

---

### Option 4: AWS SQS + Lambda

**Architecture**: Webhook sends to SQS, Lambda functions process

**Pros**:

- Serverless (no infrastructure management)
- Auto-scaling
- Pay-per-use pricing

**Cons**:

- 15-minute Lambda timeout (insufficient for long jobs)
- Vendor lock-in
- No local development parity
- Not transferable to other clouds

**Verdict**: ❌ Rejected - Lambda timeout limits, not suitable for local-first MVP

---

## Decision

**We will implement a Redis + Bull event queue architecture for webhook-triggered pipelines.**

### Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      Webhook Event Flow                          │
└──────────────────────────────────────────────────────────────────┘

1. External API (Trading API) → HTTP POST → Webhook Receiver (Express.js)
2. Webhook Receiver → Validate Payload (Zod schema)
3. Webhook Receiver → Create Job → Redis Queue (Bull)
4. Webhook Receiver → Return 202 Accepted + Job ID
5. Bull Worker → Poll Redis → Pick up Job
6. Bull Worker → Execute Analysis (call Trading API, wait for callback)
7. Trading API → Webhook Callback → Update Job Status
8. Bull Worker → Fetch Results → Store in PostgreSQL
9. Bull Worker → Send Notification (Email/Slack)
10. Bull Worker → Update Job Status → COMPLETED
```

### Key Components

#### 1. Webhook Receiver (Express.js)

```typescript
POST /webhook/trading-sweep
- Validates webhook payload
- Creates job in Redis queue
- Returns job ID immediately (202 Accepted)
- Does NOT wait for job completion
```

#### 2. Redis + Bull Queue

```typescript
// Job queue configuration
const tradingSweepQueue = new Queue('trading-sweeps', {
  redis: { host: 'redis', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: false, // Keep for observability
    removeOnFail: false,
  },
})
```

#### 3. Bull Worker (Node.js)

```typescript
// Worker process
tradingSweepQueue.process(async (job) => {
  const { ticker, fast_range, slow_range, step } = job.data

  // Call trading API with webhook callback
  const result = await tradingApiClient.submitSweep({
    ticker,
    fast_range,
    slow_range,
    step,
    webhook_url: `${WEBHOOK_BASE_URL}/webhook/sweep-callback`,
  })

  // Wait for async callback (job pauses here)
  const callbackData = await waitForCallback(result.job_id)

  // Fetch best results
  const bestResults = await tradingApiClient.getBestResults(callbackData.sweep_run_id, ticker)

  // Store in database
  await prisma.tradingSweepResult.create({ data: bestResults })

  // Send notification
  await emailService.sendSuccessNotification(bestResults)

  return { status: 'COMPLETED', sweep_run_id: callbackData.sweep_run_id }
})
```

---

## Rationale

1. **MVP Speed**: Bull + Redis is the fastest path to working async pipeline (2-3 days implementation)

2. **Local Development**: Redis runs easily in Docker Compose, no cloud dependencies

3. **Node.js Ecosystem**: Bull has excellent TypeScript support and Prisma integration

4. **Observability**: Bull UI provides built-in job monitoring dashboard

5. **DevOps Learning**: Job queue pattern is fundamental to distributed systems

6. **Cost**: Redis is free/cheap, scales well to 10,000+ jobs/day

7. **Kubernetes Ready**: Redis can be deployed as StatefulSet when moving to Kubernetes

---

## Implementation Details

### Webhook Payload Schema (Zod)

```typescript
const TradingSweepWebhookSchema = z.object({
  event_type: z.literal('sweep.completed'),
  job_id: z.string(),
  sweep_run_id: z.string(),
  status: z.enum(['completed', 'failed']),
  ticker: z.string(),
  error_message: z.string().optional(),
  result_data: z
    .object({
      sweep_run_id: z.string(),
      total_combinations: z.number(),
      execution_time_seconds: z.number(),
    })
    .optional(),
  timestamp: z.string().datetime(),
})
```

### Job Data Structure

```typescript
interface TradingSweepJob {
  jobId: string // Unique job ID
  tenantId: string // Multi-tenant isolation
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
  min_trades: number
  strategy_type: 'SMA' | 'EMA' | 'MACD'
  webhook_url: string // Callback URL
  created_at: Date
}
```

### Database Job Tracking

```prisma
model PipelineJob {
  id            String    @id @default(cuid())
  tenantId      String
  jobType       String    // "trading-sweep"
  status        JobStatus @default(QUEUED)
  parameters    Json      // Job-specific params
  result        Json?     // Final results
  metrics       Json?     // Execution metrics
  errorMessage  String?
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  completedAt   DateTime?

  @@index([tenantId, status])
  @@index([createdAt])
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
}
```

---

## Observability

### Metrics (Prometheus)

```typescript
// Custom metrics
const jobsQueued = new Counter({
  name: 'pipeline_jobs_queued_total',
  help: 'Total number of jobs queued',
  labelNames: ['job_type', 'tenant_id'],
})

const jobDuration = new Histogram({
  name: 'pipeline_job_duration_seconds',
  help: 'Job execution duration',
  labelNames: ['job_type', 'status'],
  buckets: [1, 5, 15, 30, 60, 300, 600], // Seconds
})

const jobsProcessed = new Counter({
  name: 'pipeline_jobs_processed_total',
  help: 'Total jobs processed',
  labelNames: ['job_type', 'status'], // status: completed/failed
})
```

### Logging Structure

```typescript
logger.info('Job queued', {
  job_id: job.id,
  job_type: 'trading-sweep',
  tenant_id: tenantId,
  ticker: job.data.ticker,
})

logger.info('Job started', {
  job_id: job.id,
  started_at: new Date().toISOString(),
})

logger.info('Job completed', {
  job_id: job.id,
  status: 'completed',
  duration_seconds: duration,
  sweep_run_id: result.sweep_run_id,
})
```

---

## Error Handling

### Retry Strategy

```typescript
// Automatic retries with exponential backoff
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // Start with 2s, then 4s, then 8s
  },
}
```

### Failure Scenarios

1. **Webhook Validation Fails**: Return 400 Bad Request immediately
2. **Redis Connection Lost**: Return 503 Service Unavailable, client retries
3. **Job Processing Fails**: Retry up to 3 times, then mark as FAILED
4. **Trading API Timeout**: Cancel job after 1 hour, send failure notification
5. **Database Write Fails**: Retry with exponential backoff, alert on repeated failure

---

## Consequences

### Positive

1. **Fast MVP**: 2-3 days to working async pipeline
2. **Scalable**: Add more Bull workers for horizontal scaling
3. **Observable**: Built-in job status tracking and metrics
4. **Testable**: Easy to mock Redis and test locally
5. **Cloud-Ready**: Redis can move to ElastiCache or Kubernetes StatefulSet

### Negative

1. **Single Point of Failure**: Redis in MVP (no replication)
   - **Mitigation**: Add Redis replication in production (Week 8+)
2. **Manual Scaling**: No auto-scaling of workers in MVP
   - **Mitigation**: Kubernetes HorizontalPodAutoscaler in production
3. **Limited Event Replay**: No built-in event sourcing
   - **Mitigation**: Store all jobs in PostgreSQL for historical analysis

### Neutral

1. **Learning Curve**: Bull library is new (but well-documented)
2. **Infrastructure**: Adds Redis to stack (manageable complexity)

---

## Testing Strategy

### Unit Tests

```typescript
// Test webhook validation
test('rejects invalid webhook payload', async () => {
  const invalidPayload = { event_type: 'invalid' }
  const response = await request(app).post('/webhook/trading-sweep').send(invalidPayload)

  expect(response.status).toBe(400)
})

// Test job creation
test('creates job in queue', async () => {
  const payload = validTradingSweepPayload
  const response = await request(app).post('/webhook/trading-sweep').send(payload)

  expect(response.status).toBe(202)
  expect(response.body.job_id).toBeDefined()

  const job = await tradingSweepQueue.getJob(response.body.job_id)
  expect(job.data.ticker).toBe(payload.ticker)
})
```

### Integration Tests

```typescript
// Test end-to-end flow
test('processes trading sweep job', async () => {
  const payload = validTradingSweepPayload

  // Submit webhook
  const { body } = await request(app).post('/webhook/trading-sweep').send(payload)

  // Wait for job completion
  await waitForJobStatus(body.job_id, 'COMPLETED', 60000)

  // Verify results stored
  const results = await prisma.tradingSweepResult.findFirst({
    where: { jobId: body.job_id },
  })

  expect(results).toBeDefined()
  expect(results.ticker).toBe(payload.ticker)
})
```

---

## Migration Path to Kubernetes

When moving to Kubernetes (Phase 2), the architecture adapts:

### Current (Docker Compose)

```yaml
services:
  redis:
    image: redis:7-alpine
  webhook-receiver:
    build: ./services/webhook-receiver
  pipeline-worker:
    build: ./services/pipeline-worker
    replicas: 2
```

### Future (Kubernetes)

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 1
  template:
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          volumeMounts:
            - name: redis-data
              mountPath: /data
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webhook-receiver
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: webhook-receiver
          image: zixly/webhook-receiver:latest
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pipeline-worker-hpa
spec:
  scaleTargetRef:
    kind: Deployment
    name: pipeline-worker
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## References

- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Bull MQ (TypeScript native)](https://docs.bullmq.io/)
- [Redis Persistence](https://redis.io/topics/persistence)
- [Event-Driven Microservices](https://martinfowler.com/articles/201701-event-driven.html)
- [Trading API Integration (pipeline workflow)](../../../archive/pipeline-workflows/internal/trading-api-smoke-test.json)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-27
**Review Cycle**: After MVP deployment (Week 4)
**Next Review**: 2025-02-24
