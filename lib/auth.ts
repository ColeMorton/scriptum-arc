import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function getCurrentUser(request?: NextRequest) {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    tenantId: user.user_metadata?.tenant_id,
    role: user.user_metadata?.role || 'VIEWER',
  }
}

export async function requireAuth(request?: NextRequest) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

export async function requireRole(requiredRole: 'ADMIN' | 'EDITOR' | 'VIEWER', request?: NextRequest) {
  const user = await requireAuth(request)
  
  const roleHierarchy = {
    VIEWER: 0,
    EDITOR: 1,
    ADMIN: 2,
  }

  if (roleHierarchy[user.role as keyof typeof roleHierarchy] < roleHierarchy[requiredRole]) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${user.role}`)
  }

  return user
}
