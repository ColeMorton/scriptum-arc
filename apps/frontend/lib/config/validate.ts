/**
 * Configuration Validation
 *
 * Validates configuration to ensure security and consistency.
 */

/**
 * Validates that production environment has required environment variables.
 * Throws an error if validation fails.
 */
export function validateConfig(): void {
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

    // Check for obviously insecure or test values
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseKey && (supabaseKey.includes('test') || supabaseKey.includes('example'))) {
      throw new Error('SECURITY: Production appears to be using test credentials!')
    }
  }
}
