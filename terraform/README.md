# Zixly Terraform Infrastructure

This directory contains Terraform modules and configurations for Zixly's pipeline infrastructure, supporting both LocalStack (local development) and AWS (production).

## Architecture

```
terraform/
├── modules/           # Reusable Terraform modules
│   ├── queue/        # SQS queue with DLQ
│   ├── storage/      # S3 bucket with lifecycle
│   └── secrets/      # Secrets Manager
└── environments/     # Environment-specific configurations
    ├── local/        # LocalStack (localhost:4566)
    └── aws/          # AWS Production (future)
```

## Modules

### Queue Module (`modules/queue/`)

Creates an SQS queue with dead-letter queue (DLQ) for failed message handling.

**Resources:**

- `aws_sqs_queue.pipeline_queue` - Main job queue
- `aws_sqs_queue.pipeline_queue_dlq` - Dead-letter queue
- `aws_sqs_queue_redrive_policy` - Redrive configuration (3 retries)

### Storage Module (`modules/storage/`)

Creates an S3 bucket for pipeline result storage with versioning and lifecycle policies.

**Resources:**

- `aws_s3_bucket.pipeline_results` - Results storage bucket
- `aws_s3_bucket_versioning` - Version control for objects
- `aws_s3_bucket_lifecycle_configuration` - Auto-archival after 30 days

### Secrets Module (`modules/secrets/`)

Creates AWS Secrets Manager secrets for sensitive credentials.

**Resources:**

- `aws_secretsmanager_secret.trading_api_credentials` - Trading API key and URL
- `aws_secretsmanager_secret.smtp_credentials` - Email notification credentials

## Quick Start

### LocalStack (Local Development)

1. **Start LocalStack**:

```bash
docker-compose -f docker-compose.pipeline.yml up -d localstack
```

2. **Initialize and Apply Terraform**:

```bash
cd terraform/environments/local
terraform init
terraform apply
```

3. **Export Outputs**:

```bash
terraform output -json > outputs.json
```

Or use the automated script:

```bash
./scripts/init-localstack-terraform.sh
```

### AWS Production (Future)

```bash
cd terraform/environments/aws
terraform init
terraform apply
```

## Environment Variables

After applying Terraform, configure your services:

```bash
# From Terraform outputs
export SQS_QUEUE_URL=$(terraform output -raw sqs_queue_url)
export S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)
export TRADING_API_SECRET_NAME=$(terraform output -json secrets | jq -r '.trading_api_secret_name')
export SMTP_SECRET_NAME=$(terraform output -json secrets | jq -r '.smtp_secret_name')
```

## Testing

### Test SQS Queue

```bash
# Send test message
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url $(terraform output -raw sqs_queue_url) \
  --message-body '{"test": "message"}'

# Receive messages
aws --endpoint-url=http://localhost:4566 sqs receive-message \
  --queue-url $(terraform output -raw sqs_queue_url)
```

### Test S3 Bucket

```bash
# List buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Upload test file
echo "test" > test.txt
aws --endpoint-url=http://localhost:4566 s3 cp test.txt \
  s3://$(terraform output -raw s3_bucket_name)/test.txt
```

### Test Secrets Manager

```bash
# Get secret value
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value \
  --secret-id $(terraform output -json secrets | jq -r '.trading_api_secret_name')
```

## Migration from LocalStack to AWS

The same Terraform code works for both environments. To migrate:

1. **No code changes required** - only configuration
2. **Remove endpoint overrides** from provider configuration
3. **Change region** to your AWS region (e.g., `ap-southeast-2` for Sydney)
4. **Update credentials** to use AWS IAM instead of test credentials

Example:

```hcl
# LocalStack
provider "aws" {
  region   = "us-east-1"
  endpoint = "http://localhost:4566"
  # ... LocalStack specific config
}

# AWS Production
provider "aws" {
  region = "ap-southeast-2"  # Sydney
  # No endpoint - uses real AWS
}
```

## Troubleshooting

### LocalStack Not Ready

```bash
# Check LocalStack health
curl http://localhost:4566/_localstack/health

# View LocalStack logs
docker-compose -f docker-compose.pipeline.yml logs localstack
```

### Terraform State Issues

```bash
# Remove local state (LocalStack only)
rm -rf .terraform terraform.tfstate*
terraform init
```

### AWS CLI Not Finding Resources

Ensure `--endpoint-url=http://localhost:4566` is specified for all LocalStack commands.

## Documentation

- [ADR-009: LocalStack + Terraform Phase](../../docs/architecture/decisions/adr-009-localstack-terraform-phase.md)
- [Testing LocalStack Guide](../../docs/pipelines/testing-localstack.md)
- [Trading API Pipeline Spec](../../docs/pipelines/trading-api-strategy-sweep.md)
