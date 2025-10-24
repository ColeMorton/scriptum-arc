# ADR-006: Kubernetes Jobs for Pipeline Orchestration

**Status**: Accepted
**Date**: 2025-01-27
**Decision Makers**: Technical Architecture Team
**Affected Components**: Pipeline execution, job scheduling, infrastructure

---

## Context

Zixly is pivoting from n8n-based automation services to DevOps automation consulting. We need to choose a pipeline orchestration technology for webhook-triggered data analysis workflows, specifically starting with trading strategy backtesting pipelines.

### Requirements

1. **Event-Driven**: Trigger jobs via webhooks from external APIs
2. **Long-Running**: Support jobs that take minutes to hours (parameter sweep analysis)
3. **Scalable**: Handle multiple concurrent jobs without resource contention
4. **Observable**: Track job status, execution time, and resource usage
5. **Cost-Effective**: Minimize infrastructure costs for MVP validation
6. **Cloud-Native**: Support future migration to AWS EKS
7. **Developer Experience**: Fast local development and testing

### Options Considered

#### Option 1: pipeline Workflows (Current Approach)

**Pros**:

- Already implemented and working
- Visual workflow editor for non-technical users
- 500+ pre-built integrations
- Self-hosted with full control

**Cons**:

- Not aligned with new DevOps automation positioning
- Limited scalability for compute-intensive jobs
- Not industry-standard for DevOps automation
- Less relevant for Brisbane DevOps job market
- Workflow-centric rather than infrastructure-centric

#### Option 2: Kubernetes Jobs

**Pros**:

- Industry-standard container orchestration
- Native support for job scheduling and execution
- Excellent scalability and resource management
- Strong Brisbane job market demand
- Cloud-native (AWS EKS compatible)
- Built-in monitoring and observability
- Declarative infrastructure as code

**Cons**:

- Steeper learning curve than n8n
- More complex local development setup
- Requires Kubernetes knowledge for maintenance

#### Option 3: AWS Step Functions

**Pros**:

- Serverless (no infrastructure management)
- Native AWS integration
- Visual workflow editor
- Pay-per-execution pricing

**Cons**:

- Vendor lock-in to AWS
- Not transferable to local development
- Less relevant for general DevOps consulting
- Limited to 1-year maximum execution time
- More expensive for frequent, long-running jobs

#### Option 4: Airflow

**Pros**:

- Purpose-built for data pipelines
- Python-based (good for data science)
- Rich UI and monitoring
- Strong community

**Cons**:

- Heavyweight for simple webhook triggers
- Complex setup and maintenance
- Overkill for MVP validation
- Less aligned with container orchestration focus

---

## Decision

**We will use Kubernetes Jobs for pipeline orchestration, with Docker Compose for local development.**

### Rationale

1. **Market Alignment**: Kubernetes is the #1 in-demand DevOps skill in Brisbane (per job market research). Demonstrating Kubernetes expertise is critical for service positioning.

2. **Learning Value**: Building with Kubernetes directly supports the DevOps automation learning roadmap (Phase 2 of the pivot plan).

3. **Scalability**: Kubernetes Jobs natively handle resource allocation, retries, and parallelism - essential for data analysis pipelines.

4. **Cloud-Native**: Seamless path to AWS EKS production deployment while maintaining local development via Docker Compose or Minikube.

5. **Infrastructure as Code**: Kubernetes manifests are version-controlled, reviewable, and repeatable - core DevOps principles.

6. **Cost-Effective MVP**: Docker Compose provides free local development and testing before committing to cloud infrastructure.

7. **Observability**: Built-in metrics integration with Prometheus and Grafana aligns with DevOps monitoring best practices.

---

## Implementation Approach

### Phase 1: Local Docker Compose (MVP - Weeks 1-4)

**Architecture**:

```
Webhook Receiver (Express.js)
  → Redis Job Queue (Bull)
    → Pipeline Worker (Node.js container)
      → PostgreSQL (Supabase) - Results storage
```

**Benefits**:

