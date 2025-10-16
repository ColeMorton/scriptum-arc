'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWebSocket, RealtimeEvent } from '@/lib/websocket-client'
import { StatCard } from '@/components/animated/stat-card'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { TrendingUp, DollarSign, Users, Activity, AlertCircle } from 'lucide-react'

interface DashboardData {
  financials: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    profitMargin: number
    revenueGrowth: number
    dailyData: Array<{
      date: string
      revenue: number
      expenses: number
      netProfit: number
      cashFlow: number
    }>
  }
  pipeline: {
    activeLeads: number
    totalPipelineValue: number
    closedWonValue: number
    stageBreakdown: Array<{
      stage: string
      status: string
      count: number
      value: number
    }>
  }
  metrics: Array<{
    name: string
    average: number
    max: number
    min: number
  }>
  lastUpdated: string
}

interface SyncStatus {
  syncHealth: number
  totalDataSources: number
  successfulSyncs: number
  failedSyncs: number
  pendingSyncs: number
  dataSources: Array<{
    dataSource: string
    lastSyncAt: string
    status: string
    isHealthy: boolean
  }>
}

export default function RealtimeDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting'
  >('disconnected')

  const { connect, disconnect, subscribe, unsubscribe } = useWebSocket()

  // Fetch initial dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboards')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')

      const data = await response.json()
      setDashboardData(data.dashboard)
      setLastUpdate(data.dashboard.lastUpdated)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch sync status
  const fetchSyncStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/sync-status')
      if (!response.ok) throw new Error('Failed to fetch sync status')

      const data = await response.json()
      setSyncStatus(data.syncStatus)
    } catch (error) {
      console.error('Error fetching sync status:', error)
    }
  }, [])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(
    (event: RealtimeEvent) => {
      console.log('Real-time update received:', event)

      // Update last update timestamp
      setLastUpdate(new Date().toISOString())

      // Refresh dashboard data when financial or lead data changes
      if (
        event.type === 'financial_update' ||
        event.type === 'lead_update' ||
        event.type === 'metric_update'
      ) {
        fetchDashboardData()
      }

      // Refresh sync status when sync or workflow status changes
      if (event.type === 'sync_status_update' || event.type === 'workflow_status_update') {
        fetchSyncStatus()
      }
    },
    [fetchDashboardData, fetchSyncStatus]
  )

  // Initialize WebSocket connection and data fetching
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setConnectionStatus('connecting')
        await connect()
        setConnectionStatus('connected')

        // Fetch initial data
        await Promise.all([fetchDashboardData(), fetchSyncStatus()])

        // Subscribe to real-time updates
        subscribe('financial_update', handleRealtimeUpdate)
        subscribe('lead_update', handleRealtimeUpdate)
        subscribe('metric_update', handleRealtimeUpdate)
        subscribe('sync_status_update', handleRealtimeUpdate)
        subscribe('workflow_status_update', handleRealtimeUpdate)
      } catch (error) {
        console.error('Failed to initialize dashboard:', error)
        setConnectionStatus('disconnected')
      }
    }

    initializeDashboard()

    // Cleanup on unmount
    return () => {
      unsubscribe('financial_update')
      unsubscribe('lead_update')
      unsubscribe('metric_update')
      unsubscribe('sync_status_update')
      unsubscribe('workflow_status_update')
      disconnect()
    }
  }, [
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    fetchDashboardData,
    fetchSyncStatus,
    handleRealtimeUpdate,
  ])

  // Connection status indicator
  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected'
            ? 'bg-green-500'
            : connectionStatus === 'connecting'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      />
      <span className="text-gray-600">
        {connectionStatus === 'connected'
          ? 'Live'
          : connectionStatus === 'connecting'
            ? 'Connecting...'
            : 'Disconnected'}
      </span>
      {lastUpdate && (
        <span className="text-gray-500">• Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
        <p className="text-gray-600">Please check your connection and try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time insights powered by n8n automation</p>
        </div>
        <ConnectionIndicator />
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          value={`$${dashboardData.financials.totalRevenue.toLocaleString()}`}
          description="Total Revenue (Last 30 days)"
          iconColor="text-green-500"
        />
        <StatCard
          icon={TrendingUp}
          value={`$${dashboardData.financials.netProfit.toLocaleString()}`}
          description={`Net Profit (${dashboardData.financials.profitMargin.toFixed(1)}% margin)`}
          iconColor="text-blue-500"
        />
        <StatCard
          icon={Users}
          value={dashboardData.pipeline.activeLeads.toString()}
          description="Active Leads in Pipeline"
          iconColor="text-purple-500"
        />
        <StatCard
          icon={Activity}
          value={`$${dashboardData.pipeline.totalPipelineValue.toLocaleString()}`}
          description="Total Pipeline Value"
          iconColor="text-orange-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <RevenueChart
          data={dashboardData.financials.dailyData.map((d) => ({
            month: new Date(d.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }),
            revenue: d.revenue,
            expenses: d.expenses,
            profit: d.netProfit,
          }))}
        />
      </div>

      {/* Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
          <div className="space-y-3">
            {dashboardData.pipeline.stageBreakdown.map((stage, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{stage.stage}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{stage.count} leads</span>
                  <span className="font-semibold">${stage.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Status */}
        {syncStatus && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sync Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overall Health</span>
                <span
                  className={`font-semibold ${
                    syncStatus.syncHealth >= 90
                      ? 'text-green-600'
                      : syncStatus.syncHealth >= 70
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {syncStatus.syncHealth}%
                </span>
              </div>
              {syncStatus.dataSources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{source.dataSource}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        source.isHealthy ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm text-gray-500">
                      {new Date(source.lastSyncAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Metrics */}
      {dashboardData.metrics.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.metrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{metric.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-semibold">{metric.average.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-semibold">{metric.max.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-semibold">{metric.min.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
