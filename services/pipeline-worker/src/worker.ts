import Queue from 'bull'
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import logger from './services/logger'
import { processTradingSweep } from './processors/trading-sweep-processor'

// Load environment variables
dotenv.config()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const WORKER_CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '2')

// Create queue connection
const tradingSweepQueue = new Queue('trading-sweeps', REDIS_URL)

logger.info('Pipeline worker starting', {
  redis_url: REDIS_URL,
  concurrency: WORKER_CONCURRENCY,
})

// Process jobs from queue
tradingSweepQueue.process(WORKER_CONCURRENCY, async (job) => {
  logger.info('Job picked up', {
    job_id: job.id,
    ticker: job.data.ticker,
    attempt: job.attemptsMade + 1,
  })

  await processTradingSweep(job)
})

// Queue event handlers
tradingSweepQueue.on('error', (error) => {
  logger.error('Queue error', {
    error: error.message,
    stack: error.stack,
  })
})

tradingSweepQueue.on('waiting', (jobId) => {
  logger.debug('Job waiting', { job_id: jobId })
})

tradingSweepQueue.on('active', (job) => {
  logger.info('Job active', {
    job_id: job.id,
    ticker: job.data.ticker,
  })
})

tradingSweepQueue.on('completed', (job, result) => {
  logger.info('Job completed', {
    job_id: job.id,
    ticker: job.data.ticker,
    result,
  })
})

tradingSweepQueue.on('failed', (job, error) => {
  logger.error('Job failed', {
    job_id: job?.id,
    ticker: job?.data?.ticker,
    error: error.message,
    attempts: job?.attemptsMade,
  })
})

tradingSweepQueue.on('stalled', (job) => {
  logger.warn('Job stalled', {
    job_id: job.id,
    ticker: job.data.ticker,
  })
})

// Health check file (for Docker healthcheck)
const updateHealthCheck = () => {
  try {
    writeFileSync('/tmp/worker-healthy', new Date().toISOString())
  } catch {
    // Ignore errors in health check file writing
  }
}

// Update health check every 10 seconds
const healthCheckInterval = setInterval(updateHealthCheck, 10000)
updateHealthCheck() // Initial write

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, starting graceful shutdown`)

  clearInterval(healthCheckInterval)

  // Stop accepting new jobs
  await tradingSweepQueue.pause(true)
  logger.info('Queue paused, waiting for active jobs to complete')

  // Wait for active jobs to complete
  await tradingSweepQueue.close()
  logger.info('Queue closed, all jobs completed')

  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', {
    reason,
    promise,
  })
  process.exit(1)
})

logger.info('Pipeline worker ready', {
  queue: 'trading-sweeps',
  concurrency: WORKER_CONCURRENCY,
})
