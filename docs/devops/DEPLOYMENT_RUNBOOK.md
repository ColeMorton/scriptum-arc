# Zixly Deployment Runbook

**Version:** 2.0
**Last Updated:** 2025-11-01
**Owner:** DevOps Team

## Overview

This runbook provides step-by-step instructions for deploying the Zixly platform across different environments. As of v2.0, Zixly uses a monorepo architecture with:

- **Next.js Frontend** (apps/frontend)
- **NestJS Backend API** (apps/backend)
- **Webhook Receiver** (services/webhook-receiver)
- **Pipeline Worker** (services/pipeline-worker)

## Pre-Deployment Checklist

### Prerequisites

- [ ] Access to GitHub repository
- [ ] Access to Vercel dashboard (for Next.js)
- [ ] AWS CLI configured with appropriate credentials
- [ ] kubectl configured for EKS cluster
- [ ] Docker installed and running
- [ ] Terraform >= 1.6 installed

### Environment Variables

Verify all required environment variables are set:

```bash
# Shared
export DATABASE_URL="postgresql://..."
export POSTGRES_PASSWORD="..."

# Frontend (Next.js)
export NEXT_PUBLIC_SUPABASE_URL="http://..."
export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
export NEXT_PUBLIC_API_URL="http://localhost:3001"

# Backend (NestJS)
export PORT="3001"
export SUPABASE_URL="http://..."
export SUPABASE_JWT_SECRET="..."
export REDIS_URL="redis://localhost:6379/1"
export LOG_LEVEL="info"

# Services
export SUPABASE_SERVICE_ROLE_KEY="..."
export TRADING_API_KEY="..."
export SMTP_HOST="..."
export SMTP_PORT="587"
export SMTP_USER="..."
export SMTP_PASSWORD="..."
export SQS_QUEUE_URL="..."
export S3_BUCKET_NAME="..."
```

## Deployment Procedures

### 1. Local Development Deployment

**Use Case**: Development and testing on local machine

```bash
# Start all services
docker-compose --profile zixly up -d

# Start with monitoring
docker-compose --profile zixly --profile monitoring up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f webhook-receiver
docker-compose logs -f pipeline-worker

# Stop services
docker-compose --profile zixly down

# Clean up (removes volumes)
docker-compose --profile zixly down -v
```

**Verification Steps:**

1. NestJS Backend: `curl http://localhost:3001/api/health`
2. Next.js Frontend: `curl http://localhost:3000`
3. Webhook Receiver: `curl http://localhost:3002/health`
4. Pipeline Worker: Check logs for "Worker started"
5. Redis: `docker-compose exec redis redis-cli ping`
6. PostgreSQL: `docker-compose exec postgres pg_isready -U trading_user`

**NPM Workspace Development (without Docker):**

```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate Prisma client
npm run db:generate

# Start backend (port 3001)
npm run dev:backend

# In another terminal, start frontend (port 3000)
npm run dev:frontend

# Build all workspaces
npm run build

# Type check
npm run type-check
```

### 2. GitHub Actions CI/CD Deployment

**Use Case**: Automated deployment on git push

**Automatic Trigger:**

- Push to `main` → Deploys to production
- Push to `development` → Deploys to preview

**Manual Trigger:**

1. Go to GitHub Actions tab
2. Select "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select branch and environment
5. Click "Run workflow"

**Monitor Deployment:**

```bash
# Watch workflow progress
gh run watch

# View logs
gh run view --log
```

**Rollback Procedure:**

1. Revert commit in GitHub
2. Push to trigger new deployment
3. Monitor deployment logs
4. Verify rollback success

### 3. Vercel Deployment (Next.js)

**Use Case**: Frontend deployment

**Automatic Deployment:**

- Triggers on git push to `main` or `development`
- Configured via `.github/workflows/ci-cd.yml`

**Manual Deployment:**

```bash
# Using Vercel CLI
vercel --prod

# Deploy specific environment
vercel --target production
```

**Environment Configuration:**

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add required variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `POSTGRES_PASSWORD`
   - And all other required variables

**Verification:**

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Visit deployment URL
open https://your-domain.vercel.app
```

### 4. NestJS Backend Deployment

**Use Case**: Deploy backend API server

#### Docker Build and Deploy

**Build Docker Image:**

```bash
# Build from monorepo root
docker build -f apps/backend/Dockerfile -t zixly-backend:latest .

# Tag for registry
docker tag zixly-backend:latest ghcr.io/your-org/zixly/backend:latest

# Push to GitHub Container Registry
docker push ghcr.io/your-org/zixly/backend:latest
```

**Run with Docker:**

```bash
# Run backend container
docker run -d \
  --name zixly-backend \
  -p 3001:3001 \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e SUPABASE_URL="${SUPABASE_URL}" \
  -e SUPABASE_JWT_SECRET="${SUPABASE_JWT_SECRET}" \
  -e REDIS_URL="redis://redis:6379/1" \
  -e LOG_LEVEL="info" \
  ghcr.io/your-org/zixly/backend:latest

