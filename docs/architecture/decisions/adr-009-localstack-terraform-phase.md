# ADR-009: LocalStack + Terraform Integration (Phase 1.5)

**Status**: Accepted  
**Date**: 2025-01-27  
**Decision Makers**: Technical Architecture Team, Business Strategy  
**Affected Components**: Infrastructure, deployment pipeline, development workflow

---

## Context

Following ADR-008 (Local Docker First Strategy), Zixly has a working Docker Compose MVP but needs a bridge to production AWS infrastructure. There's a gap in the learning roadmap between Docker fundamentals and AWS cloud deployment.

### Current State (Phase 1)

- ✅ Docker Compose with Redis + Bull queues
- ✅ Working webhook-triggered pipeline
- ✅ PostgreSQL results storage (Supabase)
- ✅ Prometheus + Grafana monitoring
- ❌ **No Terraform experience**
- ❌ **No AWS service experience**
- ❌ **No IaC portfolio artifacts**

### Business Constraints

1. **Portfolio Gap**: Need Terraform code for client demos and job applications
2. **AWS Learning**: Must learn AWS patterns without AWS bills ($0 budget requirement)
3. **Time Constraint**: 2-week window (Weeks 5-6) before dashboard implementation
4. **Client Value**: Need production-ready Terraform modules for first paid client

### Technical Requirements

1. **Queue System**: Move from Redis/Bull to AWS SQS (production-grade queuing)
2. **Storage**: Add S3 for large result datasets (complement PostgreSQL metadata)
3. **Secrets**: Replace `.env` files with Secrets Manager (production-ready)
4. **Portability**: Same Terraform code must work for LocalStack and AWS

---

## Decision

**We will integrate LocalStack as Phase 1.5, creating production-ready Terraform modules that work identically with LocalStack (local) and AWS (production).**

### Implementation Approach

#### Architecture Migration

```
Phase 1 (Current):
Webhook → Redis/Bull → Worker → PostgreSQL
                                (Supabase)

Phase 1.5 (LocalStack):
Webhook → SQS (LocalStack) → Worker → S3 + PostgreSQL
                                      ↓
                                  Secrets Manager

Phase 3 (AWS Production):
Webhook → SQS (AWS) → ECS Worker → S3 (AWS) + RDS
                                    ↓
                                AWS Secrets Manager
```

#### AWS Services Selected

1. **SQS (Simple Queue Service)**
   - Replaces: Redis + Bull
   - Rationale: Managed queue service with built-in DLQ and long polling
   - LocalStack Support: Excellent

2. **S3 (Simple Storage Service)**
   - Use Case: Large result datasets (complements PostgreSQL for metadata)
   - Rationale: Cost-effective storage with lifecycle policies
   - LocalStack Support: Excellent

3. **Secrets Manager**
   - Replaces: `.env` files with plaintext credentials
   - Rationale: Enterprise-grade secret management with rotation support
   - LocalStack Support: Good

#### Why Not Lambda or SNS?

- **Lambda**: Current containerized workers are fine; Lambda adds complexity
- **SNS**: Current email notifications (Nodemailer) work; SNS can be added later

### Terraform Module Structure

```
terraform/
├── modules/                 # Reusable modules
│   ├── queue/              # SQS + DLQ
│   ├── storage/            # S3 + lifecycle
│   └── secrets/            # Secrets Manager
└── environments/
    ├── local/              # LocalStack endpoint
    └── aws/                # AWS production
```

**Key Principle**: Same module code, different provider endpoint.

---

## Rationale

### Why LocalStack?

1. **Zero Cost**: LocalStack Community edition is free
2. **Offline Development**: Can work without internet connection
3. **Fast Iteration**: No AWS API rate limits or propagation delays
4. **Safe Testing**: Can't accidentally incur AWS costs or break production

### Why Terraform Over CDK/Pulumi?

1. **Market Demand**: Terraform is Brisbane's most in-demand IaC tool
2. **Declarative**: HCL is simpler than imperative TypeScript (CDK)
3. **Provider Ecosystem**: 3000+ providers, not just AWS
4. **State Management**: Built-in state file for tracking resources

### Why Phase 1.5 (Not Skip to AWS)?

| Criteria              | Skip LocalStack | Use LocalStack |
| --------------------- | --------------- | -------------- |
| **Time to Portfolio** | 3-4 weeks       | 2 weeks ⭐     |
| **AWS Costs**         | $250/month      | $0 ⭐          |
| **Learning Curve**    | Steep           | Gradual ⭐     |
| **Risk**              | High (bills)    | Zero ⭐        |
| **Terraform Output**  | Same            | Same ⭐        |

LocalStack provides identical Terraform experience at zero cost and lower risk.

---

## Implementation Details

### Terraform Modules

#### Queue Module (`modules/queue/`)

```hcl
resource "aws_sqs_queue" "pipeline_queue" {
  name                       = "${var.project_name}-${var.queue_name}-${var.environment}"
  message_retention_seconds  = 86400  # 24 hours
  visibility_timeout_seconds = 3600   # 1 hour
  receive_wait_time_seconds  = 20     # Long polling
}

resource "aws_sqs_queue" "pipeline_queue_dlq" {
  name = "${var.project_name}-${var.queue_name}-dlq-${var.environment}"
}

resource "aws_sqs_queue_redrive_policy" "pipeline_queue_redrive" {
  queue_url = aws_sqs_queue.pipeline_queue.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.pipeline_queue_dlq.arn
    maxReceiveCount     = 3
  })
}
```

#### Storage Module (`modules/storage/`)

