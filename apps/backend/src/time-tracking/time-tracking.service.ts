import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { getTimeTrackingMetadata, getBillableHoursMetadata } from '@zixly/shared'

@Injectable()
export class TimeTrackingService {
  constructor(private readonly database: DatabaseService) {}

  async getTimeTracking(tenantId: string) {
    // Fetch billable hours data for Zixly's service delivery
    const billableHours = await this.database.client.customMetric.findMany({
      where: {
        clientKPI: { tenantId },
        metricName: 'billable_hours',
        recordDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        clientKPI: {
          select: {
            clientName: true,
            industry: true,
          },
        },
      },
      orderBy: { recordDate: 'desc' },
    })

    // Calculate time tracking metrics
    const totalBillableHours = billableHours.reduce((sum, bh) => sum + Number(bh.metricValue), 0)
    const totalRevenue = billableHours.reduce((sum, bh) => {
      const hours = Number(bh.metricValue)
      const metadata = getBillableHoursMetadata(bh.metadata)
      const rate = metadata.hourlyRate || 0
      return sum + hours * rate
    }, 0)

    // Group by consultant
    const hoursByConsultant = billableHours.reduce(
      (acc, bh) => {
        const metadata = getBillableHoursMetadata(bh.metadata)
        const consultant = metadata.consultant || 'Unknown'
        acc[consultant] = (acc[consultant] || 0) + Number(bh.metricValue)
        return acc
      },
      {} as Record<string, number>
    )

    // Group by client
    const hoursByClient = billableHours.reduce(
      (acc, bh) => {
        const clientName = bh.clientKPI.clientName
        acc[clientName] = (acc[clientName] || 0) + Number(bh.metricValue)
        return acc
      },
      {} as Record<string, number>
    )

    // Group by service tier
    const hoursByTier = billableHours.reduce(
      (acc, bh) => {
        const metadata = getBillableHoursMetadata(bh.metadata)
        const tier = metadata.serviceTier || 'Unknown'
        acc[tier] = (acc[tier] || 0) + Number(bh.metricValue)
        return acc
      },
      {} as Record<string, number>
    )

    // Calculate utilization rate (assuming 40 hours/week capacity)
    const weeksInPeriod = 4.3 // 30 days / 7 days
    const capacityHours = weeksInPeriod * 40 // 40 hours per week
    const utilizationRate = capacityHours > 0 ? (totalBillableHours / capacityHours) * 100 : 0

    return {
      timeTracking: {
        totalBillableHours,
        totalRevenue,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        averageHourlyRate: totalBillableHours > 0 ? totalRevenue / totalBillableHours : 0,
        hoursByConsultant,
        hoursByClient,
        hoursByTier,
        recentEntries: billableHours.slice(0, 20).map((bh) => {
          const metadata = getTimeTrackingMetadata(bh.metadata)
          return {
            id: bh.id,
            clientName: bh.clientKPI.clientName,
            industry: bh.clientKPI.industry,
            hours: Number(bh.metricValue),
            hourlyRate: metadata.hourlyRate || 0,
            totalValue: Number(bh.metricValue) * (metadata.hourlyRate || 0),
            consultant: metadata.consultant || 'Unknown',
            serviceTier: metadata.serviceTier || 'Unknown',
            projectType: metadata.projectType || 'Unknown',
            date: bh.recordDate,
          }
        }),
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}
