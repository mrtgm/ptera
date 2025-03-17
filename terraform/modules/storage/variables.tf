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

variable "logs_expiration_days" {
  description = "Number of days after which logs should expire"
  type        = number
  default     = 7
}

variable "cloudfront_distribution_arn" {
  description = "ARN of CloudFront distribution for log bucket policy"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "The domain name for the project"
  type        = string
}
