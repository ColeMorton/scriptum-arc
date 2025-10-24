output "queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.pipeline_queue.url
}

output "queue_arn" {
  description = "ARN of the SQS queue"
  value       = aws_sqs_queue.pipeline_queue.arn
}

output "queue_name" {
  description = "Name of the SQS queue"
  value       = aws_sqs_queue.pipeline_queue.name
}

output "dlq_url" {
  description = "URL of the dead-letter queue"
  value       = aws_sqs_queue.pipeline_queue_dlq.url
}

output "dlq_arn" {
  description = "ARN of the dead-letter queue"
  value       = aws_sqs_queue.pipeline_queue_dlq.arn
}

output "dlq_name" {
  description = "Name of the dead-letter queue"
  value       = aws_sqs_queue.pipeline_queue_dlq.name
}

