import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/pipelines/route'
import { mockSupabaseAuth, createMockRequest } from '../utils/test-helpers'
import { mockUser } from '../utils/test-data'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pipelineJob: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
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
    findFirst: ReturnType<typeof vi.fn>
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

describe('POST /api/pipelines', () => {
  const tenantId = mockUser.tenantId
  let mockPrisma: MockPrisma

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks()
    // Get the mocked Prisma
    const { prisma } = await import('@/lib/prisma')
    mockPrisma = prisma
  })

  describe('Security', () => {
    it('returns 401 when user not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockImplementationOnce(mockSupabaseAuth(null))

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
          config: {},
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('job created with correct tenant_id from user metadata, not request body', async () => {
      const createdJob = { id: 'job-123', tenantId: mockUser.tenantId, jobType: 'trading-sweep' }
      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)

      const maliciousBody = {
        job_type: 'trading-sweep',
        ticker: 'BTC-USD',
        tenant_id: 'malicious-tenant-id', // Attempting to set wrong tenant
        config: {},
      }

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: maliciousBody,
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.id).toBeDefined()

      // Verify job was created with CORRECT tenant_id
      expect(mockPrisma.pipelineJob.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenantId: mockUser.tenantId,
        }),
      })
    })

    it('returns 400 when user has no tenant_id', async () => {
      const userWithoutTenant = { ...mockUser, tenantId: '' }
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockImplementationOnce(
        mockSupabaseAuth({ ...userWithoutTenant, tenantId: '' })
      )

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No tenant associated with user')
    })
  })

  describe('Validation', () => {
    it('rejects invalid job_type', async () => {
      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'invalid-type',
          ticker: 'BTC-USD',
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('accepts valid job types', async () => {
      const validTypes = ['trading-sweep', 'document-processing', 'data-etl', 'ml-inference']

      for (const jobType of validTypes) {
        const createdJob = {
          id: `test-job-${jobType}`,
          tenantId,
          jobType: jobType,
          status: 'QUEUED',
          parameters: { ticker: 'BTC-USD' },
          result: null,
          metrics: null,
          errorMessage: null,
          createdAt: new Date(),
          startedAt: null,
          completedAt: null,
        }

        mockPrisma.pipelineJob.create.mockResolvedValueOnce(createdJob)

        const request = createMockRequest({
          url: 'http://localhost/api/pipelines',
          method: 'POST',
          body: {
            job_type: jobType,
            ticker: 'BTC-USD',
            config: {},
          },
        })
        const response = await POST(request as NextRequest)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.job.job_type).toBe(jobType)
      }
    })

    it('ticker is optional', async () => {
      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'document-processing',
          config: { file_path: '/path/to/file.pdf' },
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.id).toBeDefined()
    })

    it('config is optional', async () => {
      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.id).toBeDefined()
    })

    it('rejects malformed JSON', async () => {
      const request = {
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        nextUrl: {
          searchParams: new URLSearchParams(),
        },
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      }

      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('Functionality', () => {
    it('creates job with QUEUED status', async () => {
      const createdJob = {
        id: 'test-job-id',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: { ticker: 'BTC-USD', strategy_type: 'SMA' },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)
      mockPrisma.pipelineJob.findUnique.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
          config: { strategy_type: 'SMA' },
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.status).toBe('queued')

      // Verify in database
      const job = await prisma.pipelineJob.findUnique({
        where: { id: data.job.id },
      })
      expect(job?.status).toBe('QUEUED')
    })

    it('stores ticker in parameters when provided', async () => {
      const createdJob = {
        id: 'test-job-id-2',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: { ticker: 'ETH-USD', strategy_type: 'SMA' },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)
      mockPrisma.pipelineJob.findUnique.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'ETH-USD',
          config: { strategy_type: 'SMA' },
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.parameters.ticker).toBe('ETH-USD')

      // Verify in database
      const job = await prisma.pipelineJob.findUnique({
        where: { id: data.job.id },
      })
      expect((job?.parameters as Record<string, unknown>)?.ticker).toBe('ETH-USD')
    })

    it('merges config with ticker in parameters', async () => {
      const createdJob = {
        id: 'test-job-id-3',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: {
          strategy_type: 'SMA',
          fast_period: 10,
          slow_period: 50,
          ticker: 'BTC-USD',
        },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
          config: {
            strategy_type: 'SMA',
            fast_period: 10,
            slow_period: 50,
          },
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.parameters).toEqual({
        strategy_type: 'SMA',
        fast_period: 10,
        slow_period: 50,
        ticker: 'BTC-USD',
      })
    })

    it('returns created job with correct structure', async () => {
      const createdJob = {
        id: 'test-job-id-4',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: { ticker: 'BTC-USD' },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty('job')
      expect(data).toHaveProperty('message')
      expect(data.job).toMatchObject({
        id: expect.any(String),
        job_type: 'trading-sweep',
        status: 'queued',
        parameters: expect.any(Object),
        created_at: expect.any(String),
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles complex nested config objects', async () => {
      const complexConfig = {
        strategy: {
          type: 'SMA',
          parameters: {
            fast: 10,
            slow: 50,
          },
        },
        risk: {
          max_drawdown: 0.2,
          position_size: 0.1,
        },
      }

      const createdJob = {
        id: 'test-job-id-5',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: {
          ...complexConfig,
          ticker: 'BTC-USD',
        },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC-USD',
          config: complexConfig,
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.parameters).toMatchObject(complexConfig)
    })

    it('handles special characters in ticker', async () => {
      const createdJob = {
        id: 'test-job-id-6',
        tenantId,
        jobType: 'trading-sweep',
        status: 'QUEUED',
        parameters: { ticker: 'BTC/USDT' },
        result: null,
        metrics: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      }

      mockPrisma.pipelineJob.create.mockResolvedValue(createdJob)

      const request = createMockRequest({
        url: 'http://localhost/api/pipelines',
        method: 'POST',
        body: {
          job_type: 'trading-sweep',
          ticker: 'BTC/USDT',
        },
      })
      const response = await POST(request as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job.parameters.ticker).toBe('BTC/USDT')
    })
  })
})
