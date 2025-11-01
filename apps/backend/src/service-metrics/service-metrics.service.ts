import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { getProjectMetadata, getBillableHoursMetadata, getSurveyMetadata } from '@zixly/shared'

@Injectable()
export class ServiceMetricsService {
  constructor(private readonly database: DatabaseService) {}

  async getServiceMetrics(tenantId: string) {
    // Fetch Zixly service business KPIs in parallel
    const [clientSatisfaction, projectVelocity, serviceDelivery, billableHours] = await Promise.all(
      [
        // Client satisfaction scores
        this.database.client.customMetric.findMany({
          where: {
            clientKPI: { tenantId },
            metricName: 'client_satisfaction',
            recordDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
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
        }),

        // Project velocity metrics
        this.database.client.customMetric.findMany({
          where: {
            clientKPI: { tenantId },
            metricName: 'project_velocity',
            recordDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
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
        }),

        // Service delivery efficiency
        this.database.client.customMetric.findMany({
          where: {
            clientKPI: { tenantId },
            metricName: 'service_delivery_days',
            recordDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
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
        }),

        // Billable hours
        this.database.client.customMetric.findMany({
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
        }),
      ]
    )

    // Calculate service metrics
    const averageSatisfaction =
      clientSatisfaction.length > 0
        ? clientSatisfaction.reduce((sum, cs) => sum + Number(cs.metricValue), 0) /
          clientSatisfaction.length
        : 0

    const totalProjects = projectVelocity.length
    const averageProjectDuration =
      serviceDelivery.length > 0
        ? serviceDelivery.reduce((sum, sd) => sum + Number(sd.metricValue), 0) /
          serviceDelivery.length
        : 0

    const totalBillableHours = billableHours.reduce((sum, bh) => sum + Number(bh.metricValue), 0)
    const totalRevenue = billableHours.reduce((sum, bh) => {
      const hours = Number(bh.metricValue)
      const metadata = getBillableHoursMetadata(bh.metadata)
      const rate = metadata.hourlyRate || 0
      return sum + hours * rate
    }, 0)

    // Calculate efficiency metrics
    const onTimeDelivery = serviceDelivery.filter((sd) => {
      const actual = Number(sd.metricValue)
      const metadata = getProjectMetadata(sd.metadata)
      const estimated = metadata.estimatedDays || 0
      return actual <= estimated
    }).length

    const deliveryEfficiency =
      serviceDelivery.length > 0 ? (onTimeDelivery / serviceDelivery.length) * 100 : 0

    // Calculate client retention (based on satisfaction scores)
    const satisfiedClients = clientSatisfaction.filter((cs) => Number(cs.metricValue) >= 8).length
    const clientRetentionRate =
      clientSatisfaction.length > 0 ? (satisfiedClients / clientSatisfaction.length) * 100 : 0

    // Revenue per consultant hour
    const revenuePerHour = totalBillableHours > 0 ? totalRevenue / totalBillableHours : 0

    return {
      serviceMetrics: {
        // Client satisfaction
        averageSatisfaction: Math.round(averageSatisfaction * 100) / 100,
        satisfiedClients,
        totalClientFeedback: clientSatisfaction.length,
        clientRetentionRate: Math.round(clientRetentionRate * 100) / 100,

        // Project delivery
        totalProjects,
        averageProjectDuration: Math.round(averageProjectDuration * 100) / 100,
        onTimeDelivery,
        deliveryEfficiency: Math.round(deliveryEfficiency * 100) / 100,

        // Financial performance
        totalBillableHours,
        totalRevenue,
        revenuePerHour: Math.round(revenuePerHour * 100) / 100,

        // Service quality indicators
        qualityMetrics: {
          satisfactionScore: Math.round(averageSatisfaction * 100) / 100,
          deliveryEfficiency: Math.round(deliveryEfficiency * 100) / 100,
          clientRetention: Math.round(clientRetentionRate * 100) / 100,
          revenueEfficiency: Math.round(revenuePerHour * 100) / 100,
        },
      },
      detailedMetrics: {
        clientSatisfaction: clientSatisfaction.map((cs) => {
          const metadata = getSurveyMetadata(cs.metadata)
          return {
            id: cs.id,
            clientName: cs.clientKPI.clientName,
            industry: cs.clientKPI.industry,
            score: Number(cs.metricValue),
            feedback: metadata.feedback || '',
            surveyType: metadata.surveyType || 'NPS',
            date: cs.recordDate,
          }
        }),
        projectVelocity: projectVelocity.map((pv) => {
          const metadata = getProjectMetadata(pv.metadata)
          return {
            id: pv.id,
            clientName: pv.clientKPI.clientName,
            industry: pv.clientKPI.industry,
            projectsCompleted: Number(pv.metricValue),
            serviceTier: metadata.serviceTier || 'Unknown',
            completionTime: metadata.completionTime || 0,
            consultant: metadata.consultant || 'Unknown',
            date: pv.recordDate,
          }
        }),
        serviceDelivery: serviceDelivery.map((sd) => {
          const metadata = getProjectMetadata(sd.metadata)
          return {
            id: sd.id,
            clientName: sd.clientKPI.clientName,
            industry: sd.clientKPI.industry,
            actualDays: Number(sd.metricValue),
            estimatedDays: metadata.estimatedDays || 0,
            efficiency: metadata.efficiency || 0,
            serviceTier: metadata.serviceTier || 'Unknown',
            date: sd.recordDate,
          }
        }),
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}
