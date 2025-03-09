# S3オリジン用のOrigin Access Control
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "${var.project_name}-s3-oac${var.name_suffix}"
  description                       = "S3 Origin Access Control for ${var.project_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Lambda関数用のOrigin Access Control
resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "${var.project_name}-lambda-oac${var.name_suffix}"
  description                       = "Lambda Origin Access Control for ${var.project_name}"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} distribution ${var.env}"
  default_root_object = "index.html"
  price_class         = var.cloudfront_config.price_class

  # ログ設定
  logging_config {
    include_cookies = false
    bucket          = "${var.logs_bucket_domain_name}"
    prefix          = "cloudfront-logs/"
  }

  # S3オリジン（SPAフロントエンド用）
  origin {
    domain_name              = var.spa_bucket_domain_name
    origin_id                = "S3-${var.project_name}-spa${var.name_suffix}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  # Lambda関数URL オリジン（API用）
  origin {
    domain_name = replace(replace(var.lambda_function_url, "https://", ""), "/", "")
    origin_id   = "Lambda-${var.project_name}-api${var.name_suffix}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # API用のキャッシュ動作設定
  ordered_cache_behavior {
    path_pattern     = var.api_path_pattern
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Lambda-${var.project_name}-api${var.name_suffix}"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Origin", "Content-Type", "Accept"]

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # index.html用のキャッシュ動作設定
  ordered_cache_behavior {
    path_pattern     = "/index.html"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-spa${var.name_suffix}"

    forwarded_values {
      query_string = false # クエリパラメータつきでのキャッシュは不要
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = var.cloudfront_config.cache_disabled ? 0 : 60
    max_ttl                = var.cloudfront_config.cache_disabled ? 0 : 300
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # アセット用のキャッシュ動作設定（ハッシュ付きファイル用）
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-spa${var.name_suffix}"

    forwarded_values {
      query_string = false # クエリパラメータつきでのキャッシュは不要
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 31536000  # 1年（開発環境でも長くキャッシュ）
    max_ttl                = 31536000  # 1年
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # デフォルトのキャッシュ動作設定
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-spa${var.name_suffix}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = var.cloudfront_config.cache_disabled ? 0 : 60
    max_ttl                = var.cloudfront_config.cache_disabled ? 0 : 300
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    # SPAルーティング用の設定
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_router.arn
    }
  }

  # 地理的制限（なし）
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL証明書設定
  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # カスタムドメイン
  aliases = [var.domain_name]

  # タグ
  tags = var.tags
}


# SPA用のCloudFront Function（リクエストを/index.htmlにリダイレクト）
resource "aws_cloudfront_function" "spa_router" {
  name    = "${var.project_name}-spa-router${var.name_suffix}"
  runtime = "cloudfront-js-1.0"
  comment = "Redirect requests to index.html for SPA routing"
  publish = true
  code    = <<-EOT
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // APIリクエストはそのまま転送
  if (uri.startsWith('/api')) {
    return request;
  }

  // アセットファイルはそのまま転送
  if (uri.startsWith('/assets/')) {
    return request;
  }

  // ファイル拡張子を持つリクエストはそのまま転送（静的ファイル）
  if (uri.match(/\.[a-zA-Z0-9]+$/)) {
    return request;
  }

  // その他のリクエストは/index.htmlにリダイレクト
  request.uri = '/index.html';
  return request;
}
  EOT
}

# S3バケットポリシー - CloudFrontからのアクセスを許可
resource "aws_s3_bucket_policy" "spa" {
  bucket = var.spa_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject"
        ]
        Resource = "${var.spa_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })
}

# Route53でCloudFrontにAレコードを作成
resource "aws_route53_record" "cloudfront" {
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}


# ログバケットのポリシー - CloudFrontからの書き込みを許可
resource "aws_s3_bucket_policy" "logs" {
  bucket = var.logs_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${var.logs_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "aws:SourceArn" =  aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })
}
