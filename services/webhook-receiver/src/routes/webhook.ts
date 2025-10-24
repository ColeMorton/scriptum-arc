import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, AppError } from '../middleware/error-handler'
import {
  TradingSweepTriggerSchema,
  TradingSweepCallbackSchema,
  TradingSweepJobData,
  JobCreatedResponse,
} from '../types'
import tradingSweepQueue from '../services/queue'
import logger from '../services/logger'
import { jobsQueued } from '../services/metrics'

const router = Router()
const prisma = new PrismaClient()

const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'http://webhook-receiver:3000'
const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || 'zixly-internal'

/**
 * POST /webhook/trading-sweep
 * Trigger a trading strategy sweep job
 */
router.post(
  '/trading-sweep',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validate request body
    const validatedData = TradingSweepTriggerSchema.parse(req.body)

    logger.info('Trading sweep requested', {
      ticker: validatedData.ticker,
      strategy_type: validatedData.strategy_type,
    })

    // Create job in database (temporarily disabled due to database connectivity)
    // const pipelineJob = await prisma.pipelineJob.create({
    //   data: {
    //     tenantId: DEFAULT_TENANT_ID,
    //     jobType: 'trading-sweep',
    //     status: 'QUEUED',
    //     parameters: validatedData as unknown as any,
    //     createdAt: new Date(),
    //   },
    // });

    // Mock job for testing without database
    const pipelineJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: DEFAULT_TENANT_ID,
      createdAt: new Date(),
    }

    // Prepare job data
    const jobData: TradingSweepJobData = {
      jobId: pipelineJob.id,
      tenantId: pipelineJob.tenantId,
      ticker: validatedData.ticker,
      fast_range: validatedData.fast_range,
      slow_range: validatedData.slow_range,
      step: validatedData.step,
      min_trades: validatedData.min_trades,
      strategy_type: validatedData.strategy_type,
      config_path: validatedData.config_path,
      webhook_url: `${WEBHOOK_BASE_URL}/webhook/sweep-callback`,
      created_at: new Date(),
    }

    // Add job to queue
    const bullJob = await tradingSweepQueue.add(jobData, {
      jobId: pipelineJob.id,
    })

    // Record metrics
    jobsQueued.labels('trading-sweep', pipelineJob.tenantId, validatedData.ticker).inc()

    logger.info('Trading sweep job queued', {
      job_id: pipelineJob.id,
      bull_job_id: bullJob.id,
      ticker: validatedData.ticker,
    })

    // Return success response
    const response: JobCreatedResponse = {
      job_id: pipelineJob.id,
      status: 'QUEUED',
      message: 'Trading sweep job queued successfully',
      webhook_url: jobData.webhook_url,
      created_at: pipelineJob.createdAt.toISOString(),
    }

    res.status(202).json(response)
  })
)

/**
 * POST /webhook/sweep-callback
 * Receive callback from trading API when sweep completes
 */
router.post(
  '/sweep-callback',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validate callback payload
    const callbackData = TradingSweepCallbackSchema.parse(req.body)

    logger.info('Sweep callback received', {
      job_id: callbackData.job_id,
      status: callbackData.status,
      sweep_run_id: callbackData.sweep_run_id,
    })

    // Find the pipeline job
    const pipelineJob = await prisma.pipelineJob.findUnique({
      where: { id: callbackData.job_id },
    })

    if (!pipelineJob) {
      throw new AppError(404, `Job not found: ${callbackData.job_id}`)
    }

    // Update job status based on callback
    if (callbackData.status === 'completed' && callbackData.result_data) {
      await prisma.pipelineJob.update({
        where: { id: callbackData.job_id },
        data: {
          status: 'RUNNING',
          startedAt: new Date(),
          metrics: {
            sweep_run_id: callbackData.sweep_run_id,
            total_combinations: callbackData.result_data.total_combinations,
            execution_time_seconds: callbackData.result_data.execution_time_seconds,
          },
        },
      })

      logger.info('Job status updated to RUNNING', {
        job_id: callbackData.job_id,
        sweep_run_id: callbackData.sweep_run_id,
      })
    } else if (callbackData.status === 'failed') {
      await prisma.pipelineJob.update({
        where: { id: callbackData.job_id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorMessage: callbackData.error_message || 'Unknown error',
        },
      })

      logger.error('Job failed', {
        job_id: callbackData.job_id,
        error: callbackData.error_message,
      })
    }

    res.status(200).json({ message: 'Callback processed' })
  })
)

/**
 * GET /webhook/jobs/:id
 * Get job status
 */
router.get(
  '/jobs/:id',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    const job = await prisma.pipelineJob.findUnique({
      where: { id },
      include: {
        results: {
          orderBy: { score: 'desc' },
          take: 10,
        },
      },
    })

    if (!job) {
      throw new AppError(404, `Job not found: ${id}`)
    }

    res.status(200).json(job)
  })
)

export default router
