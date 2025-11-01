terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "zixly-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "ap-southeast-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "terraform"
      Project     = "zixly"
      Owner       = "devops"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  environment        = "production"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["ap-southeast-2a", "ap-southeast-2b", "ap-southeast-2c"]

  common_tags = {
    CostCenter = "engineering"
  }
}

# EKS Cluster Module
module "eks_cluster" {
  source = "../../modules/eks-cluster"

  cluster_name       = "zixly-production"
  environment        = "production"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
  kubernetes_version = "1.29"

  node_groups = {
    general = {
      instance_types = ["t3.medium"]
      min_size       = 2
      max_size       = 5
      desired_size   = 2
      capacity_type  = "ON_DEMAND"
    }
    compute = {
      instance_types = ["t3.large"]
      min_size       = 1
      max_size       = 3
      desired_size   = 1
      capacity_type  = "SPOT"
      labels = {
        workload-type = "compute-intensive"
      }
    }
  }

  depends_on = [module.vpc]
}

# RDS PostgreSQL Module
module "rds_postgres" {
  source = "../../modules/rds-postgres"

  identifier           = "zixly-production-db"
  engine_version       = "15.4"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  max_allocated_storage = 500
  
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.database_subnet_ids
  vpc_cidr           = module.vpc.vpc_cidr
  database_name      = "zixly_production"
  master_username    = var.db_master_username
  master_password    = var.db_master_password

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  multi_az               = true
  deletion_protection    = true
  skip_final_snapshot    = false
  final_snapshot_identifier = "zixly-production-final-snapshot-${formatdate("YYYY-MM-DD", timestamp())}"
}

# ElastiCache Redis Module
module "redis" {
  source = "../../modules/elasticache-redis"

  cluster_id       = "zixly-production-cache"
  node_type        = "cache.t3.micro"
  num_cache_nodes  = 1
  engine_version   = "7.1"
  parameter_group_name = "default.redis7"
  
  subnet_ids = module.vpc.elasticache_subnet_ids
  vpc_id     = module.vpc.vpc_id
  vpc_cidr   = module.vpc.vpc_cidr

  maintenance_window      = "sun:05:00-sun:06:00"
  snapshot_retention_limit = 7
  at_rest_encryption_enabled = true
  transit_encryption_enabled  = true
}

# S3 Buckets Module
module "s3_buckets" {
  source = "../../modules/s3-buckets"

  environment = "production"

  buckets = {
    pipeline-data = {
      versioning_enabled = true
      encryption_enabled = true
      lifecycle_rules = {
        transition_old_versions = {
          enabled = true
          days    = 90
          storage_class = "STANDARD_IA"
        }
        expire_old_versions = {
          enabled = true
          days    = 365
        }
      }
    }
    trading-results = {
      versioning_enabled = true
      encryption_enabled = true
    }
  }
}

# IAM Roles for Service Accounts
module "irsa" {
  source = "../../modules/irsa"

  cluster_name    = module.eks_cluster.cluster_name
  cluster_oidc_url = module.eks_cluster.cluster_oidc_provider_url

  service_accounts = {
    webhook-receiver = {
      namespace = "zixly"
      policies = [
        aws_iam_policy.s3_access.arn,
        aws_iam_policy.sqs_access.arn,
        aws_iam_policy.secrets_manager.arn,
      ]
    }
    pipeline-worker = {
      namespace = "zixly"
      policies = [
        aws_iam_policy.s3_access.arn,
        aws_iam_policy.sqs_access.arn,
        aws_iam_policy.secrets_manager.arn,
      ]
    }
  }
}

# IAM Policies
resource "aws_iam_policy" "s3_access" {
  name        = "zixly-s3-access"
  description = "Policy for S3 bucket access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          module.s3_buckets.bucket_arns["pipeline-data"],
          "${module.s3_buckets.bucket_arns["pipeline-data"]}/*",
          module.s3_buckets.bucket_arns["trading-results"],
          "${module.s3_buckets.bucket_arns["trading-results"]}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "sqs_access" {
  name        = "zixly-sqs-access"
  description = "Policy for SQS queue access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:ChangeMessageVisibility"
        ]
        Resource = module.sqs.queue_arns
      }
    ]
  })
}

resource "aws_iam_policy" "secrets_manager" {
  name        = "zixly-secrets-access"
  description = "Policy for AWS Secrets Manager access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          module.secrets.secret_arns["trading-api-credentials"],
          module.secrets.secret_arns["smtp-credentials"]
        ]
      }
    ]
  })
}

# SQS Queues Module
module "sqs" {
  source = "../../modules/sqs"

  environment = "production"

  queues = {
    trading-sweep-jobs = {
      visibility_timeout = 300
      message_retention  = 345600  # 4 days
      max_receive_count  = 3
    }
    notifications = {
      visibility_timeout = 60
      message_retention  = 604800  # 7 days
      max_receive_count  = 3
    }
  }
}

# Secrets Manager Module
module "secrets" {
  source = "../../modules/secrets-manager"

  environment = "production"

  secrets = {
    trading-api-credentials = {
      description = "Trading API credentials for production"
      rotation_enabled = false
    }
    smtp-credentials = {
      description = "SMTP credentials for email notifications"
      rotation_enabled = true
      rotation_schedule_expression = "rate(90 days)"
    }
  }
}

# CloudWatch Log Groups
module "cloudwatch_logs" {
  source = "../../modules/cloudwatch-logs"

  environment = "production"

  log_groups = {
    "/aws/eks/zixly-production/cluster" = {
      retention_in_days = 30
    }
    "/aws/containerinsights/zixly-production/application" = {
      retention_in_days = 7
    }
  }
}

# Route53 Zone (if using custom domain)
module "route53" {
  source = "../../modules/route53"

  domain_name = var.domain_name
  environment = "production"

  create_example_record = true
}

# Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks_cluster.cluster_endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks_cluster.cluster_name
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds_postgres.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = module.redis.endpoint
  sensitive   = true
}

output "s3_bucket_names" {
  description = "S3 bucket names"
  value       = module.s3_buckets.bucket_names
}

output "domain_name" {
  description = "Route53 domain name"
  value       = module.route53.zone_name
}

