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

variable "alert_emails" {
  description = "List of email addresses for alert notifications"
  type        = list(string)
  default     = []
}

variable "budget_config" {
  description = "Budget alert configuration"
  type = object({
    monthly_limit     = number
    alert_thresholds  = list(number)
  })
}

variable "lambda_function_name" {
  description = "Name of the Lambda function to monitor"
  type        = string
}

variable "aurora_cluster_id" {
  description = "ID of the Aurora cluster to monitor"
  type        = string
}

variable "aurora_config" {
  description = "Aurora configuration for setting alarms"
  type = object({
    max_capacity = number
  })
}

variable "use_elasticache" {
  description = "Whether ElastiCache is used"
  type        = bool
  default     = false
}

variable "elasticache_cluster_id" {
  description = "ID of the ElastiCache cluster to monitor"
  type        = string
  default     = ""
}
