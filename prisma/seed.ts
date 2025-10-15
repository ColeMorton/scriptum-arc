import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Set tenant context for RLS (we'll use a service role approach)
  // For seeding, we'll disable RLS temporarily

  // Create a sample tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'ABC Construction Pty Ltd',
      industry: 'Construction',
    },
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'sarah@abcconstruction.com.au',
      role: 'ADMIN',
    },
  })

  const editorUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'john@abcconstruction.com.au',
      role: 'EDITOR',
    },
  })

  console.log('✅ Created users:', adminUser.email, editorUser.email)

  // Create sample clients
  const client1 = await prisma.clientKPI.create({
    data: {
      tenantId: tenant.id,
      clientId: 'HBR-2024-001',
      clientName: 'Harbor Bridge Renovation Project',
      industry: 'Infrastructure',
    },
  })

  const client2 = await prisma.clientKPI.create({
    data: {
      tenantId: tenant.id,
      clientId: 'BRD-2024-002',
      clientName: 'Bondi Residential Development',
      industry: 'Residential Construction',
    },
  })

  console.log('✅ Created clients:', client1.clientName, client2.clientName)

  // Create sample financial data
  await prisma.financial.create({
    data: {
      clientKPIId: client1.id,
      recordDate: new Date('2024-01-01'),
      revenue: 2500000.0,
      expenses: 1800000.0,
      netProfit: 700000.0,
      cashFlow: 650000.0,
      currency: 'AUD',
      sourceSystem: 'xero',
    },
  })

  await prisma.financial.create({
    data: {
      clientKPIId: client2.id,
      recordDate: new Date('2024-01-01'),
      revenue: 1200000.0,
      expenses: 950000.0,
      netProfit: 250000.0,
      cashFlow: 200000.0,
      currency: 'AUD',
      sourceSystem: 'xero',
    },
  })

  console.log('✅ Created financial records')

  // Create sample lead events
  await prisma.leadEvent.create({
    data: {
      clientKPIId: client1.id,
      eventDate: new Date('2024-01-15'),
      leadId: 'LEAD-001',
      stage: 'qualified',
      value: 2500000.0,
      status: 'active',
      sourceSystem: 'hubspot',
    },
  })

  await prisma.leadEvent.create({
    data: {
      clientKPIId: client2.id,
      eventDate: new Date('2024-03-01'),
      leadId: 'LEAD-002',
      stage: 'proposal',
      value: 1200000.0,
      status: 'active',
      sourceSystem: 'hubspot',
    },
  })

  console.log('✅ Created lead events')

  // Create sample custom metrics
  await prisma.customMetric.create({
    data: {
      clientKPIId: client1.id,
      metricName: 'construction_milestones_completed',
      metricValue: 15.0,
      unit: 'count',
      recordDate: new Date('2024-01-31'),
      sourceSystem: 'manual',
    },
  })

  await prisma.customMetric.create({
    data: {
      clientKPIId: client2.id,
      metricName: 'units_sold',
      metricValue: 8.0,
      unit: 'count',
      recordDate: new Date('2024-03-31'),
      sourceSystem: 'manual',
    },
  })

  console.log('✅ Created custom metrics')

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
