resource "aws_s3_bucket" "pipeline_results" {
  bucket = "${var.project_name}-pipeline-results-${var.environment}"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Purpose     = "trading-sweep-results"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_versioning" "pipeline_results_versioning" {
  bucket = aws_s3_bucket.pipeline_results.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "pipeline_results_lifecycle" {
  bucket = aws_s3_bucket.pipeline_results.id

  rule {
    id     = "archive-old-results"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "GLACIER" # LocalStack ignores, AWS uses
    }

    expiration {
      days = 365
    }
  }
}

