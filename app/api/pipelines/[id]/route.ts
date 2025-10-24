import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/pipelines/[id] - Get job details and results
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    // Fetch job with results
    const job = await prisma.pipelineJob.findFirst({
      where: {
        id,
        tenantId, // Ensure tenant isolation
      },
      include: {
        results: {
          orderBy: { score: 'desc' },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Calculate duration
    const duration =
      job.startedAt && job.completedAt
        ? Math.floor((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)
        : job.startedAt
          ? Math.floor((Date.now() - job.startedAt.getTime()) / 1000)
          : null

    return NextResponse.json({
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
      duration_seconds: duration,
      results: job.results.map((result) => ({
        id: result.id,
        sweep_run_id: result.sweepRunId,
        ticker: result.ticker,
        strategy_type: result.strategyType,
        fast_period: result.fastPeriod,
        slow_period: result.slowPeriod,
        score: Number(result.score),
        sharpe_ratio: Number(result.sharpeRatio),
        sortino_ratio: Number(result.sortinoRatio),
        total_return_pct: Number(result.totalReturnPct),
        annualized_return: Number(result.annualizedReturn),
        max_drawdown_pct: Number(result.maxDrawdownPct),
        win_rate_pct: Number(result.winRatePct),
        profit_factor: Number(result.profitFactor),
        total_trades: result.totalTrades,
        trades_per_month: Number(result.tradesPerMonth),
        avg_trade_duration: result.avgTradeDuration,
        created_at: result.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get job details error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/pipelines/[id] - Cancel job (if queued/active)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    // Fetch job
    const job = await prisma.pipelineJob.findFirst({
      where: {
        id,
        tenantId, // Ensure tenant isolation
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if job can be cancelled
    if (job.status !== 'QUEUED' && job.status !== 'RUNNING') {
      return NextResponse.json(
        {
          error: 'Cannot cancel job',
          message: `Job is already ${job.status?.toLowerCase() || 'unknown'}`,
        },
        { status: 400 }
      )
    }

    // Update job status to FAILED (with cancellation message)
    const updatedJob = await prisma.pipelineJob.update({
      where: { id },
      data: {
        status: 'FAILED',
        errorMessage: 'Job cancelled by user',
        completedAt: new Date(),
      },
    })

    // TODO: Send cancellation signal to worker (via Redis/Bull queue)
    // This would require integration with the webhook-receiver service

    return NextResponse.json({
      message: 'Job cancelled successfully',
      id: updatedJob.id,
      status: updatedJob.status?.toLowerCase() || 'unknown',
      completed_at: updatedJob.completedAt,
    })
  } catch (error) {
    console.error('Cancel job error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
