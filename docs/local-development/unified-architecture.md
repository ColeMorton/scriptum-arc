# Unified Architecture Documentation

## Overview

This document describes the unified Docker Compose architecture that integrates zixly and trading services while maintaining proper service boundaries and independent lifecycles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              Unified Docker Network                  │
│              (zixly-unified-network)                │
├─────────────────────────────────────────────────────┤
│  Frontend Layer                                      │
│    - Next.js (zixly) :3000                          │
│    - React (trading) :3100 [profile: frontend]      │
├─────────────────────────────────────────────────────┤
│  API Layer                                           │
│    - Webhook Receiver :3002                         │
│    - Trading API (FastAPI) :8000                    │
├─────────────────────────────────────────────────────┤
│  Worker Layer                                        │
│    - Pipeline Workers (2x) - job orchestration      │
│    - ARQ Worker - trading execution                 │
├─────────────────────────────────────────────────────┤
│  Shared Infrastructure                               │
│    - Redis :6379 (shared queue/cache)              │
│    - LocalStack :4566 (shared AWS emulation)       │
│    - Prometheus :9090 [profile: monitoring]        │
│    - Grafana :3001 [profile: monitoring]           │
├─────────────────────────────────────────────────────┤
│  Database Layer                                      │
│    - Supabase (zixly) - cloud                       │
│    - PostgreSQL :5432 (trading) - local             │
└─────────────────────────────────────────────────────┘
```

## Service Profiles

### Core Infrastructure (Always Running)

- `redis` - Shared cache and job queue
- `localstack` - AWS service emulation
- `postgres` - Trading database

### Zixly Services (Profile: `zixly`)

- `webhook-receiver` - Express.js webhook ingestion
- `pipeline-worker` - Job processing (2 replicas)

### Trading Services (Profile: `trading`)

- `trading-api` - FastAPI application
- `arq-worker` - Async job processing

### Frontend Services (Profile: `frontend`)

- `nextjs-app` - Zixly Next.js application
- `react-app` - Trading React application

### Monitoring Services (Profile: `monitoring`)

- `prometheus` - Metrics collection
- `grafana` - Visualization dashboards

### Admin Services (Profile: `admin`)

- `pgadmin` - Database administration
- `redis-commander` - Redis GUI

## Port Mappings

| Service          | Port | Description           |
| ---------------- | ---- | --------------------- |
| Next.js App      | 3000 | Zixly frontend        |
| React App        | 3100 | Trading frontend      |
| Webhook Receiver | 3002 | Webhook ingestion     |
| Trading API      | 8000 | Trading service API   |
| PostgreSQL       | 5432 | Trading database      |
| Redis            | 6379 | Shared cache/queue    |
| LocalStack       | 4566 | AWS emulation         |
| Prometheus       | 9090 | Metrics collection    |
| Grafana          | 3001 | Monitoring dashboards |
| pgAdmin          | 5050 | Database admin        |
| Redis Commander  | 8081 | Redis admin           |

## Service Communication

### Network Communication

All services communicate through the `unified-network` (172.25.0.0/16):

- **Webhook Receiver → Trading API**: `http://trading-api:8000`
- **Pipeline Workers → Trading API**: `http://trading-api:8000`
- **All Services → Redis**: `redis://redis:6379`
- **All Services → LocalStack**: `http://localstack:4566`

### Image and Container Strategy

**Generic Image Names**: Images use generic, reusable names for portability:

- `trading-api:latest` - Trading API service
- `arq-worker:latest` - Trading async job processing
- `webhook-receiver:latest` - Webhook ingestion service
- `pipeline-worker:latest` - Job processing service

**Project-Specific Container Names**: Containers use project-specific names for isolation:

- `zixly-trading-api` - Trading API running in Zixly context
- `zixly-arq-worker` - ARQ worker running in Zixly context
- `zixly-webhook-receiver` - Webhook receiver running in Zixly context
- `zixly-pipeline-worker` - Pipeline worker running in Zixly context

**Benefits**:

- **95% Faster Startup**: Pre-built images load in ~1.7 seconds vs 30-60 seconds for rebuild
- **Image Portability**: Generic images can be used across projects
- **Clear Separation**: Image identity vs deployment context is explicit
- **Foundation for CI/CD**: Ready for container registry integration

### Redis Namespace Strategy

- **Trading cache**: `trading:*` keys (DB 0)
- **Zixly job queue**: `bull:trading-sweeps:*` keys (DB 1)
- **Session data**: `session:*` keys

## Environment Variables

### Shared Infrastructure

```bash
REDIS_URL=redis://redis:6379
AWS_ENDPOINT_URL=http://localstack:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

### Zixly Configuration

```bash
DATABASE_URL=postgresql://postgres.qhndigeishvhanwhvuei:skRWwFvAE6viEqpA@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://qhndigeishvhanwhvuei.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Trading Configuration

```bash
TRADING_DATABASE_URL=postgresql://trading_user:trading_password@postgres:5432/trading_db
TRADING_API_URL=http://trading-api:8000
TRADING_API_KEY=dev-key-000000000000000000000000
```

## Usage Commands

### Initial Setup (First Time)

