export const mockJobData = {
  id: 'test-job-1',
  tenantId: 'test-tenant-1',
  jobType: 'trading-sweep',
  status: 'COMPLETED',
  parameters: {
    ticker: 'BTC-USD',
    strategy_type: 'SMA',
    fast_period: 10,
    slow_period: 50,
  },
  result: {
    sweep_run_id: 'sweep-123',
    total_combinations: 100,
    best_sharpe: 2.5,
  },
  metrics: {
    duration_seconds: 120,
    combinations_tested: 100,
  },
  errorMessage: null,
  createdAt: new Date('2025-01-27T10:00:00Z'),
  startedAt: new Date('2025-01-27T10:00:05Z'),
  completedAt: new Date('2025-01-27T10:02:05Z'),
}

export const mockTradingResults = [
  {
    id: 'result-1',
    jobId: 'test-job-1',
    sweepRunId: 'sweep-123',
    ticker: 'BTC-USD',
    strategyType: 'SMA',
    parameters: {
      fast_period: 10,
      slow_period: 50,
    },
    performance: {
      score: 90.5,
      sharpe_ratio: 2.5,
      sortino_ratio: 3.2,
      total_return_pct: 150.5,
      annualized_return: 55.2,
      max_drawdown_pct: -12.3,
      win_rate_pct: 68.0,
      profit_factor: 2.8,
    },
    trades: {
      total_trades: 60,
      trades_per_month: 5.0,
      avg_trade_duration: '4.8 days',
    },
    createdAt: new Date('2025-01-27T10:02:05Z'),
  },
  {
    id: 'result-2',
    jobId: 'test-job-1',
    sweepRunId: 'sweep-123',
    ticker: 'BTC-USD',
    strategyType: 'SMA',
    parameters: {
      fast_period: 15,
      slow_period: 60,
    },
    performance: {
      score: 85.0,
      sharpe_ratio: 2.1,
      sortino_ratio: 2.8,
      total_return_pct: 120.0,
      annualized_return: 42.5,
      max_drawdown_pct: -18.5,
      win_rate_pct: 62.0,
      profit_factor: 2.3,
    },
    trades: {
      total_trades: 48,
      trades_per_month: 4.0,
      avg_trade_duration: '6.2 days',
    },
    createdAt: new Date('2025-01-27T10:02:05Z'),
  },
  {
    id: 'result-3',
    jobId: 'test-job-1',
    sweepRunId: 'sweep-123',
    ticker: 'BTC-USD',
    strategyType: 'SMA',
    parameters: {
      fast_period: 20,
      slow_period: 70,
    },
    performance: {
      score: 78.5,
      sharpe_ratio: 1.8,
      sortino_ratio: 2.4,
      total_return_pct: 95.0,
      annualized_return: 35.0,
      max_drawdown_pct: -22.0,
      win_rate_pct: 58.0,
      profit_factor: 2.0,
    },
    trades: {
      total_trades: 40,
      trades_per_month: 3.3,
      avg_trade_duration: '7.5 days',
    },
    createdAt: new Date('2025-01-27T10:02:05Z'),
  },
]

export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  tenantId: 'test-tenant-1',
  role: 'ADMIN' as const,
}

export const mockUser2 = {
  id: 'test-user-2',
  email: 'test2@example.com',
  tenantId: 'test-tenant-2',
  role: 'ADMIN' as const,
}

// Job status types
export const JobStatus = {
  QUEUED: 'QUEUED' as const,
  RUNNING: 'RUNNING' as const,
  COMPLETED: 'COMPLETED' as const,
  FAILED: 'FAILED' as const,
  CANCELLED: 'CANCELLED' as const,
}

// Mock jobs for table tests (using lowercase status to match JobsTable component)
export const mockJob1 = {
  id: 'job-1',
  tenantId: 'test-tenant-1',
  job_type: 'trading-sweep',
  status: 'queued' as const,
  parameters: { ticker: 'BTC-USD', strategy: 'SMA' },
  result: null,
  errorMessage: null,
  created_at: new Date('2024-01-01T10:00:00Z').toISOString(),
  started_at: null,
  completed_at: null,
  duration_seconds: null,
}

export const mockJob2 = {
  id: 'job-2',
  tenantId: 'test-tenant-1',
  job_type: 'data-etl',
  status: 'running' as const,
  parameters: { source: 'Xero', target: 'Supabase' },
  result: null,
  errorMessage: null,
  created_at: new Date('2024-01-01T11:00:00Z').toISOString(),
  started_at: new Date('2024-01-01T11:00:05Z').toISOString(),
  completed_at: null,
  duration_seconds: null,
}

export const mockJob3 = {
  id: 'job-3',
  tenantId: 'test-tenant-1',
  job_type: 'trading-sweep',
  status: 'completed' as const,
  parameters: { ticker: 'ETH-USD', strategy: 'EMA' },
  result: { sharpe: 1.5, return: 0.2 },
  errorMessage: null,
  created_at: new Date('2024-01-01T12:00:00Z').toISOString(),
  started_at: new Date('2024-01-01T12:00:05Z').toISOString(),
  completed_at: new Date('2024-01-01T12:15:00Z').toISOString(),
  duration_seconds: 900,
}

export const mockJobs = [mockJob1, mockJob2, mockJob3]
