#!/usr/bin/env node

/**
 * End-to-End Pipeline Testing Script
 * Tests the complete pipeline functionality with authentication
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhndigeishvhanwhvuei.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobmRpZ2Vpc2h2aGFud2h2dWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjkzMDMsImV4cCI6MjA3NDUwNTMwM30.Ax8ZRCVZVgqC1yUdfD8A7hi3X7HQjeZgufub067zrsE'

const API_BASE_URL = 'http://localhost:3001'
const WEBHOOK_BASE_URL = 'http://localhost:3002'

// Test user credentials (you'll need to create this user in Supabase)
const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test-password-123'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let authToken = null
let testJobId = null

async function log(message, data = null) {
  console.log(`[${new Date().toISOString()}] ${message}`)
  if (data) {
    console.log(JSON.stringify(data, null, 2))
  }
}

async function authenticate() {
  log('🔐 Testing authentication...')

  try {
    // Try to sign in with test credentials
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })

    if (error) {
      log('❌ Authentication failed:', error.message)
      log('💡 Note: You need to create a test user in Supabase Dashboard')
      log('   Email:', TEST_EMAIL)
      log('   Password:', TEST_PASSWORD)
      return false
    }

    authToken = session.access_token
    log('✅ Authentication successful')
    return true
  } catch (error) {
    log('❌ Authentication error:', error.message)
    return false
  }
}

async function testHealthEndpoints() {
  log('🏥 Testing health endpoints...')

  const endpoints = [
    { name: 'Next.js App', url: `${API_BASE_URL}/api/health` },
    { name: 'Webhook Receiver', url: `${WEBHOOK_BASE_URL}/health` },
    { name: 'Prometheus', url: 'http://localhost:9090/-/healthy' },
    { name: 'Grafana', url: 'http://localhost:3001/api/health' },
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url)

      if (response.ok) {
        log(`✅ ${endpoint.name}: Healthy`)
      } else {
        log(`❌ ${endpoint.name}: Unhealthy (${response.status})`)
      }
    } catch (error) {
      log(`❌ ${endpoint.name}: Error - ${error.message}`)
    }
  }
}

async function testJobCreation() {
  log('📝 Testing job creation...')

  if (!authToken) {
    log('❌ No auth token available')
    return false
  }

  try {
    const jobData = {
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

    const result = await response.json()

    if (response.ok) {
      testJobId = result.job.id
      log('✅ Job created successfully:', result)
      return true
    } else {
      log('❌ Job creation failed:', result)
      return false
    }
  } catch (error) {
    log('❌ Job creation error:', error.message)
    return false
  }
}

async function testJobListing() {
  log('📋 Testing job listing...')

  if (!authToken) {
    log('❌ No auth token available')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const result = await response.json()

    if (response.ok) {
      log('✅ Jobs listed successfully:', {
        totalJobs: result.totalJobs,
        jobsCount: result.jobs?.length || 0,
      })
      return true
    } else {
      log('❌ Job listing failed:', result)
      return false
    }
  } catch (error) {
    log('❌ Job listing error:', error.message)
    return false
  }
}

async function testWebhookTrigger() {
  log('🔔 Testing webhook trigger...')

  if (!testJobId) {
    log('❌ No test job ID available')
    return false
  }

  try {
    const webhookData = {
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
      log('✅ Webhook triggered successfully:', result)
      return true
    } else {
      log('❌ Webhook trigger failed:', result)
      return false
    }
  } catch (error) {
    log('❌ Webhook trigger error:', error.message)
    return false
  }
}

async function testErrorScenarios() {
  log('🚨 Testing error scenarios...')

  if (!authToken) {
    log('❌ No auth token available')
    return false
  }

  // Test invalid job type
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
      log('✅ Invalid job type rejected:', result.error)
    } else {
      log('❌ Invalid job type should have been rejected')
    }
  } catch (error) {
    log('❌ Error scenario test failed:', error.message)
  }

  // Test missing required fields
  try {
    const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ticker: 'BTC-USD',
        // Missing job_type
      }),
    })

    const result = await response.json()

    if (!response.ok && result.error) {
      log('✅ Missing required field rejected:', result.error)
    } else {
      log('❌ Missing required field should have been rejected')
    }
  } catch (error) {
    log('❌ Error scenario test failed:', error.message)
  }
}

async function main() {
  log('🚀 Starting End-to-End Pipeline Test')
  log('=====================================')

  // Test 1: Health endpoints
  await testHealthEndpoints()

  // Test 2: Authentication
  const authSuccess = await authenticate()

  if (authSuccess) {
    // Test 3: Job creation
    await testJobCreation()

    // Test 4: Job listing
    await testJobListing()

    // Test 5: Webhook trigger
    await testWebhookTrigger()

    // Test 6: Error scenarios
    await testErrorScenarios()
  } else {
    log('⚠️ Skipping authenticated tests due to authentication failure')
    log('💡 To enable full testing:')
    log('   1. Go to Supabase Dashboard')
    log('   2. Create a user with email:', TEST_EMAIL)
    log('   3. Set password:', TEST_PASSWORD)
    log('   4. Run this script again')
  }

  log('🏁 End-to-End Test Complete')
  log('===========================')
}

// Run the test
main().catch(console.error)
