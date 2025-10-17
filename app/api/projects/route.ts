import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getProjectMetadata, getBillableHoursMetadata } from '@/lib/types'

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

    // Fetch Zixly service delivery projects (from CustomMetric table)
    const projects = await prisma.customMetric.findMany({
      where: {
        clientKPI: { tenantId },
        metricName: 'project_velocity', // Projects completed
        recordDate: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
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
    const billableHours = await prisma.customMetric.findMany({
      where: {
        clientKPI: { tenantId },
        metricName: 'billable_hours',
        recordDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
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

    // Calculate project metrics
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

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
