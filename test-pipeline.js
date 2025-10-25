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
  webhookReceiverUrl: 'http://localhost:3001',
  nextAppUrl: 'http://localhost:3000',
  testPayload: {
    ticker: 'BTC-USD',
    fast_range: [10, 20],
    slow_range: [20, 30],
    step: 5,
    strategy_type: 'SMA',
    min_trades: 10,
  },
}

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
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

    req.on('error', reject)

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
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

async function testNextAppHealth() {
  console.log('🔍 Testing Next.js App Health...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.nextAppUrl}/api/health`)
    if (response.status === 200) {
      console.log('✅ Next.js App is healthy:', response.data)
      return true
    } else {
      console.log('❌ Next.js App health check failed:', response.status, response.data)
      return false
    }
  } catch (error) {
    console.log('❌ Next.js App is not accessible:', error.message)
    return false
  }
}

async function testPipelineAPI() {
  console.log('🔍 Testing Pipeline API (without auth)...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.nextAppUrl}/api/pipelines`, {
      method: 'POST',
      body: {
        job_type: 'trading-sweep',
        ticker: 'BTC-USD',
        config: TEST_CONFIG.testPayload,
      },
    })

    if (response.status === 401) {
      console.log('✅ Pipeline API correctly requires authentication:', response.data)
      return true
    } else {
      console.log('❌ Pipeline API unexpected response:', response.status, response.data)
      return false
    }
  } catch (error) {
    console.log('❌ Pipeline API error:', error.message)
    return false
  }
}

// Main test function
async function runPipelineTests() {
  console.log('🧪 Zixly Pipeline Test Suite')
  console.log('================================\n')

  const results = {
    webhookReceiverHealth: false,
    webhookReceiverSweep: false,
    nextAppHealth: false,
    pipelineAPI: false,
  }

  // Test webhook receiver health
  results.webhookReceiverHealth = await testWebhookReceiverHealth()
  console.log('')

  // Test trading sweep webhook
  if (results.webhookReceiverHealth) {
    const sweepResult = await testTradingSweepWebhook()
    results.webhookReceiverSweep = sweepResult !== null
    console.log('')
  }

  // Test Next.js app health
  results.nextAppHealth = await testNextAppHealth()
  console.log('')

  // Test pipeline API
  results.pipelineAPI = await testPipelineAPI()
  console.log('')

  // Summary
  console.log('📊 Test Results Summary')
  console.log('========================')
  console.log(`Webhook Receiver Health: ${results.webhookReceiverHealth ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Trading Sweep Webhook: ${results.webhookReceiverSweep ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Next.js App Health: ${results.nextAppHealth ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Pipeline API Auth: ${results.pipelineAPI ? '✅ PASS' : '❌ FAIL'}`)

  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = Object.keys(results).length

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Pipeline is working correctly.')
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
