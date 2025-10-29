#!/usr/bin/env node

/**
 * Pipeline Test Script
 *
 * This script demonstrates the pipeline functionality by:
 * 1. Testing the webhook receiver service directly
 * 2. Simulating a trading sweep job
 * 3. Showing the expected API responses
 */

import http from 'http'

// Test configuration
const TEST_CONFIG = {
  webhookReceiverUrl: 'http://localhost:3002',
  testPayload: {
    ticker: 'BTC-USD',
    fast_range: [10, 20],
    slow_range: [20, 30],
    step: 5,
    strategy_type: 'SMA',
    min_trades: 10,
  },
}

// Service profile requirements
const SERVICE_PROFILES = {
  webhookReceiver: { profile: 'zixly', port: 3002, url: 'http://localhost:3002/health' },
  tradingApi: { profile: 'trading', port: 8000, url: 'http://localhost:8000/health' },
}

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const timeout = options.timeout || 5000 // Default 5 second timeout

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      timeout: timeout, // Add timeout
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const req = http.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers })
        } catch {
          resolve({ status: res.statusCode, data: data, headers: res.headers })
        }
      })
    })

    // Handle timeout
    req.on('timeout', () => {
      req.destroy()
      reject(new Error(`Request timeout after ${timeout}ms`))
    })

    req.on('error', reject)

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

// Check if a service is available
async function checkServiceAvailability(url, _serviceName) {
  try {
    const response = await makeRequest(url, { timeout: 2000 })
    return { available: true, status: response.status }
  } catch (error) {
    return { available: false, error: error.message }
  }
}

// Test functions
async function testWebhookReceiverHealth() {
  console.log('🔍 Testing Webhook Receiver Health...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.webhookReceiverUrl}/health`)
    if (response.status === 200) {
      console.log('✅ Webhook Receiver is healthy:', response.data)
      return true
    } else {
      console.log('❌ Webhook Receiver health check failed:', response.status, response.data)
      return false
    }
  } catch (error) {
    console.log('❌ Webhook Receiver is not accessible:', error.message)
    return false
  }
}

async function testTradingSweepWebhook() {
  console.log('🚀 Testing Trading Sweep Webhook...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.webhookReceiverUrl}/webhook/trading-sweep`, {
      method: 'POST',
      body: TEST_CONFIG.testPayload,
    })

    if (response.status === 202) {
      console.log('✅ Trading sweep webhook successful:', response.data)
      return response.data
    } else {
      console.log('❌ Trading sweep webhook failed:', response.status, response.data)
      return null
    }
  } catch (error) {
    console.log('❌ Trading sweep webhook error:', error.message)
    return null
  }
}

// Pre-flight check function
async function preflightCheck() {
  console.log('🔍 Checking service availability...\n')

  const results = {}

  for (const [service, config] of Object.entries(SERVICE_PROFILES)) {
    const availability = await checkServiceAvailability(config.url, service)
    results[service] = availability.available

    if (availability.available) {
      console.log(`✅ ${service}: Available (port ${config.port})`)
    } else {
      console.log(`⚠️  ${service}: Not running (requires '${config.profile}' profile)`)
    }
  }

  console.log('')
  return results
}

// Main test function
async function runPipelineTests() {
  console.log('🧪 Zixly Pipeline Test Suite')
  console.log('================================\n')

  // Run preflight check
  const availability = await preflightCheck()

  const results = {
    webhookReceiverHealth: false,
    webhookReceiverSweep: false,
  }

  // Test webhook receiver (requires zixly profile)
  if (availability.webhookReceiver) {
    results.webhookReceiverHealth = await testWebhookReceiverHealth()
    console.log('')

    if (results.webhookReceiverHealth) {
      const sweepResult = await testTradingSweepWebhook()
      results.webhookReceiverSweep = sweepResult !== null
      console.log('')
    }
  } else {
    console.log('⏭️  Skipping webhook receiver tests (service not running)\n')
  }

  // Summary
  console.log('📊 Test Results Summary')
  console.log('========================')

  const testedServices = []
  if (availability.webhookReceiver) {
    console.log(`Webhook Receiver Health: ${results.webhookReceiverHealth ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Trading Sweep Webhook: ${results.webhookReceiverSweep ? '✅ PASS' : '❌ FAIL'}`)
    testedServices.push('webhookReceiver')
  }

  if (testedServices.length === 0) {
    console.log('\n⚠️  No services available for testing')
    console.log('Start services with: docker-compose --profile zixly up -d')
    return results
  }

  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = testedServices.length * 2

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All available tests passed!')
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.')
  }

  return results
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runPipelineTests().catch(console.error)
}

export { runPipelineTests, testWebhookReceiverHealth, testTradingSweepWebhook }
