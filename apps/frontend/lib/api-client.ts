import { createClient } from '@/lib/supabase/client'

export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  return fetch(endpoint, {
    ...options,
    headers,
  })
}

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'GET' })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function apiPost<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'DELETE' })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}
