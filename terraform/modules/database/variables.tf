# modules/database/variables.tf
# 変数定義

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

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs of private subnets for the database"
  type        = list(string)
}

variable "aurora_config" {
  description = "Aurora Serverless v2 configuration"
  type = object({
    engine              = string
    engine_version      = string
    database_name       = string
    min_capacity        = number
    max_capacity        = number
    auto_pause          = bool
    auto_pause_seconds  = number
    backup_retention    = number
  })
}
