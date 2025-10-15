import { prisma } from '@/lib/prisma'

/**
 * Set tenant context for database queries
 * This function should be called before any Prisma queries that need tenant isolation
 */
export async function setTenantContext(tenantId: string) {
  await prisma.$executeRaw`SET app.tenant_id = ${tenantId}`
}

/**
 * Create a scoped Prisma client for a specific tenant
 * This ensures all queries are automatically filtered by tenant
 */
export function createTenantScopedClient(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Add tenant filter to all queries except on tenants table
          if (model !== 'Tenant') {
            if (operation === 'findMany' || operation === 'findFirst' || operation === 'findUnique') {
              if (args.where) {
                args.where = {
                  ...args.where,
                  tenantId: tenantId,
                }
              } else {
                args.where = { tenantId: tenantId }
              }
            }
          }
          
          return query(args)
        },
      },
    },
  })
}

/**
 * Helper function to ensure tenant isolation in raw queries
 */
export async function executeTenantScopedQuery(tenantId: string, query: string, params: any[] = []) {
  await setTenantContext(tenantId)
  return prisma.$queryRawUnsafe(query, ...params)
}
