import { createClient } from '@/lib/supabase/client'

export interface RealtimeEvent {
  type:
    | 'financial_update'
    | 'lead_update'
    | 'metric_update'
    | 'sync_status_update'
    | 'workflow_status_update'
  tenantId: string
  data: unknown
  timestamp: string
}

export interface WebSocketClient {
  connect: () => Promise<void>
  disconnect: () => void
  subscribe: (eventType: RealtimeEvent['type'], callback: (event: RealtimeEvent) => void) => void
  unsubscribe: (eventType: RealtimeEvent['type']) => void
  isConnected: () => boolean
}

class SupabaseWebSocketClient implements WebSocketClient {
  private supabase = createClient()
  private subscriptions: Map<string, unknown> = new Map()
  private connected = false

  async connect(): Promise<void> {
    try {
      // Test connection
      const { error } = await this.supabase.from('_prisma_migrations').select('*').limit(1)

      if (error) {
        throw new Error(`Supabase connection failed: ${error.message}`)
      }

      this.connected = true
      console.log('WebSocket client connected to Supabase real-time')
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.connected = false
      throw error
    }
  }

  disconnect(): void {
    // Unsubscribe from all channels
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
    this.subscriptions.clear()
    this.connected = false
    console.log('WebSocket client disconnected')
  }

  subscribe(eventType: RealtimeEvent['type'], callback: (event: RealtimeEvent) => void): void {
    if (!this.connected) {
      console.warn('WebSocket client not connected. Call connect() first.')
      return
    }

    // Map event types to database tables
    const tableMap: Record<RealtimeEvent['type'], string> = {
      financial_update: 'financials',
      lead_update: 'lead_events',
      metric_update: 'custom_metrics',
      sync_status_update: 'data_sync_status',
      workflow_status_update: 'workflow_metadata',
    }

    const table = tableMap[eventType]
    if (!table) {
      console.error(`Unknown event type: ${eventType}`)
      return
    }

    // Subscribe to real-time changes
    const subscription = this.supabase
      .channel(`${eventType}_channel`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`Real-time ${eventType} event:`, payload)

          // Transform payload to RealtimeEvent format
          const event: RealtimeEvent = {
            type: eventType,
            tenantId:
              (payload.new as { tenantId?: string })?.tenantId ||
              (payload.old as { tenantId?: string })?.tenantId ||
              '',
            data: payload.new || payload.old,
            timestamp: new Date().toISOString(),
          }

          callback(event)
        }
      )
      .subscribe()

    this.subscriptions.set(eventType, subscription)
    console.log(`Subscribed to ${eventType} events`)
  }

  unsubscribe(eventType: RealtimeEvent['type']): void {
    const subscription = this.subscriptions.get(eventType)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(eventType)
      console.log(`Unsubscribed from ${eventType} events`)
    }
  }

  isConnected(): boolean {
    return this.connected
  }
}

// Singleton instance
let websocketClient: WebSocketClient | null = null

export function getWebSocketClient(): WebSocketClient {
  if (!websocketClient) {
    websocketClient = new SupabaseWebSocketClient()
  }
  return websocketClient
}

// React hook for using WebSocket client
export function useWebSocket() {
  const client = getWebSocketClient()

  const connect = async () => {
    try {
      await client.connect()
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  const disconnect = () => {
    client.disconnect()
  }

  const subscribe = (
    eventType: RealtimeEvent['type'],
    callback: (event: RealtimeEvent) => void
  ) => {
    client.subscribe(eventType, callback)
  }

  const unsubscribe = (eventType: RealtimeEvent['type']) => {
    client.unsubscribe(eventType)
  }

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected: client.isConnected,
  }
}

// Utility functions for common real-time patterns
export const RealtimeUtils = {
  // Subscribe to financial data updates
  subscribeToFinancials: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    client.subscribe('financial_update', callback)
  },

  // Subscribe to lead pipeline updates
  subscribeToLeads: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    client.subscribe('lead_update', callback)
  },

  // Subscribe to custom metrics updates
  subscribeToMetrics: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    client.subscribe('metric_update', callback)
  },

  // Subscribe to sync status updates
  subscribeToSyncStatus: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    client.subscribe('sync_status_update', callback)
  },

  // Subscribe to workflow status updates
  subscribeToWorkflowStatus: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    client.subscribe('workflow_status_update', callback)
  },

  // Subscribe to all business data updates
  subscribeToAll: (callback: (event: RealtimeEvent) => void) => {
    const client = getWebSocketClient()
    const eventTypes: RealtimeEvent['type'][] = [
      'financial_update',
      'lead_update',
      'metric_update',
      'sync_status_update',
      'workflow_status_update',
    ]

    eventTypes.forEach((eventType) => {
      client.subscribe(eventType, callback)
    })
  },
}
