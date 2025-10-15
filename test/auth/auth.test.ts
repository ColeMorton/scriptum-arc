import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUser, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Authentication Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should return user data for authenticated user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'ADMIN',
        },
      }

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      const result = await getCurrentUser()

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
        role: 'ADMIN',
      })
      expect(createClient).toHaveBeenCalledTimes(1)
    })

    it('should return null for unauthenticated user', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })

    it('should handle authentication errors', async () => {
      const mockError = new Error('Authentication failed')
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: mockError,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('requireAuth', () => {
    it('should return user for authenticated user with tenant', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'ADMIN',
        },
      }

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      const result = await requireAuth()

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
        role: 'ADMIN',
      })
    })

    it('should throw error for unauthenticated user', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      await expect(requireAuth()).rejects.toThrow('Authentication required')
    })

    it('should return user even without tenant (no tenant validation in requireAuth)', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          // No tenant_id
          role: 'ADMIN',
        },
      }

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      const result = await requireAuth()

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        tenantId: undefined,
        role: 'ADMIN',
      })
    })

    it('should handle Supabase client errors', async () => {
      const mockError = new Error('Supabase connection failed')
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockRejectedValue(mockError),
        },
      }

      vi.mocked(createClient).mockResolvedValue(
        mockSupabaseClient as unknown as ReturnType<typeof createClient>
      )

      await expect(requireAuth()).rejects.toThrow('Supabase connection failed')
    })
  })
})
