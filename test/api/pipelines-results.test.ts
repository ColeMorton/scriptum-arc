import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/pipelines/[id]/results/route'
import { createMockRequest } from '../utils/test-helpers'
import { mockUser } from '../utils/test-data'
import type { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pipelineJob: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    tradingSweepResult: {
      findMany: vi.fn(),
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
    findFirst: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
  }
  tradingSweepResult: {
    findMany: ReturnType<typeof vi.fn>
  }
}

describe('GET /api/pipelines/[id]/results', () => {
  let mockPrisma: MockPrisma

  beforeEach(async () => {
    vi.clearAllMocks()
    const { prisma } = await import('@/lib/prisma')
    mockPrisma = prisma
  })

  it('returns 404 for non-existent job', async () => {
    mockPrisma.pipelineJob.findFirst.mockResolvedValue(null)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/non-existent-id/results',
    })
    const response = await GET(request as NextRequest, {
      params: Promise.resolve({ id: 'non-existent-id' }),
    })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Job not found')
  })

  it('returns results for valid trading-sweep job', async () => {
    const mockJob = {
      id: 'job-123',
      tenantId: mockUser.tenantId,
      jobType: 'trading-sweep',
      status: 'COMPLETED',
    }
    const mockResults = [
      {
        id: 'result-1',
        jobId: 'job-123',
        sweepRunId: 'sweep-1',
        ticker: 'BTC-USD',
        strategyType: 'SMA',
        fastPeriod: 10,
        slowPeriod: 50,
        score: 85.5,
        sharpeRatio: 2.3,
        sortinoRatio: 2.5,
        totalReturnPct: 125.5,
        annualizedReturn: 45.0,
        maxDrawdownPct: -15.3,
        winRatePct: 65.0,
        profitFactor: 2.1,
        totalTrades: 100,
        tradesPerMonth: 8.3,
        avgTradeDuration: '2 days',
        createdAt: new Date(),
      },
    ]

    mockPrisma.pipelineJob.findFirst.mockResolvedValue(mockJob)
    mockPrisma.tradingSweepResult.findMany.mockResolvedValue(mockResults)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/job-123/results',
    })
    const response = await GET(request as NextRequest, {
      params: Promise.resolve({ id: 'job-123' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(1)
    expect(data.results[0].ticker).toBe('BTC-USD')
  })

  it('returns 400 for non-trading-sweep job', async () => {
    const mockJob = {
      id: 'job-123',
      tenantId: mockUser.tenantId,
      jobType: 'document-processing',
      status: 'COMPLETED',
    }

    mockPrisma.pipelineJob.findFirst.mockResolvedValue(mockJob)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/job-123/results',
    })
    const response = await GET(request as NextRequest, {
      params: Promise.resolve({ id: 'job-123' }),
    })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('This job type does not have trading sweep results')
  })
})
