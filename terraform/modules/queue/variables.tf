variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "queue_name" {
  description = "Queue name (will be prefixed with project and environment)"
  type        = string
}

variable "environment" {
  description = "Environment name (local, dev, prod)"
  type        = string
}

variable "message_retention_seconds" {
  description = "Number of seconds SQS retains a message"
  type        = number
  default     = 86400 # 24 hours
}

variable "visibility_timeout_seconds" {
  description = "Visibility timeout for messages being processed"
  type        = number
  default     = 3600 # 1 hour
}

