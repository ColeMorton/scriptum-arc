import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { LOCAL_SERVICES } from '@/lib/config/constants'

// Validation schemas
const triggerJobSchema = z.object({
  job_type: z.enum(['trading-sweep', 'document-processing', 'data-etl', 'ml-inference']),
  ticker: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
})

// GET /api/pipelines - List jobs with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tenant ID from user metadata
    const tenantId = user.user_metadata?.tenant_id

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant associated with user' }, { status: 400 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const jobType = searchParams.get('job_type')
    const limitParam = parseInt(searchParams.get('limit') || '50', 10)
    const limit = isNaN(limitParam) ? 50 : limitParam
    const offsetParam = parseInt(searchParams.get('offset') || '0', 10)
    const offset = isNaN(offsetParam) ? 0 : offsetParam

    // Build where clause
    const where: Prisma.PipelineJobWhereInput = { tenantId }
    if (status) {
      where.status = status.toUpperCase() as Prisma.EnumJobStatusFilter<'PipelineJob'>
    }
    if (jobType) {
      where.jobType = jobType
    }

    // Fetch jobs
    const [jobs, total] = await Promise.all([
      prisma.pipelineJob.findMany({
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
            take: 5, // Preview first 5 results
          },
        },
      }),
      prisma.pipelineJob.count({ where }),
    ])

    return NextResponse.json({
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
        results: job.results, // Changed from results_preview to results
      })),
      totalJobs: total, // Flat structure as expected by tests
      limit,
      offset,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Pipelines API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST /api/pipelines - Trigger new job
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tenant ID from user metadata
    const tenantId = user.user_metadata?.tenant_id

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant associated with user' }, { status: 400 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = triggerJobSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { job_type, ticker, config } = validation.data

    // Build parameters based on job type
    const parameters: Record<string, unknown> = { ...(config || {}) }
    if (ticker) {
      parameters.ticker = ticker
    }

    // Create job in database
    const job = await prisma.pipelineJob.create({
      data: {
        tenantId,
        jobType: job_type,
        status: 'QUEUED',
        parameters: parameters as Prisma.InputJsonValue,
      },
    })

    // TODO: Trigger webhook to webhook-receiver service
    // For now, we'll return the job and let the user know to trigger manually
    const webhookUrl = process.env.WEBHOOK_RECEIVER_URL || LOCAL_SERVICES.NEXT_APP

    // In production, trigger the webhook:
    // await fetch(`${webhookUrl}/webhook/trading-sweep`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ job_id: job.id, ...parameters }),
    // });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Trigger job error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
