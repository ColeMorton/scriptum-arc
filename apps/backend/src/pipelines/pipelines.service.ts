import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from '../database/database.service'
import { CreatePipelineJobDto } from './dto/create-pipeline-job.dto'
import { QueryPipelinesDto } from './dto/query-pipelines.dto'
import { Prisma } from '@zixly/database'

@Injectable()
export class PipelinesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly configService: ConfigService
  ) {}

  async listJobs(tenantId: string, query: QueryPipelinesDto) {
    const { status, job_type, limit = 50, offset = 0 } = query

    // Build where clause
    const where: Prisma.PipelineJobWhereInput = { tenantId }
    if (status) {
      where.status = status.toUpperCase() as Prisma.EnumJobStatusFilter<'PipelineJob'>
    }
    if (job_type) {
      where.jobType = job_type
    }

    // Fetch jobs and total count
    const [jobs, total] = await Promise.all([
      this.database.client.pipelineJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          results: {
            select: {
              id: true,
              ticker: true,
              score: true,
              sharpeRatio: true,
            },
            take: 5,
          },
        },
      }),
      this.database.client.pipelineJob.count({ where }),
    ])

    return {
      jobs: jobs.map((job) => ({
        id: job.id,
        job_type: job.jobType,
        status: job.status?.toLowerCase() || 'unknown',
        parameters: job.parameters,
        result_summary: job.result,
        metrics: job.metrics,
        error_message: job.errorMessage,
        created_at: job.createdAt,
        started_at: job.startedAt,
        completed_at: job.completedAt,
        duration_seconds:
          job.startedAt && job.completedAt
            ? Math.floor((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)
            : null,
        results: job.results,
      })),
      totalJobs: total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async createJob(tenantId: string, dto: CreatePipelineJobDto) {
    const { job_type, ticker, config } = dto

    // Build parameters
    const parameters: Record<string, unknown> = { ...(config || {}) }
    if (ticker) {
      parameters.ticker = ticker
    }

    // Create job in database
    const job = await this.database.client.pipelineJob.create({
      data: {
        tenantId,
        jobType: job_type,
        status: 'QUEUED',
        parameters: parameters as Prisma.InputJsonValue,
      },
    })

    const webhookUrl =
      this.configService.get<string>('WEBHOOK_RECEIVER_URL') || 'http://localhost:3000'

    return {
      job: {
        id: job.id,
        job_type: job.jobType,
        status: job.status?.toLowerCase() || 'unknown',
        parameters: job.parameters,
        created_at: job.createdAt,
      },
      message: 'Job queued successfully',
      webhook_trigger_note: 'Manual webhook trigger required for local development',
      webhook_url: `${webhookUrl}/webhook/${job_type}`,
    }
  }

  async getJob(tenantId: string, id: string) {
    const job = await this.database.client.pipelineJob.findFirst({
      where: { id, tenantId },
      include: {
        results: {
          select: {
            id: true,
            ticker: true,
            score: true,
            sharpeRatio: true,
          },
        },
      },
    })

    if (!job) {
      throw new NotFoundException('Pipeline job not found')
    }

    return {
      job: {
        id: job.id,
        job_type: job.jobType,
        status: job.status?.toLowerCase() || 'unknown',
        parameters: job.parameters,
        result_summary: job.result,
        metrics: job.metrics,
        error_message: job.errorMessage,
        created_at: job.createdAt,
        started_at: job.startedAt,
        completed_at: job.completedAt,
        duration_seconds:
          job.startedAt && job.completedAt
            ? Math.floor((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)
            : null,
        results: job.results,
      },
    }
  }

  async getJobResults(tenantId: string, id: string) {
    const job = await this.database.client.pipelineJob.findFirst({
      where: { id, tenantId },
    })

    if (!job) {
      throw new NotFoundException('Pipeline job not found')
    }

    const results = await this.database.client.tradingSweepResult.findMany({
      where: { jobId: id },
      orderBy: { score: 'desc' },
    })

    return {
      job_id: job.id,
      status: job.status?.toLowerCase() || 'unknown',
      results,
      total: results.length,
    }
  }
}
