import axios, { AxiosInstance } from 'axios'
import logger from './logger'

// Note: Service-level constants are loaded from environment variables
// This keeps services decoupled from the main app's configuration
// For centralized constants, see lib/config/constants.ts
const TRADING_API_URL = process.env.TRADING_API_URL || 'http://localhost:8000'
const TRADING_API_KEY = process.env.TRADING_API_KEY || 'dev-key-000000000000000000000000'

export interface TradingSweepParams {
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
  min_trades: number
  strategy_type: 'SMA' | 'EMA' | 'MACD'
  config_path?: 'minimum' | 'standard'
  webhook_url: string
}

export interface TradingSweepResponse {
  job_id: string
  status: string
  message: string
  parameters: {
    ticker: string
    fast_range: [number, number]
    slow_range: [number, number]
    step: number
    combinations: number
  }
  estimated_duration_seconds: number
  webhook_url: string
  created_at: string
}

export interface TradingSweepResult {
  ticker: string
  strategy_type: string
  fast_period: number
  slow_period: number
  score: number
  sharpe_ratio: number
  sortino_ratio: number
  total_return_pct: number
  annualized_return: number
  max_drawdown_pct: number
  win_rate_pct: number
  profit_factor: number
  total_trades: number
  trades_per_month: number
  avg_trade_duration: string
}

export interface BestResultsResponse {
  sweep_run_id: string
  ticker: string
  results: TradingSweepResult[]
  total_results: number
  returned: number
  query_timestamp: string
}

export class TradingAPIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: TRADING_API_URL,
      headers: {
        'X-API-Key': TRADING_API_KEY,
      },
      timeout: 30000,
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200 && response.data.status === 'healthy'
    } catch (error) {
      logger.error('Trading API health check failed', { error })
      return false
    }
  }

  async submitSweep(params: TradingSweepParams): Promise<TradingSweepResponse> {
    try {
      logger.info('Submitting sweep to Trading API', {
        ticker: params.ticker,
        strategy_type: params.strategy_type,
      })

      // Convert to form data format as Trading API expects
      const formData = new URLSearchParams()
      formData.append('ticker', params.ticker)
      formData.append('fast_range', JSON.stringify(params.fast_range))
      formData.append('slow_range', JSON.stringify(params.slow_range))
      formData.append('step', params.step.toString())
      formData.append('min_trades', params.min_trades.toString())
      formData.append('strategy_type', params.strategy_type)
      if (params.config_path) {
        formData.append('config_path', params.config_path)
      }
      formData.append('webhook_url', params.webhook_url)

      const response = await this.client.post<TradingSweepResponse>(
        '/api/v1/strategy/sweep',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      logger.info('Sweep submitted successfully', {
        job_id: response.data.job_id,
        ticker: params.ticker,
        combinations: response.data.parameters.combinations,
      })

      return response.data
    } catch (error) {
      logger.error('Failed to submit sweep', {
        error,
        ticker: params.ticker,
      })
      throw error
    }
  }

  async getJobStatus(
    jobId: string
  ): Promise<{ status: string; sweep_run_id?: string; error_message?: string }> {
    try {
      logger.info('Fetching job status', {
        job_id: jobId,
      })

      const response = await this.client.get(`/api/v1/jobs/${jobId}`)
      return response.data
    } catch (error) {
      logger.error('Failed to fetch job status', {
        error,
        job_id: jobId,
      })
      throw error
    }
  }

  async getBestResults(sweepRunId: string, ticker: string): Promise<BestResultsResponse> {
    try {
      logger.info('Fetching best results', {
        sweep_run_id: sweepRunId,
        ticker,
      })

      const response = await this.client.get<BestResultsResponse>(
        `/api/v1/sweeps/${sweepRunId}/best`,
        {
          params: { ticker },
        }
      )

      logger.info('Best results fetched', {
        sweep_run_id: sweepRunId,
        results_count: response.data.results.length,
      })

      return response.data
    } catch (error) {
      logger.error('Failed to fetch best results', {
        error,
        sweep_run_id: sweepRunId,
      })
      throw error
    }
  }
}

const tradingAPIClient = new TradingAPIClient()
export default tradingAPIClient
