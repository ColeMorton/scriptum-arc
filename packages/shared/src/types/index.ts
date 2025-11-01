// Shared types across frontend and backend
export type TenantContext = {
  tenantId: string
  userId: string
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  page?: number
  pageSize?: number
  total?: number
}

// Export metadata types
export * from './metadata'
