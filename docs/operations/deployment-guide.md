# Zixly Pipeline Deployment Guide

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Target Environment**: Local Docker Compose → AWS EKS (future)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Pipeline Stack Deployment](#pipeline-stack-deployment)
6. [Verification & Testing](#verification--testing)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software

- **Docker Desktop** 24.0+ (with Docker Compose)
- **Node.js** 20+ LTS
- **npm** 10+
- **Git** 2.40+
- **Trading API** (running on `http://localhost:8000`)

### Required Accounts

- **Supabase** account with PostgreSQL database (Sydney region)
- **Outlook/Microsoft** account for email notifications (optional)

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 10GB free space
- **CPU**: 4 cores recommended
- **OS**: macOS, Linux, or Windows with WSL2

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/colemorton/zixly.git
cd zixly

# 2. Copy environment template
cp .env.local.template .env.local

# 3. Configure environment variables (edit .env.local)
# Add your Supabase credentials, Trading API key, SMTP settings

# 4. Install dependencies
npm install

# 5. Generate Prisma client
npm run db:generate

# 6. Run database migrations
npm run db:migrate

# 7. Start pipeline stack
docker-compose -f docker-compose.pipeline.yml up -d

# 8. Verify services are running
docker-compose -f docker-compose.pipeline.yml ps

# 9. Check logs
docker-compose -f docker-compose.pipeline.yml logs -f

# 10. Access services
# - Webhook Receiver: http://localhost:3000
# - Grafana: http://localhost:3001 (admin/admin)
# - Prometheus: http://localhost:9090
# - Redis Commander: http://localhost:8081 (debug mode only)
```

---

## Environment Configuration

### 1. Supabase Configuration

Create a Supabase project at [supabase.com](https://supabase.com):

1. Create new project (Sydney region recommended)
2. Navigate to **Settings → Database**
3. Copy connection string
4. Navigate to **Settings → API**
5. Copy project URL, anon key, and service role key

### 2. Environment Variables

Edit `.env.local` with your configuration:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Trading API
TRADING_API_URL="http://host.docker.internal:8000"
TRADING_API_KEY="your-trading-api-key"

# Email Notifications (Optional - Outlook/Microsoft 365)
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="your-email@outlook.com"
NOTIFICATION_EMAIL="cole.morton@hotmail.com"

# Grafana
GRAFANA_ADMIN_PASSWORD="change-me-in-production"
```

### 3. Trading API Setup

Ensure your trading API is running:

```bash
# Check Trading API health
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","version":"1.0.0"}
```

---

## Database Setup

### 1. Enable pgvector Extension (Supabase)

In Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Migrations

```bash
npx prisma migrate dev --name init
```

This creates:

- `pipeline_jobs` table
- `trading_sweep_results` table
- Required indexes and relationships

### 4. Verify Schema

```bash
npx prisma studio
```

Open http://localhost:5555 to browse your database.

---

## Pipeline Stack Deployment

### 1. Build Services

```bash
# Build webhook receiver
cd services/webhook-receiver
npm install
npm run build

# Build pipeline worker
cd ../pipeline-worker
npm install
npm run build

# Return to root
cd ../..
```

### 2. Start Docker Compose Stack

```bash
docker-compose -f docker-compose.pipeline.yml up -d
```

This starts:

- **redis**: Job queue
- **webhook-receiver**: API endpoint (port 3000)
- **pipeline-worker**: Job processor (2 replicas)
- **prometheus**: Metrics collection (port 9090)
- **grafana**: Dashboards (port 3001)

### 3. Check Service Status

```bash
# View all services
docker-compose -f docker-compose.pipeline.yml ps

# Check logs
docker-compose -f docker-compose.pipeline.yml logs -f webhook-receiver
docker-compose -f docker-compose.pipeline.yml logs -f pipeline-worker
```

### 4. Scale Workers (Optional)

```bash
# Scale to 5 workers
docker-compose -f docker-compose.pipeline.yml up -d --scale pipeline-worker=5
```

---

## Verification & Testing

### 1. Health Checks

```bash
# Webhook Receiver
curl http://localhost:3000/health

# Prometheus
curl http://localhost:9090/-/healthy

# Grafana
curl http://localhost:3001/api/health
```

### 2. Trigger Test Job

```bash
curl -X POST http://localhost:3000/webhook/trading-sweep \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "BTC-USD",
    "fast_range": [10, 15],
    "slow_range": [20, 25],
    "step": 5,
    "min_trades": 50,
    "strategy_type": "SMA"
  }'
```

Expected response:

```json
{
  "job_id": "cm4x8y9z0000108l7a1b2c3d4",
  "status": "QUEUED",
  "message": "Trading sweep job queued successfully",
  "webhook_url": "http://webhook-receiver:3000/webhook/sweep-callback",
  "created_at": "2025-01-27T10:30:45.123Z"
}
```

### 3. Check Job Status

```bash
# Get job status
curl http://localhost:3000/webhook/jobs/cm4x8y9z0000108l7a1b2c3d4
```

### 4. Monitor Logs

```bash
# Follow worker logs
docker-compose -f docker-compose.pipeline.yml logs -f pipeline-worker

# Watch for:
# - "Job picked up"
# - "Sweep submitted to Trading API"
# - "Best results fetched"
# - "Trading sweep completed successfully"
```

---

## Monitoring

### Grafana Dashboards

1. Open http://localhost:3001
2. Login: `admin` / `admin` (change password on first login)
3. Navigate to **Dashboards → Zixly Pipelines**

**Available Metrics**:

- Job queue depth
- Job success rate
- Average job duration
- Trading API latency
- Redis connection status

### Prometheus Queries

Open http://localhost:9090 and try these queries:

```promql
# Jobs queued per minute
rate(pipeline_jobs_queued_total[5m])

# Job success rate
rate(pipeline_jobs_processed_total{status="completed"}[5m]) / rate(pipeline_jobs_processed_total[5m])

# 95th percentile job duration
histogram_quantile(0.95, rate(pipeline_job_duration_seconds_bucket[10m]))

# Active jobs
sum(pipeline_jobs{status="running"})
```

### Redis Monitoring (Debug Mode)

```bash
# Start with debug profile
docker-compose -f docker-compose.pipeline.yml --profile debug up -d

# Access Redis Commander
open http://localhost:8081
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check Docker logs
docker-compose -f docker-compose.pipeline.yml logs webhook-receiver

# Common issues:
# 1. Port already in use
lsof -i :3000  # Find process using port 3000

# 2. Database connection failed
# → Verify DATABASE_URL in .env.local
# → Check Supabase project is running

# 3. Redis connection failed
# → Ensure Redis container is healthy
docker-compose -f docker-compose.pipeline.yml ps redis
```

### Jobs Not Processing

```bash
# Check worker logs
docker-compose -f docker-compose.pipeline.yml logs pipeline-worker

# Check Redis queue
docker-compose -f docker-compose.pipeline.yml exec redis redis-cli
> LLEN bull:trading-sweeps:wait
> LLEN bull:trading-sweeps:active
> LLEN bull:trading-sweeps:failed
```

### Trading API Unreachable

```bash
# From host machine
curl http://localhost:8000/health

# From within Docker
docker-compose -f docker-compose.pipeline.yml exec webhook-receiver \
  curl http://host.docker.internal:8000/health

# If fails, check:
# 1. Trading API is running
# 2. Using host.docker.internal (not localhost)
# 3. Docker Desktop allows host access
```

### Database Migration Errors

```bash
# Reset database (WARNING: destroys data)
npx prisma migrate reset

# Or manually drop tables and re-migrate
npx prisma migrate deploy
```

### Email Notifications Not Sending

```bash
# Check SMTP configuration in .env.local
# Test SMTP connection
docker-compose -f docker-compose.pipeline.yml logs pipeline-worker | grep "Email"

# Common issues:
# 1. Outlook requires App Password (not account password)
# 2. Check SMTP_PORT (587 for TLS, 465 for SSL)
# 3. Verify SMTP_HOST is correct
```

---

## Production Deployment

### AWS EKS Migration (Future)

When ready to migrate to production AWS EKS:

1. **Terraform Infrastructure**:

   ```bash
   cd terraform/
   terraform init
   terraform plan
   terraform apply
   ```

2. **GitHub Actions CI/CD**:
   - Push to `main` branch triggers deployment
   - Automated testing before deploy
   - Blue/green deployment strategy

3. **Production Monitoring**:
   - DataDog APM
   - AWS CloudWatch
   - Sentry error tracking

4. **Database Migration**:
   - Use AWS RDS PostgreSQL or continue with Supabase
   - Enable connection pooling (PgBouncer)
   - Configure automated backups

See [AWS EKS Deployment Guide](./docs/pipelines/aws-eks-deployment.md) (future)

---

## Useful Commands

### Docker Compose

```bash
# Start services
docker-compose -f docker-compose.pipeline.yml up -d

# Stop services
docker-compose -f docker-compose.pipeline.yml down

# Rebuild services
docker-compose -f docker-compose.pipeline.yml build

# View logs
docker-compose -f docker-compose.pipeline.yml logs -f [service-name]

# Execute command in container
docker-compose -f docker-compose.pipeline.yml exec webhook-receiver sh

# Scale workers
docker-compose -f docker-compose.pipeline.yml up -d --scale pipeline-worker=5
```

### Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Development

```bash
# Run webhook receiver locally (outside Docker)
cd services/webhook-receiver
npm run dev

# Run pipeline worker locally
cd services/pipeline-worker
npm run dev

# Run Next.js dashboard
npm run dev
```

---

## Container Security Scanning

### Automated Vulnerability Scanning

Zixly uses **Trivy** for automated container security scanning integrated into the CI/CD pipeline.

**What Gets Scanned**:

- `webhook-receiver` Docker image
- `pipeline-worker` Docker image
- OS packages and application dependencies
- Secrets and configuration issues

**When Scans Run**:

- On every push to `main` or `develop` branches
- On every pull request
- Weekly scheduled scans (Mondays at 9:00 UTC)
- Manual trigger via GitHub Actions

**Severity Threshold**:

- **CRITICAL** vulnerabilities: ❌ Fail build
- **HIGH** vulnerabilities: ❌ Fail build
- **MEDIUM/LOW** vulnerabilities: ⚠️ Warning only

### Viewing Scan Results

```bash
# Navigate to GitHub Security tab
# Security → Code scanning alerts → Filter by service

# Or view in workflow logs
# Actions → Container Security Scanning → View logs
```

### Manual Security Scan

```bash
# Scan webhook-receiver locally
docker build -t webhook-receiver:test ./services/webhook-receiver
trivy image webhook-receiver:test --severity CRITICAL,HIGH

# Scan pipeline-worker locally
docker build -t pipeline-worker:test ./services/pipeline-worker
trivy image pipeline-worker:test --severity CRITICAL,HIGH
```

For detailed vulnerability management procedures, see:

- **[Vulnerability Scanning Guide](./docs/security/vulnerability-scanning.md)**

---

## Security Checklist

Before deploying to production:

- [ ] Change default Grafana password
- [ ] Use strong DATABASE_URL password
- [ ] Enable Supabase Row-Level Security (RLS)
- [ ] Rotate TRADING_API_KEY regularly
- [ ] Use environment-specific SMTP credentials
- [x] Enable Docker security scanning ✅ (automated via GitHub Actions)
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS certificates
- [ ] Enable audit logging
- [ ] Configure backup retention policy
- [ ] Review and remediate all CRITICAL/HIGH vulnerabilities
- [ ] Set up branch protection rules requiring security scans

---

## Support & Resources

- **Documentation**: [./docs/](./docs/)
- **Architecture Decisions**: [./docs/architecture/decisions/](./docs/architecture/decisions/)
- **Pipeline Specifications**: [./docs/pipelines/](./docs/pipelines/)
- **Troubleshooting**: [./docs/troubleshooting/](./docs/troubleshooting/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Maintained By**: Zixly DevOps Team
