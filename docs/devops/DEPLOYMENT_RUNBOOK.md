# Zixly Deployment Runbook

**Version:** 1.0  
**Last Updated:** 2024-01-XX  
**Owner:** DevOps Team

## Overview

This runbook provides step-by-step instructions for deploying the Zixly platform across different environments.

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
# Development
export DATABASE_URL="postgresql://..."
export NEXT_PUBLIC_SUPABASE_URL="http://..."
export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
export POSTGRES_PASSWORD="..."
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

1. Webhook Receiver: `curl http://localhost:3002/health`
2. Pipeline Worker: Check logs for "Worker started"
3. Next.js App: `curl http://localhost:3000`
4. Redis: `docker-compose exec redis redis-cli ping`
5. PostgreSQL: `docker-compose exec postgres pg_isready -U trading_user`

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

### 4. AWS EKS Deployment (Microservices)

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
# Webhook Receiver
curl https://api.your-domain.com/health

# Pipeline Worker
kubectl logs -f deployment/pipeline-worker -n zixly | grep "Worker started"

# Database connectivity
kubectl exec -it deployment/webhook-receiver -n zixly -- \
  psql $DATABASE_URL -c "SELECT version();"

# Redis connectivity
kubectl exec -it deployment/webhook-receiver -n zixly -- \
  redis-cli -h redis -p 6379 ping
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
