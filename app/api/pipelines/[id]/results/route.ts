import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/pipelines/[id]/results - Fetch TradingSweepResult
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

    // Parse query parameters for filtering and sorting
    const searchParams = request.nextUrl.searchParams
    const sortBy = searchParams.get('sort_by') || 'score' // score, sharpe_ratio, total_return_pct
    const order = searchParams.get('order') || 'desc' // asc, desc
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    // Verify job exists and belongs to tenant
    const job = await prisma.pipelineJob.findFirst({
      where: {
        id,
        tenantId, // Ensure tenant isolation
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if job type supports trading sweep results
    if (job.jobType !== 'trading-sweep') {
      return NextResponse.json(
        { error: 'This job type does not have trading sweep results' },
        { status: 400 }
      )
    }

    // Map sort field to database column
    const sortFieldMap: Record<string, string> = {
      score: 'score',
      sharpe_ratio: 'sharpeRatio',
      sortino_ratio: 'sortinoRatio',
      total_return_pct: 'totalReturnPct',
      annualized_return: 'annualizedReturn',
      max_drawdown_pct: 'maxDrawdownPct',
      win_rate_pct: 'winRatePct',
      profit_factor: 'profitFactor',
      total_trades: 'totalTrades',
    }

    const dbSortField = sortFieldMap[sortBy] || 'score'
    const dbOrder = order === 'asc' ? 'asc' : 'desc'

    // Fetch results
    const results = await prisma.tradingSweepResult.findMany({
      where: {
        jobId: id,
      },
      orderBy: {
        [dbSortField]: dbOrder,
      },
      take: limit,
    })

    // Calculate statistics
    const stats =
      results.length > 0
        ? {
            total_results: results.length,
            best_sharpe_ratio: Math.max(...results.map((r) => Number(r.sharpeRatio))),
            best_return: Math.max(...results.map((r) => Number(r.totalReturnPct))),
            lowest_drawdown: Math.min(...results.map((r) => Number(r.maxDrawdownPct))),
            avg_sharpe_ratio:
              results.reduce((sum, r) => sum + Number(r.sharpeRatio), 0) / results.length,
            avg_return:
              results.reduce((sum, r) => sum + Number(r.totalReturnPct), 0) / results.length,
          }
        : null

    return NextResponse.json({
      job_id: id,
      job_status: job.status?.toLowerCase() || 'unknown',
      results: results.map((result) => ({
        id: result.id,
        sweep_run_id: result.sweepRunId,
        ticker: result.ticker,
        strategy_type: result.strategyType,
        parameters: {
          fast_period: result.fastPeriod,
          slow_period: result.slowPeriod,
        },
        performance: {
          score: Number(result.score),
          sharpe_ratio: Number(result.sharpeRatio),
          sortino_ratio: Number(result.sortinoRatio),
          total_return_pct: Number(result.totalReturnPct),
          annualized_return: Number(result.annualizedReturn),
          max_drawdown_pct: Number(result.maxDrawdownPct),
          win_rate_pct: Number(result.winRatePct),
          profit_factor: Number(result.profitFactor),
        },
        trades: {
          total_trades: result.totalTrades,
          trades_per_month: Number(result.tradesPerMonth),
          avg_trade_duration: result.avgTradeDuration,
        },
        created_at: result.createdAt,
      })),
      statistics: stats,
      metadata: {
        sorted_by: sortBy,
        order,
        limit,
      },
    })
  } catch (error) {
    console.error('Get job results error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
