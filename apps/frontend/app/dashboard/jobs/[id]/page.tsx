'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { JobDetailCard } from '@/components/pipelines/JobDetailCard'
import { TradingSweepResults } from '@/components/pipelines/TradingSweepResults'
import { useJobUpdates } from '@/components/pipelines/useJobUpdates'
import { JobStatus } from '@/components/pipelines/JobStatusBadge'
import { apiGet, apiDelete, apiPost } from '@/lib/api-client'
import { toast } from 'sonner'

interface JobData {
  id: string
  job_type: string
  status: JobStatus
  parameters?: Record<string, unknown>
  result_summary?: Record<string, unknown>
  metrics?: Record<string, unknown>
  error_message?: string | null
  created_at: string
  started_at?: string | null
  completed_at?: string | null
  duration_seconds?: number | null
}

interface TradingResult {
  id: string
  parameters: {
    fast_period: number
    slow_period: number
  }
  performance: {
    score: number
    sharpe_ratio: number
    sortino_ratio: number
    total_return_pct: number
    annualized_return: number
    max_drawdown_pct: number
    win_rate_pct: number
    profit_factor: number
  }
  trades: {
    total_trades: number
    trades_per_month: number
    avg_trade_duration: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<JobData | null>(null)
  const [results, setResults] = useState<TradingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time updates
  const {
    job: realtimeJob,
    isConnected: wsConnected,
    lastUpdate,
  } = useJobUpdates({ jobId, autoRefresh: false })

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch job details
      const jobData = await apiGet<{ job: JobData; results?: TradingResult[] }>(
        `/api/pipelines/${jobId}`
      )

      setJob(jobData.job)

      // If job has results, set them
      if (jobData.results && jobData.results.length > 0) {
        setResults(jobData.results)
      }

      setError(null)
    } catch (err) {
      console.error('Failed to fetch job details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    fetchJobDetails()
  }, [fetchJobDetails])

  // Refresh when real-time update received
  useEffect(() => {
    if (lastUpdate && realtimeJob) {
      fetchJobDetails()
    }
  }, [lastUpdate, realtimeJob, fetchJobDetails])

  const handleCancelJob = async () => {
    if (!confirm('Are you sure you want to cancel this job?')) return

    try {
      await apiDelete(`/api/pipelines/${jobId}`)
      toast.success('Job cancelled successfully')
      fetchJobDetails() // Refresh
    } catch (err) {
      console.error('Failed to cancel job:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to cancel job')
    }
  }

  const handleRetry = async () => {
    if (!job) return

    try {
      const data = await apiPost<{ job: JobData }>('/api/pipelines', {
        job_type: job.job_type,
        ticker: job.parameters?.ticker,
        config: job.parameters,
      })

      toast.success('New job created successfully')
      router.push(`/dashboard/jobs/${data.job.id}`)
    } catch (err) {
      console.error('Failed to retry job:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to retry job')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-red-600 dark:text-red-400">{error || 'Job not found'}</p>
          <Button onClick={() => router.push('/dashboard/jobs')}>← Back to Jobs</Button>
        </div>
      </div>
    )
  }

  const isJobActive = job.status === 'queued' || job.status === 'running'
  const canRetry = job.status === 'failed' || job.status === 'completed'

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard/jobs')}>
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Details</h1>
              <div className="flex items-center gap-4 mt-2">
                {isJobActive && (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Job running</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-400'}`}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {wsConnected ? 'Live updates' : 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isJobActive && (
              <Button variant="destructive" onClick={handleCancelJob}>
                Cancel Job
              </Button>
            )}
            {canRetry && <Button onClick={handleRetry}>Retry Job</Button>}
            <Button variant="outline" onClick={fetchJobDetails}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <JobDetailCard job={job} />

      {/* Trading Results */}
      {results.length > 0 && job.job_type === 'trading-sweep' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Trading Sweep Results
          </h2>
          <TradingSweepResults
            results={results}
            ticker={(job.parameters?.ticker as string) || 'Unknown'}
          />
        </div>
      )}

      {/* No Results Message */}
      {results.length === 0 && job.status === 'completed' && (
        <div className="mt-8 p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
          <p className="text-yellow-800 dark:text-yellow-200">
            Job completed but no results were returned.
          </p>
        </div>
      )}
    </div>
  )
}
