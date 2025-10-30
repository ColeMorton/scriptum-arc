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
import { URL } from 'url'
import { TEST_SERVICES, PORTS } from './config/test-constants'
import { HEALTH_ENDPOINTS as ENDPOINTS } from '@/lib/config/constants'

interface TestConfig {
  webhookReceiverUrl: string
  testPayload: {
    ticker: string
    fast_range: [number, number]
    slow_range: [number, number]
    step: number
    strategy_type: string
    min_trades: number
  }
}

interface ServiceProfile {
  profile: string
  port: number
  url: string
}

interface HTTPRequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

interface HTTPResponse {
  status: number
  data: unknown
  headers: http.IncomingHttpHeaders
}

interface ServiceAvailability {
  available: boolean
  status?: number
  error?: string
}

interface TestResults {
  webhookReceiverHealth: boolean
  webhookReceiverSweep: boolean
}

interface AvailabilityResults {
  webhookReceiver?: boolean
  tradingApi?: boolean
}

const TEST_CONFIG: TestConfig = {
  webhookReceiverUrl: TEST_SERVICES.WEBHOOK_RECEIVER,
  testPayload: {
    ticker: 'BTC-USD',
    fast_range: [10, 20],
    slow_range: [20, 30],
    step: 5,
    strategy_type: 'SMA',
    min_trades: 10,
  },
}

const SERVICE_PROFILES: Record<string, ServiceProfile> = {
  webhookReceiver: {
    profile: 'zixly',
    port: PORTS.WEBHOOK_RECEIVER,
    url: `${TEST_SERVICES.WEBHOOK_RECEIVER}${ENDPOINTS.WEBHOOK_RECEIVER}`,
  },
  tradingApi: {
    profile: 'trading',
    port: PORTS.TRADING_API,
    url: `${TEST_SERVICES.TRADING_API}${ENDPOINTS.TRADING_API}`,
  },
}

function makeRequest(url: string, options: HTTPRequestOptions = {}): Promise<HTTPResponse> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const timeout = options.timeout || 5000

    const requestOptions: http.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const req = http.request(requestOptions, (res: http.IncomingMessage) => {
      let data = ''
      res.on('data', (chunk: Buffer) => (data += chunk))
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({ status: res.statusCode!, data: jsonData, headers: res.headers })
        } catch {
          resolve({ status: res.statusCode!, data, headers: res.headers })
        }
      })
    })

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

async function checkServiceAvailability(
  url: string,
  _serviceName: string
): Promise<ServiceAvailability> {
  try {
    const response = await makeRequest(url, { timeout: 2000 })
    return { available: true, status: response.status }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { available: false, error: errorMessage }
  }
}

async function testWebhookReceiverHealth(): Promise<boolean> {
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log('❌ Webhook Receiver is not accessible:', errorMessage)
    return false
  }
}

async function testTradingSweepWebhook(): Promise<unknown> {
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log('❌ Trading sweep webhook error:', errorMessage)
    return null
  }
}

async function preflightCheck(): Promise<AvailabilityResults> {
  console.log('🔍 Checking service availability...\n')

  const results: AvailabilityResults = {}

  for (const [service, config] of Object.entries(SERVICE_PROFILES)) {
    const availability = await checkServiceAvailability(config.url, service)
    results[service as keyof AvailabilityResults] = availability.available

    if (availability.available) {
      console.log(`✅ ${service}: Available (port ${config.port})`)
    } else {
      console.log(`⚠️  ${service}: Not running (requires '${config.profile}' profile)`)
    }
  }

  console.log('')
  return results
}

async function runPipelineTests(): Promise<TestResults> {
  console.log('🧪 Zixly Pipeline Test Suite')
  console.log('================================\n')

  const availability = await preflightCheck()

  const results: TestResults = {
    webhookReceiverHealth: false,
    webhookReceiverSweep: false,
  }

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

  console.log('📊 Test Results Summary')
  console.log('========================')

  const testedServices: string[] = []
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

if (import.meta.url === `file://${process.argv[1]}`) {
  runPipelineTests().catch(console.error)
}

export { runPipelineTests, testWebhookReceiverHealth, testTradingSweepWebhook }