# Check health
curl http://localhost:3001/api/health

# View logs
docker logs -f zixly-backend
```

**Run with Docker Compose:**

```bash
# Start backend with dependencies
docker-compose --profile zixly up -d backend

# Check status
docker-compose ps backend

# View logs
docker-compose logs -f backend

# Stop backend
docker-compose stop backend
```

#### Kubernetes Deployment

**Create Backend Deployment:**

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: zixly
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/your-org/zixly/backend:latest
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              value: 'production'
            - name: PORT
              value: '3001'
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: backend-secrets
                  key: database-url
            - name: SUPABASE_URL
              valueFrom:
                secretKeyRef:
                  name: backend-secrets
                  key: supabase-url
            - name: SUPABASE_JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: backend-secrets
                  key: supabase-jwt-secret
            - name: REDIS_URL
              value: 'redis://redis:6379/1'
            - name: LOG_LEVEL
              value: 'info'
          resources:
            requests:
              cpu: 200m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 1Gi
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3001
            initialDelaySeconds: 40
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 5
---
# Service
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: zixly
spec:
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 3001
  type: ClusterIP
```

**Create Secrets:**

```bash
kubectl create secret generic backend-secrets \
  --from-literal=database-url="${DATABASE_URL}" \
  --from-literal=supabase-url="${SUPABASE_URL}" \
  --from-literal=supabase-jwt-secret="${SUPABASE_JWT_SECRET}" \
  --namespace=zixly
```

**Deploy:**

```bash
kubectl apply -f backend-deployment.yaml

# Check deployment status
kubectl get deployments -n zixly

# Check pods
kubectl get pods -n zixly -l app=backend

# Check logs
kubectl logs -f deployment/backend -n zixly

# Test health endpoint
kubectl port-forward svc/backend 3001:80 -n zixly
curl http://localhost:3001/api/health
```

**Swagger Documentation:**

Access API docs at: `http://your-backend-url/api/docs`

### 5. AWS EKS Deployment (Microservices)

**Use Case**: Production deployment of webhook-receiver and pipeline-worker

**Prerequisites:**

1. Terraform infrastructure deployed
2. EKS cluster created
3. kubectl configured

**Deploy Infrastructure:**

```bash
cd terraform/environments/production

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply changes
terraform apply

# Export kubeconfig
aws eks update-kubeconfig --name zixly-production --region ap-southeast-2
```

**Deploy Services:**

#### Create Namespace

```bash
kubectl create namespace zixly
```

#### Create Secrets

```bash
# Create Kubernetes secrets from environment variables
kubectl create secret generic webhook-receiver-secrets \
  --from-literal=database-url="$DATABASE_URL" \
  --from-literal=supabase-url="$NEXT_PUBLIC_SUPABASE_URL" \
  --from-literal=supabase-anon-key="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --from-literal=supabase-service-role-key="$SUPABASE_SERVICE_ROLE_KEY" \
  --namespace=zixly

kubectl create secret generic pipeline-worker-secrets \
  --from-literal=database-url="$DATABASE_URL" \
  --from-literal=supabase-url="$NEXT_PUBLIC_SUPABASE_URL" \
  --from-literal=supabase-service-role-key="$SUPABASE_SERVICE_ROLE_KEY" \
  --from-literal=trading-api-key="$TRADING_API_KEY" \
  --from-literal=smtp-host="$SMTP_HOST" \
  --from-literal=smtp-port="$SMTP_PORT" \
  --from-literal=smtp-user="$SMTP_USER" \
  --from-literal=smtp-password="$SMTP_PASSWORD" \
  --namespace=zixly
```

#### Deploy Services

```yaml
# webhook-receiver-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webhook-receiver
  namespace: zixly
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webhook-receiver
  template:
    metadata:
      labels:
        app: webhook-receiver
    spec:
      serviceAccountName: webhook-receiver
      containers:
        - name: webhook-receiver
          image: ghcr.io/your-org/zixly/webhook-receiver:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: webhook-receiver-secrets
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
# Service
apiVersion: v1
kind: Service
metadata:
  name: webhook-receiver
  namespace: zixly
spec:
  selector:
    app: webhook-receiver
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

Apply the deployment:

```bash
kubectl apply -f webhook-receiver-deployment.yaml
kubectl apply -f pipeline-worker-deployment.yaml
```

#### Create Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zixly-ingress
  namespace: zixly
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
    - host: api.your-domain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: webhook-receiver
                port:
                  number: 80
```

Apply ingress:

```bash
kubectl apply -f ingress.yaml
```

### 5. Database Migrations

**Run Migrations:**

```bash
# Via Docker
docker-compose exec app npm run db:migrate

# Via kubectl
kubectl exec -it deployment/webhook-receiver -n zixly -- npm run db:migrate

# Direct connection
psql $DATABASE_URL -f prisma/migrations/*.sql
```

**Verify Migrations:**

```bash
kubectl exec -it deployment/webhook-receiver -n zixly -- npm run db:studio
```

### 6. Monitoring Setup

