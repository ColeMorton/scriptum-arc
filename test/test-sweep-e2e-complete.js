import fetch from 'node-fetch'

const TRADING_API_URL = 'http://localhost:8000'
const TRADING_API_KEY = 'dev-key-000000000000000000000000'

async function testCompleteSweepWorkflow() {
  console.log('🚀 Starting Complete Sweep E2E Test')
  console.log('=====================================')

  // 1. Define sweep parameters
  const sweepParams = {
    ticker: 'AAPL',
    fast_range: [10, 20],
    slow_range: [20, 30],
    step: 5,
    strategy_type: 'SMA',
    min_trades: 50,
  }

  console.log('📊 Input Parameters:')
  console.log(JSON.stringify(sweepParams, null, 2))
  console.log('')

  // 2. Start sweep job
  console.log('🔄 Starting sweep job...')
  const sweepResponse = await fetch(`${TRADING_API_URL}/api/v1/strategy/sweep`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': TRADING_API_KEY,
    },
    body: JSON.stringify(sweepParams),
  })

  if (!sweepResponse.ok) {
    throw new Error(
      `Sweep creation failed: ${sweepResponse.status} - ${await sweepResponse.text()}`
    )
  }

  const sweepResult = await sweepResponse.json()
  const jobId = sweepResult.job_id

  console.log('✅ Sweep job created successfully')
  console.log(`🆔 Job ID: ${jobId}`)
  console.log(`📅 Created: ${sweepResult.created_at}`)
  console.log(`🔗 Status URL: ${sweepResult.status_url}`)
  console.log('')

  // 3. Monitor job progress
  console.log('⏳ Monitoring job progress...')
  let jobStatus = 'pending'
  let attempts = 0
  const maxAttempts = 60 // 10 minutes max

  while (jobStatus !== 'completed' && jobStatus !== 'failed' && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait 10 seconds

    const statusResponse = await fetch(`${TRADING_API_URL}/api/v1/jobs/${jobId}`, {
      headers: { 'X-API-Key': TRADING_API_KEY },
    })

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`)
    }

    const statusData = await statusResponse.json()
    jobStatus = statusData.status
    attempts++

    console.log(
      `📊 Attempt ${attempts}: Status = ${jobStatus}, Progress = ${statusData.progress || 0}%`
    )

    if (statusData.error_message) {
      console.log(`⚠️  Error: ${statusData.error_message}`)
    }
  }

  if (jobStatus === 'failed') {
    throw new Error(`Job failed: ${jobStatus}`)
  }

  if (attempts >= maxAttempts) {
    throw new Error('Job did not complete within timeout period')
  }

  console.log('✅ Job completed successfully!')
  console.log('')

  // 4. Get sweep results
  console.log('📈 Retrieving sweep results...')
  const resultsResponse = await fetch(`${TRADING_API_URL}/api/v1/sweeps/${jobId}/results`, {
    headers: { 'X-API-Key': TRADING_API_KEY },
  })

  if (!resultsResponse.ok) {
    throw new Error(`Results retrieval failed: ${resultsResponse.status}`)
  }

  const results = await resultsResponse.json()
  console.log('✅ Sweep results retrieved')
  console.log(`📊 Total parameter combinations tested: ${results.total_combinations || 'N/A'}`)
  console.log(`⏱️  Execution time: ${results.execution_time || 'N/A'}`)
  console.log('')

  // 5. Get best result
  console.log('🏆 Retrieving best result...')
  const bestResponse = await fetch(`${TRADING_API_URL}/api/v1/sweeps/${jobId}/best`, {
    headers: { 'X-API-Key': TRADING_API_KEY },
  })

  if (!bestResponse.ok) {
    throw new Error(`Best result retrieval failed: ${bestResponse.status}`)
  }

  const bestResult = await bestResponse.json()

  console.log('✅ Best result retrieved successfully!')
  console.log('')
  console.log('🏆 COMPLETE BEST RESULT DATA:')
  console.log('==============================')
  console.log(JSON.stringify(bestResult, null, 2))
  console.log('')

  // 6. Extract key metrics
  if (bestResult.parameters) {
    console.log('📊 Best Parameters:')
    console.log(`   • Fast MA: ${bestResult.parameters.fast || 'N/A'}`)
    console.log(`   • Slow MA: ${bestResult.parameters.slow || 'N/A'}`)
    console.log(`   • Signal: ${bestResult.parameters.signal || 'N/A'}`)
  }

  if (bestResult.total_return !== undefined) {
    console.log(`💰 Total Return: ${(bestResult.total_return * 100).toFixed(2)}%`)
  }

  if (bestResult.sharpe_ratio !== undefined) {
    console.log(`📈 Sharpe Ratio: ${bestResult.sharpe_ratio.toFixed(4)}`)
  }

  if (bestResult.max_drawdown !== undefined) {
    console.log(`📉 Max Drawdown: ${(bestResult.max_drawdown * 100).toFixed(2)}%`)
  }

  if (bestResult.win_rate !== undefined) {
    console.log(`🎯 Win Rate: ${(bestResult.win_rate * 100).toFixed(2)}%`)
  }

  console.log('')
  console.log('✅ Complete Sweep E2E Test PASSED!')
  console.log('=====================================')

  return {
    jobId,
    sweepParams,
    bestResult,
    results,
  }
}

// Run the test
testCompleteSweepWorkflow()
  .then((_result) => {
    console.log('🎉 Test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  })
