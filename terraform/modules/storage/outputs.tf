output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.pipeline_results.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.pipeline_results.arn
}

output "bucket_region" {
  description = "Region of the S3 bucket"
  value       = aws_s3_bucket.pipeline_results.region
}

