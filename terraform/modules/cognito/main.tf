# Google の OAuth 認証情報を SSM から取得
data "aws_secretsmanager_secret" "google_auth" {
  name = "${var.project_name}/google-auth${var.name_suffix}"
}

data "aws_secretsmanager_secret_version" "secrets" {
  secret_id = data.aws_secretsmanager_secret.google_auth.id
}

locals {
  auth = jsondecode(data.aws_secretsmanager_secret_version.secrets.secret_string)
}

resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}${var.name_suffix}"

  # 自動検証設定
  auto_verified_attributes = ["email"]

  # ユーザー名の設定
  username_attributes      = ["email"]
  username_configuration {
    case_sensitive = false
  }

  # MFAは無効
  mfa_configuration = "OFF"

  # 管理画面テーマ設定
  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  # 検証メッセージのカスタマイズ
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "【${var.project_name}】認証コード"
    email_message        = "認証コード: {####}"
  }

  # メール設定
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # スキーマ属性
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
    string_attribute_constraints {
      min_length = 1
      max_length = 255
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 255
    }
  }

  tags = var.tags
}

# Cognito ユーザープールドメイン
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.env}"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Cognito アプリクライアント
resource "aws_cognito_user_pool_client" "main" {
  name                         = "${var.project_name}-client${var.name_suffix}"
  user_pool_id                 = aws_cognito_user_pool.main.id
  generate_secret              = true
  refresh_token_validity       = 30  # 30日
  access_token_validity        = 1   # 1時間
  id_token_validity            = 1   # 1時間
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # OAuth 設定
  allowed_oauth_flows          = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes         = ["openid", "email", "profile"]

  # コールバック URL（API 経由）
  callback_urls                = ["https://${var.domain_name}/api/auth/callback"]
  logout_urls                  = ["https://${var.domain_name}"]

  # 明示的認証を有効化
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  # サポートするプロバイダ
  supported_identity_providers = ["Google"]

  # デフォルトでは認証情報キャッシュを無効
  prevent_user_existence_errors = "ENABLED"
}

# Googleの Identity Provider設定（環境変数から取得）
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id                     = local.auth.google-client-id
    client_secret                 = local.auth.google-client-secret
    authorize_scopes              = "profile email openid"
    oidc_issuer                   = "https://accounts.google.com"
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = "true"
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
    token_request_method          = "POST"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
    name     = "name"
  }
}

data "aws_region" "current" {}
