

locals {
  common_vars = read_terragrunt_config(find_in_parent_folders("common.hcl"))

  # 環境名
  env = "prod"

  # 環境固有のドメイン
  domain_name = "${local.common_vars.locals.domain_prefix.prod}.${local.common_vars.locals.base_domain}"

  # 環境固有のタグ
  env_tags = {
    Environment = local.env
  }

  # リソース名のプレフィックス/サフィックス
  name_suffix = "-${local.env}"

  # 本番環境固有の設定
  prod_settings = {
    # CloudFront
    cloudfront = {
      price_class    = "PriceClass_200"  # 日本を含むクラス
      cache_disabled = false  # キャッシュ有効
    }

    # コスト予算アラート
    budget = {
      monthly_limit = 20  # 月額$20
      alert_thresholds = [80, 100]  # 80%と100%でアラート
    }
  }
}

# 現在の環境変数をすべてのモジュールに渡す
inputs = {
  project_name   = local.common_vars.locals.project_name
  env            = local.env
  aws_region     = local.common_vars.locals.aws_region
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
    price_class    = local.prod_settings.cloudfront.price_class
    cache_disabled = local.prod_settings.cloudfront.cache_disabled
  }

  # Budgetアラート設定
  budget_config = local.prod_settings.budget

  # Aurora設定
  aurora_config = local.common_vars.locals.aurora_config

  # API Path Pattern
  api_path_pattern = local.common_vars.locals.api_path_pattern
}
