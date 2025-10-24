import { vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

export function createMockPrismaClient() {
  return {
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
  } as unknown as PrismaClient
}