```hcl
resource "aws_s3_bucket" "pipeline_results" {
  bucket = "${var.project_name}-pipeline-results-${var.environment}"
}

resource "aws_s3_bucket_lifecycle_configuration" "pipeline_results_lifecycle" {
  bucket = aws_s3_bucket.pipeline_results.id

  rule {
    id     = "archive-old-results"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "GLACIER"  # LocalStack ignores, AWS uses
    }

    expiration {
      days = 365
    }
  }
}
```

#### Secrets Module (`modules/secrets/`)

```hcl
resource "aws_secretsmanager_secret" "trading_api_credentials" {
  name        = "${var.project_name}/trading-api-${var.environment}"
  description = "Trading API credentials for pipeline workers"
}

resource "aws_secretsmanager_secret_version" "trading_api_credentials" {
  secret_id = aws_secretsmanager_secret.trading_api_credentials.id
  secret_string = jsonencode({
    api_key  = var.trading_api_key
    base_url = var.trading_api_url
  })
}
```

### Provider Configuration

**LocalStack** (`environments/local/main.tf`):

```hcl
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    sqs            = "http://localhost:4566"
    s3             = "http://localhost:4566"
    secretsmanager = "http://localhost:4566"
  }
}
```

**AWS Production** (`environments/aws/main.tf`):

```hcl
provider "aws" {
  region = "ap-southeast-2"  # Sydney
  # No endpoints - uses real AWS
  # No test credentials - uses AWS credentials from environment
}
```

**Same modules, different endpoint** - that's it!

### Application Integration

Services use AWS SDK with environment-based configuration:

```typescript
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL || undefined, // undefined = AWS
  credentials: process.env.AWS_ENDPOINT_URL
    ? {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      }
    : undefined, // undefined = use AWS credentials
})
```

**Environment Variables**:

- **LocalStack**: `AWS_ENDPOINT_URL=http://localhost:4566`
- **AWS**: `AWS_ENDPOINT_URL` not set (uses default AWS endpoints)

---

## Consequences

### Positive

1. **Terraform Portfolio**: Production-ready modules for client demos and job applications
2. **AWS Experience**: Hands-on with SQS, S3, Secrets Manager without AWS bills
3. **Smooth Migration**: Same code works for AWS (change 1 provider config)
4. **Fast Iteration**: LocalStack restarts are instant, no AWS propagation delays
5. **Cost Savings**: $250/month savings vs AWS EKS during learning phase
6. **Risk Mitigation**: Can't accidentally create expensive AWS resources

### Negative

1. **LocalStack Limitations**: Not 100% AWS-compatible (95% for selected services)
2. **Extra Setup**: Docker Compose now manages 7 services instead of 6
3. **Learning Curve**: Must learn Terraform + AWS patterns simultaneously

### Neutral

1. **Dual Queue System**: Redis and SQS both present during transition
   - Mitigation: Gradually deprecate Redis after SQS validation
2. **Service Complexity**: Application code now supports Redis OR SQS
   - Mitigation: Abstract behind interface, remove Redis in Phase 3

---

## Migration Path to AWS

When ready for production AWS deployment:

### Step 1: Create AWS Environment

```bash
cd terraform/environments/aws
cp ../local/main.tf .
# Edit: Remove endpoints block, change region
terraform init
terraform apply
```

### Step 2: Update Service Configuration

```bash
# .env.production
AWS_REGION=ap-southeast-2  # Sydney
# AWS_ENDPOINT_URL not set (uses default AWS)
SQS_QUEUE_URL=https://sqs.ap-southeast-2.amazonaws.com/...
S3_BUCKET_NAME=zixly-pipeline-results-prod
```

### Step 3: Deploy Application

**Zero code changes required** - only configuration.

---

## Alternatives Considered

### Alternative 1: Skip LocalStack, Use AWS Free Tier

**Rejected because**:

- Still incurs costs after free tier limits
- Risk of accidentally exceeding free tier (billing surprise)
- Requires credit card and AWS account setup
- Can't work offline

### Alternative 2: Use Serverless Framework Instead of Terraform

**Rejected because**:

- Less Brisbane job market demand (Terraform > Serverless Framework)
- Specific to Lambda (we're using containers)
- Doesn't teach general IaC principles

### Alternative 3: Wait Until Phase 3 (First Client)

**Rejected because**:

- No Terraform portfolio for client demos
- Steeper learning curve (AWS + Terraform simultaneously)
- Can't practice IaC patterns before billing starts

---

## Success Criteria

Phase 1.5 is successful when:

- ✅ `terraform apply` creates SQS, S3, Secrets Manager in LocalStack
- ✅ Pipeline jobs flow through SQS instead of Redis
- ✅ Result datasets stored in S3
- ✅ Secrets fetched from Secrets Manager (not `.env`)
- ✅ Same Terraform code documented for AWS migration
- ✅ Zero AWS costs incurred
- ✅ Portfolio has production-ready Terraform modules

---

## Implementation Timeline

**Week 5**:

- Day 1-2: Create Terraform modules and LocalStack integration
- Day 3-4: Migrate services to AWS SDK (SQS, S3, Secrets)
- Day 5: Testing and documentation

**Week 6**:

- Day 1-2: Dashboard integration (read from S3)
- Day 3: Create demo materials (screenshots, video)
- Day 4-5: Buffer for issues, polish documentation

---

## References

- [ADR-008: Local Docker First Strategy](./adr-008-local-docker-first-strategy.md) - Predecessor decision
- [ADR-006: Kubernetes Pipeline Orchestration](./adr-006-kubernetes-pipeline-orchestration.md) - Future state
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS SQS Best Practices](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html)
- [LocalStack Terraform Guide](https://docs.localstack.cloud/user-guide/integrations/terraform/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Review Cycle**: Week 6 (Phase 1.5 completion)  
**Next Review**: 2025-02-10  
**Migration Trigger**: First paying client or 100+ jobs/day
