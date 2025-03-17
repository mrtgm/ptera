include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//cloudfront"
}

dependencies {
  paths = ["../storage", "../lambda", "../acm"]
}

dependency "storage" {
  config_path = "../storage"

  mock_outputs = {
    spa_bucket_name       = "spa-bucket-name"
    spa_bucket_arn        = "arn:aws:s3:::spa-bucket-name"
    spa_bucket_domain_name = "spa-bucket-name.s3-website-ap-northeast-1.amazonaws.com"
    logs_bucket_domain_name = "logs-bucket-name.s3.amazonaws.com"
  }
}

dependency "lambda" {
  config_path = "../lambda"

  mock_outputs = {
    lambda_function_url = "https://lambda-function-url.execute-api.ap-northeast-1.amazonaws.com/Prod/"
  }
}

dependency "acm" {
  config_path = "../acm"

  mock_outputs = {
    certificate_validation_arn = "arn:aws:acm:ap-northeast-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
  }
}

inputs = {
  # S3バケット情報
  spa_bucket_name       = dependency.storage.outputs.spa_bucket_name
  spa_bucket_arn        = dependency.storage.outputs.spa_bucket_arn
  spa_bucket_domain_name = dependency.storage.outputs.spa_bucket_domain_name
  logs_bucket_domain_name = dependency.storage.outputs.logs_bucket_domain_name

  # Lambda関数URL
  lambda_function_url   = dependency.lambda.outputs.lambda_function_url

  # ACM証明書
  certificate_arn       = dependency.acm.outputs.certificate_validation_arn
}

