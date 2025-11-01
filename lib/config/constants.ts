/**
 * Centralized Configuration Constants
 *
 * Single source of truth for all service ports, URLs, and endpoints.
 * This eliminates magic strings scattered throughout the codebase.
 */

// =============================================================================
// SERVICE PORTS
// =============================================================================

export const PORTS = {
  NEXT_APP: 3000,
  GRAFANA: 3001,
  WEBHOOK_RECEIVER: 3002,
  LOCALSTACK: 4566,
  POSTGRES: 5432,
  REDIS: 6379,
  TRADING_API: 8000,
  PROMETHEUS: 9090,
} as const

// =============================================================================
// SERVICE URLs (Localhost - Local Development)
// =============================================================================

export const LOCAL_SERVICES = {
  NEXT_APP: `http://localhost:${PORTS.NEXT_APP}`,
  GRAFANA: `http://localhost:${PORTS.GRAFANA}`,
  WEBHOOK_RECEIVER: `http://localhost:${PORTS.WEBHOOK_RECEIVER}`,
  LOCALSTACK: `http://localhost:${PORTS.LOCALSTACK}`,
  TRADING_API: `http://localhost:${PORTS.TRADING_API}`,
  PROMETHEUS: `http://localhost:${PORTS.PROMETHEUS}`,
} as const

// =============================================================================
// CONTAINER NETWORK URLs (Inter-Service Communication)
// =============================================================================

export const CONTAINER_SERVICES = {
  REDIS: `redis://redis:${PORTS.REDIS}`,
  LOCALSTACK: `http://localstack:${PORTS.LOCALSTACK}`,
  TRADING_API: `http://trading-api:${PORTS.TRADING_API}`,
  WEBHOOK_RECEIVER: 'http://webhook-receiver:3000', // Internal container port
  POSTGRES: `postgresql://trading_user:PASSWORD@postgres:${PORTS.POSTGRES}/trading_db`,
} as const

// =============================================================================
// HEALTH CHECK ENDPOINTS
// =============================================================================

export const HEALTH_ENDPOINTS = {
  WEBHOOK_RECEIVER: '/health',
  TRADING_API: '/health/',
  LOCALSTACK: '/_localstack/health',
  PROMETHEUS: '/-/healthy',
  GRAFANA: '/api/health',
} as const

// =============================================================================
// API ENDPOINTS
// =============================================================================

export const API_ENDPOINTS = {
  PIPELINES: '/api/pipelines',
  PIPELINES_RESULTS: (id: string) => `/api/pipelines/${id}/results`,
  PIPELINES_DETAIL: (id: string) => `/api/pipelines/${id}`,
  HEALTH: '/api/health',
  WEBHOOK_TRADING_SWEEP: '/webhook/trading-sweep',
  TRADING_SWEEP: '/api/v1/strategy/sweep',
  TRADING_JOBS: '/api/v1/jobs',
} as const
