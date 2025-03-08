variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "name_suffix" {
  description = "Suffix to append to resource names"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution role"
  type        = string
}

variable "lambda_config" {
  description = "Lambda function configuration"
  type = object({
    runtime                = string
    memory_size            = number
    timeout                = number
  })
}

variable "domain_name" {
  description = "Domain name for CORS settings"
  type        = string
}

variable "aurora_config" {
  description = "Aurora database configuration"
  type = object({
    database_name = string
  })
}

variable "aurora_cluster_arn" {
  description = "ARN of the Aurora cluster"
  type        = string
  default     = ""
}

variable "aurora_secret_arn" {
  description = "ARN of the Aurora secret in Secrets Manager"
  type        = string
  default     = ""
}
