# Trading API Strategy Sweep Pipeline

**Version**: 1.0
**Last Updated**: 2025-01-27
**Pipeline Type**: Webhook-Triggered Data Analysis
**Status**: MVP Implementation

---

## Overview

The Trading API Strategy Sweep pipeline is the first DevOps automation implementation for Zixly. It demonstrates webhook-triggered, long-running data analysis workflows using Docker containerization, job queues, and asynchronous processing.

### Business Context

This pipeline serves as:

1. **Portfolio Demonstration**: Showcases cloud-native pipeline architecture for client presentations
2. **Personal Tool**: Optimizes trading strategies using parameter sweep backtesting
3. **Learning Project**: Demonstrates Docker, job queues, and event-driven architecture

---

## Trading API Overview

**Repository**: Personal trading strategy backtesting API
**Base URL**: `http://localhost:8000` (runs locally on development machine)
**Authentication**: X-API-Key header
**Documentation**: `/docs` endpoint (FastAPI auto-generated)

### Key Features

- **Strategy Backtesting**: Test moving average crossover strategies on historical price data
- **Parameter Sweeps**: Test multiple parameter combinations to find optimal settings
- **Webhook Callbacks**: Async job execution with webhook notification on completion
- **Performance Metrics**: Sharpe ratio, Sortino ratio, total return, max drawdown, win rate

---

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Purpose**: Verify API is running and accessible

