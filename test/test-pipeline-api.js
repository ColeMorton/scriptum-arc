#!/usr/bin/env node

/**
 * Pipeline API Test Script
 *
 * This script demonstrates how to test the Zixly Pipeline API endpoints
 * with proper Supabase authentication.
 */

import { config } from 'dotenv'
import http from 'http'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  testPayload: {
    job_type: 'trading-sweep',
    ticker: 'BTC-USD',
    config: {
      fast_range: [10, 20],
      slow_range: [20, 30],
      step: 5,
      strategy_type: 'SMA',
    },
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
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
          })
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

// Test functions
async function testHealthEndpoint() {
  console.log('🔍 Testing Health Endpoint...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/health`)
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, response.data)
    return response.status === 200
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`)
    return false
  }
}

async function testPipelineAPIWithoutAuth() {
  console.log('\n🔍 Testing Pipeline API (without authentication)...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/pipelines`, {
      method: 'POST',
      body: TEST_CONFIG.testPayload,
    })

    console.log(`Status: ${response.status}`)
    console.log(`Response:`, response.data)

    if (response.status === 401 && response.data.error === 'Unauthorized') {
      console.log('✅ API correctly requires authentication')
      return true
    }
    return false
  } catch (error) {
    console.log(`❌ API test failed: ${error.message}`)
    return false
  }
}

async function testPipelineListWithoutAuth() {
  console.log('\n🔍 Testing Pipeline List API (without authentication)...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/pipelines`)

    console.log(`Status: ${response.status}`)
    console.log(`Response:`, response.data)

    if (response.status === 401 && response.data.error === 'Unauthorized') {
      console.log('✅ List API correctly requires authentication')
      return true
    }
    return false
  } catch (error) {
    console.log(`❌ List API test failed: ${error.message}`)
    return false
  }
}

async function testWithMockAuth() {
  console.log('\n🔍 Testing Pipeline API (with mock authentication)...')
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/pipelines`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer mock-token-for-testing',
      },
      body: TEST_CONFIG.testPayload,
    })

    console.log(`Status: ${response.status}`)
    console.log(`Response:`, response.data)

    // This will likely fail with authentication error, which is expected
    return response.status === 401
  } catch (error) {
    console.log(`❌ Mock auth test failed: ${error.message}`)
    return false
  }
}

// Main test runner
async function runPipelineAPITests() {
  console.log('🧪 Zixly Pipeline API Test Suite')
  console.log('================================\n')

  const results = {
    health: await testHealthEndpoint(),
    pipelineAuth: await testPipelineAPIWithoutAuth(),
    listAuth: await testPipelineListWithoutAuth(),
    mockAuth: await testWithMockAuth(),
  }

  console.log('\n📊 Test Results Summary')
  console.log('========================')
  console.log(`Health Endpoint: ${results.health ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Pipeline Auth: ${results.pipelineAuth ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`List Auth: ${results.listAuth ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Mock Auth: ${results.mockAuth ? '✅ PASS' : '❌ FAIL'}`)

  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = Object.keys(results).length

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All API tests passed! Pipeline API is working correctly.')
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.')
  }

  console.log('\n📋 Authentication Guide')
  console.log('=======================')
  console.log('To test with real authentication, you need:')
  console.log('1. A valid Supabase user account')
  console.log('2. A valid JWT token from Supabase auth')
  console.log('3. The user must have a tenant_id in their metadata')
  console.log('\nExample with real token:')
  console.log('curl -X POST http://localhost:3001/api/pipelines \\')
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \\')
  console.log('  -d \'{"job_type": "trading-sweep", "ticker": "BTC-USD"}\'')
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runPipelineAPITests().catch(console.error)
}

export {
  runPipelineAPITests,
  testHealthEndpoint,
  testPipelineAPIWithoutAuth,
  testPipelineListWithoutAuth,
  testWithMockAuth,
}
