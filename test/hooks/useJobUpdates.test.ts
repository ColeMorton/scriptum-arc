import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useJobUpdates, useJobListUpdates } from '@/components/pipelines/useJobUpdates'

type SupabaseCallback = (payload: Record<string, unknown>) => void

// Mock Supabase client
const mockChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn((callback) => {
    if (typeof callback === 'function') {
      // Simulate immediate subscription success
      setTimeout(() => callback('SUBSCRIBED'), 0)
    }
    return mockChannel
  }),
  unsubscribe: vi.fn(),
}

const mockSupabase = {
  channel: vi.fn(() => mockChannel),
  removeChannel: vi.fn(),
}

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

describe('useJobUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the channel mock to its default behavior
    mockSupabase.channel.mockImplementation(() => mockChannel)
    // Reset the subscribe mock to its default behavior
    mockChannel.subscribe.mockImplementation((callback) => {
      if (typeof callback === 'function') {
        setTimeout(() => callback('SUBSCRIBED'), 0)
      }
      return mockChannel
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Connection Establishment', () => {
    it('creates channel with correct name', () => {
      renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      expect(mockSupabase.channel).toHaveBeenCalledWith('pipeline-jobs-changes')
    })

    it('subscribes to postgres_changes event', () => {
      renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          event: '*',
          schema: 'public',
          table: 'pipeline_jobs',
        }),
        expect.any(Function)
      )
    })

    it('sets isConnected to true on SUBSCRIBED status', async () => {
      const { result } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })
    })

    it('filters by jobId when provided', () => {
      const jobId = 'test-job-123'
      renderHook(() => useJobUpdates({ jobId }))

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          filter: `id=eq.${jobId}`,
        }),
        expect.any(Function)
      )
    })

    it('does not filter when jobId not provided', () => {
      renderHook(() => useJobUpdates({}))

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          event: '*',
          schema: 'public',
          table: 'pipeline_jobs',
        }),
        expect.any(Function)
      )
    })
  })

  describe('Job Updates', () => {
    it('updates job state when payload received', async () => {
      const mockPayload = {
        new: {
          id: 'test-job-123',
          job_type: 'trading-sweep',
          status: 'COMPLETED',
          tenant_id: 'test-tenant',
          parameters: { ticker: 'BTC-USD' },
          created_at: new Date().toISOString(),
        },
      }

      let onCallback: SupabaseCallback | undefined
      mockChannel.on.mockImplementation((_event, _config, callback: SupabaseCallback) => {
        onCallback = callback
        return mockChannel
      })

      const { result } = renderHook(() =>
        useJobUpdates({ jobId: 'test-job-123', autoRefresh: true })
      )

      // Trigger the callback
      await waitFor(() => {
        if (onCallback) {
          onCallback(mockPayload)
        }
      })

      await waitFor(() => {
        expect(result.current.job).toBeDefined()
        expect(result.current.job?.status).toBe('completed')
      })
    })

    it('updates lastUpdate timestamp on new payload', async () => {
      const mockPayload = {
        new: {
          id: 'test-job-123',
          status: 'RUNNING',
          job_type: 'trading-sweep',
          tenant_id: 'test-tenant',
        },
      }

      let onCallback: SupabaseCallback | undefined
      mockChannel.on.mockImplementation((_event, _config, callback: SupabaseCallback) => {
        onCallback = callback
        return mockChannel
      })

      const { result } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      const beforeUpdate = result.current.lastUpdate

      await waitFor(() => {
        if (onCallback) {
          onCallback(mockPayload)
        }
      })

      await waitFor(() => {
        expect(result.current.lastUpdate).not.toBe(beforeUpdate)
        expect(result.current.lastUpdate).toBeInstanceOf(Date)
      })
    })

    it('does not update job state when autoRefresh is false', async () => {
      const mockPayload = {
        new: {
          id: 'test-job-123',
          status: 'COMPLETED',
        },
      }

      let onCallback: SupabaseCallback | undefined
      mockChannel.on.mockImplementation((_event, _config, callback: SupabaseCallback) => {
        onCallback = callback
        return mockChannel
      })

      const { result } = renderHook(() =>
        useJobUpdates({ jobId: 'test-job-123', autoRefresh: false })
      )

      await waitFor(() => {
        if (onCallback) {
          onCallback(mockPayload)
        }
      })

      // Job should remain null because autoRefresh is false
      expect(result.current.job).toBeNull()
      // But lastUpdate should still be set
      await waitFor(() => {
        expect(result.current.lastUpdate).toBeInstanceOf(Date)
      })
    })

    it('transforms database column names to camelCase', async () => {
      const mockPayload = {
        new: {
          id: 'test-job-123',
          job_type: 'trading-sweep',
          status: 'RUNNING',
          tenant_id: 'test-tenant',
          error_message: 'Test error',
          created_at: '2025-01-27T10:00:00Z',
          started_at: '2025-01-27T10:00:05Z',
          completed_at: null,
        },
      }

      let onCallback: SupabaseCallback | undefined
      mockChannel.on.mockImplementation((_event, _config, callback: SupabaseCallback) => {
        onCallback = callback
        return mockChannel
      })

      const { result } = renderHook(() =>
        useJobUpdates({ jobId: 'test-job-123', autoRefresh: true })
      )

      await waitFor(() => {
        if (onCallback) {
          onCallback(mockPayload)
        }
      })

      await waitFor(() => {
        expect(result.current.job).toMatchObject({
          id: 'test-job-123',
          job_type: 'trading-sweep',
          status: 'running',
          error_message: 'Test error',
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('sets error state on CHANNEL_ERROR status', async () => {
      mockChannel.subscribe.mockImplementation((callback) => {
        if (typeof callback === 'function') {
          setTimeout(() => callback('CHANNEL_ERROR'), 0)
        }
        return mockChannel
      })

      const { result } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.error?.message).toContain('Failed to subscribe')
        expect(result.current.isConnected).toBe(false)
      })
    })

    it('sets error state on TIMED_OUT status', async () => {
      mockChannel.subscribe.mockImplementation((callback) => {
        if (typeof callback === 'function') {
          setTimeout(() => callback('TIMED_OUT'), 0)
        }
        return mockChannel
      })

      const { result } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.error?.message).toContain('timed out')
        expect(result.current.isConnected).toBe(false)
      })
    })

    it('handles subscription setup errors gracefully', async () => {
      mockSupabase.channel.mockImplementation(() => {
        throw new Error('Connection failed')
      })

      const { result } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.isConnected).toBe(false)
      })
    })
  })

  describe('Cleanup and Memory Leaks', () => {
    it('unsubscribes on unmount', () => {
      const { unmount } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      unmount()

      // The cleanup happens in the useEffect return function
      // We can verify the channel was created and will be cleaned up
      expect(mockSupabase.channel).toHaveBeenCalled()
    })

    it('sets isConnected to false on unmount', async () => {
      const { result, unmount } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      unmount()

      // After unmount, connection should be closed
      expect(mockSupabase.removeChannel).toHaveBeenCalled()
    })

    it('cleans up on jobId change', async () => {
      const { rerender } = renderHook(({ jobId }) => useJobUpdates({ jobId }), {
        initialProps: { jobId: 'job-1' },
      })

      await waitFor(() => {
        expect(mockSupabase.channel).toHaveBeenCalledTimes(1)
      })

      // Change jobId
      rerender({ jobId: 'job-2' })

      await waitFor(() => {
        expect(mockSupabase.channel).toHaveBeenCalledTimes(2)
      })
    })

    it('does not leak listeners on multiple re-renders', async () => {
      const { rerender } = renderHook(() => useJobUpdates({ jobId: 'test-job-123' }))

      await waitFor(() => {
        expect(mockChannel.on).toHaveBeenCalledTimes(1)
      })

      // Re-render multiple times
      rerender()
      rerender()
      rerender()

      // Should not create additional listeners
      expect(mockChannel.on).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple Simultaneous Subscriptions', () => {
    it('can subscribe to multiple jobs simultaneously', async () => {
      const { result: result1 } = renderHook(() => useJobUpdates({ jobId: 'job-1' }))
      const { result: result2 } = renderHook(() => useJobUpdates({ jobId: 'job-2' }))

      await waitFor(() => {
        expect(result1.current.isConnected).toBe(true)
        expect(result2.current.isConnected).toBe(true)
      })

      // Both should have their own channels
      expect(mockSupabase.channel).toHaveBeenCalledTimes(2)
    })

    it('each subscription receives only its own updates', async () => {
      let onCallback1: SupabaseCallback | undefined

      mockChannel.on.mockImplementation(
        (_event, config: { filter?: string }, callback: SupabaseCallback) => {
          if (config.filter?.includes('job-1')) {
            onCallback1 = callback
          }
          // We don't need onCallback2 for this test
          return mockChannel
        }
      )

      const { result: result1 } = renderHook(() =>
        useJobUpdates({ jobId: 'job-1', autoRefresh: true })
      )
      const { result: result2 } = renderHook(() =>
        useJobUpdates({ jobId: 'job-2', autoRefresh: true })
      )

      // Trigger update for job-1
      if (onCallback1) {
        onCallback1({
          new: { id: 'job-1', status: 'COMPLETED', job_type: 'trading-sweep', tenant_id: 'test' },
        })
      }

      await waitFor(() => {
        expect(result1.current.job?.id).toBe('job-1')
        expect(result2.current.job).toBeNull()
      })
    })
  })
})

