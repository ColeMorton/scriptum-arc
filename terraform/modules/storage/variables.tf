variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (local, dev, prod)"
  type        = string
}

variable "enable_lifecycle_rules" {
  description = "Enable S3 lifecycle rules (disabled for LocalStack compatibility)"
  type        = bool
  default     = true
}

