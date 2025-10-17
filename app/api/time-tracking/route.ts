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

    // Fetch billable hours data for Zixly's service delivery
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

    // Calculate time tracking metrics
    const totalBillableHours = billableHours.reduce((sum, bh) => sum + Number(bh.metricValue), 0)
    const totalRevenue = billableHours.reduce((sum, bh) => {
      const hours = Number(bh.metricValue)
      const rate = bh.metadata?.hourlyRate || 0
      return sum + hours * rate
    }, 0)

    // Group by consultant
    const hoursByConsultant = billableHours.reduce(
      (acc, bh) => {
        const consultant = bh.metadata?.consultant || 'Unknown'
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
        const tier = bh.metadata?.serviceTier || 'Unknown'
        acc[tier] = (acc[tier] || 0) + Number(bh.metricValue)
        return acc
      },
      {} as Record<string, number>
    )

    // Calculate utilization rate (assuming 40 hours/week capacity)
    const weeksInPeriod = 4.3 // 30 days / 7 days
    const capacityHours = weeksInPeriod * 40 // 40 hours per week
    const utilizationRate = capacityHours > 0 ? (totalBillableHours / capacityHours) * 100 : 0

    return NextResponse.json({
      timeTracking: {
        totalBillableHours,
        totalRevenue,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        averageHourlyRate: totalBillableHours > 0 ? totalRevenue / totalBillableHours : 0,
        hoursByConsultant,
        hoursByClient,
        hoursByTier,
        recentEntries: billableHours.slice(0, 20).map((bh) => ({
          id: bh.id,
          clientName: bh.clientKPI.clientName,
          industry: bh.clientKPI.industry,
          hours: Number(bh.metricValue),
          hourlyRate: bh.metadata?.hourlyRate || 0,
          totalValue: Number(bh.metricValue) * (bh.metadata?.hourlyRate || 0),
          consultant: bh.metadata?.consultant || 'Unknown',
          serviceTier: bh.metadata?.serviceTier || 'Unknown',
          projectType: bh.metadata?.projectType || 'Unknown',
          date: bh.recordDate,
        })),
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Time tracking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
