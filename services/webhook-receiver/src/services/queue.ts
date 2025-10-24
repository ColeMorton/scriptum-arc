import Queue from 'bull'
import { TradingSweepJobData } from '../types'
import logger from './logger'
import { pipelineJobs } from './metrics'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

// Create job queue
export const tradingSweepQueue = new Queue<TradingSweepJobData>('trading-sweeps', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500, // Keep last 500 failed jobs for debugging
    timeout: 3600000, // 1 hour timeout per job
  },
})

// Update metrics helper
async function updateQueueMetrics() {
  try {
    const counts = await tradingSweepQueue.getJobCounts()
    pipelineJobs.set({ status: 'queued' }, counts.waiting + counts.delayed)
    pipelineJobs.set({ status: 'active' }, counts.active)
    pipelineJobs.set({ status: 'completed' }, counts.completed)
    pipelineJobs.set({ status: 'failed' }, counts.failed)
  } catch (error) {
    logger.error('Failed to update queue metrics', { error })
  }
}

// Queue event handlers
tradingSweepQueue.on('error', (error) => {
  logger.error('Queue error', { error: error.message, stack: error.stack })
})

tradingSweepQueue.on('waiting', (jobId) => {
  logger.debug('Job waiting', { job_id: jobId })
  updateQueueMetrics()
})

tradingSweepQueue.on('active', (job) => {
  logger.info('Job started processing', {
    job_id: job.id,
    ticker: job.data.ticker,
    strategy_type: job.data.strategy_type,
  })
  updateQueueMetrics()
})

tradingSweepQueue.on('completed', (job, result) => {
  logger.info('Job completed', {
    job_id: job.id,
    ticker: job.data.ticker,
    duration_ms: Date.now() - job.timestamp,
    result,
  })
  updateQueueMetrics()
})

tradingSweepQueue.on('failed', (job, error) => {
  logger.error('Job failed', {
    job_id: job?.id,
    ticker: job?.data?.ticker,
    error: error.message,
    attempts: job?.attemptsMade,
  })
  updateQueueMetrics()
})

tradingSweepQueue.on('stalled', (job) => {
  logger.warn('Job stalled', {
    job_id: job.id,
    ticker: job.data.ticker,
  })
  updateQueueMetrics()
})

// Update metrics periodically (every 10 seconds)
setInterval(() => {
  updateQueueMetrics()
}, 10000)

// Initial metrics update
updateQueueMetrics()

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing queue gracefully')
  await tradingSweepQueue.close()
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing queue gracefully')
  await tradingSweepQueue.close()
})

export default tradingSweepQueue
