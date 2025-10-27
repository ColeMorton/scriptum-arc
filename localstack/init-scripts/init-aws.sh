#!/bin/bash

# LocalStack AWS Resources Initialization Script
# This script initializes AWS resources for both zixly and trading projects

set -e

echo "🚀 Initializing LocalStack AWS resources..."

# Wait for LocalStack to be ready
echo "⏳ Waiting for LocalStack to be ready..."
until curl -s http://localstack:4566/_localstack/health > /dev/null; do
  echo "Waiting for LocalStack..."
  sleep 2
done

echo "✅ LocalStack is ready"

# Configure AWS CLI for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localstack:4566

# S3 Buckets
echo "📦 Creating S3 buckets..."
aws s3 mb s3://zixly-pipeline-data || echo "Bucket zixly-pipeline-data already exists"
aws s3 mb s3://trading-results || echo "Bucket trading-results already exists"
aws s3 mb s3://zixly-job-results || echo "Bucket zixly-job-results already exists"

# SQS Queues
echo "📬 Creating SQS queues..."
aws sqs create-queue --queue-name trading-sweep-jobs || echo "Queue trading-sweep-jobs already exists"
aws sqs create-queue --queue-name notifications || echo "Queue notifications already exists"
aws sqs create-queue --queue-name zixly-job-queue || echo "Queue zixly-job-queue already exists"

# SNS Topics
echo "📢 Creating SNS topics..."
aws sns create-topic --name trading-alerts || echo "Topic trading-alerts already exists"
aws sns create-topic --name zixly-notifications || echo "Topic zixly-notifications already exists"

# Secrets Manager
echo "🔐 Creating secrets..."
aws secretsmanager create-secret \
  --name trading-api-credentials \
  --secret-string '{"api_key":"dev-key-000000000000000000000000","secret":"dev-secret"}' \
  || echo "Secret trading-api-credentials already exists"

aws secretsmanager create-secret \
  --name smtp-credentials \
  --secret-string '{"host":"smtp.office365.com","port":587,"user":"cole.morton@hotmail.com","password":"your_password"}' \
  || echo "Secret smtp-credentials already exists"

aws secretsmanager create-secret \
  --name zixly-database-credentials \
  --secret-string '{"url":"postgresql://postgres:skRWwFvAE6viEqpA@db.qhndigeishvhanwhvuei.supabase.co:5432/postgres","password":"skRWwFvAE6viEqpA"}' \
  || echo "Secret zixly-database-credentials already exists"

# List created resources
echo "📋 Created resources:"
echo "S3 Buckets:"
aws s3 ls

echo "SQS Queues:"
aws sqs list-queues

echo "SNS Topics:"
aws sns list-topics

echo "Secrets:"
aws secretsmanager list-secrets

echo "✅ LocalStack initialization complete!"
