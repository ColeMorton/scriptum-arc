import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface JobUpdate {
  id: string
  job_type: string
  status: string
  tenant_id: string
  parameters?: Record<string, unknown>
  result?: Record<string, unknown>
  error_message?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

interface UseJobUpdatesOptions {
  jobId?: string
  autoRefresh?: boolean
}

interface UseJobUpdatesReturn {
  job: JobUpdate | null
  isConnected: boolean
  lastUpdate: Date | null
  error: Error | null
}

interface UseJobListUpdatesReturn {
  isConnected: boolean
  lastUpdate: Date | null
}

// Transform database column names to camelCase
function transformJobData(data: Record<string, unknown>): JobUpdate {
  return {
    id: data.id as string,
    job_type: data.job_type as string,
    status: ((data.status as string)?.toLowerCase() || data.status) as string,
    tenant_id: data.tenant_id as string,
    parameters: data.parameters as Record<string, unknown> | undefined,
    result: data.result as Record<string, unknown> | undefined,
    error_message: data.error_message as string | undefined,
    created_at: data.created_at as string,
    started_at: data.started_at as string | undefined,
    completed_at: data.completed_at as string | undefined,
  }
}

export function useJobUpdates(options: UseJobUpdatesOptions = {}): UseJobUpdatesReturn {
  const { jobId, autoRefresh = true } = options
  const [job, setJob] = useState<JobUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const setupSubscription = async () => {
      try {
        const channel = supabase.channel('pipeline-jobs-changes')

        const subscriptionConfig = {
          event: '*' as const,
          schema: 'public',
          table: 'pipeline_jobs',
          ...(jobId && { filter: `id=eq.${jobId}` }),
        }

        channel
          .on('postgres_changes', subscriptionConfig, (payload) => {
            console.log('Received job update:', payload)

            if (!mounted) return

            // Always update lastUpdate timestamp
            setLastUpdate(new Date())

            // Update job state if autoRefresh is enabled
            if (autoRefresh && payload.new) {
              const transformedJob = transformJobData(payload.new as Record<string, unknown>)
              setJob(transformedJob)
            }
          })
          .subscribe((status) => {
            console.log('Subscription status:', status)

            if (!mounted) return

            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
              setError(null)
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false)
              setError(new Error('Failed to subscribe to job updates'))
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false)
              setError(new Error('Subscription timed out'))
            } else {
              setIsConnected(false)
            }
          })

        channelRef.current = channel
      } catch (err) {
        console.error('Error setting up subscription:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Connection failed'))
          setIsConnected(false)
        }
      }
    }

    setupSubscription()

    // Cleanup on unmount
    return () => {
      mounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [jobId, autoRefresh])

  // Cleanup on jobId change
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        const supabase = createClient()
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [jobId])

  return {
    job,
    isConnected,
    lastUpdate,
    error,
  }
}

export function useJobListUpdates(): UseJobListUpdatesReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const setupSubscription = async () => {
      try {
        const channel = supabase.channel('pipeline-jobs-changes')

        const subscriptionConfig = {
          event: '*' as const,
          schema: 'public',
          table: 'pipeline_jobs',
        }

        channel
          .on('postgres_changes', subscriptionConfig, (payload) => {
            console.log('Received job list update:', payload)

            if (!mounted) return

            // Update lastUpdate timestamp
            setLastUpdate(new Date())
          })
          .subscribe((status) => {
            console.log('List subscription status:', status)

            if (!mounted) return

            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
            } else {
              setIsConnected(false)
            }
          })

        channelRef.current = channel
      } catch (err) {
        console.error('Error setting up list subscription:', err)
        if (mounted) {
          setIsConnected(false)
        }
      }
    }

    setupSubscription()

    // Cleanup on unmount
    return () => {
      mounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  return {
    isConnected,
    lastUpdate,
  }
}
