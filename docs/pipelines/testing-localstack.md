# Testing LocalStack + Terraform Integration

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Purpose**: Comprehensive guide for testing AWS services emulated by LocalStack

---

## Prerequisites

- LocalStack running on `http://localhost:4566`
- Terraform resources applied (via `init-localstack-terraform.sh`)
- AWS CLI installed (`brew install awscli`)
- `jq` installed for JSON parsing (`brew install jq`)

---

## Quick Verification

### 1. Check LocalStack Health

```bash
curl http://localhost:4566/_localstack/health | jq
```

Expected output:

```json
{
  "services": {
    "sqs": "running",
    "s3": "running",
    "secretsmanager": "running"
  },
  "version": "3.0.0",
  "edition": "community"
}
```

### 2. Verify Terraform Resources

```bash
cd terraform/environments/local

# Get all outputs
terraform output

# Get specific values
terraform output sqs_queue_url
terraform output s3_bucket_name
terraform output -json secrets
```

---

## Testing SQS Queue

### List Queues

```bash
aws --endpoint-url=http://localhost:4566 sqs list-queues
```

Expected output:

```json
{
  "QueueUrls": [
    "http://localhost:4566/000000000000/zixly-trading-sweeps-local",
    "http://localhost:4566/000000000000/zixly-trading-sweeps-dlq-local"
  ]
}
```

### Get Queue Attributes

```bash
aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --attribute-names All | jq
```

Check for:

- `MessageRetentionPeriod`: 86400 (24 hours)
- `VisibilityTimeout`: 3600 (1 hour)
- `ReceiveMessageWaitTimeSeconds`: 20 (long polling)

### Send Test Message

```bash
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --message-body '{
    "jobType": "trading-sweep",
    "payload": {
      "ticker": "BTC-USD",
      "fast_range": [10, 20],
      "slow_range": [20, 30],
      "step": 5
    },
    "enqueuedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }' \
  --message-attributes 'jobType={DataType=String,StringValue=trading-sweep}'
```

Expected output:

```json
{
  "MessageId": "abc123...",
  "MD5OfMessageBody": "..."
}
```

### Receive Messages

```bash
aws --endpoint-url=http://localhost:4566 sqs receive-message \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --max-number-of-messages 1 \
  --wait-time-seconds 5 \
  --message-attribute-names All | jq
```

### Purge Queue (Clear All Messages)

```bash
aws --endpoint-url=http://localhost:4566 sqs purge-queue \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url)
```

---

## Testing S3 Bucket

### List Buckets

```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

Expected output:

```
2025-01-27 10:30:00 zixly-pipeline-results-local
```

### Create Test File and Upload

```bash
# Create test JSON file
cat > test-result.json << 'EOF'
{
  "jobId": "test-job-123",
  "sweepRunId": "test-run-456",
  "results": [
    {
      "ticker": "BTC-USD",
      "fast_period": 10,
      "slow_period": 20,
      "sharpe_ratio": 1.5,
      "total_return_pct": 25.3
    }
  ]
}
EOF

# Upload to S3
aws --endpoint-url=http://localhost:4566 s3 cp test-result.json \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/test-result.json

# Verify upload
aws --endpoint-url=http://localhost:4566 s3 ls \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/
```

### Upload with Metadata

```bash
aws --endpoint-url=http://localhost:4566 s3api put-object \
  --bucket $(cd terraform/environments/local && terraform output -raw s3_bucket_name) \
  --key results/test-job-123/test-run-456.json \
  --body test-result.json \
  --content-type application/json \
  --metadata jobId=test-job-123,sweepRunId=test-run-456,resultCount=1
```

### Get Object Metadata

```bash
aws --endpoint-url=http://localhost:4566 s3api head-object \
  --bucket $(cd terraform/environments/local && terraform output -raw s3_bucket_name) \
  --key results/test-job-123/test-run-456.json | jq
```

### Download Object

```bash
aws --endpoint-url=http://localhost:4566 s3 cp \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/results/test-job-123/test-run-456.json \
  downloaded-result.json

# Verify contents
cat downloaded-result.json | jq
```

### List Objects with Prefix

```bash
aws --endpoint-url=http://localhost:4566 s3 ls \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/results/ \
  --recursive
```

### Delete Test Files

```bash
aws --endpoint-url=http://localhost:4566 s3 rm \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/test-result.json

aws --endpoint-url=http://localhost:4566 s3 rm \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/results/test-job-123/test-run-456.json
```

---

## Testing Secrets Manager

### List Secrets

```bash
aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets | jq
```

Expected output:

```json
{
  "SecretList": [
    {
      "Name": "zixly/trading-api-local",
      "Description": "Trading API credentials for pipeline workers"
    },
    {
      "Name": "zixly/smtp-local",
      "Description": "SMTP credentials for email notifications"
    }
  ]
}
```

### Get Secret Value (Trading API)

```bash
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value \
  --secret-id zixly/trading-api-local \
  | jq -r '.SecretString' | jq
```

Expected output:

```json
{
  "api_key": "dev-key-000000000000000000000000",
  "base_url": "http://host.docker.internal:8000"
}
```

### Get Secret Value (SMTP)

```bash
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value \
  --secret-id zixly/smtp-local \
  | jq -r '.SecretString' | jq