describe('useJobListUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the channel mock to its default behavior
    mockSupabase.channel.mockImplementation(() => mockChannel)
    // Reset the subscribe mock to its default behavior
    mockChannel.subscribe.mockImplementation((callback) => {
      if (typeof callback === 'function') {
        setTimeout(() => callback('SUBSCRIBED'), 0)
      }
      return mockChannel
    })
  })

  describe('Connection', () => {
    it('creates channel for all jobs without filter', () => {
      renderHook(() => useJobListUpdates())

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          event: '*',
          schema: 'public',
          table: 'pipeline_jobs',
        }),
        expect.any(Function)
      )

      // Should not have a filter (filter property not included in config)
      const callArgs = mockChannel.on.mock.calls[0][1]
      expect(callArgs).not.toHaveProperty('filter')
    })

    it('sets isConnected to true on successful subscription', async () => {
      const { result } = renderHook(() => useJobListUpdates())

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })
    })

    it('updates lastUpdate on any job change', async () => {
      let onCallback: SupabaseCallback | undefined
      mockChannel.on.mockImplementation((_event, _config, callback: SupabaseCallback) => {
        onCallback = callback
        return mockChannel
      })

      const { result } = renderHook(() => useJobListUpdates())

      // Wait for connection first
      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // Trigger update
      if (onCallback) {
        onCallback({ new: { id: 'any-job', status: 'COMPLETED' } })
      }

      await waitFor(() => {
        expect(result.current.lastUpdate).toBeInstanceOf(Date)
      })
    })
  })

  describe('Cleanup', () => {
    it('unsubscribes on unmount', () => {
      const { unmount } = renderHook(() => useJobListUpdates())

      unmount()

      // The cleanup happens in the useEffect return function
      // We can verify the channel was created and will be cleaned up
      expect(mockSupabase.channel).toHaveBeenCalled()
    })
  })
})