**Response**:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-01-27T10:30:00Z"
}
```

**Usage in Pipeline**:

- Health check before submitting sweep job
- Monitoring endpoint for observability

---

### 2. Submit Strategy Sweep

**Endpoint**: `POST /api/v1/strategy/sweep`

**Purpose**: Submit parameter sweep job for backtesting

**Headers**:

```
X-API-Key: dev-key-000000000000000000000000
Content-Type: application/x-www-form-urlencoded
```

**Request Body** (Form Data):

```
ticker: BTC-USD
fast_range: [10, 20]
slow_range: [20, 30]
step: 5
min_trades: 50
strategy_type: SMA
config_path: minimum
webhook_url: http://webhook-receiver:3000/webhook/sweep-callback
```

**Parameters**:

| Parameter       | Type            | Required | Description                                  |
| --------------- | --------------- | -------- | -------------------------------------------- |
| `ticker`        | string          | Yes      | Trading pair symbol (e.g., "BTC-USD")        |
| `fast_range`    | array[int, int] | Yes      | Min and max for fast moving average period   |
| `slow_range`    | array[int, int] | Yes      | Min and max for slow moving average period   |
| `step`          | integer         | Yes      | Step size for parameter iteration            |
| `min_trades`    | integer         | Yes      | Minimum trades required for valid backtest   |
| `strategy_type` | string          | Yes      | Strategy type: "SMA", "EMA", or "MACD"       |
| `config_path`   | string          | No       | Configuration preset: "minimum", "standard"  |
| `webhook_url`   | string          | Yes      | Callback URL for job completion notification |

**Response** (202 Accepted):

```json
{
  "job_id": "sweep_20250127_103045_btcusd",
  "status": "queued",
  "message": "Strategy sweep job queued successfully",
  "parameters": {
    "ticker": "BTC-USD",
    "fast_range": [10, 20],
    "slow_range": [20, 30],
    "step": 5,
    "combinations": 9
  },
  "estimated_duration_seconds": 120,
  "webhook_url": "http://webhook-receiver:3000/webhook/sweep-callback",
  "created_at": "2025-01-27T10:30:45Z"
}
```

**Example Combinations** (step=5):

- Fast 10, Slow 20
- Fast 10, Slow 25
- Fast 10, Slow 30
- Fast 15, Slow 20
- Fast 15, Slow 25
- Fast 15, Slow 30
- Fast 20, Slow 20 (skipped - invalid)
- Fast 20, Slow 25
- Fast 20, Slow 30

**Total**: 8 valid combinations (fast must be < slow)

---

### 3. Webhook Callback (from Trading API)

**Endpoint**: `POST {webhook_url}` (our webhook receiver)

**Purpose**: Trading API calls this when sweep job completes

**Request Body**:

```json
{
  "event_type": "sweep.completed",
  "job_id": "sweep_20250127_103045_btcusd",
  "sweep_run_id": "run_abc123xyz789",
  "status": "completed",
  "ticker": "BTC-USD",
  "result_data": {
    "sweep_run_id": "run_abc123xyz789",
    "total_combinations": 8,
    "execution_time_seconds": 127,
    "completed_at": "2025-01-27T10:32:52Z"
  },
  "timestamp": "2025-01-27T10:32:52Z"
}
```

**Failure Callback**:

```json
{
  "event_type": "sweep.failed",
  "job_id": "sweep_20250127_103045_btcusd",
  "status": "failed",
  "error_message": "Insufficient historical data for ticker BTC-USD",
  "timestamp": "2025-01-27T10:31:30Z"
}
```

---

### 4. Get Best Results

**Endpoint**: `GET /api/v1/sweeps/{sweep_run_id}/best`

**Purpose**: Retrieve top-performing strategy parameters after sweep completion

**Headers**:

```
X-API-Key: dev-key-000000000000000000000000
```

**Query Parameters**:

```
ticker: BTC-USD
```

**Response**:

```json
{
  "sweep_run_id": "run_abc123xyz789",
  "ticker": "BTC-USD",
  "results": [
    {
      "ticker": "BTC-USD",
      "strategy_type": "SMA",
      "fast_period": 15,
      "slow_period": 30,
      "score": 2.47,
      "sharpe_ratio": 1.82,
      "sortino_ratio": 2.15,
      "total_return_pct": 145.3,
      "annualized_return": 32.4,
      "max_drawdown_pct": -18.7,
      "win_rate_pct": 58.3,
      "profit_factor": 2.1,
      "total_trades": 87,
      "trades_per_month": 4.2,
      "avg_trade_duration": "5.2 days"
    },
    {
      "ticker": "BTC-USD",
      "strategy_type": "SMA",
      "fast_period": 10,
      "slow_period": 25,
      "score": 2.31,
      "sharpe_ratio": 1.68,
      "sortino_ratio": 1.92,
      "total_return_pct": 132.1,
      "annualized_return": 29.8,
      "max_drawdown_pct": -21.3,
      "win_rate_pct": 56.2,
      "profit_factor": 1.95,
      "total_trades": 102,
      "trades_per_month": 4.9,
      "avg_trade_duration": "4.8 days"
    }
  ],
  "total_results": 8,
  "returned": 2,
  "query_timestamp": "2025-01-27T10:33:15Z"
}
```

**Sorting**: Results sorted by `score` (composite metric) descending

---

## Pipeline Workflow

### End-to-End Flow

```
1. User/API → POST /api/pipelines/trigger → Zixly Webhook Receiver
2. Webhook Receiver → Validate Payload → Create Job → Redis Queue
3. Webhook Receiver → Return 202 Accepted + Job ID
4. Pipeline Worker → Poll Redis → Pick up Job
5. Pipeline Worker → POST /api/v1/strategy/sweep → Trading API
6. Trading API → Execute Sweep (2-10 minutes)
7. Trading API → POST {webhook_url} → Zixly Webhook Receiver
8. Webhook Receiver → Update Job Status → RUNNING
9. Pipeline Worker → GET /api/v1/sweeps/{id}/best → Fetch Results
10. Pipeline Worker → Store Results → PostgreSQL (Supabase)
11. Pipeline Worker → Send Email Notification (Outlook)
12. Pipeline Worker → Update Job Status → COMPLETED
13. Dashboard → Display Results → User views performance metrics
```

### Timing

- **Job Submission**: < 100ms (webhook receiver)
- **Sweep Execution**: 2-10 minutes (depending on parameters)
- **Result Retrieval**: < 1 second
- **Database Storage**: < 500ms
- **Email Notification**: 1-2 seconds
- **Total Latency**: 2-10 minutes (dominated by sweep execution)

---

## Data Schemas

### Zod Validation Schema (Webhook Receiver)

```typescript
import { z } from 'zod'

export const TradingSweepTriggerSchema = z
  .object({
    ticker: z.string().min(3).max(20),
    fast_range: z.tuple([z.number().int().min(1), z.number().int().max(500)]),
    slow_range: z.tuple([z.number().int().min(1), z.number().int().max(500)]),
    step: z.number().int().min(1).max(50),
    min_trades: z.number().int().min(10).max(1000).default(50),
    strategy_type: z.enum(['SMA', 'EMA', 'MACD']).default('SMA'),
    config_path: z.enum(['minimum', 'standard']).optional(),
  })
  .refine((data) => data.fast_range[0] < data.slow_range[0], {
    message: 'Fast range min must be less than slow range min',
  })
  .refine((data) => data.fast_range[1] < data.slow_range[1], {
    message: 'Fast range max must be less than slow range max',
  })

