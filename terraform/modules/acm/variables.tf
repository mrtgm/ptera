
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

variable "domain_name" {
  description = "Domain name for the certificate"
  type        = string
}

variable "base_domain" {
  description = "Base domain name for the project"
  type        = string
}
