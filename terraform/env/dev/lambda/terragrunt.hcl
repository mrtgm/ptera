include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//lambda"
}

dependencies {
  paths = ["../iam", "../database"]
}

dependency "iam" {
  config_path = "../iam"

  mock_outputs = {
    lambda_execution_role_arn = "arn:aws:iam::123456789012:role/my-role"
  }
}

dependency "database" {
  config_path = "../database"

  mock_outputs = {
    aurora_cluster_arn = "arn:aws:rds:us-west-2:123456789012:cluster:my-cluster"
    aurora_secret_arn  = "arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret"
  }
}

inputs = {
  lambda_execution_role_arn = dependency.iam.outputs.lambda_execution_role_arn

  aurora_cluster_arn = dependency.database.outputs.aurora_cluster_arn
  aurora_secret_arn  = dependency.database.outputs.aurora_secret_arn
}