```bash
# 1. Build trading images (in trading project)
cd /Users/colemorton/Projects/trading
docker-compose build

# 2. Build zixly images (in zixly project)
cd /Users/colemorton/Projects/zixly
docker-compose build webhook-receiver pipeline-worker
```

### Daily Development

```bash
# Start Zixly services (uses pre-built images instantly)
docker-compose --profile zixly --profile trading up -d

# Images load instantly (no rebuild)
# Containers still named zixly-* for isolation
```

### When Trading Code Changes

```bash
# Rebuild only changed images
cd /Users/colemorton/Projects/trading
docker-compose build trading-api

# Restart Zixly services to use new image
cd /Users/colemorton/Projects/zixly
docker-compose restart trading-api
```

### Start with Monitoring

```bash
docker-compose --profile zixly --profile trading --profile monitoring up -d
```

### Start with Admin Tools

```bash
docker-compose --profile zixly --profile trading --profile admin up -d
```

### Start Everything

```bash
docker-compose --profile zixly --profile trading --profile frontend --profile monitoring --profile admin up -d
```

## LocalStack Setup

### Initialization Script

The `localstack/init-scripts/init-aws.sh` script automatically creates:

**S3 Buckets:**

- `zixly-pipeline-data`
- `trading-results`
- `zixly-job-results`

**SQS Queues:**

- `trading-sweep-jobs`
- `notifications`
- `zixly-job-queue`

**SNS Topics:**

- `trading-alerts`
- `zixly-notifications`

**Secrets Manager:**

- `trading-api-credentials`
- `smtp-credentials`
- `zixly-database-credentials`

### Accessing LocalStack Resources

```bash
# List S3 buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# List SQS queues
aws --endpoint-url=http://localhost:4566 sqs list-queues

# List secrets
aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets
```

## Monitoring

### Prometheus Metrics

- **Trading API**: `http://trading-api:8000/metrics`
- **Webhook Receiver**: `http://webhook-receiver:3000/metrics`
- **Pipeline Workers**: `http://pipeline-worker:3000/metrics`
- **Redis**: `http://redis:6379/metrics`

### Grafana Dashboards

Access at `http://localhost:3001` (admin/admin)

**Available Dashboards:**

- Trading API performance
- Pipeline job execution
- Shared Redis metrics
- LocalStack usage

## Troubleshooting

### Service Health Checks

```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs webhook-receiver
docker-compose logs trading-api
docker-compose logs pipeline-worker

# Check service health
curl http://localhost:3002/health
curl http://localhost:8000/health
curl http://localhost:3000/api/health
```

### Network Connectivity

```bash
# Test Redis connectivity
docker-compose exec webhook-receiver redis-cli -h redis ping

# Test LocalStack connectivity
docker-compose exec webhook-receiver curl http://localstack:4566/_localstack/health

# Test trading API connectivity
docker-compose exec webhook-receiver curl http://trading-api:8000/health
```

### Common Issues

**Port Conflicts:**

- Ensure no other services are using ports 3000, 3002, 8000, 5432, 6379, 4566
- Check with `lsof -i :PORT` or `netstat -tulpn | grep PORT`

**Service Dependencies:**

- Core services (Redis, LocalStack, PostgreSQL) must start first
- Use `depends_on` and health checks for proper startup order

**Environment Variables:**

- Ensure `.env` file exists with all required variables
- Check service-specific environment variables in docker-compose.yml

**Volume Issues:**

- Named volumes persist data between restarts
- Use `docker volume ls` to check volume status
- Use `docker volume rm VOLUME_NAME` to reset volumes

## Migration from Separate Stacks

### Automated Migration

```bash
./scripts/migrate-to-unified.sh
```

### Manual Migration Steps

1. Stop existing services
2. Backup data volumes
3. Export environment variables
4. Start unified stack
5. Verify service connectivity
6. Run smoke tests

### Rollback Plan

If issues arise:

1. Stop unified stack: `docker-compose down`
2. Restore original files from `archive/docker-compose/`
3. Start separate stacks as before
4. Data preserved in named volumes

## Benefits

1. **Simplified Operations**: Single `docker-compose up` command
2. **Resource Efficiency**: Shared Redis/LocalStack reduce memory by ~300MB
3. **Better Integration**: Unified network enables seamless service communication
4. **Comprehensive Monitoring**: Single Prometheus/Grafana stack for all services
5. **Profile Flexibility**: Start only what you need
6. **Production Parity**: Architecture mirrors production setup

## Service Boundaries

### Zixly (Orchestration Platform)

- **Role**: Job orchestration and workflow management
- **Database**: Supabase (cloud)
- **Dependencies**: Calls trading API as external service
- **Independence**: Can run without trading API

### Trading (Execution Service)

- **Role**: Algorithm execution and trading operations
- **Database**: PostgreSQL (local)
- **Dependencies**: None (standalone service)
- **Independence**: Completely independent of zixly

### Integration Contract

- **Trading** exposes: REST API, authentication, documentation
- **Zixly** consumes: Makes HTTP calls with API keys, handles responses
- **Communication**: HTTP REST calls over unified network
- **Data**: No shared database, only API communication
