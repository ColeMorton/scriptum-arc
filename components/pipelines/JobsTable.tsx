'use client'

import React from 'react'
import Link from 'next/link'
import { JobStatusBadge, JobStatus } from './JobStatusBadge'
import { Button } from '@/components/ui/button'

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

interface JobsTableProps {
  jobs: Job[]
  onRefresh?: () => void
  onCancel?: (jobId: string) => Promise<void>
}

export function JobsTable({ jobs, onCancel }: JobsTableProps) {
  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return '--'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTicker = (params?: Record<string, unknown>): string => {
    if (!params) return '--'
    return (params.ticker as string) || (params.symbol as string) || '--'
  }

  const handleCancel = async (jobId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (onCancel && confirm('Are you sure you want to cancel this job?')) {
      await onCancel(jobId)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Ticker
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Duration
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                No jobs found. Trigger your first pipeline job to get started.
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {job.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{job.job_type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getTicker(job.parameters)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(job.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(job.duration_seconds)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    {(job.status === 'queued' || job.status === 'running') && onCancel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleCancel(job.id, e)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