```

Expected output:

```json
{
  "host": "smtp.office365.com",
  "port": 587,
  "user": "your-email@outlook.com",
  "password": "your-password",
  "from": "your-email@outlook.com"
}
```

### Update Secret

```bash
aws --endpoint-url=http://localhost:4566 secretsmanager put-secret-value \
  --secret-id zixly/trading-api-local \
  --secret-string '{
    "api_key": "new-test-key-123",
    "base_url": "http://host.docker.internal:8000"
  }'
```

---

## Integration Testing

### Test Full Pipeline Flow

1. **Send Message to SQS**:

```bash
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --message-body '{
    "jobType": "trading-sweep",
    "payload": {
      "ticker": "ETH-USD",
      "fast_range": [5, 10],
      "slow_range": [15, 20],
      "step": 5
    },
    "enqueuedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }' \
  --message-attributes 'jobType={DataType=String,StringValue=trading-sweep}'
```

2. **Worker Picks Up Message** (check worker logs):

```bash
docker-compose -f docker-compose.pipeline.yml logs -f pipeline-worker
```

3. **Worker Fetches Secrets** (check for successful secret retrieval in logs)

4. **Worker Stores Results in S3** (verify upload):

```bash
aws --endpoint-url=http://localhost:4566 s3 ls \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/results/ \
  --recursive --human-readable
```

5. **Verify Message Deleted from Queue**:

```bash
aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --attribute-names ApproximateNumberOfMessages | jq '.Attributes.ApproximateNumberOfMessages'
```

---

## Debugging

### Check LocalStack Logs

```bash
docker-compose -f docker-compose.pipeline.yml logs -f localstack
```

### Check Service Connectivity

```bash
# From host
curl http://localhost:4566/_localstack/health

# From inside webhook-receiver container
docker-compose -f docker-compose.pipeline.yml exec webhook-receiver \
  curl http://localstack:4566/_localstack/health

# From inside pipeline-worker container
docker-compose -f docker-compose.pipeline.yml exec pipeline-worker \
  curl http://localstack:4566/_localstack/health
```

### Verify Environment Variables

```bash
# Webhook receiver
docker-compose -f docker-compose.pipeline.yml exec webhook-receiver env | grep AWS

# Pipeline worker
docker-compose -f docker-compose.pipeline.yml exec pipeline-worker env | grep AWS
```

### Reset LocalStack Data

```bash
# Stop LocalStack
docker-compose -f docker-compose.pipeline.yml stop localstack

# Remove data volume
docker volume rm zixly-localstack-data

# Start LocalStack
docker-compose -f docker-compose.pipeline.yml up -d localstack

# Re-apply Terraform
cd terraform/environments/local
terraform apply -auto-approve
```

---

## Common Issues

### Issue: "Connection refused" to localhost:4566

**Solution**: LocalStack container not running

```bash
docker-compose -f docker-compose.pipeline.yml up -d localstack
docker-compose -f docker-compose.pipeline.yml logs localstack
```

### Issue: Queue/Bucket not found after restart

**Solution**: LocalStack data is ephemeral, re-apply Terraform

```bash
cd terraform/environments/local
terraform apply -auto-approve
```

### Issue: Services can't reach LocalStack from Docker

**Solution**: Use `localstack:4566` not `localhost:4566` in container environment variables

### Issue: Terraform apply fails with "endpoint not reachable"

**Solution**: Ensure LocalStack is healthy before running Terraform

```bash
curl http://localhost:4566/_localstack/health
# Wait until all services show "running"
```

---

## Performance Testing

### Measure SQS Latency

```bash
time aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url) \
  --message-body '{"test": "latency"}'
```

Typical LocalStack latency: 10-50ms

### Measure S3 Upload Speed

```bash
# Create 1MB test file
dd if=/dev/zero of=test-1mb.bin bs=1m count=1

# Time upload
time aws --endpoint-url=http://localhost:4566 s3 cp test-1mb.bin \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/test-1mb.bin

# Cleanup
rm test-1mb.bin
aws --endpoint-url=http://localhost:4566 s3 rm \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name)/test-1mb.bin
```

---

## Cleanup

### Remove All Test Data

```bash
# Purge SQS queue
aws --endpoint-url=http://localhost:4566 sqs purge-queue \
  --queue-url $(cd terraform/environments/local && terraform output -raw sqs_queue_url)

# Empty S3 bucket
aws --endpoint-url=http://localhost:4566 s3 rm \
  s3://$(cd terraform/environments/local && terraform output -raw s3_bucket_name) \
  --recursive
```

### Destroy Terraform Resources

```bash
cd terraform/environments/local
terraform destroy -auto-approve
```

### Stop LocalStack

```bash
docker-compose -f docker-compose.pipeline.yml stop localstack
```

---

## References

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS CLI Command Reference - SQS](https://docs.aws.amazon.com/cli/latest/reference/sqs/)
- [AWS CLI Command Reference - S3](https://docs.aws.amazon.com/cli/latest/reference/s3/)
- [AWS CLI Command Reference - Secrets Manager](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/)
- [Terraform LocalStack Provider](https://docs.localstack.cloud/user-guide/integrations/terraform/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Maintained By**: Zixly DevOps Team