**Prometheus Scraping:**

```yaml
# ServiceMonitor for Prometheus
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: zixly-services
  namespace: zixly
spec:
  selector:
    matchLabels:
      app: webhook-receiver
  endpoints:
    - port: metrics
      interval: 15s
```

**Grafana Dashboard:**

1. Access Grafana: `http://localhost:3001` (local) or configured domain (prod)
2. Login with credentials
3. Import dashboards from `grafana/dashboards/`
4. Configure Prometheus datasource

## Post-Deployment Verification

### Health Checks

```bash
# NestJS Backend
curl https://api.your-domain.com/api/health
# Expected: {"status":"ok","database":"connected"}

# Next.js Frontend
curl https://your-domain.com
# Expected: HTML response

# Webhook Receiver
curl https://api.your-domain.com/health

# Pipeline Worker
kubectl logs -f deployment/pipeline-worker -n zixly | grep "Worker started"

# Backend API Swagger Docs
curl https://api.your-domain.com/api/docs
# Expected: HTML swagger UI

# Database connectivity (from backend)
kubectl exec -it deployment/backend -n zixly -- \
  node -e "require('@prisma/client').PrismaClient().then(c => c.\$queryRaw\`SELECT version()\`)"

# Redis connectivity
kubectl exec -it deployment/backend -n zixly -- \
  node -e "require('redis').createClient({url:process.env.REDIS_URL}).ping()"
```

### Performance Checks

```bash
# Check pod resource usage
kubectl top pods -n zixly

# Check node resources
kubectl top nodes

# Check service endpoints
kubectl get endpoints -n zixly

# Check ingress status
kubectl get ingress -n zixly
```

### Log Analysis

```bash
# View logs
kubectl logs -f deployment/webhook-receiver -n zixly

# View logs with timestamp
kubectl logs -f deployment/webhook-receiver -n zixly --timestamps

# Check for errors
kubectl logs deployment/webhook-receiver -n zixly | grep -i error

# Export logs
kubectl logs deployment/webhook-receiver -n zixly > webhook-logs.txt
```

## Rollback Procedures

### Quick Rollback

```bash
# Rollback deployment
kubectl rollout undo deployment/webhook-receiver -n zixly

# Check rollback status
kubectl rollout status deployment/webhook-receiver -n zixly

# Rollback to specific revision
kubectl rollout history deployment/webhook-receiver -n zixly
kubectl rollout undo deployment/webhook-receiver -n zixly --to-revision=2
```

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Database Rollback

```bash
# Prisma rollback
npm run db:migrate reset

# Manual rollback
psql $DATABASE_URL -c "BEGIN;"
# ... execute reverse SQL
psql $DATABASE_URL -c "COMMIT;"
```

## Troubleshooting

### Pod Not Starting

```bash
# Describe pod
kubectl describe pod [pod-name] -n zixly

# Check events
kubectl get events -n zixly --sort-by='.lastTimestamp'

# Check logs
kubectl logs [pod-name] -n zixly --previous
```

### Image Pull Errors

```bash
# Check image pull secret
kubectl describe pod [pod-name] -n zixly | grep -i image

# Create registry secret
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=[username] \
  --docker-password=[token] \
  --namespace=zixly
```

### Database Connection Issues

```bash
# Test connectivity
kubectl exec -it deployment/webhook-receiver -n zixly -- \
  psql $DATABASE_URL -c "SELECT 1;"

# Check secrets
kubectl get secret webhook-receiver-secrets -n zixly -o yaml

# Verify DNS resolution
kubectl exec -it deployment/webhook-receiver -n zixly -- nslookup [db-host]
```

## Emergency Procedures

### Service Down

1. Check pod status: `kubectl get pods -n zixly`
2. Restart pods: `kubectl delete pod [pod-name] -n zixly`
3. Scale up: `kubectl scale deployment webhook-receiver --replicas=3 -n zixly`
4. Check ingress: `kubectl get ingress -n zixly`

### Database Down

1. Check RDS status: `aws rds describe-db-instances --db-instance-identifier zixly-production-db`
2. Review CloudWatch logs
3. Execute failover if multi-AZ: `aws rds reboot-db-instance --db-instance-identifier zixly-production-db`
4. Contact AWS support if unrecoverable

### Security Incident

1. Immediately rotate compromised credentials
2. Check audit logs: `kubectl get events -n zixly`
3. Review access logs in CloudWatch
4. Follow incident response procedure

## Communication

### Notify Team

- Slack: #incidents
- On-Call: PagerDuty
- Email: devops@zixly.com.au

### Update Status Page

- Update status.zixly.com.au
- Post to Twitter/LinkedIn if public impact

## Reference Links

- [GitHub Actions Workflows](.github/workflows/)
- [Terraform Documentation](terraform/README.md)
- [Architecture Diagrams](docs/architecture/)
- [Monitoring Dashboards](grafana/dashboards/)
- [API Documentation](docs/api/)

---

**Last Deployment**: [Date]  
**Deployed By**: [Name]  
**Deployment Version**: [Version]
