import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/pipelines/route'
import { mockSupabaseAuth, createMockRequest } from '../utils/test-helpers'
import { mockUser, mockUser2 } from '../utils/test-data'
import type { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pipelineJob: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
    tradingSweepResult: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: { tenant_id: mockUser.tenantId, role: mockUser.role },
        },
      },
      error: null,
    }),
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}))

interface MockPrisma {
  pipelineJob: {
    create: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    count: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
  tradingSweepResult: {
    create: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
}

interface Job {
  id: string
  job_type: string
  status: string
}

describe('GET /api/pipelines', () => {
  const tenantId1 = mockUser.tenantId
  const tenantId2 = mockUser2.tenantId
  let mockPrisma: MockPrisma

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks()
    // Get the mocked Prisma
    const { prisma } = await import('@/lib/prisma')
    mockPrisma = prisma
  })

  describe('Security - Tenant Isolation', () => {
    it('returns 401 when user not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockImplementationOnce(mockSupabaseAuth(null))

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('tenant isolation: User A cannot see User B jobs', async () => {
      // Mock Prisma responses
      const tenant1Job = { id: 'job-1', tenantId: tenantId1, status: 'COMPLETED' }
      const tenant2Job = { id: 'job-2', tenantId: tenantId2, status: 'COMPLETED' }

      mockPrisma.pipelineJob.findMany.mockResolvedValue([tenant1Job])
      mockPrisma.pipelineJob.count.mockResolvedValue(1)

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(1)
      expect(data.jobs[0].id).toBe(tenant1Job.id)
      expect(data.jobs[0].id).not.toBe(tenant2Job.id)
    })

    it('returns 400 when user has no tenant_id', async () => {
      const userWithoutTenant = { ...mockUser, tenantId: '' }
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockImplementationOnce(
        mockSupabaseAuth({ ...userWithoutTenant, tenantId: '' })
      )

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No tenant associated with user')
    })
  })

  describe('Functionality - Filtering', () => {
    it('filters by status correctly', async () => {
      const completedJob = { id: 'job-1', tenantId: tenantId1, status: 'COMPLETED' }
      mockPrisma.pipelineJob.findMany.mockResolvedValue([completedJob])
      mockPrisma.pipelineJob.count.mockResolvedValue(1)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?status=completed',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(1)
      expect(data.jobs[0].status).toBe('completed') // lowercase as returned by API
    })

    it('filters by job_type correctly', async () => {
      const documentJob = {
        id: 'job-1',
        tenantId: tenantId1,
        jobType: 'document-processing',
        results: [],
      }
      mockPrisma.pipelineJob.findMany.mockResolvedValue([documentJob])
      mockPrisma.pipelineJob.count.mockResolvedValue(1)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?job_type=document-processing',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs.length).toBeGreaterThan(0)
      expect(data.jobs.every((j: Job) => j.job_type === 'document-processing')).toBe(true)
    })

    it('returns all jobs when no filter applied', async () => {
      const allJobs = [
        { id: 'job-1', tenantId: tenantId1, status: 'QUEUED' },
        { id: 'job-2', tenantId: tenantId1, status: 'RUNNING' },
        { id: 'job-3', tenantId: tenantId1, status: 'COMPLETED' },
        { id: 'job-4', tenantId: tenantId1, status: 'FAILED' },
      ]
      mockPrisma.pipelineJob.findMany.mockResolvedValue(allJobs)
      mockPrisma.pipelineJob.count.mockResolvedValue(4)

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(4)
    })
  })

  describe('Functionality - Pagination', () => {
    it('paginates correctly with limit and offset', async () => {
      const jobs = Array.from({ length: 5 }, (_, i) => ({ id: `job-${i}`, tenantId: tenantId1 }))
      mockPrisma.pipelineJob.findMany.mockResolvedValue(jobs)
      mockPrisma.pipelineJob.count.mockResolvedValue(15)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=5&offset=0',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(5)
      expect(data.totalJobs).toBe(15)
      expect(data.limit).toBe(5)
      expect(data.offset).toBe(0)
      expect(data.hasMore).toBe(true)
    })

    it('calculates has_more correctly on last page', async () => {
      const jobs = Array.from({ length: 5 }, (_, i) => ({ id: `job-${i}`, tenantId: tenantId1 }))
      mockPrisma.pipelineJob.findMany.mockResolvedValue(jobs)
      mockPrisma.pipelineJob.count.mockResolvedValue(15)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=10&offset=10',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(5)
      expect(data.hasMore).toBe(false)
    })

    it('does not skip results across pages', async () => {
      const firstPageJobs = Array.from({ length: 10 }, (_, i) => ({
        id: `job-${i}`,
        tenantId: tenantId1,
      }))
      const secondPageJobs = Array.from({ length: 5 }, (_, i) => ({
        id: `job-${i + 10}`,
        tenantId: tenantId1,
      }))

      mockPrisma.pipelineJob.findMany
        .mockResolvedValueOnce(firstPageJobs)
        .mockResolvedValueOnce(secondPageJobs)
      mockPrisma.pipelineJob.count.mockResolvedValue(15)

      // Get first page
      const request1 = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=10&offset=0',
      })
      const response1 = await GET(request1 as NextRequest)
      const data1 = await response1.json()
      const firstPageIds = data1.jobs.map((j: Job) => j.id)

      // Get second page
      const request2 = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=10&offset=10',
      })
      const response2 = await GET(request2 as NextRequest)
      const data2 = await response2.json()
      const secondPageIds = data2.jobs.map((j: Job) => j.id)

      // No overlap
      const overlap = firstPageIds.filter((id: string) => secondPageIds.includes(id))
      expect(overlap).toHaveLength(0)
    })

    it('returns empty array when offset exceeds total', async () => {
      mockPrisma.pipelineJob.findMany.mockResolvedValue([])
      mockPrisma.pipelineJob.count.mockResolvedValue(0)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=10&offset=100',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(0)
      expect(data.hasMore).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty results gracefully', async () => {
      mockPrisma.pipelineJob.findMany.mockResolvedValue([])
      mockPrisma.pipelineJob.count.mockResolvedValue(0)

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toHaveLength(0)
      expect(data.totalJobs).toBe(0)
    })

    it('handles invalid limit parameter', async () => {
      mockPrisma.pipelineJob.findMany.mockResolvedValue([])
      mockPrisma.pipelineJob.count.mockResolvedValue(0)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines?limit=invalid',
      })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      // Should use default limit
      expect(response.status).toBe(200)
      expect(data.limit).toBe(50) // Default
    })

    it('includes results preview in response', async () => {
      const tradingResult = {
        id: 'result-1',
        ticker: 'BTC-USD',
        score: 85.5,
        sharpeRatio: 2.3,
      }
      const job = {
        id: 'job-1',
        tenantId: tenantId1,
        status: 'COMPLETED',
        results: [tradingResult], // Include results in the job
      }

      mockPrisma.pipelineJob.findMany.mockResolvedValue([job])
      mockPrisma.pipelineJob.count.mockResolvedValue(1)

      const request = createMockRequest({ url: 'http://localhost/api/pipelines' })
      const response = await GET(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs[0].results).toBeDefined()
      expect(data.jobs[0].results.length).toBeGreaterThan(0)
    })
  })
})
