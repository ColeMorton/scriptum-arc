import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class DashboardsService {
  constructor(private readonly database: DatabaseService) {}

  async getDashboardData(tenantId: string) {
    // Fetch aggregated data in parallel
    const [financials, leadEvents, customMetrics] = await Promise.all([
      this.database.client.financial.groupBy({
        by: ['recordDate'],
        where: {
          clientKPI: { tenantId },
          recordDate: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          revenue: true,
          expenses: true,
          netProfit: true,
          cashFlow: true,
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

      this.database.client.leadEvent.groupBy({
        by: ['stage', 'status'],
        where: {
          clientKPI: { tenantId },
          eventDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: { value: true },
        _count: { id: true },
      }),

      this.database.client.customMetric.groupBy({
        by: ['metricName'],
        where: {
          clientKPI: { tenantId },
          recordDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _avg: { metricValue: true },
        _max: { metricValue: true },
        _min: { metricValue: true },
      }),
    ])

    // Calculate business intelligence metrics
    const totalRevenue = financials.reduce((sum, f) => sum + Number(f._sum.revenue || 0), 0)
    const totalExpenses = financials.reduce((sum, f) => sum + Number(f._sum.expenses || 0), 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    const activeLeads = leadEvents.filter((le) => le.status === 'active').length
    const totalPipelineValue = leadEvents.reduce((sum, le) => sum + Number(le._sum.value || 0), 0)
    const closedWonValue = leadEvents
      .filter((le) => le.stage === 'closed-won' && le.status === 'active')
      .reduce((sum, le) => sum + Number(le._sum.value || 0), 0)

    // Calculate growth metrics
    const currentMonth = financials.slice(0, 15)
    const previousMonth = financials.slice(15, 30)

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

    return {
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
    }
  }
}
