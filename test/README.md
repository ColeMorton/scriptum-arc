# Integration Testing Suite

This directory contains comprehensive integration tests for the Scriptum Arc application, covering API endpoints, database operations, authentication, and Row-Level Security (RLS).

## Test Structure

```
test/
├── setup.ts                 # Global test setup and configuration
├── env.test.ts             # Environment configuration tests
├── mocks/
│   └── server.ts           # Mock Service Worker setup for API mocking
├── api/
│   ├── health.test.ts      # Health check API tests
│   └── tenants.test.ts     # Tenants API endpoint tests
├── database/
│   ├── setup.ts            # Database test utilities and helpers
│   ├── schema.test.ts      # Database schema and model tests
│   └── rls.test.ts         # Row-Level Security integration tests
└── auth/
    ├── auth.test.ts        # Authentication utility tests
    └── middleware.test.ts  # Supabase middleware tests
```

## Running Tests

### All Tests
```bash
npm test                    # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:ui            # Run tests with UI
```

### Specific Test Suites
```bash
npm run test:api           # API endpoint tests
npm run test:database      # Database integration tests
npm run test:auth          # Authentication tests
```

### Coverage
```bash
npm run test:coverage      # Generate coverage report
```

## Test Categories

### 1. API Tests (`test/api/`)
- **Health Check**: Tests the `/api/health` endpoint
- **Tenants API**: Tests the `/api/tenants` endpoint with authentication

### 2. Database Tests (`test/database/`)
- **Schema Tests**: Validates all Prisma models and relationships
- **RLS Tests**: Comprehensive Row-Level Security testing
  - Tenant data isolation
  - Cross-tenant access prevention
  - Data integrity across tenants

### 3. Authentication Tests (`test/auth/`)
- **Auth Utilities**: Tests `getCurrentUser()` and `requireAuth()`
- **Middleware**: Tests Supabase middleware functionality

## Test Environment

### Mocking Strategy
- **Supabase API**: Mocked using MSW (Mock Service Worker)
- **Database**: Uses test database with cleanup between tests
- **Authentication**: Mocked Supabase auth responses

### Test Data Management
- Automatic cleanup between tests
- Isolated test data creation
- Tenant context management for RLS testing

## Key Testing Features

### Multi-tenant Testing
- Tests tenant data isolation
- Validates RLS policies
- Ensures cross-tenant access prevention

### Authentication Flow
- Tests authenticated and unauthenticated scenarios
- Validates user metadata handling
- Tests tenant association requirements

### Database Operations
- CRUD operations for all models
- Relationship integrity
- Constraint validation

## Test Utilities

### Database Helpers (`test/database/setup.ts`)
```typescript
// Clean up test data
await cleanupTestData()

// Create test entities
const tenant = await createTestTenant()
const user = await createTestUser(tenant.id)
const client = await createTestClient(tenant.id)

// Set tenant context for RLS
await setTenantContext(tenant.id)
```

### Mock Configuration (`test/mocks/server.ts`)
- Mock Supabase Auth endpoints
- Mock REST API responses
- Mock health check responses

## Best Practices

1. **Isolation**: Each test is completely isolated with fresh data
2. **Cleanup**: Automatic cleanup prevents test interference
3. **Mocking**: External services are mocked for reliable testing
4. **Coverage**: Comprehensive coverage of critical paths
5. **RLS Testing**: Extensive testing of multi-tenant security

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure test database is accessible
2. **Environment Variables**: Verify test environment configuration
3. **Mock Setup**: Check MSW server configuration
4. **Cleanup**: Ensure test data is properly cleaned up

### Debug Mode
```bash
# Run specific test with verbose output
npm test -- --reporter=verbose test/api/health.test.ts
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies
- Deterministic results
- Fast execution
- Comprehensive coverage
