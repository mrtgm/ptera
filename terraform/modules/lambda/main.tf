resource "random_password" "oidc_auth_secret" {
  length           = 32
  special          = true
  override_special = "_%@"
}

data "aws_cognito_user_pool_client" "client" {
  user_pool_id = var.user_pool_id
  client_id    = var.user_pool_client_id
}

resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api${var.name_suffix}"
  role          = var.lambda_execution_role_arn
  runtime       = var.lambda_config.runtime
  memory_size   = var.lambda_config.memory_size
  timeout       = var.lambda_config.timeout

  # 実際のコードはGitHub Actionsでデプロイされる
  filename      = data.archive_file.dummy.output_path
  handler       = "index.handler"

  # 環境変数設定
  environment {
    variables = {
      API_VERSION = "v1"
      ENV         = var.env
      DOMAIN_NAME = var.domain_name
      OIDC_AUTH_SECRET = random_password.oidc_auth_secret.result
      OIDC_ISSUER = "https://cognito-idp.${var.aws_region}.amazonaws.com/${var.user_pool_id}"
      OIDC_CLIENT_ID = var.user_pool_client_id
      OIDC_CLIENT_SECRET = data.aws_cognito_user_pool_client.client.client_secret
    }
  }
  tags = var.tags
}

# Lambda関数URLの作成
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "AWS_IAM"  # IAM認証を使用

  cors {
    allow_credentials = true
    allow_origins     = ["https://${var.domain_name}"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["*"]
    max_age           = 86400  # 24時間
  }
}

# CloudWatch Logsグループの設定
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 7  # ログ保持期間
  tags = var.tags
}

# 初回デプロイ時にLambda関数を作成するためのダミーファイル
# https://techblog.szksh.cloud/create-empty-lambda-by-terraform/
data "archive_file" "dummy" {
  type        = "zip"
  output_path = "${path.module}/dummy.zip"
  source {
    content  = "dummy"
    filename = "bootstrap"
  }
  depends_on = [
    null_resource.main
  ]
}

resource "null_resource" "main" {}

