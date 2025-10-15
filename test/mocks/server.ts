import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock Supabase API responses
export const server = setupServer(
  // Mock Supabase Auth endpoints
  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'mock-tenant-id',
          role: 'ADMIN',
        },
      },
    })
  }),

  // Mock Supabase REST API
  http.get('https://test.supabase.co/rest/v1/tenants', () => {
    return HttpResponse.json([
      {
        id: 'mock-tenant-id',
        name: 'Test Tenant',
        industry: 'Technology',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ])
  }),

  // Mock health check endpoint
  http.get('http://localhost:3000/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      message: 'Supabase connected successfully',
      timestamp: new Date().toISOString(),
      supabase: {
        url: 'https://test.supabase.co',
        hasConnection: true,
      },
    })
  })
)
