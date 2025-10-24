# LocalStack Environment Configuration

This environment configuration uses LocalStack to emulate AWS services locally for development and testing.

## Prerequisites

1. **Docker Desktop** running
2. **Terraform** 1.6.0 or higher
3. **LocalStack** container running on port 4566

## Quick Start

### 1. Start LocalStack

```bash
# From project root
docker-compose -f docker-compose.pipeline.yml up -d localstack

# Verify LocalStack is healthy
curl http://localhost:4566/_localstack/health
```

### 2. Configure Variables

Edit `terraform.tfvars` with your credentials:

```hcl
smtp_user     = "your-email@outlook.com"
smtp_password = "your-actual-password"
smtp_from     = "your-email@outlook.com"
```

### 3. Initialize Terraform

```bash
terraform init
```

This will download the AWS provider and initialize the backend.

### 4. Plan and Apply

```bash
# Preview changes
terraform plan

# Create resources in LocalStack
terraform apply
```

## Resources Created

After `terraform apply`, the following resources are created in LocalStack:

### SQS Queue

- **Main Queue**: `zixly-trading-sweeps-local`
  - Message retention: 24 hours
  - Visibility timeout: 1 hour
  - Long polling enabled (20 seconds)
- **Dead-Letter Queue**: `zixly-trading-sweeps-dlq-local`
  - Max receive count: 3 attempts before moving to DLQ

### S3 Bucket

- **Bucket**: `zixly-pipeline-results-local`
  - Versioning: Enabled
  - Lifecycle policy: Archive to GLACIER after 30 days, delete after 365 days
  - Note: LocalStack ignores GLACIER transitions, but policy is AWS-compatible

### Secrets Manager

- **Trading API Secret**: `zixly/trading-api-local`
  - Contains: `api_key` and `base_url`
- **SMTP Secret**: `zixly/smtp-local`
  - Contains: `host`, `port`, `user`, `password`, `from`

## Outputs

After applying, Terraform outputs the following:

```bash
# Get queue URL
terraform output sqs_queue_url

# Get S3 bucket name
terraform output s3_bucket_name

# Get secret names (sensitive)
terraform output -json secrets
```

## Testing Resources

### Test SQS Queue

```bash
# Send a test message
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url $(terraform output -raw sqs_queue_url) \
  --message-body '{"jobType":"trading-sweep","payload":{"ticker":"BTC-USD"}}'

# Receive messages
aws --endpoint-url=http://localhost:4566 sqs receive-message \
  --queue-url $(terraform output -raw sqs_queue_url) \
  --max-number-of-messages 1

# Get queue attributes
aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes \
  --queue-url $(terraform output -raw sqs_queue_url) \
  --attribute-names All
```

### Test S3 Bucket

```bash
# List buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Create test file and upload
echo '{"test": "data"}' > test.json
aws --endpoint-url=http://localhost:4566 s3 cp test.json \
  s3://$(terraform output -raw s3_bucket_name)/test.json

# List bucket contents
aws --endpoint-url=http://localhost:4566 s3 ls \
  s3://$(terraform output -raw s3_bucket_name)/

# Download file
aws --endpoint-url=http://localhost:4566 s3 cp \
  s3://$(terraform output -raw s3_bucket_name)/test.json downloaded.json
```

### Test Secrets Manager

```bash
# Get trading API secret
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value \
  --secret-id zixly/trading-api-local \
  | jq -r '.SecretString' | jq .

# Get SMTP secret
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value \
  --secret-id zixly/smtp-local \
  | jq -r '.SecretString' | jq .

# List all secrets
aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets
```

## Integration with Services

### Environment Variables

Export these for your services:

```bash
export AWS_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
export SQS_QUEUE_URL=$(terraform output -raw sqs_queue_url)
export S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)
export TRADING_API_SECRET_NAME=$(terraform output -json secrets | jq -r '.trading_api_secret_name')
export SMTP_SECRET_NAME=$(terraform output -json secrets | jq -r '.smtp_secret_name')
```

Or use the init script:

```bash
# From project root
./scripts/init-localstack-terraform.sh
```

## Troubleshooting

### "Connection refused" to localhost:4566

LocalStack is not running:

```bash
docker-compose -f docker-compose.pipeline.yml up -d localstack
docker-compose -f docker-compose.pipeline.yml logs localstack
```

### Terraform state issues

Remove local state and reinitialize:

```bash
rm -rf .terraform terraform.tfstate*
terraform init
terraform apply
```

### Resources not created

Check LocalStack logs:

```bash
docker-compose -f docker-compose.pipeline.yml logs -f localstack
```

LocalStack might need restart:

```bash
docker-compose -f docker-compose.pipeline.yml restart localstack
```

### AWS CLI not finding resources

Ensure you're using `--endpoint-url=http://localhost:4566` on all commands.

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

Note: LocalStack state is ephemeral. Restarting the container will clear all resources.

## Migration to AWS

This configuration is designed to be AWS-compatible. To migrate:

1. Copy to `../aws/` directory
2. Remove `endpoints` block from provider
3. Remove test credentials
4. Change region to your AWS region
5. Add proper AWS credentials configuration

See `../aws/` for production configuration (future).
