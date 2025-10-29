# Testing Guide

## Prerequisites

Different test suites require different Docker Compose profiles to be running.

### Start Services by Profile

```bash
# Zixly services (webhook receiver, pipeline workers)
docker-compose --profile zixly up -d

# Trading services (trading API, ARQ worker)
docker-compose --profile trading up -d

# All services
docker-compose --profile zixly --profile trading up -d
```

### Test Coverage by Profile

| Test                    | Required Profile | Services              |
| ----------------------- | ---------------- | --------------------- |
| Webhook Receiver Health | `zixly`          | webhook-receiver:3002 |
| Trading Sweep Webhook   | `zixly`          | webhook-receiver:3002 |

### Running Tests

```bash
# Run all tests (skips tests for unavailable services)
node test/test-pipeline.js

# The script will automatically detect which services are running
# and skip tests for services that aren't available
```

### Timeout Configuration

All HTTP requests have a 5-second default timeout. Tests fail fast if services don't respond within this time, preventing indefinite hangs.

## Testing the Fix

1. **Test with no services running**:

   ```bash
   docker-compose down
   node test/test-pipeline.js
   ```

   Should complete quickly, showing all services unavailable

2. **Test with zixly profile only**:

   ```bash
   docker-compose --profile zixly up -d
   node test/test-pipeline.js
   ```

   Should test webhook receiver successfully

3. **Test with all profiles**:
   ```bash
   docker-compose --profile zixly --profile trading up -d
   node test/test-pipeline.js
   ```
   Should run all tests successfully

## Troubleshooting

### Common Issues

**Test hangs indefinitely**

- This was fixed by adding 5-second timeouts to all HTTP requests
- Tests now fail fast if services aren't available

**Tests skip unexpectedly**

- Check which Docker Compose profiles are running: `docker-compose ps`
- Start required profiles: `docker-compose --profile zixly --profile trading up -d`

**Webhook receiver shows as unhealthy**

- This was fixed by removing the curl-based healthcheck override
- The service now uses the Node.js-based healthcheck from the Dockerfile

**Port connection errors**

- Webhook receiver runs on port 3002
- Trading API runs on port 8000
- Test script automatically detects correct ports

### Service Status Commands

```bash
# Check all running services
docker-compose ps

# Check specific service health
docker-compose ps webhook-receiver
docker-compose ps trading-api

# View service logs
docker-compose logs webhook-receiver
docker-compose logs trading-api

# Restart a service
docker-compose restart webhook-receiver
```

## Development

### Adding New Tests

1. Add service configuration to `SERVICE_PROFILES` in `test-pipeline.js`
2. Create test function following the pattern of existing tests
3. Add availability check before running the test
4. Update the main test function to include the new test

### Test Structure

```javascript
// Service configuration
const SERVICE_PROFILES = {
  newService: { profile: 'profile-name', port: 3000, url: 'http://localhost:3000/health' },
}

// Test function
async function testNewService() {
  console.log('🔍 Testing New Service...')

  const availability = await checkServiceAvailability(
    `${TEST_CONFIG.newServiceUrl}/health`,
    'New Service'
  )

  if (!availability.available) {
    console.log('⚠️  New Service is not running (requires profile-name profile)')
    return false
  }

  // ... test implementation
}
```

## Impact

- ✅ **No more indefinite hangs** - 5-second timeout on all requests
- ✅ **Smart test execution** - Only tests available services
- ✅ **Clear feedback** - Shows which services are required and how to start them
- ✅ **Fast failure** - Tests fail in seconds, not minutes
- ✅ **Better documentation** - Clear guide on running tests with proper profiles
