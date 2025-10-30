/**
 * Test Configuration Constants
 *
 * Centralized test credentials and service URLs.
 * These values are NEVER used in production.
 */

import { LOCAL_SERVICES, PORTS } from '@/lib/config/constants'

// =============================================================================
// TEST CREDENTIALS (NEVER USE IN PRODUCTION)
// =============================================================================

export const TEST_CREDENTIALS = {
  REDIS_PASSWORD: 'local_dev_password',
  TRADING_API_KEY: 'dev-key-000000000000000000000000',
  TEST_PASSWORD: 'test-password-123',
  SUPABASE_ANON_KEY: 'test-key',
  SUPABASE_SERVICE_KEY: 'test-service-key',
} as const

// =============================================================================
// TEST SERVICE URLs
// =============================================================================

export const TEST_SERVICES = {
  ...LOCAL_SERVICES,
} as const

// Export PORTS for test convenience
export { PORTS }

// =============================================================================
// TEST DATA CONSTANTS
// =============================================================================

export const TEST_SUPABASE_URL = 'https://test.supabase.co'

// =============================================================================
// TEST DATABASE CONFIG
// =============================================================================

export const TEST_DB_CONFIG = {
  WEBHOOK_RECEIVER_URL: TEST_SERVICES.WEBHOOK_RECEIVER,
  TRADING_API_URL: TEST_SERVICES.TRADING_API,
  LOCALSTACK_URL: TEST_SERVICES.LOCALSTACK,
  REDIS_PASSWORD: TEST_CREDENTIALS.REDIS_PASSWORD,
  TRADING_API_KEY: TEST_CREDENTIALS.TRADING_API_KEY,
} as const
