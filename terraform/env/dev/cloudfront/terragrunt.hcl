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
    spa_bucket_name       = "spa_bucket_name"
    spa_bucket_arn        = "spa_bucket_arn"
    logs_bucket_name       = "logs_bucket_name"
    logs_bucket_arn       = "logs_bucket_arn"
    spa_bucket_domain_name = "spa_bucket_domain_name"
    logs_bucket_domain_name = "logs_bucket_domain_name"
  }
}

dependency "lambda" {
  config_path = "../lambda"

  mock_outputs = {
    lambda_function_url = "lambda_function_url"
    lambda_function_name = "lambda_function_name"
  }
}

dependency "acm" {
  config_path = "../acm"

  mock_outputs = {
    certificate_validation_arn = "arn:aws:acm:ap-northeast-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
    route53_zone_id = "route53_zone_id"
  }
}

inputs = {
  # S3バケット情報
  spa_bucket_name       = dependency.storage.outputs.spa_bucket_name
  spa_bucket_arn        = dependency.storage.outputs.spa_bucket_arn
  spa_bucket_domain_name = dependency.storage.outputs.spa_bucket_domain_name
  logs_bucket_name       = dependency.storage.outputs.logs_bucket_name
  logs_bucket_arn       = dependency.storage.outputs.logs_bucket_arn
  logs_bucket_domain_name = dependency.storage.outputs.logs_bucket_domain_name

  # Lambda関数URL
  lambda_function_url   = dependency.lambda.outputs.lambda_function_url
  lambda_function_name  = dependency.lambda.outputs.lambda_function_name

  # ACM証明書
  certificate_arn       = dependency.acm.outputs.certificate_validation_arn
  route53_zone_id       = dependency.acm.outputs.route53_zone_id
}

