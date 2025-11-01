'use client'

import React from 'react'

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

interface JobStatusBadgeProps {
  status: JobStatus
  className?: string
}

const statusConfig: Record<
  JobStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  queued: {
    label: 'Queued',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-800 dark:text-blue-300',
    icon: '⏳',
  },
  running: {
    label: 'Running',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    icon: '⚡',
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-300',
    icon: '✓',
  },
  failed: {
    label: 'Failed',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-300',
    icon: '✗',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    textColor: 'text-gray-800 dark:text-gray-300',
    icon: '⊘',
  },
}

export function JobStatusBadge({ status, className = '' }: JobStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.queued

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span className="text-sm">{config.icon}</span>
      {config.label}
    </span>
  )
}
