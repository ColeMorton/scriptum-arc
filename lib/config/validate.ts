/**
 * Configuration Validation
 *
 * Validates configuration to ensure security and consistency.
 */

import { TEST_CREDENTIALS } from '@/test/config/test-constants'

/**
 * Validates that production environment is not using test credentials.
 * Throws an error if validation fails.
 */
export function validateConfig(): void {
  if (process.env.NODE_ENV === 'production') {
    // Check for test credentials in production
    const prodApiKey = process.env.TRADING_API_KEY
    if (prodApiKey === TEST_CREDENTIALS.TRADING_API_KEY) {
      throw new Error('SECURITY: Production using test Trading API key!')
    }

    const prodRedisPassword = process.env.REDIS_PASSWORD
    if (prodRedisPassword === TEST_CREDENTIALS.REDIS_PASSWORD) {
      throw new Error('SECURITY: Production using test Redis password!')
    }

    const prodSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (prodSupabaseKey === TEST_CREDENTIALS.SUPABASE_ANON_KEY) {
      throw new Error('SECURITY: Production using test Supabase key!')
    }
  }

  // Validate that required environment variables are set in production
  if (process.env.NODE_ENV === 'production') {
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]

    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
  }
}
