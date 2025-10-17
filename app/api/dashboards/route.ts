import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Fetch aggregated Zixly service business data (written by n8n workflows)
    const [financials, leadEvents, customMetrics] = await Promise.all([
      // Zixly service revenue/expenses aggregated by n8n workflows
      prisma.financial.groupBy({
        by: ['recordDate'],
        where: {
          clientKPI: { tenantId },
          recordDate: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
          },
        },
        _sum: {
          revenue: true, // Zixly revenue from service clients
          expenses: true, // Zixly costs (consultant time, tools, infrastructure)
          netProfit: true, // Zixly profit from service delivery
          cashFlow: true, // Cash flow impact
        },
        _avg: {
          revenue: true,
          expenses: true,
          netProfit: true,
          cashFlow: true,
        },
        orderBy: { recordDate: 'desc' },
        take: 30,
      }),

      // Zixly sales pipeline data aggregated by n8n workflows
      prisma.leadEvent.groupBy({
        by: ['stage', 'status'],
        where: {
          clientKPI: { tenantId },
          eventDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        _sum: { value: true }, // Potential service contract values
        _count: { id: true },
      }),

      // Zixly internal KPIs aggregated by n8n workflows
      prisma.customMetric.groupBy({
        by: ['metricName'],
        where: {
          clientKPI: { tenantId },
          recordDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        _avg: { metricValue: true }, // Average billable hours, project velocity, etc.
        _max: { metricValue: true },
        _min: { metricValue: true },
      }),
    ])

    // Calculate Zixly service business intelligence metrics
    const totalRevenue = financials.reduce((sum, f) => sum + Number(f._sum.revenue || 0), 0) // Zixly service revenue
    const totalExpenses = financials.reduce((sum, f) => sum + Number(f._sum.expenses || 0), 0) // Zixly operational costs
    const netProfit = totalRevenue - totalExpenses // Zixly service profit
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0 // Service delivery margin

    // Calculate Zixly sales pipeline metrics
    const activeLeads = leadEvents.filter((le) => le.status === 'active').length // Active prospects
    const totalPipelineValue = leadEvents.reduce((sum, le) => sum + Number(le._sum.value || 0), 0) // Total potential revenue
    const closedWonValue = leadEvents
      .filter((le) => le.stage === 'closed-won' && le.status === 'active')
      .reduce((sum, le) => sum + Number(le._sum.value || 0), 0) // Won service contracts

    // Calculate growth metrics (month over month)
    const currentMonth = financials.slice(0, 15) // Last 15 days
    const previousMonth = financials.slice(15, 30) // Previous 15 days

    const currentMonthRevenue = currentMonth.reduce(
      (sum, f) => sum + Number(f._sum.revenue || 0),
      0
    )
    const previousMonthRevenue = previousMonth.reduce(
      (sum, f) => sum + Number(f._sum.revenue || 0),
      0
    )
    const revenueGrowth =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0

    return NextResponse.json({
      dashboard: {
        financials: {
          totalRevenue,
          totalExpenses,
          netProfit,
          profitMargin: Math.round(profitMargin * 100) / 100,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          dailyData: financials.map((f) => ({
            date: f.recordDate,
            revenue: Number(f._sum.revenue || 0),
            expenses: Number(f._sum.expenses || 0),
            netProfit: Number(f._sum.netProfit || 0),
            cashFlow: Number(f._sum.cashFlow || 0),
          })),
        },
        pipeline: {
          activeLeads,
          totalPipelineValue,
          closedWonValue,
          stageBreakdown: leadEvents.map((le) => ({
            stage: le.stage,
            status: le.status,
            count: le._count.id,
            value: Number(le._sum.value || 0),
          })),
        },
        metrics: customMetrics.map((cm) => ({
          name: cm.metricName,
          average: Number(cm._avg.metricValue || 0),
          max: Number(cm._max.metricValue || 0),
          min: Number(cm._min.metricValue || 0),
        })),
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
