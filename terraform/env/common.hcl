locals {
  project_name = "ptera"
  aws_region   = "ap-northeast-1"

  common_tags = {
    Project     = "ptera"
    ManagedBy   = "terragrunt"
  }
}
