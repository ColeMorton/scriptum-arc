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

    // Fetch Zixly's internal data sync status (written by pipeline workflows)
    const syncStatus = await prisma.dataSyncStatus.findMany({
      where: { tenantId },
      orderBy: { lastSyncAt: 'desc' },
    })

    // Fetch Zixly's internal workflow metadata (written by pipeline workflows)
    const workflowStatus = await prisma.workflowMetadata.findMany({
      where: { tenantId },
      orderBy: { lastRunAt: 'desc' },
    })

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

    return NextResponse.json({
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
            s.status === 'success' && s.lastSyncAt > new Date(Date.now() - 24 * 60 * 60 * 1000), // Synced within 24 hours
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
            w.lastRunAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Run within 7 days
        })),
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync status API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
