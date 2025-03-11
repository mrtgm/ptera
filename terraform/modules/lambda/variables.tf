variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
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

variable "user_pool_id" {
  description = "ID of the Cognito user pool"
  type        = string
}

variable "user_pool_client_id" {
  description = "ID of the Cognito user pool client"
  type        = string
}
