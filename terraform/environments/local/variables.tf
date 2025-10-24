variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "zixly"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "local"
}

variable "trading_api_key" {
  description = "Trading API authentication key"
  type        = string
  sensitive   = true
}

variable "trading_api_url" {
  description = "Trading API base URL"
  type        = string
  default     = "http://host.docker.internal:8000"
}

variable "smtp_host" {
  description = "SMTP server hostname"
  type        = string
}

variable "smtp_port" {
  description = "SMTP server port"
  type        = number
}

variable "smtp_user" {
  description = "SMTP authentication username"
  type        = string
  sensitive   = true
}

variable "smtp_password" {
  description = "SMTP authentication password"
  type        = string
  sensitive   = true
}

variable "smtp_from" {
  description = "SMTP from email address"
  type        = string
}

