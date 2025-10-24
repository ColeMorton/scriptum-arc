# ADR-008: Local Docker Compose First Strategy

**Status**: Accepted
**Date**: 2025-01-27
**Decision Makers**: Technical Architecture Team, Business Strategy
**Affected Components**: Development workflow, infrastructure, deployment pipeline

---

## Context

Zixly is pivoting to DevOps automation services with a primary goal of building portfolio-ready infrastructure that demonstrates employable skills for the Brisbane DevOps market. The learning roadmap emphasizes AWS, Kubernetes, and Terraform, but we need to choose the **fastest and cheapest path** to validate the business model before cloud infrastructure investment.

### Business Constraints

1. **Budget**: Minimize AWS costs during MVP validation (target: $0-50/month)
2. **Time**: Prove concept within 4 weeks before committing to cloud migration
3. **Learning ROI**: Focus initial time on Docker (foundational) before Kubernetes (advanced)
4. **Portfolio Value**: Must demonstrate working pipeline for client presentations

### Technical Constraints

1. **Local Development**: Single developer (solo founder) needs fast iteration
2. **External API Dependency**: Trading API runs on `http://localhost:8000`
3. **Zero Downtime Tolerance**: MVP can have downtime, production cannot
4. **Scalability Requirements**: 10-50 jobs/day initially, 1000+ jobs/day at scale

---

## Options Considered

### Option 1: AWS EKS from Day 1

**Architecture**: Deploy directly to AWS Elastic Kubernetes Service

**Pros**:

- Production-grade infrastructure immediately
- Learn Kubernetes from the start
- Full AWS ecosystem integration
- Professional demo environment

**Cons**:

- **Cost**: ~$200-500/month minimum (EKS cluster + EC2 nodes + ALB + RDS)
- **Complexity**: 2-3 weeks setup before first pipeline runs
- **Risk**: Significant investment before business model validation
- **Learning Curve**: Must learn AWS + Kubernetes + Terraform simultaneously
- **Local Development**: Still need local Docker anyway for fast iteration

**Estimated Timeline**: 3-4 weeks to first working pipeline
**Estimated Cost**: $800-2000 for first 4 weeks

**Verdict**: ❌ Rejected - Too slow and expensive for MVP validation

---

### Option 2: Docker Compose for MVP, Kubernetes Later

**Architecture**: Local Docker Compose → Validate → Migrate to Kubernetes

**Pros**:

- **Cost**: $0 for local development (free Docker Desktop)
- **Speed**: 3-5 days to first working pipeline
- **Learning**: Focus on Docker first (foundational skill)
- **Iteration**: Fast local testing and debugging
- **Validation**: Prove business value before cloud investment
- **Flexibility**: Easy to change architecture before cloud lock-in

**Cons**:

