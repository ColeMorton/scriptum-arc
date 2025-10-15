import { PrismaClient } from '@prisma/client'

// Test database client - use mock for now since we don't have a test database
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DIRECT_URL || 'postgresql://mock:mock@mock:5432/mock'
    }
  }
})

// Clean up test data
export async function cleanupTestData() {
  // Delete in reverse order to respect foreign key constraints
  await testPrisma.customMetric.deleteMany({})
  await testPrisma.leadEvent.deleteMany({})
  await testPrisma.financial.deleteMany({})
  await testPrisma.integration.deleteMany({})
  await testPrisma.clientKPI.deleteMany({})
  await testPrisma.user.deleteMany({})
  await testPrisma.tenant.deleteMany({})
}

// Create test tenant
export async function createTestTenant() {
  return await testPrisma.tenant.create({
    data: {
      name: 'Test Tenant',
      industry: 'Technology',
    },
  })
}

// Create test user
export async function createTestUser(tenantId: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER' = 'ADMIN') {
  return await testPrisma.user.create({
    data: {
      tenantId,
      email: 'test@example.com',
      role,
    },
  })
}

// Create test client
export async function createTestClient(tenantId: string) {
  return await testPrisma.clientKPI.create({
    data: {
      tenantId,
      clientId: 'TEST-CLIENT-001',
      clientName: 'Test Client',
      industry: 'Technology',
    },
  })
}

// Set tenant context for RLS testing
export async function setTenantContext(tenantId: string) {
  await testPrisma.$executeRaw`SET app.current_tenant_id = ${tenantId}`
}
