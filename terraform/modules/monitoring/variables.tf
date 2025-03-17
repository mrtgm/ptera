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