export const TradingSweepCallbackSchema = z.object({
  event_type: z.enum(['sweep.completed', 'sweep.failed']),
  job_id: z.string(),
  sweep_run_id: z.string().optional(),
  status: z.enum(['completed', 'failed']),
  ticker: z.string(),
  error_message: z.string().optional(),
  result_data: z
    .object({
      sweep_run_id: z.string(),
      total_combinations: z.number(),
      execution_time_seconds: z.number(),
      completed_at: z.string().datetime(),
    })
    .optional(),
  timestamp: z.string().datetime(),
})
```

### Prisma Database Schema

```prisma
model PipelineJob {
  id            String    @id @default(cuid())
  tenantId      String
  jobType       String    // "trading-sweep"
  status        JobStatus @default(QUEUED)
  parameters    Json      // TradingSweepTriggerSchema
  result        Json?     // Summary results
  metrics       Json?     // { duration, combinations, etc }
  errorMessage  String?
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  completedAt   DateTime?

  results       TradingSweepResult[]

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
  sweepRunId          String   // From Trading API
  ticker              String
  strategyType        String
  fastPeriod          Int
  slowPeriod          Int
  score               Decimal  @db.Decimal(10, 2)
  sharpeRatio         Decimal  @db.Decimal(10, 2)
  sortinoRatio        Decimal  @db.Decimal(10, 2)
  totalReturnPct      Decimal  @db.Decimal(10, 2)
  annualizedReturn    Decimal  @db.Decimal(10, 2)
  maxDrawdownPct      Decimal  @db.Decimal(10, 2)
  winRatePct          Decimal  @db.Decimal(10, 2)
  profitFactor        Decimal  @db.Decimal(10, 2)
  totalTrades         Int
  tradesPerMonth      Decimal  @db.Decimal(10, 2)
  avgTradeDuration    String
  createdAt           DateTime @default(now())

  job                 PipelineJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  @@index([jobId])
  @@index([sweepRunId])
  @@index([ticker, score])
  @@map("trading_sweep_results")
}
```

---

## Error Handling

### Failure Scenarios

| Scenario                 | Detection                | Recovery                               | User Impact         |
| ------------------------ | ------------------------ | -------------------------------------- | ------------------- |
| Trading API down         | Health check fails       | Return 503, retry after 30s            | Job queued, retry   |
| Invalid parameters       | Zod validation fails     | Return 400 Bad Request immediately     | User fixes request  |
| Sweep execution timeout  | No callback after 1 hour | Mark job FAILED, send notification     | User notified       |
| Webhook callback lost    | Timeout after 1 hour     | Poll Trading API for status (fallback) | Eventual completion |
| Database connection lost | Prisma error             | Retry 3x with backoff, alert DevOps    | Temp unavailable    |
| Results fetch fails      | HTTP error               | Retry 3x, mark FAILED if persist       | Job marked failed   |

### Retry Configuration

```typescript
// Bull job configuration
const jobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s, 4s, 8s
  },
  timeout: 3600000, // 1 hour max per job
  removeOnComplete: 100, // Keep last 100 completed jobs
  removeOnFail: 500, // Keep last 500 failed jobs for debugging
}
```

---

## Monitoring & Observability

### Prometheus Metrics

```typescript
// Custom metrics
const pipelineJobsQueued = new Counter({
  name: 'pipeline_trading_sweep_jobs_queued_total',
  help: 'Total trading sweep jobs queued',
  labelNames: ['ticker', 'strategy_type'],
})

const pipelineJobDuration = new Histogram({
  name: 'pipeline_trading_sweep_duration_seconds',
  help: 'Trading sweep job duration',
  labelNames: ['status', 'ticker'],
  buckets: [10, 30, 60, 120, 300, 600, 1800], // 10s to 30min
})

const pipelineJobsCompleted = new Counter({
  name: 'pipeline_trading_sweep_jobs_completed_total',
  help: 'Total completed trading sweeps',
  labelNames: ['status', 'ticker'], // status: completed/failed
})

