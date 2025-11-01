/**
 * Shared test utilities and types
 */

import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export type Color = 'reset' | 'bright' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan'

export const colors: Record<Color, string> = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

export type TestStatus = 'PASS' | 'FAIL' | 'WARN'

export interface HTTPResponse {
  status: number
  ok: boolean
  data?: string
  headers?: Headers
  error?: string
}

export interface SpawnResult {
  code: number | null
  output: string
}

export function log(message: string, color: Color = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

export function logSection(title: string): void {
  log(`\n${'='.repeat(80)}`, 'cyan')
  log(`  ${title}`, 'bright')
  log(`${'='.repeat(80)}`, 'cyan')
}

export function logTest(testName: string, status: TestStatus, details: string = ''): void {
  const statusColor: Color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow'
  const statusSymbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
  log(`${statusSymbol} ${testName}: ${status}`, statusColor)
  if (details) {
    log(`   ${details}`, 'reset')
  }
}

export async function makeRequest(
  url: string,
  options: Record<string, unknown> = {}
): Promise<HTTPResponse> {
  const fetch = (await import('node-fetch')).default
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
    } as never)
    const data = await response.text()
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers as unknown as Headers,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      status: 0,
      ok: false,
      error: errorMessage,
    }
  }
}

/**
 * Creates a mock Next.js request object for testing
 */
export function createMockRequest(options: {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: unknown
}): NextRequest {
  const url = new URL(options.url)
  const headers = new Headers(options.headers || {})

  // Create a request with body if provided
  const requestOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  }

  if (options.body) {
    requestOptions.body = JSON.stringify(options.body)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const request = new Request(url.toString(), requestOptions)

  // Create a NextRequest-like object with json method
  const nextRequest = {
    ...request,
    nextUrl: url,
    method: options.method || 'GET',
    headers,
    url: url.toString(),
    async json() {
      return options.body
    },
  }

  return nextRequest as NextRequest
}

/**
 * Creates a mock Supabase auth client factory for testing
 */
export function mockSupabaseAuth(
  user: {
    id?: string
    email?: string
    tenantId?: string
    role?: string
  } | null
) {
  const mockAuth = {
    getUser: async () => {
      if (!user) {
        return {
          data: { user: null },
          error: { message: 'Not authenticated', status: 401 },
        }
      }

      // Handle empty tenantId as no tenant_id in metadata
      const userMetadata: Record<string, unknown> = {
        role: user.role || 'ADMIN',
      }

      // Only add tenant_id if tenantId is provided and not empty
      if (user.tenantId && user.tenantId !== '') {
        userMetadata.tenant_id = user.tenantId
      }

      return {
        data: {
          user: {
            id: user.id || 'test-user-id',
            email: user.email || 'test@example.com',
            user_metadata: userMetadata,
          },
        },
        error: null,
      }
    },
  }

  return () =>
    ({
      auth: mockAuth,
    }) as unknown as SupabaseClient
}