- Not "production-ready" (but MVP doesn't need production yet)
- Manual scaling (acceptable for 10-50 jobs/day)
- No high availability (acceptable for internal demo)
- Eventual migration work to Kubernetes (planned in roadmap)

**Estimated Timeline**: 3-5 days to first working pipeline
**Estimated Cost**: $0 for MVP validation (4 weeks)

**Verdict**: ✅ **Recommended** - Fastest path to validation, lowest risk

---

### Option 3: Minikube/Kind (Local Kubernetes)

**Architecture**: Local Kubernetes cluster for development

**Pros**:

- Learn Kubernetes without cloud costs
- Test Kubernetes manifests locally
- Closer to production environment

**Cons**:

- **Learning Curve**: Must learn Kubernetes immediately
- **Resource Intensive**: Requires powerful development machine
- **Slower Iteration**: Kubernetes restart cycle slower than Docker Compose
- **Debugging Complexity**: Harder to debug than simple Docker containers
- **Overkill**: Local MVP doesn't need Kubernetes features (auto-scaling, HA)

**Estimated Timeline**: 1-2 weeks to first working pipeline
**Estimated Cost**: $0 but higher time investment

**Verdict**: ⚠️ **Deferred to Week 5+** - Introduces complexity before business validation

---

## Decision

**We will use Docker Compose for MVP validation (Weeks 1-4), then migrate to Kubernetes when business model is proven.**

### Implementation Phases

#### Phase 1: Docker Compose MVP (Weeks 1-4)

**Goal**: Validate webhook-triggered pipeline architecture with zero AWS costs

**Stack**:

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  webhook-receiver:
    build: ./services/webhook-receiver
    ports:
      - '3000:3000'
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - redis

  pipeline-worker:
    build: ./services/pipeline-worker
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
      - TRADING_API_URL=http://host.docker.internal:8000
    depends_on:
      - redis
    deploy:
      replicas: 2

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
```

**Benefits**:

- ✅ All services run locally
- ✅ Fast development cycle (docker-compose restart)
- ✅ Easy debugging (docker logs -f)
- ✅ Free infrastructure
- ✅ Works offline (no cloud dependency)

**Limitations**:

- ⚠️ Single-machine scaling limits
- ⚠️ No automatic failover
- ⚠️ Manual horizontal scaling

**Success Criteria**:

- [x] Webhook receiver accepts requests
- [ ] Jobs queued and processed by workers
- [ ] Results stored in Supabase
- [ ] Prometheus metrics collected
- [ ] Grafana dashboards functional
- [ ] Trading API integration working

**Deliverables**:

1. Working webhook-triggered pipeline demo
2. Portfolio documentation with screenshots
3. Technical blog post: "Building Webhook Pipelines with Docker Compose"
4. Video walkthrough for client presentations

---

#### Phase 2: Local Kubernetes Learning (Weeks 5-8, Optional)

**Goal**: Learn Kubernetes locally before AWS investment

**Approach**: Deploy same pipeline to Minikube or Docker Desktop Kubernetes

**Benefits**:

- Learn Kubernetes without AWS costs
- Test Helm charts locally
- Practice kubectl commands
- Validate resource limits and scaling

**Not Required for MVP**: This phase is optional for learning purposes only

---

#### Phase 3: AWS EKS Production (Weeks 9-16)

**Goal**: Production-grade deployment for client projects

**Triggers for Migration**:

1. First paying client secured
2. Need for 24/7 availability
3. Scaling beyond local machine capacity (100+ jobs/day)
4. Client requires cloud deployment

**Migration Path**:

1. Create Terraform modules for EKS cluster
2. Convert docker-compose.yml to Kubernetes manifests
3. Setup CI/CD with GitHub Actions
4. Deploy to AWS EKS
5. Configure auto-scaling and monitoring

---

## Rationale

### Why Docker Compose First?

1. **Fastest Time to Value**: 3-5 days vs 2-3 weeks for Kubernetes
   - Can start client conversations sooner
   - Earlier portfolio material for job applications

2. **Lowest Risk**: $0 investment before business validation
   - No AWS bills before first client
   - Can pivot architecture easily if needed

3. **Better Learning Path**: Docker → Kubernetes is natural progression
   - Docker is prerequisite for Kubernetes
   - Understand containers before orchestration
   - Less cognitive load initially

4. **Practical for Solo Developer**:
   - Fast iteration and debugging
   - Low complexity overhead
   - Can work offline (trains, cafes)

5. **Trading API Constraint**: Trading API runs locally (`host.docker.internal:8000`)
   - Easier to connect from local Docker containers
   - No VPN/networking complexity

### Financial Analysis

**Docker Compose MVP (4 weeks)**:

- Infrastructure: $0 (local Docker)
- Database: $0 (Supabase free tier)
- Storage: $0 (local disk)
- **Total**: $0

**AWS EKS Immediate (4 weeks)**:

- EKS Cluster: $73 (cluster fee)
- EC2 Nodes (2x t3.medium): $120
- Load Balancer: $18
- RDS PostgreSQL (or Supabase): $30
- Data transfer: $10
- **Total**: ~$251/month = $1,000 for 4 months

**Savings**: $1,000 by validating locally first

---

## Implementation Details

### Docker Compose Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    docker-compose.pipeline.yml          │
│                                                         │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │ webhook-receiver │───────▶│      redis       │     │
│  │   (Express.js)   │        │   (job queue)    │     │
│  └──────────────────┘        └──────────────────┘     │
│           │                           │                │
│           │                           │                │
│           ▼                           ▼                │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │  Next.js (3000)  │        │ pipeline-worker  │     │
│  │   (dashboard)    │        │    (replicas:2)  │     │
│  └──────────────────┘        └──────────────────┘     │
│           │                           │                │
│           └───────────┬───────────────┘                │
│                       ▼                                │
│              ┌──────────────────┐                      │
│              │  Supabase        │                      │
│              │  (PostgreSQL)    │                      │
│              └──────────────────┘                      │
│                                                         │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │   prometheus     │───────▶│     grafana      │     │
│  │     (9090)       │        │      (3001)      │     │
│  └──────────────────┘        └──────────────────┘     │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Trading API (host machine)  │
        │    http://localhost:8000     │
        └──────────────────────────────┘
```

### Development Workflow

```bash
# Start all services
docker-compose -f docker-compose.pipeline.yml up -d

# View logs
docker-compose -f docker-compose.pipeline.yml logs -f webhook-receiver
docker-compose -f docker-compose.pipeline.yml logs -f pipeline-worker

# Restart after code changes
docker-compose -f docker-compose.pipeline.yml restart webhook-receiver

# Scale workers
docker-compose -f docker-compose.pipeline.yml up -d --scale pipeline-worker=5

# Stop all services
docker-compose -f docker-compose.pipeline.yml down
```

### Testing Strategy

```bash
# Run unit tests (outside Docker)
npm test

# Integration tests with Docker Compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Manual testing
curl -X POST http://localhost:3000/webhook/trading-sweep \
  -H "Content-Type: application/json" \
  -d '{"ticker": "BTC-USD", ...}'
```

---

## Consequences

### Positive

1. **Fast MVP**: Working demo in 3-5 days vs 2-3 weeks
2. **Zero Cost**: No AWS bills during validation
3. **Learning Focus**: Master Docker before Kubernetes complexity
4. **Portfolio Velocity**: Earlier client presentations and job applications
5. **Risk Mitigation**: No financial commitment before business proof

### Negative

1. **Not Production-Grade**: Manual scaling, single point of failure
   - **Mitigation**: This is acceptable for MVP, plan migration to Kubernetes
2. **Eventually Throwaway**: Some Docker Compose config won't transfer to Kubernetes
   - **Mitigation**: Keep services containerized (Dockerfiles reusable), only docker-compose.yml specific
3. **Local Resource Limits**: Can't scale beyond single machine
   - **Mitigation**: Profile performance, understand scaling limits, migrate when needed

### Neutral

1. **Two-Phase Learning**: Docker now, Kubernetes later
   - This is actually optimal learning progression
2. **Migration Work**: Kubernetes migration is planned work
   - Part of roadmap, billable to first client

---

## Decision Matrix

| Criteria               | Docker Compose | Local Kubernetes | AWS EKS Day 1 |
| ---------------------- | -------------- | ---------------- | ------------- |
| **Time to First Demo** | 3-5 days ⭐    | 1-2 weeks        | 2-3 weeks     |
| **MVP Cost**           | $0 ⭐          | $0 ⭐            | $250/month    |
| **Learning Curve**     | Easy ⭐        | Medium           | Hard          |
| **Iteration Speed**    | Fast ⭐        | Medium           | Slow          |
| **Production Ready**   | No             | No               | Yes ⭐        |
| **Portfolio Value**    | Medium         | High             | High ⭐       |
| **AWS Experience**     | None           | None             | Direct ⭐     |

**Winner for MVP**: Docker Compose (3 ⭐ ratings, fastest validation)
**Winner for Production**: AWS EKS (after validation)

---

## Exit Criteria for Migration

Migrate to Kubernetes when **any** of these conditions met:

1. **Client Acquisition**: First paying client requiring 24/7 uptime
2. **Scale**: Processing >100 jobs/day consistently
3. **Geographic Distribution**: Need AWS regions outside Australia
4. **Team Growth**: Multiple developers needing shared dev environment
5. **Learning Milestone**: Completed Kubernetes certification/course

**Estimated Timeline**: Week 9-12 (assuming first client by Week 8)

---

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Compose Production Considerations](https://docs.docker.com/compose/production/)
- [When to use Docker Compose vs Kubernetes](https://www.docker.com/blog/docker-compose-from-local-to-amazon-ecs/)
- [DevOps Automation Pivot Plan](/.claude/devops_automation_pivot.md) - Phase 1 priorities
- [ADR-006: Kubernetes Pipeline Orchestration](./adr-006-kubernetes-pipeline-orchestration.md) - Future state

---

**Document Version**: 1.0
**Last Updated**: 2025-01-27
**Review Cycle**: Week 4 (MVP completion)
**Next Review**: 2025-02-24
**Migration Trigger**: First paying client or 100+ jobs/day