- No Kubernetes knowledge required initially
- Fast iteration and debugging
- Zero infrastructure costs
- Proves business value before cloud investment

**Limitations**:

- Manual scaling (single worker initially)
- No automatic restarts on failure
- Limited monitoring capabilities

### Phase 2: Local Kubernetes (Weeks 5-8)

**Architecture**:

```
Webhook Receiver (Kubernetes Service)
  → Redis (StatefulSet)
    → Kubernetes Jobs (created dynamically per request)
      → PostgreSQL (external Supabase)
```

**Benefits**:

- Learn Kubernetes locally (Minikube or Docker Desktop)
- Test job isolation and resource limits
- Validate Helm charts before production
- Practice infrastructure as code

**Limitations**:

- Local resource constraints
- No high availability
- Development-only setup

### Phase 3: AWS EKS Production (Weeks 9-16)

**Architecture**:

```
ALB → Webhook Receiver (EKS Service)
  → ElastiCache Redis
    → EKS Jobs (with auto-scaling)
      → RDS PostgreSQL or Supabase
```

**Benefits**:

- Production-grade scalability
- High availability and fault tolerance
- AWS-native monitoring and logging
- Professional client demonstrations

**Infrastructure**:

- Terraform modules for repeatable deployment
- GitHub Actions CI/CD for automated updates
- CloudWatch + Prometheus for observability

---

## Consequences

### Positive

1. **Portfolio Value**: Live Kubernetes pipeline demonstrates employable DevOps skills for Brisbane market
2. **Service Differentiation**: Moving beyond pipeline positions Zixly as modern DevOps automation expert
3. **Scalability**: Kubernetes handles compute-intensive jobs better than workflow tools
4. **Learning ROI**: Direct learning path to AWS certification and Brisbane DevOps roles
5. **Client Value**: Cloud-native pipelines are more valuable to tech clients than n8n workflows

### Negative

1. **Learning Curve**: Kubernetes is more complex than n8n workflow editor
   - **Mitigation**: Start with Docker Compose, gradually introduce Kubernetes concepts
2. **Setup Complexity**: More moving parts than n8n self-hosted instance
   - **Mitigation**: Document thoroughly, create reusable Terraform modules
3. **Local Development**: Requires more powerful development machine
   - **Mitigation**: Docker Compose for MVP, optional Kubernetes locally

### Neutral

1. **Technology Shift**: Complete pivot from n8n focus
   - Archive n8n workflows for reference
   - Repurpose pipeline integration knowledge for API client development
2. **Documentation Updates**: Extensive documentation changes required
   - Part of pivot plan, budgeted time in Phase 1

---

## Implementation Plan

### Week 1-2: Docker Compose MVP

- [x] Archive n8n workflows and credentials
- [ ] Create `docker-compose.pipeline.yml` with Redis, webhook receiver, worker
- [ ] Implement simple job queue pattern with Bull
- [ ] Deploy trading API integration
- [ ] Store results in Supabase PostgreSQL

### Week 3-4: Monitoring & Dashboard

- [ ] Add Prometheus metrics to pipeline services
- [ ] Configure Grafana dashboards for job monitoring
- [ ] Build Next.js dashboard for job status and results
- [ ] Document pipeline architecture and deployment

### Week 5-8: Kubernetes Migration (Optional for MVP)

- [ ] Create Kubernetes Job manifests
- [ ] Deploy to local Kubernetes (Minikube or Docker Desktop)
- [ ] Test horizontal pod autoscaling
- [ ] Validate resource limits and quotas

### Week 9+: AWS EKS Production

- [ ] Design Terraform modules for EKS cluster
- [ ] Implement GitHub Actions CI/CD
- [ ] Configure AWS-native monitoring
- [ ] Production deployment and client demonstrations

---

## References

- [Kubernetes Jobs Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [DevOps Automation Pivot Plan](/.claude/devops_automation_pivot.md)
- [Brisbane DevOps Job Market Analysis](https://www.seek.com.au/devops-jobs/in-Brisbane-QLD)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-27
**Review Cycle**: After MVP completion (Week 4)
**Next Review**: 2025-02-24
