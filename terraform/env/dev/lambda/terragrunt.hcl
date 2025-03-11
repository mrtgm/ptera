include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//lambda"
}

dependencies {
  paths = ["../iam", "../database", "../cognito"]
}

dependency "iam" {
  config_path = "../iam"

  mock_outputs = {
    lambda_execution_role_arn = "arn:aws:iam::123456789012:role/my-role"
  }
}

dependency "cognito" {
  config_path = "../cognito"

  mock_outputs = {
    user_pool_id = "us-west-2_123456789012"
    user_pool_client_id = "my-client"
  }
}

inputs = {
  lambda_execution_role_arn = dependency.iam.outputs.lambda_execution_role_arn

  user_pool_id = dependency.cognito.outputs.user_pool_id
  user_pool_client_id = dependency.cognito.outputs.user_pool_client_id
}
