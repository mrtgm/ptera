include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//monitoring"
}

dependencies {
  paths = ["../lambda", "../database"]
}

dependency "lambda" {
  config_path = "../lambda"

  mock_outputs = {
    lambda_function_name = "dummy-lambda-function-name"
  }
}

dependency "database" {
  config_path = "../database"

  mock_outputs = {
    aurora_cluster_id = "dummy-aurora-cluster-id"
  }
}

inputs = {
  alert_emails = ["xtarako@gmail.com"]

  lambda_function_name = dependency.lambda.outputs.lambda_function_name
  aurora_cluster_id = dependency.database.outputs.aurora_cluster_id
}