const tradingApiLatency = new Histogram({
  name: 'pipeline_trading_api_latency_seconds',
  help: 'Trading API response time',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
})
```

### Grafana Dashboard Panels

1. **Job Queue Depth**: Current jobs in QUEUED status
2. **Job Success Rate**: (completed / total) \* 100
3. **Average Job Duration**: p50, p95, p99 latencies
4. **Trading API Health**: Uptime percentage
5. **Results Per Ticker**: Top tickers by job count
6. **Best Performing Strategies**: Top Sharpe ratios across all sweeps

---

## Example Usage

### Via API (cURL)

```bash
# Trigger trading sweep
curl -X POST http://localhost:3000/api/pipelines/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{
    "ticker": "BTC-USD",
    "fast_range": [10, 20],
    "slow_range": [20, 30],
    "step": 5,
    "min_trades": 50,
    "strategy_type": "SMA"
  }'

# Response
{
  "job_id": "cm4x8y9z0000108l7a1b2c3d4",
  "status": "QUEUED",
  "message": "Trading sweep job queued successfully",
  "webhook_url": "http://webhook-receiver:3000/webhook/sweep-callback"
}

# Check job status
curl http://localhost:3000/api/pipelines/cm4x8y9z0000108l7a1b2c3d4 \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"

# Response
{
  "id": "cm4x8y9z0000108l7a1b2c3d4",
  "status": "COMPLETED",
  "parameters": { "ticker": "BTC-USD", ... },
  "metrics": {
    "duration_seconds": 127,
    "combinations_tested": 8
  },
  "results": [
    {
      "fast_period": 15,
      "slow_period": 30,
      "sharpe_ratio": 1.82,
      "total_return_pct": 145.3
    }
  ]
}
```

### Via Dashboard

1. Navigate to `http://localhost:3000/pipelines`
2. Click "New Trading Sweep"
3. Enter parameters:
   - Ticker: BTC-USD
   - Fast Range: 10-20
   - Slow Range: 20-30
   - Step: 5
4. Click "Start Sweep"
5. View real-time status updates
6. Review results when completed

---

## Performance Considerations

### Scalability

- **Concurrent Jobs**: 2 workers initially, scale to 10+ with Docker Compose replicas
- **Job Duration**: 2-10 minutes per sweep (depends on parameters)
- **Throughput**: ~12-30 sweeps/hour with 2 workers
- **Bottleneck**: Trading API execution time (external dependency)

### Optimization Opportunities

1. **Caching**: Cache historical price data in Redis (reduce Trading API load)
2. **Batching**: Submit multiple tickers in single job
3. **Parallel Workers**: Increase worker replicas for horizontal scaling
4. **Result Pagination**: Implement cursor-based pagination for large result sets

---

## Security Considerations

### Authentication

- **Trading API**: X-API-Key header (stored in environment variable)
- **Zixly API**: Supabase JWT (existing auth middleware)
- **Webhook Callback**: Validate job_id exists before processing

### Data Privacy

- **Results Storage**: Tenant-scoped (RLS policies)
- **API Keys**: Never logged, stored in encrypted environment variables
- **Webhook URLs**: Validated to prevent SSRF attacks

---

## Future Enhancements

### Phase 2 (Weeks 5-8)

- [ ] Support for multiple strategy types (EMA, MACD, RSI)
- [ ] Portfolio-level backtesting (multiple tickers)
- [ ] Result caching for repeated parameter combinations
- [ ] Real-time progress updates via WebSockets

### Phase 3 (Weeks 9-12)

- [ ] Machine learning parameter optimization (Bayesian optimization)
- [ ] Walk-forward analysis for strategy robustness
- [ ] Comparison against buy-and-hold baseline
- [ ] Export results to CSV/PDF reports

---

## References

- [Trading API Repository](../archive/pipeline-workflows/internal/trading-api-smoke-test.json) - Original pipeline workflow
- [ADR-006: Kubernetes Pipeline Orchestration](../architecture/decisions/adr-006-kubernetes-pipeline-orchestration.md)
- [ADR-007: Webhook Event Architecture](../architecture/decisions/adr-007-webhook-event-architecture.md)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Algorithmic Trading Concepts](https://www.investopedia.com/terms/a/algorithmictrading.asp)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-27
**Review Cycle**: After MVP completion
**Next Review**: 2025-02-24
