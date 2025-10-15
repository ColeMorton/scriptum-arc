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

    // Fetch tenant data (RLS will automatically filter)
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        clientKPIs: {
          select: {
            id: true,
            clientName: true,
            industry: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            users: true,
            clientKPIs: true,
          },
        },
      },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        industry: tenant.industry,
        createdAt: tenant.createdAt,
        stats: tenant._count,
        users: tenant.users,
        clients: tenant.clientKPIs,
      },
    })
  } catch (error) {
    console.error('Tenant API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
