terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

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

module "pipeline_queue" {
  source = "../../modules/queue"

  project_name               = var.project_name
  queue_name                 = "trading-sweeps"
  environment                = var.environment
  message_retention_seconds  = 86400 # 24 hours
  visibility_timeout_seconds = 3600  # 1 hour
}

module "pipeline_storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = var.environment
}

module "pipeline_secrets" {
  source = "../../modules/secrets"

  project_name      = var.project_name
  environment       = var.environment
  trading_api_key   = var.trading_api_key
  trading_api_url   = var.trading_api_url
  smtp_host         = var.smtp_host
  smtp_port         = var.smtp_port
  smtp_user         = var.smtp_user
  smtp_password     = var.smtp_password
  smtp_from         = var.smtp_from
}

output "sqs_queue_url" {
  description = "URL of the SQS queue for pipeline jobs"
  value       = module.pipeline_queue.queue_url
}

output "sqs_dlq_url" {
  description = "URL of the dead-letter queue"
  value       = module.pipeline_queue.dlq_url
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for pipeline results"
  value       = module.pipeline_storage.bucket_name
}

output "secrets" {
  description = "Secret names for application configuration"
  value = {
    trading_api_secret_name = module.pipeline_secrets.trading_api_secret_name
    smtp_secret_name        = module.pipeline_secrets.smtp_secret_name
  }
  sensitive = true
}

