import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

interface ProjectMetadata {
  serviceTier?: string
  completionTime?: number
  consultant?: string
}

interface BillableHoursMetadata {
  hourlyRate?: number
  consultant?: string
}

function getProjectMetadata(metadata: unknown): ProjectMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as ProjectMetadata
  }
  return {}
}

function getBillableHoursMetadata(metadata: unknown): BillableHoursMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as BillableHoursMetadata
  }
  return {}
}

@Injectable()
export class ProjectsService {
  constructor(private readonly database: DatabaseService) {}

  async getProjectMetrics(tenantId: string) {
    // Fetch service delivery projects
    const projects = await this.database.client.customMetric.findMany({
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
    })

    // Fetch billable hours data
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

    // Calculate metrics
    const totalProjects = projects.length
    const totalBillableHours = billableHours.reduce((sum, bh) => sum + Number(bh.metricValue), 0)
    const averageProjectDuration =
      projects.length > 0
        ? projects.reduce((sum, p) => {
            const metadata = getProjectMetadata(p.metadata)
            return sum + Number(metadata.completionTime || 0)
          }, 0) / projects.length
        : 0

    // Group by service tier
    const projectsByTier = projects.reduce(
      (acc, project) => {
        const metadata = getProjectMetadata(project.metadata)
        const tier = metadata.serviceTier || 'Unknown'
        acc[tier] = (acc[tier] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      projects: {
        total: totalProjects,
        totalBillableHours,
        averageProjectDuration,
        projectsByTier,
        recentProjects: projects.slice(0, 10).map((p) => {
          const metadata = getProjectMetadata(p.metadata)
          return {
            id: p.id,
            clientName: p.clientKPI.clientName,
            industry: p.clientKPI.industry,
            serviceTier: metadata.serviceTier || 'Unknown',
            completionTime: metadata.completionTime || 0,
            consultant: metadata.consultant || 'Unknown',
            completedAt: p.recordDate,
            billableHours: billableHours
              .filter((bh) => bh.clientKPIId === p.clientKPIId)
              .reduce((sum, bh) => sum + Number(bh.metricValue), 0),
          }
        }),
      },
      billableHours: {
        total: totalBillableHours,
        byClient: billableHours.map((bh) => {
          const metadata = getBillableHoursMetadata(bh.metadata)
          return {
            clientName: bh.clientKPI.clientName,
            hours: Number(bh.metricValue),
            hourlyRate: metadata.hourlyRate || 0,
            totalValue: Number(bh.metricValue) * (metadata.hourlyRate || 0),
            consultant: metadata.consultant || 'Unknown',
            date: bh.recordDate,
          }
        }),
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}
