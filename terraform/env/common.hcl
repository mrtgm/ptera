locals {
  project_name = "ptera"
  aws_region   = "ap-northeast-1"  # 東京リージョン

  # ベースドメイン
  base_domain  = "morio.space"

  # IAMロール用のパス
  iam_role_path = "/service-roles/"

  # サブドメイン用のプレフィックス
  domain_prefix = {
    dev  = "dev.ptera"
    prod = "ptera"
  }

  # デフォルトのタグ
  common_tags = {
    Project     = "ptera"
    ManagedBy   = "terragrunt"
  }

  # API パス設定
  api_path_pattern = "/api/*"

  # Lambda関数の設定
  lambda_config = {
    runtime     = "nodejs20.x"
    memory_size = 256
    timeout     = 10
  }

  # Aurora Serverless v2 設定
  aurora_config = {
    engine              = "aurora-postgresql"
    engine_version      = "15.7"
    db_name             = "ptera"
    database_name       = "ptera"
    min_capacity        = 0      # 最小ACU
    max_capacity        = 2      # 最大ACU
    auto_pause          = true
    auto_pause_seconds  = 1800   # 30分
    backup_retention    = 1      # 1日
  }

  # S3のライフサイクルポリシー
  s3_lifecycle_rules = {
    logs = {
      expiration_days = 7
    }
  }
}
