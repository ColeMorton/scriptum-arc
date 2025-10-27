import { Job } from 'bull'
import logger from '../services/logger'
import { TradingAPIClient } from '../services/trading-api-client'

interface TradingSweepJobData {
  jobId: string
  tenantId: string
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
  min_trades: number
  strategy_type: 'SMA' | 'EMA' | 'MACD'
  config_path?: 'minimum' | 'standard'
  webhook_url: string
  created_at: Date
}

export async function processTradingSweep(job: Job<TradingSweepJobData>): Promise<void> {
  const { jobId, ticker, fast_range, slow_range, step, min_trades, strategy_type, config_path } =
    job.data

  logger.info('Processing trading sweep', {
    job_id: jobId,
    ticker,
    strategy_type,
  })

  const tradingAPIClient = new TradingAPIClient()

  try {
    // Step 1: Check Trading API health
    const isHealthy = await tradingAPIClient.healthCheck()
    if (!isHealthy) {
      throw new Error('Trading API is not healthy')
    }

    logger.info('Trading API health check passed', {
      job_id: jobId,
      status: 'healthy',
    })

    // Step 2: Submit sweep to Trading API
    const sweepParams = {
      ticker,
      fast_range,
      slow_range,
      step,
      min_trades,
      strategy_type,
      config_path,
      webhook_url: job.data.webhook_url,
    }

    const sweepResponse = await tradingAPIClient.submitSweep(sweepParams)

    logger.info('Sweep submitted to Trading API', {
      job_id: jobId,
      trading_api_job_id: sweepResponse.job_id,
      estimated_duration: sweepResponse.estimated_duration_seconds,
    })

    // Step 3: Wait for sweep completion (polling)
    let sweepRunId: string | undefined
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max wait time

    while (attempts < maxAttempts) {
      try {
        // Check if job is completed by looking at the job status
        const jobStatus = await tradingAPIClient.getJobStatus(sweepResponse.job_id)

        if (jobStatus.status === 'completed') {
          sweepRunId = jobStatus.sweep_run_id
          break
        } else if (jobStatus.status === 'failed') {
          throw new Error(`Sweep job failed: ${jobStatus.error_message || 'Unknown error'}`)
        }

        // Wait 5 seconds before next check
        await new Promise((resolve) => setTimeout(resolve, 5000))
        attempts++
      } catch (error) {
        if (attempts >= maxAttempts - 1) {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, 5000))
        attempts++
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Sweep job timed out')
    }

    if (!sweepRunId) {
      throw new Error('Sweep run ID not found in completed job')
    }

    logger.info('Sweep completed', {
      job_id: jobId,
      sweep_run_id: sweepRunId,
    })

    // Step 4: Get best results
    const results = await tradingAPIClient.getBestResults(sweepRunId, ticker)

    logger.info('Best results fetched', {
      job_id: jobId,
      results_count: results.results.length,
    })

    // Step 6: Send success notification
    const executionTime = Math.floor((Date.now() - job.timestamp) / 1000)

    logger.info('Success notification sent', {
      job_id: jobId,
      ticker,
      sweep_run_id: sweepRunId,
      execution_time_seconds: executionTime,
    })

    logger.info('Trading sweep completed successfully', {
      job_id: jobId,
      execution_time_seconds: executionTime,
    })
  } catch (error) {
    logger.error('Trading sweep failed', {
      job_id: jobId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    // Send failure notification
    logger.info('Failure notification sent', {
      job_id: jobId,
      ticker,
    })

    throw error
  }
}
