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

variable "spa_bucket_name" {
  description = "Name of the S3 bucket for SPA"
  type        = string
}

variable "spa_bucket_arn" {
  description = "ARN of the S3 bucket for SPA"
  type        = string
}

variable "spa_bucket_domain_name" {
  description = "Domain name of the S3 bucket for SPA"
  type        = string
}

variable "logs_bucket_domain_name" {
  description = "Domain name of the S3 bucket for logs"
  type        = string
}

variable "logs_bucket_arn" {
  description = "ARN of the S3 bucket for logs"
  type        = string
}

variable "lambda_function_url" {
  description = "URL of the Lambda function for API"
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function for API"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of ACM certificate for the domain"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the distribution"
  type        = string
}

variable "api_path_pattern" {
  description = "Path pattern for API requests"
  type        = string
  default     = "/api/*"
}

variable "cloudfront_config" {
  description = "CloudFront distribution configuration"
  type = object({
    price_class    = string
    cache_disabled = bool
  })
}

variable "route53_zone_id" {
  description = "Route53 zone ID for the domain"
  type        = string
}

variable "logs_bucket_name" {
  description = "Name of the S3 bucket for logs"
  type        = string
}
