import { PrismaClient } from '@prisma/client'

// Use service role connection for seeding (bypasses RLS)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL // Use direct URL for seeding
    }
  }
})

async function main() {
  console.log('🌱 Seeding database with service role...')

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
  const financial1 = await prisma.financial.create({
    data: {
      clientKPIId: client1.id,
      recordDate: new Date('2024-01-01'),
      revenue: 2500000.00,
      expenses: 1800000.00,
      netProfit: 700000.00,
      cashFlow: 650000.00,
      currency: 'AUD',
      sourceSystem: 'xero',
    },
  })

  const financial2 = await prisma.financial.create({
    data: {
      clientKPIId: client2.id,
      recordDate: new Date('2024-01-01'),
      revenue: 1200000.00,
      expenses: 950000.00,
      netProfit: 250000.00,
      cashFlow: 200000.00,
      currency: 'AUD',
      sourceSystem: 'xero',
    },
  })

  console.log('✅ Created financial records')

  // Create sample lead events
  const leadEvent1 = await prisma.leadEvent.create({
    data: {
      clientKPIId: client1.id,
      eventDate: new Date('2024-01-15'),
      leadId: 'LEAD-001',
      stage: 'qualified',
      value: 2500000.00,
      status: 'active',
      sourceSystem: 'hubspot',
    },
  })

  const leadEvent2 = await prisma.leadEvent.create({
    data: {
      clientKPIId: client2.id,
      eventDate: new Date('2024-03-01'),
      leadId: 'LEAD-002',
      stage: 'proposal',
      value: 1200000.00,
      status: 'active',
      sourceSystem: 'hubspot',
    },
  })

  console.log('✅ Created lead events')

  // Create sample custom metrics
  const customMetric1 = await prisma.customMetric.create({
    data: {
      clientKPIId: client1.id,
      metricName: 'construction_milestones_completed',
      metricValue: 15.00,
      unit: 'count',
      recordDate: new Date('2024-01-31'),
      sourceSystem: 'manual',
    },
  })

  const customMetric2 = await prisma.customMetric.create({
    data: {
      clientKPIId: client2.id,
      metricName: 'units_sold',
      metricValue: 8.00,
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
