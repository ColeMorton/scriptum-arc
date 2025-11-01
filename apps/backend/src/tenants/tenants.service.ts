import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class TenantsService {
  constructor(private readonly database: DatabaseService) {}

  async getTenant(tenantId: string) {
    const tenant = await this.database.client.tenant.findUnique({
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
      throw new NotFoundException('Tenant not found')
    }

    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        industry: tenant.industry,
        createdAt: tenant.createdAt,
        stats: {
          teamMembers: tenant._count.users,
          serviceClients: tenant._count.clientKPIs,
        },
        users: tenant.users,
        serviceClients: tenant.clientKPIs,
      },
    }
  }
}
