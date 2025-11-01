import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class SyncStatusService {
  constructor(private readonly database: DatabaseService) {}

  async getSyncStatus(tenantId: string) {
    // Fetch Zixly's internal data sync status and workflow metadata
    const [syncStatus, workflowStatus] = await Promise.all([
      this.database.client.dataSyncStatus.findMany({
        where: { tenantId },
        orderBy: { lastSyncAt: 'desc' },
      }),

      this.database.client.workflowMetadata.findMany({
        where: { tenantId },
        orderBy: { lastRunAt: 'desc' },
      }),
    ])

    // Calculate overall sync health
    const totalDataSources = syncStatus.length
    const successfulSyncs = syncStatus.filter((s) => s.status === 'success').length
    const failedSyncs = syncStatus.filter((s) => s.status === 'error').length
    const pendingSyncs = syncStatus.filter((s) => s.status === 'pending').length

    const syncHealth =
      totalDataSources > 0 ? Math.round((successfulSyncs / totalDataSources) * 100) : 100

    // Calculate workflow health
    const totalWorkflows = workflowStatus.length
    const activeWorkflows = workflowStatus.filter((w) => w.isActive).length
    const recentlyRunWorkflows = workflowStatus.filter(
      (w) => w.lastRunAt && w.lastRunAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length

    return {
      syncStatus: {
        overall: {
          syncHealth,
          totalDataSources,
          successfulSyncs,
          failedSyncs,
          pendingSyncs,
        },
        dataSources: syncStatus.map((s) => ({
          id: s.id,
          dataSource: s.dataSource,
          lastSyncAt: s.lastSyncAt,
          nextSyncAt: s.nextSyncAt,
          recordCount: s.recordCount,
          status: s.status,
          errorMessage: s.errorMessage,
          isHealthy:
            s.status === 'success' && s.lastSyncAt > new Date(Date.now() - 24 * 60 * 60 * 1000),
        })),
      },
      workflowStatus: {
        overall: {
          totalWorkflows,
          activeWorkflows,
          recentlyRunWorkflows,
          workflowHealth:
            totalWorkflows > 0 ? Math.round((recentlyRunWorkflows / totalWorkflows) * 100) : 100,
        },
        workflows: workflowStatus.map((w) => ({
          id: w.id,
          workflowId: w.workflowId,
          workflowName: w.workflowName,
          description: w.description,
          category: w.category,
          isActive: w.isActive,
          lastRunAt: w.lastRunAt,
          isHealthy:
            w.isActive &&
            w.lastRunAt &&
            w.lastRunAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        })),
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}
