import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Only export onRequestError if Sentry is configured
export const onRequestError = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? Sentry.captureRequestError
  : undefined
