'use client'

import React from 'react'

interface TimelineEvent {
  timestamp: string
  label: string
  status: 'completed' | 'active' | 'pending'
}

interface JobTimelineProps {
  createdAt: string
  startedAt?: string | null
  completedAt?: string | null
  status: string
}

export function JobTimeline({ createdAt, startedAt, completedAt, status }: JobTimelineProps) {
  const events: TimelineEvent[] = [
    {
      timestamp: createdAt,
      label: 'Job Created',
      status: 'completed',
    },
    {
      timestamp: startedAt || '',
      label: 'Processing Started',
      status: startedAt ? 'completed' : status === 'queued' ? 'pending' : 'active',
    },
    {
      timestamp: completedAt || '',
      label: status === 'failed' ? 'Job Failed' : 'Job Completed',
      status: completedAt ? 'completed' : 'pending',
    },
  ]

  const formatTimestamp = (ts: string) => {
    if (!ts) return '--'
    const date = new Date(ts)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                event.status === 'completed'
                  ? 'bg-green-500'
                  : event.status === 'active'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
            {index < events.length - 1 && (
              <div
                className={`w-0.5 h-12 ${
                  event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
