import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Zixly internal operations data...')

  // Create Zixly organization (single tenant)
  const zixlyTenant = await prisma.tenant.upsert({
    where: { id: 'zixly-org-001' },
    update: {},
    create: {
      id: 'zixly-org-001',
      name: 'Zixly',
      industry: 'n8n Automation Services',
    },
  })

  console.log('✅ Created Zixly organization:', zixlyTenant.name)

  // Create Zixly team members
  const teamMembers = [
    {
      id: 'user-001',
      email: 'cole@zixly.com.au',
      role: 'ADMIN' as const,
    },
    {
      id: 'user-002',
      email: 'support@zixly.com.au',
      role: 'EDITOR' as const,
    },
  ]

  for (const member of teamMembers) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        id: member.id,
        tenantId: zixlyTenant.id,
        email: member.email,
        role: member.role,
      },
    })
  }

  console.log('✅ Created Zixly team members')

  // Create service clients (businesses using Zixly services)
  const serviceClients = [
    {
      id: 'client-001',
      clientId: 'brisbane-construction',
      clientName: 'Brisbane Construction Co',
      industry: 'Construction',
    },
    {
      id: 'client-002',
      clientId: 'seq-accounting',
      clientName: 'SEQ Accounting Services',
      industry: 'Professional Services',
    },
    {
      id: 'client-003',
      clientId: 'gold-coast-retail',
      clientName: 'Gold Coast Retail Group',
      industry: 'Retail',
    },
    {
      id: 'client-004',
      clientId: 'sunshine-coast-consulting',
      clientName: 'Sunshine Coast Consulting',
      industry: 'Professional Services',
    },
  ]

  for (const client of serviceClients) {
    await prisma.clientKPI.upsert({
      where: {
        tenantId_clientId: {
          tenantId: zixlyTenant.id,
          clientId: client.clientId,
        },
      },
      update: {},
      create: {
        id: client.id,
        tenantId: zixlyTenant.id,
        clientId: client.clientId,
        clientName: client.clientName,
        industry: client.industry,
      },
    })
  }

  console.log('✅ Created service clients')

  // Create financial data for Zixly's service revenue
  const financialData = [
    // Brisbane Construction Co - Starter Package
    {
      clientKPIId: 'client-001',
      recordDate: new Date('2025-01-15'),
      revenue: 4500.0,
      expenses: 1200.0, // Consultant time, tools, infrastructure
      netProfit: 3300.0,
      cashFlow: 4500.0,
      sourceSystem: 'invoice_ninja',
      metadata: {
        serviceTier: 'Starter',
        projectType: 'n8n Setup',
        consultant: 'cole@zixly.com.au',
        duration: '2 weeks',
      },
    },
    {
      clientKPIId: 'client-001',
      recordDate: new Date('2025-01-22'),
      revenue: 0.0,
      expenses: 300.0, // Ongoing support
      netProfit: -300.0,
      cashFlow: 0.0,
      sourceSystem: 'xero',
      metadata: {
        serviceTier: 'Starter',
        projectType: 'Support',
        consultant: 'cole@zixly.com.au',
        duration: '1 week',
      },
    },
    // SEQ Accounting Services - Professional Package
    {
      clientKPIId: 'client-002',
      recordDate: new Date('2025-01-10'),
      revenue: 8500.0,
      expenses: 2500.0,
      netProfit: 6000.0,
      cashFlow: 8500.0,
      sourceSystem: 'invoice_ninja',
      metadata: {
        serviceTier: 'Professional',
        projectType: 'n8n + Metabase + Nextcloud',
        consultant: 'cole@zixly.com.au',
        duration: '4 weeks',
      },
    },
    {
      clientKPIId: 'client-002',
      recordDate: new Date('2025-01-17'),
      revenue: 500.0, // Monthly retainer
      expenses: 200.0,
      netProfit: 300.0,
      cashFlow: 500.0,
      sourceSystem: 'xero',
      metadata: {
        serviceTier: 'Professional',
        projectType: 'Monthly Management',
        consultant: 'support@zixly.com.au',
        duration: '1 month',
      },
    },
    // Gold Coast Retail Group - Enterprise Package
    {
      clientKPIId: 'client-003',
      recordDate: new Date('2025-01-05'),
      revenue: 18000.0,
      expenses: 5000.0,
      netProfit: 13000.0,
      cashFlow: 18000.0,
      sourceSystem: 'invoice_ninja',
      metadata: {
        serviceTier: 'Enterprise',
        projectType: 'Full Stack Implementation',
        consultant: 'cole@zixly.com.au',
        duration: '8 weeks',
      },
    },
    {
      clientKPIId: 'client-003',
      recordDate: new Date('2025-01-12'),
      revenue: 2000.0, // Monthly retainer
      expenses: 800.0,
      netProfit: 1200.0,
      cashFlow: 2000.0,
      sourceSystem: 'xero',
      metadata: {
        serviceTier: 'Enterprise',
        projectType: 'Monthly Management',
        consultant: 'support@zixly.com.au',
        duration: '1 month',
      },
    },
  ]

  for (const financial of financialData) {
    await prisma.financial.create({
      data: financial,
    })
  }

  console.log('✅ Created financial data')

  // Create lead events for Zixly's sales pipeline
  const leadEvents = [
    {
      clientKPIId: 'client-004',
      eventDate: new Date('2025-01-20'),
      leadId: 'lead-sunshine-001',
      stage: 'prospect',
      value: 12000.0,
      status: 'active',
      sourceSystem: 'mautic',
      metadata: {
        leadSource: 'Website Contact Form',
        contactName: 'Sarah Johnson',
        company: 'Sunshine Coast Consulting',
        serviceInterest: 'Professional Package',
        estimatedCloseDate: '2025-02-15',
      },
    },
    {
      clientKPIId: 'client-004',
      eventDate: new Date('2025-01-25'),
      leadId: 'lead-sunshine-001',
      stage: 'qualified',
      value: 12000.0,
      status: 'active',
      sourceSystem: 'mautic',
      metadata: {
        leadSource: 'Website Contact Form',
        contactName: 'Sarah Johnson',
        company: 'Sunshine Coast Consulting',
        serviceInterest: 'Professional Package',
        qualificationNotes: 'Budget approved, decision maker identified',
      },
    },
  ]

  for (const lead of leadEvents) {
    await prisma.leadEvent.create({
      data: lead,
    })
  }

  console.log('✅ Created lead events')

  // Create custom metrics for Zixly's internal KPIs
  const customMetrics = [
    // Project velocity metrics
    {
      clientKPIId: 'client-001',
      metricName: 'project_velocity',
      metricValue: 1.0, // 1 project completed
      unit: 'projects',
      recordDate: new Date('2025-01-15'),
      sourceSystem: 'plane',
      metadata: {
        projectType: 'Starter Package',
        completionTime: '2 weeks',
        consultant: 'cole@zixly.com.au',
      },
    },
    {
      clientKPIId: 'client-002',
      metricName: 'project_velocity',
      metricValue: 1.0,
      unit: 'projects',
      recordDate: new Date('2025-01-10'),
      sourceSystem: 'plane',
      metadata: {
        projectType: 'Professional Package',
        completionTime: '4 weeks',
        consultant: 'cole@zixly.com.au',
      },
    },
    // Billable hours tracking
    {
      clientKPIId: 'client-001',
      metricName: 'billable_hours',
      metricValue: 24.0,
      unit: 'hours',
      recordDate: new Date('2025-01-15'),
      sourceSystem: 'time_tracking',
      metadata: {
        consultant: 'cole@zixly.com.au',
        hourlyRate: 200.0,
        projectType: 'n8n Setup',
      },
    },
    {
      clientKPIId: 'client-002',
      metricName: 'billable_hours',
      metricValue: 42.5,
      unit: 'hours',
      recordDate: new Date('2025-01-10'),
      sourceSystem: 'time_tracking',
      metadata: {
        consultant: 'cole@zixly.com.au',
        hourlyRate: 200.0,
        projectType: 'Professional Package',
      },
    },
    // Client satisfaction scores
    {
      clientKPIId: 'client-001',
      metricName: 'client_satisfaction',
      metricValue: 9.0,
      unit: 'score',
      recordDate: new Date('2025-01-20'),
      sourceSystem: 'chatwoot',
      metadata: {
        surveyType: 'NPS',
        responseDate: '2025-01-20',
        feedback: 'Excellent service, very professional',
      },
    },
    {
      clientKPIId: 'client-002',
      metricName: 'client_satisfaction',
      metricValue: 10.0,
      unit: 'score',
      recordDate: new Date('2025-01-18'),
      sourceSystem: 'chatwoot',
      metadata: {
        surveyType: 'NPS',
        responseDate: '2025-01-18',
        feedback: 'Outstanding results, exceeded expectations',
      },
    },
    // Service delivery efficiency
    {
      clientKPIId: 'client-001',
      metricName: 'service_delivery_days',
      metricValue: 14.0,
      unit: 'days',
      recordDate: new Date('2025-01-15'),
      sourceSystem: 'plane',
      metadata: {
        projectType: 'Starter Package',
        estimatedDays: 14,
        actualDays: 14,
        efficiency: 100.0,
      },
    },
    {
      clientKPIId: 'client-002',
      metricName: 'service_delivery_days',
      metricValue: 28.0,
      unit: 'days',
      recordDate: new Date('2025-01-10'),
      sourceSystem: 'plane',
      metadata: {
        projectType: 'Professional Package',
        estimatedDays: 30,
        actualDays: 28,
        efficiency: 107.1,
      },
    },
  ]

  for (const metric of customMetrics) {
    await prisma.customMetric.create({
      data: metric,
    })
  }

  console.log('✅ Created custom metrics')

  // Create integrations for Zixly's own systems
  const integrations = [
    {
      tenantId: zixlyTenant.id,
      provider: 'xero',
      status: 'ACTIVE' as const,
      accessToken: 'encrypted_xero_token',
      refreshToken: 'encrypted_xero_refresh',
      expiresAt: new Date('2025-12-31'),
      metadata: {
        companyId: 'xero_company_123',
        lastSync: '2025-01-25T10:00:00Z',
      },
      lastSyncAt: new Date('2025-01-25T10:00:00Z'),
    },
    {
      tenantId: zixlyTenant.id,
      provider: 'plane',
      status: 'ACTIVE' as const,
      accessToken: 'encrypted_plane_token',
      metadata: {
        workspaceId: 'plane_workspace_456',
        lastSync: '2025-01-25T09:30:00Z',
      },
      lastSyncAt: new Date('2025-01-25T09:30:00Z'),
    },
    {
      tenantId: zixlyTenant.id,
      provider: 'nextcloud',
      status: 'ACTIVE' as const,
      accessToken: 'encrypted_nextcloud_token',
      metadata: {
        serverUrl: 'https://files.zixly.internal',
        lastSync: '2025-01-25T09:00:00Z',
      },
      lastSyncAt: new Date('2025-01-25T09:00:00Z'),
    },
  ]

  for (const integration of integrations) {
    await prisma.integration.create({
      data: integration,
    })
  }

  console.log('✅ Created integrations')

  // Create workflow metadata for Zixly's internal n8n workflows
  const workflows = [
    {
      tenantId: zixlyTenant.id,
      workflowId: 'n8n_workflow_001',
      workflowName: 'Client Onboarding Automation',
      description: 'Automates new client setup, project folder creation, and welcome email',
      category: 'client_onboarding',
      isActive: true,
      lastRunAt: new Date('2025-01-25T08:00:00Z'),
      metadata: {
        trigger: 'New client signup form',
        actions: ['Create client record', 'Generate project folder', 'Send welcome email'],
        frequency: 'On-demand',
      },
    },
    {
      tenantId: zixlyTenant.id,
      workflowId: 'n8n_workflow_002',
      workflowName: 'Time Tracking Sync',
      description: 'Syncs billable hours from time tracking system to financial records',
      category: 'time_tracking',
      isActive: true,
      lastRunAt: new Date('2025-01-25T17:00:00Z'),
      metadata: {
        trigger: 'Daily at 5 PM',
        actions: ['Aggregate billable hours', 'Update project profitability'],
        frequency: 'Daily',
      },
    },
    {
      tenantId: zixlyTenant.id,
      workflowId: 'n8n_workflow_003',
      workflowName: 'Financial Reporting',
      description: 'Generates weekly revenue reports and syncs to Xero',
      category: 'financial',
      isActive: true,
      lastRunAt: new Date('2025-01-20T09:00:00Z'),
      metadata: {
        trigger: 'Weekly Monday 9 AM',
        actions: ['Generate revenue report', 'Sync to Xero'],
        frequency: 'Weekly',
      },
    },
  ]

  for (const workflow of workflows) {
    await prisma.workflowMetadata.create({
      data: workflow,
    })
  }

  console.log('✅ Created workflow metadata')

  // Create data sync status for Zixly's systems
  const syncStatuses = [
    {
      tenantId: zixlyTenant.id,
      dataSource: 'xero',
      lastSyncAt: new Date('2025-01-25T10:00:00Z'),
      nextSyncAt: new Date('2025-01-26T10:00:00Z'),
      recordCount: 15,
      status: 'success',
    },
    {
      tenantId: zixlyTenant.id,
      dataSource: 'plane',
      lastSyncAt: new Date('2025-01-25T09:30:00Z'),
      nextSyncAt: new Date('2025-01-25T21:30:00Z'),
      recordCount: 8,
      status: 'success',
    },
    {
      tenantId: zixlyTenant.id,
      dataSource: 'nextcloud',
      lastSyncAt: new Date('2025-01-25T09:00:00Z'),
      nextSyncAt: new Date('2025-01-25T21:00:00Z'),
      recordCount: 24,
      status: 'success',
    },
    {
      tenantId: zixlyTenant.id,
      dataSource: 'metabase',
      lastSyncAt: new Date('2025-01-25T08:00:00Z'),
      nextSyncAt: new Date('2025-01-26T08:00:00Z'),
      recordCount: 0,
      status: 'pending',
    },
  ]

  for (const syncStatus of syncStatuses) {
    await prisma.dataSyncStatus.create({
      data: syncStatus,
    })
  }

  console.log('✅ Created data sync status')

  console.log('🎉 Zixly internal operations data seeding completed!')
  console.log('📊 Summary:')
  console.log(`   - Organization: ${zixlyTenant.name}`)
  console.log(`   - Team members: ${teamMembers.length}`)
  console.log(`   - Service clients: ${serviceClients.length}`)
  console.log(`   - Financial records: ${financialData.length}`)
  console.log(`   - Lead events: ${leadEvents.length}`)
  console.log(`   - Custom metrics: ${customMetrics.length}`)
  console.log(`   - Integrations: ${integrations.length}`)
  console.log(`   - Workflows: ${workflows.length}`)
  console.log(`   - Sync statuses: ${syncStatuses.length}`)
}

export default async function seedService() {
  await main()
}

// Run if called directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Seeding failed:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
