resource "aws_sqs_queue" "pipeline_queue" {
  name                       = "${var.project_name}-${var.queue_name}-${var.environment}"
  message_retention_seconds  = var.message_retention_seconds
  visibility_timeout_seconds = var.visibility_timeout_seconds
  receive_wait_time_seconds  = 20 # Long polling

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

resource "aws_sqs_queue" "pipeline_queue_dlq" {
  name = "${var.project_name}-${var.queue_name}-dlq-${var.environment}"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Purpose     = "dead-letter-queue"
  }
}

resource "aws_sqs_queue_redrive_policy" "pipeline_queue_redrive" {
  queue_url = aws_sqs_queue.pipeline_queue.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.pipeline_queue_dlq.arn
    maxReceiveCount     = 3
  })
}

