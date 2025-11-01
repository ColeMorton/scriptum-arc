import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())

// Import test constants
import { TEST_SUPABASE_URL, TEST_CREDENTIALS } from './config/test-constants'

// Mock environment variables for tests
;(process.env as any).NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SUPABASE_URL = TEST_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = TEST_CREDENTIALS.SUPABASE_ANON_KEY
process.env.SUPABASE_SERVICE_ROLE_KEY = TEST_CREDENTIALS.SUPABASE_SERVICE_KEY
