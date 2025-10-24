import { vi } from 'vitest'

// Auth helpers
export interface TestUser {
  id: string
  email: string
  tenantId: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

export function mockSupabaseAuth(user: TestUser | null = null) {
  return vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: user
            ? {
                id: user.id,
                email: user.email,
                user_metadata: { tenant_id: user.tenantId, role: user.role },
              }
            : null,
        },
        error: user ? null : new Error('Not authenticated'),
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ error: null }),
    })),
  }))
}

export function createTestUser(overrides?: Partial<TestUser>): TestUser {
  return {
    id: `user-${Math.random().toString(36).substring(7)}`,
    email: `test-${Math.random().toString(36).substring(7)}@example.com`,
    tenantId: `tenant-${Math.random().toString(36).substring(7)}`,
    role: 'ADMIN',
    ...overrides,
  }
}

// Mock WebSocket
export function mockWebSocket() {
  return {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn((callback) => {
        if (typeof callback === 'function') {
          callback('SUBSCRIBED')
        }
        return {
          unsubscribe: vi.fn(),
        }
      }),
    })),
    removeChannel: vi.fn(),
  }
}

// HTTP test helpers
export function createMockRequest(options: {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: unknown
}) {
  const { url, method = 'GET', headers = {}, body } = options

  return {
    url,
    method,
    headers: new Headers(headers),
    nextUrl: {
      searchParams: new URLSearchParams(url.split('?')[1] || ''),
    },
    json: async () => body,
  }
}

export function createMockResponse() {
  return {
    json: vi.fn((data) => ({
      status: 200,
      json: async () => data,
    })),
  }
}
