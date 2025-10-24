import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, DELETE } from '@/app/api/pipelines/[id]/route'
import { createMockRequest } from '../utils/test-helpers'
import { mockUser } from '../utils/test-data'
import type { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pipelineJob: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
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
    update: ReturnType<typeof vi.fn>
  }
}

describe('GET /api/pipelines/[id]', () => {
  let mockPrisma: MockPrisma

  beforeEach(async () => {
    vi.clearAllMocks()
    const { prisma } = await import('@/lib/prisma')
    mockPrisma = prisma
  })

  it('returns 404 for non-existent job', async () => {
    mockPrisma.pipelineJob.findFirst.mockResolvedValue(null)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/non-existent-id',
    })
    const response = await GET(request as NextRequest, {
      params: Promise.resolve({ id: 'non-existent-id' }),
    })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Job not found')
  })

  it('returns job details for valid job', async () => {
    const mockJob = {
      id: 'job-123',
      tenantId: mockUser.tenantId,
      jobType: 'trading-sweep',
      status: 'COMPLETED',
      parameters: {},
      result: null,
      metrics: null,
      errorMessage: null,
      createdAt: new Date(),
      startedAt: new Date(),
      completedAt: new Date(),
      results: [],
    }
    mockPrisma.pipelineJob.findFirst.mockResolvedValue(mockJob)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/job-123',
    })
    const response = await GET(request as NextRequest, {
      params: Promise.resolve({ id: 'job-123' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBe('job-123')
  })
})

describe('DELETE /api/pipelines/[id]', () => {
  let mockPrisma: MockPrisma

  beforeEach(async () => {
    vi.clearAllMocks()
    const { prisma } = await import('@/lib/prisma')
    mockPrisma = prisma
  })

  it('returns 404 for non-existent job', async () => {
    mockPrisma.pipelineJob.findFirst.mockResolvedValue(null)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/non-existent-id',
      method: 'DELETE',
    })
    const response = await DELETE(request as NextRequest, {
      params: Promise.resolve({ id: 'non-existent-id' }),
    })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Job not found')
  })

  it('cancels job successfully', async () => {
    const mockJob = {
      id: 'job-123',
      tenantId: mockUser.tenantId,
      status: 'QUEUED',
    }
    const updatedJob = { ...mockJob, status: 'CANCELLED', completedAt: new Date() }

    mockPrisma.pipelineJob.findFirst.mockResolvedValue(mockJob)
    mockPrisma.pipelineJob.update.mockResolvedValue(updatedJob)

    const request = createMockRequest({
      url: 'http://localhost/api/pipelines/job-123',
      method: 'DELETE',
    })
    const response = await DELETE(request as NextRequest, {
      params: Promise.resolve({ id: 'job-123' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('cancelled') // lowercase as returned by API
  })
})
