include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//acm"
}

dependencies {
  paths = []
}

# プロバイダプロキシの設定
generate "provider_us_east_1" {
  path      = "provider_us_east_1.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
EOF
}
