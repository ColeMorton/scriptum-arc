import { Counter, Histogram, Gauge, register } from 'prom-client'

// Job metrics
export const jobsQueued = new Counter({
  name: 'pipeline_jobs_queued_total',
  help: 'Total number of jobs queued',
  labelNames: ['job_type', 'tenant_id', 'ticker'],
})

export const jobDuration = new Histogram({
  name: 'pipeline_job_duration_seconds',
  help: 'Job execution duration',
  labelNames: ['job_type', 'status'],
  buckets: [1, 5, 15, 30, 60, 300, 600, 1800], // 1s to 30min
})

export const jobsProcessed = new Counter({
  name: 'pipeline_jobs_processed_total',
  help: 'Total jobs processed',
  labelNames: ['job_type', 'status'], // status: completed/failed
})

// Current job counts by status (Gauge for alerts)
export const pipelineJobs = new Gauge({
  name: 'pipeline_jobs',
  help: 'Current number of pipeline jobs by status',
  labelNames: ['status'], // status: queued/active/completed/failed
})

// HTTP metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
})

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
})

// Trading API metrics
export const tradingApiLatency = new Histogram({
  name: 'pipeline_trading_api_latency_seconds',
  help: 'Trading API response time',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
})

export const tradingApiErrors = new Counter({
  name: 'pipeline_trading_api_errors_total',
  help: 'Trading API errors',
  labelNames: ['endpoint', 'error_type'],
})

// Redis metrics
export const redisConnectionErrors = new Counter({
  name: 'redis_connection_errors_total',
  help: 'Redis connection errors',
})

// Export metrics registry
export { register }
