import { z } from 'zod'

// Trading Sweep Trigger Schema
export const TradingSweepTriggerSchema = z
  .object({
    ticker: z.string().min(3).max(20),
    fast_range: z.tuple([z.number().int().min(1), z.number().int().max(500)]),
    slow_range: z.tuple([z.number().int().min(1), z.number().int().max(500)]),
    step: z.number().int().min(1).max(50),
    min_trades: z.number().int().min(10).max(1000).default(50),
    strategy_type: z.enum(['SMA', 'EMA', 'MACD']).default('SMA'),
    config_path: z.enum(['minimum', 'standard']).optional(),
  })
  .refine((data) => data.fast_range[0] < data.slow_range[0], {
    message: 'Fast range min must be less than slow range min',
  })
  .refine((data) => data.fast_range[1] < data.slow_range[1], {
    message: 'Fast range max must be less than slow range max',
  })

export type TradingSweepTrigger = z.infer<typeof TradingSweepTriggerSchema>

// Trading Sweep Callback Schema
export const TradingSweepCallbackSchema = z.object({
  event_type: z.enum(['sweep.completed', 'sweep.failed']),
  job_id: z.string(),
  sweep_run_id: z.string().optional(),
  status: z.enum(['completed', 'failed']),
  ticker: z.string(),
  error_message: z.string().optional(),
  result_data: z
    .object({
      sweep_run_id: z.string(),
      total_combinations: z.number(),
      execution_time_seconds: z.number(),
      completed_at: z.string().datetime(),
    })
    .optional(),
  timestamp: z.string().datetime(),
})

export type TradingSweepCallback = z.infer<typeof TradingSweepCallbackSchema>

// Job Data Interface
export interface TradingSweepJobData {
  jobId: string
  tenantId: string
  ticker: string
  fast_range: [number, number]
  slow_range: [number, number]
  step: number
  min_trades: number
  strategy_type: 'SMA' | 'EMA' | 'MACD'
  config_path?: 'minimum' | 'standard'
  webhook_url: string
  created_at: Date
}

// API Response Types
export interface JobCreatedResponse {
  job_id: string
  status: 'QUEUED'
  message: string
  webhook_url: string
  created_at: string
}

export interface ErrorResponse {
  error: string
  details?: unknown
  timestamp: string
}
