include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//monitoring"
}

dependencies {
  paths = ["../lambda"]
}

dependency "lambda" {
  config_path = "../lambda"

  mock_outputs = {
    lambda_function_name = "dummy-lambda-function-name"
  }
}

inputs = {
  alert_emails = ["xtarako@gmail.com"]

  lambda_function_name = dependency.lambda.outputs.lambda_function_name
}
