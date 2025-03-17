remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket         = "ptera-terraform-state"
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  region = "ap-northeast-1"  # 東京リージョン
  default_tags {
    tags = {
      Project     = "ptera"
      ManagedBy   = "terragrunt"
    }
  }
}
EOF
}

terraform {
  extra_arguments "common_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      find_in_parent_folders("common.tfvars", "ignore"),
      find_in_parent_folders("env.tfvars", "ignore")
    ]
  }
}

terragrunt_version_constraint = ">= 0.75.3"
