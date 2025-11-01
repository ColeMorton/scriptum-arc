import { z } from 'zod'

// Shared Zod schemas for validation across frontend and backend

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export const tenantIdSchema = z.object({
  tenantId: z.string().uuid(),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type TenantIdInput = z.infer<typeof tenantIdSchema>
