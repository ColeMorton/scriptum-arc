'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { JobsTable } from '@/components/pipelines/JobsTable'
import { TriggerJobDialog } from '@/components/pipelines/TriggerJobDialog'
import { useJobListUpdates } from '@/components/pipelines/useJobUpdates'
import { JobStatus } from '@/components/pipelines/JobStatusBadge'
import { toast } from 'sonner'

interface Job {
  id: string
  job_type: string
  status: JobStatus
  parameters?: Record<string, unknown>
  created_at: string
  started_at?: string | null
  completed_at?: string | null
  duration_seconds?: number | null
  error_message?: string | null
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Real-time updates
  const { isConnected: wsConnected, lastUpdate } = useJobListUpdates()

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/pipelines?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs')
      }

      setJobs(data.jobs)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Refresh when real-time update received
  useEffect(() => {
    if (lastUpdate) {
      fetchJobs()
    }
  }, [lastUpdate, fetchJobs])

  const handleCancelJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/pipelines/${jobId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel job')
      }

      toast.success('Job cancelled successfully')
      fetchJobs() // Refresh list
    } catch (err) {
      console.error('Failed to cancel job:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to cancel job')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pipeline Jobs</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-500 dark:text-gray-400">
              Monitor and manage your pipeline jobs
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          + Trigger New Job
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filter:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Status</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <Button variant="outline" onClick={fetchJobs} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        {loading && jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : (
          <JobsTable jobs={jobs} onRefresh={fetchJobs} onCancel={handleCancelJob} />
        )}
      </div>

      <TriggerJobDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
