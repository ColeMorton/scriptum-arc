#!/usr/bin/env node

/**
 * End-to-End Pipeline Testing Script
 * Tests the complete pipeline functionality with authentication
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { TEST_SERVICES, TEST_CREDENTIALS } from './config/test-constants'
import { HEALTH_ENDPOINTS } from '@/lib/config/constants'

config({ path: '.env.local' })

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhndigeishvhanwhvuei.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobmRpZ2Vpc2h2aGFud2h2dWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjkzMDMsImV4cCI6MjA3NDUwNTMwM30.Ax8ZRCVZVgqC1yUdfD8A7hi3X7HQjeZgufub067zrsE'

const API_BASE_URL = TEST_SERVICES.GRAFANA
const WEBHOOK_BASE_URL = TEST_SERVICES.WEBHOOK_RECEIVER

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = TEST_CREDENTIALS.TEST_PASSWORD

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let authToken: string | null = null
let testJobId: string | null = null

interface Endpoint {
  name: string
  url: string
}

interface JobData {
  job_type: string
  ticker: string
  config: {
    fast_range: [number, number]
    slow_range: [number, number]
    step: number
  }
}

interface JobResponse {
  job: {
    id: string
  }
}

interface JobsResponse {
  totalJobs: number
  jobs?: unknown[]
}

interface WebhookData {
  job_id: string
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
}

async function log(message: string, data: unknown = null): Promise<void> {
  console.log(`[${new Date().toISOString()}] ${message}`)
  if (data) {
    console.log(JSON.stringify(data, null, 2))
  }
}

async function authenticate(): Promise<boolean> {
  await log('🔐 Testing authentication...')

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })

    if (error) {
      await log('❌ Authentication failed:', error.message)
      await log('💡 Note: You need to create a test user in Supabase Dashboard')
      await log('   Email:', TEST_EMAIL)
      await log('   Password:', TEST_PASSWORD)
      return false
    }

    authToken = session!.access_token
    await log('✅ Authentication successful')
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Authentication error:', errorMessage)
    return false
  }
}

async function testHealthEndpoints(): Promise<void> {
  await log('🏥 Testing health endpoints...')

  const endpoints: Endpoint[] = [
    { name: 'Next.js App', url: `${API_BASE_URL}/api/health` },
    { name: 'Webhook Receiver', url: `${WEBHOOK_BASE_URL}${HEALTH_ENDPOINTS.WEBHOOK_RECEIVER}` },
    { name: 'Prometheus', url: `${TEST_SERVICES.PROMETHEUS}${HEALTH_ENDPOINTS.PROMETHEUS}` },
    { name: 'Grafana', url: `${TEST_SERVICES.GRAFANA}${HEALTH_ENDPOINTS.GRAFANA}` },
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url)

      if (response.ok) {
        await log(`✅ ${endpoint.name}: Healthy`)
      } else {
        await log(`❌ ${endpoint.name}: Unhealthy (${response.status})`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await log(`❌ ${endpoint.name}: Error - ${errorMessage}`)
    }
  }
}

async function testJobCreation(): Promise<boolean> {
  await log('📝 Testing job creation...')

  if (!authToken) {
    await log('❌ No auth token available')
    return false
  }

  try {
    const jobData: JobData = {
      job_type: 'trading-sweep',
      ticker: 'BTC-USD',
      config: {
        fast_range: [10, 20],
        slow_range: [20, 30],
        step: 5,
      },
    }

    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(jobData),
    })

    const result = (await response.json()) as JobResponse

    if (response.ok) {
      testJobId = result.job.id
      await log('✅ Job created successfully:', result)
      return true
    } else {
      await log('❌ Job creation failed:', result)
      return false
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Job creation error:', errorMessage)
    return false
  }
}

async function testJobListing(): Promise<boolean> {
  await log('📋 Testing job listing...')

  if (!authToken) {
    await log('❌ No auth token available')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const result = (await response.json()) as JobsResponse

    if (response.ok) {
      await log('✅ Jobs listed successfully:', {
        totalJobs: result.totalJobs,
        jobsCount: result.jobs?.length || 0,
      })
      return true
    } else {
      await log('❌ Job listing failed:', result)
      return false
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Job listing error:', errorMessage)
    return false
  }
}

async function testWebhookTrigger(): Promise<boolean> {
  await log('🔔 Testing webhook trigger...')

  if (!testJobId) {
    await log('❌ No test job ID available')
    return false
  }

  try {
    const webhookData: WebhookData = {
      job_id: testJobId,
      ticker: 'BTC-USD',
      fast_range: [10, 20],
      slow_range: [20, 30],
      step: 5,
    }

    const response = await fetch(`${WEBHOOK_BASE_URL}/webhook/trading-sweep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    const result = await response.json()

    if (response.ok) {
      await log('✅ Webhook triggered successfully:', result)
      return true
    } else {
      await log('❌ Webhook trigger failed:', result)
      return false
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Webhook trigger error:', errorMessage)
    return false
  }
}

async function testErrorScenarios(): Promise<void> {
  await log('🚨 Testing error scenarios...')

  if (!authToken) {
    await log('❌ No auth token available')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        job_type: 'invalid-type',
        ticker: 'BTC-USD',
      }),
    })

    const result = await response.json()

    if (!response.ok && result.error) {
      await log('✅ Invalid job type rejected:', result.error)
    } else {
      await log('❌ Invalid job type should have been rejected')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Error scenario test failed:', errorMessage)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ticker: 'BTC-USD',
      }),
    })

    const result = await response.json()

    if (!response.ok && result.error) {
      await log('✅ Missing required field rejected:', result.error)
    } else {
      await log('❌ Missing required field should have been rejected')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await log('❌ Error scenario test failed:', errorMessage)
  }
}

async function main(): Promise<void> {
  await log('🚀 Starting End-to-End Pipeline Test')
  await log('=====================================')

  await testHealthEndpoints()

  const authSuccess = await authenticate()

  if (authSuccess) {
    await testJobCreation()
    await testJobListing()
    await testWebhookTrigger()
    await testErrorScenarios()
  } else {
    await log('⚠️ Skipping authenticated tests due to authentication failure')
    await log('💡 To enable full testing:')
    await log('   1. Go to Supabase Dashboard')
    await log('   2. Create a user with email:', TEST_EMAIL)
    await log('   3. Set password:', TEST_PASSWORD)
    await log('   4. Run this script again')
  }

  await log('🏁 End-to-End Test Complete')
  await log('===========================')
}

main().catch(console.error)
