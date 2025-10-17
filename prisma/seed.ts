// INTERNAL OPERATIONS: Zixly service business seed data
// This replaces the generic client data with Zixly's internal operations data

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Zixly internal operations database...')
  console.log("📋 This creates data for Zixly's service business operations")
  console.log('🔧 Includes: service clients, financials, sales pipeline, internal metrics')

  // Import and run the service seed data
  const { default: seedService } = await import('./seed-service')

  // Run the service seed function
  await seedService()

  console.log('🎉 Zixly internal operations database seeded successfully!')
  console.log("💡 This data represents Zixly's own business operations")
  console.log('📊 Use this to demonstrate "eating our own dogfood"')
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
