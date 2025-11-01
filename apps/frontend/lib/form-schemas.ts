import { z } from 'zod'

// Tenant validation schema
export const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().optional(),
})

export type TenantFormData = z.infer<typeof tenantSchema>

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
})

export type UserFormData = z.infer<typeof userSchema>

// Financial data validation schema
export const financialSchema = z.object({
  revenue: z.number().min(0, 'Revenue must be positive'),
  expenses: z.number().min(0, 'Expenses must be positive'),
  recordDate: z.date(),
  currency: z.string().default('AUD'),
})

export type FinancialFormData = z.infer<typeof financialSchema>
