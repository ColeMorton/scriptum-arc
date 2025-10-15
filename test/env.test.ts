import { describe, it, expect } from 'vitest'

describe('Test Environment Configuration', () => {
  it('should have required environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeTruthy()
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeTruthy()
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy()
  })

  it('should have test-specific Supabase configuration', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe('test-key')
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe('test-service-key')
  })
})
