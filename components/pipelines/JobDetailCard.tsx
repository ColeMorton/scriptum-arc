'use client'

import React from 'react'
import { JobStatusBadge, JobStatus } from './JobStatusBadge'
import { JobTimeline } from './JobTimeline'

interface JobDetailCardProps {
  job: {
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
}

export function JobDetailCard({ job }: JobDetailCardProps) {
  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {job.job_type}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">ID: {job.id}</p>
            </div>
            <JobStatusBadge status={job.status} className="text-sm px-3 py-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDuration(job.duration_seconds)}
              </p>
            </div>
            {(() => {
              const ticker = job.parameters?.ticker
              return ticker && typeof ticker === 'string' ? (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ticker</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ticker}</p>
                </div>
              ) : null
            })()}
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Parameters
          </h3>
          <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-gray-800 dark:text-gray-200">
              {JSON.stringify(job.parameters, null, 2)}
            </code>
          </pre>
        </div>

        {/* Error Message */}
        {job.error_message && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Error Message
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
              {job.error_message}
            </p>
          </div>
        )}

        {/* Metrics */}
        {job.metrics && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Execution Metrics
            </h3>
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">
                {JSON.stringify(job.metrics, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {/* Result Summary */}
        {job.result_summary && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Result Summary
            </h3>
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">
                {JSON.stringify(job.result_summary, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>

      {/* Timeline Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Timeline</h3>
          <JobTimeline
            createdAt={job.created_at}
            startedAt={job.started_at}
            completedAt={job.completed_at}
            status={job.status}
          />
        </div>
      </div>
    </div>
  )
}
