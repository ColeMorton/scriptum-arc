import { z } from 'zod'

/**
 * Environment variable validation schema
 * Validates all required environment variables at startup
 * Provides type safety for environment access
 */
const envSchema = z.object({
  // =============================================================================
  // 1. APPLICATION CONFIGURATION
  // =============================================================================
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_pipeline_URL: z.string().url().default('http://localhost:5678'),

  // =============================================================================
  // 2. SUPABASE CONFIGURATION (Required)
  // =============================================================================
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(100, 'Supabase anon key must be at least 100 characters'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(100, 'Supabase service role key must be at least 100 characters'),
  SUPABASE_API_SECRET_KEY: z.string().optional(),
  SUPABASE_PROJECT_ID: z.string().optional(),

  // =============================================================================
  // 3. DATABASE CONFIGURATION (Required)
  // =============================================================================
  DATABASE_URL: z.string().url('Database URL must be a valid URL'),
  DIRECT_URL: z.string().url('Direct database URL must be a valid URL'),
  POSTGRES_PASSWORD: z.string().default('changeme'),
  TRADING_DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://trading_user:changeme@postgres:5432/trading_db'),

  // =============================================================================
  // 4. TRADING API CONFIGURATION
  // =============================================================================
  TRADING_API_URL: z.string().url().default('http://trading-api:8000'),
  TRADING_API_KEY: z.string().default('dev-key-000000000000000000000000'),
  API_KEY_SECRET: z.string().default('dev-secret-key-change-in-production'),
  ENVIRONMENT: z.string().default('development'),
  DEBUG: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // =============================================================================
  // 5. AWS / LOCALSTACK CONFIGURATION
  // =============================================================================
  AWS_ENDPOINT_URL: z.string().url().default('http://localstack:4566'),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().default('test'),
  AWS_SECRET_ACCESS_KEY: z.string().default('test'),

  // SQS Configuration
  SQS_QUEUE_URL: z.string().url().default('http://localstack:4566/000000000000/trading-sweep-jobs'),
  NOTIFICATIONS_QUEUE_URL: z
    .string()
    .url()
    .default('http://localstack:4566/000000000000/notifications'),

  // S3 Configuration
  S3_BUCKET_NAME: z.string().default('zixly-pipeline-data'),
  TRADING_RESULTS_BUCKET: z.string().default('trading-results'),

  // AWS Secrets Manager
  TRADING_API_SECRET_NAME: z.string().default('trading-api-credentials'),
  SMTP_SECRET_NAME: z.string().default('smtp-credentials'),
  ZIXLY_DATABASE_SECRET_NAME: z.string().default('zixly-database-credentials'),

  // =============================================================================
  // 6. EMAIL / SMTP CONFIGURATION
  // =============================================================================
  SMTP_HOST: z.string().default('smtp-mail.outlook.com'),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().default('noreply@zixly.com.au'),

  // Email Recipients
  NOTIFICATION_EMAIL: z.string().email().default('cole.morton@hotmail.com'),
  ZIXLY_EMAIL: z.string().email().optional(),
  ZIXLY_FIRST_NAME: z.string().optional(),
  ZIXLY_LAST_NAME: z.string().optional(),
  ZIXLY_EMAIL_PASSWORD: z.string().optional(),

  // =============================================================================
  // 7. MONITORING CONFIGURATION
  // =============================================================================
  GRAFANA_ADMIN_PASSWORD: z.string().default('admin'),

  // =============================================================================
  // 8. EXTERNAL INTEGRATIONS
  // =============================================================================
  // pipeline Configuration
  pipeline_BASIC_AUTH_USER: z.string().default('admin'),
  pipeline_BASIC_AUTH_PASSWORD: z.string().default('zixly2025'),
  PIPELINE_BASIC_AUTH_ACTIVE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // Plane Configuration
  PLANE_API_KEY: z.string().optional(),
  PLANE_SECRET_KEY: z.string().optional(),

  // Nextcloud Configuration
  NEXTCLOUD_ADMIN_PASSWORD: z.string().optional(),

  // Xero Integration
  XERO_CLIENT_ID: z.string().optional(),
  XERO_CLIENT_SECRET: z.string().optional(),

  // =============================================================================
  // 9. SENTRY CONFIGURATION (Optional)
  // =============================================================================
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // =============================================================================
  // 10. DEVELOPMENT CONFIGURATION
  // =============================================================================
  // Redis Configuration
  REDIS_URL: z.string().url().default('redis://redis:6379/1'),
  REDIS_PASSWORD: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Worker Configuration
  WORKER_CONCURRENCY: z.string().default('2').transform(Number),

  // Frontend Configuration (React App)
  VITE_API_URL: z.string().url().default('http://localhost:8000'),
  VITE_GRAPHQL_URL: z.string().url().default('http://localhost:8000/graphql'),
})

/**
 * Validated environment variables
 * Throws error at startup if validation fails
 */
export const env = envSchema.parse(process.env)

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === 'test'

/**
 * Get required environment variables for startup
 */
export const getRequiredEnvVars = () => {
  const required = [
    // Supabase Configuration (Required)
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',

    // Database Configuration (Required)
    'DATABASE_URL',
    'DIRECT_URL',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.\n' +
        'Note: All other variables have sensible defaults for development.'
    )
  }
}

/**
 * Validate environment on module load
 */
if (typeof window === 'undefined') {
  // Only validate on server side
  getRequiredEnvVars()
}
