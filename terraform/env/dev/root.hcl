# 共通の変数ファイルを読み込み
locals {
  common_vars = read_terragrunt_config(find_in_parent_folders("common.hcl"))

  # 環境名
  env = "dev"

  # 環境固有のドメイン
  domain_name = "${local.common_vars.locals.domain_prefix.dev}.${local.common_vars.locals.base_domain}"

  # 環境固有のタグ
  env_tags = {
    Environment = local.env
  }

  # リソース名のプレフィックス/サフィックス
  name_suffix = "-${local.env}"

  # 開発環境固有の設定
  dev_settings = {
    # CloudFront
    cloudfront = {
      price_class = "PriceClass_200"  # 日本を含むクラス
      cache_disabled = true           # 開発環境のキャッシュは無効
    }

    # コスト予算アラート
    budget = {
      monthly_limit = 5  # 月額$5
      alert_thresholds = [80, 100]  # 80%と100%でアラート
    }
  }
}


# 現在の環境変数をすべてのモジュールに渡す
inputs = {
  project_name   = local.common_vars.locals.project_name
  env            = local.env
  aws_region     = local.common_vars.locals.aws_region
  base_domain   = local.common_vars.locals.base_domain
  domain_name    = local.domain_name
  name_suffix    = local.name_suffix

  # タグをマージ
  tags = merge(
    local.common_vars.locals.common_tags,
    local.env_tags
  )

  # Lambda設定
  lambda_config = local.common_vars.locals.lambda_config

  # CloudFront設定
  cloudfront_config = {
    price_class    = local.dev_settings.cloudfront.price_class
    cache_disabled = local.dev_settings.cloudfront.cache_disabled
  }

  # Budgetアラート設定
  budget_config = local.dev_settings.budget

  # Aurora設定
  aurora_config = local.common_vars.locals.aurora_config

  # API Path Pattern
  api_path_pattern = local.common_vars.locals.api_path_pattern

  # キャッシュ設定 (開発環境ではElastiCacheを使わない)
  use_elasticache = false
}
