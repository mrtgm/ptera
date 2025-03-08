# CloudFront ログ用のS3バケット
resource "aws_s3_bucket" "logs" {
  bucket = "${var.project_name}-cloudfront-logs${var.name_suffix}"

  tags = var.tags
}

# パブリックアクセスのブロック（すべてブロック）
resource "aws_s3_bucket_public_access_block" "logs" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ログバケットの暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ログバケットのライフサイクルポリシー
resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    id     = "expire-logs"
    status = "Enabled"
    filter {
      prefix = ""
    }

    expiration {
      days = var.logs_expiration_days
    }
  }
}

# SPA用のS3バケット
resource "aws_s3_bucket" "spa" {
  bucket = "${var.project_name}-spa${var.name_suffix}"

  tags = var.tags
}

# パブリックアクセスのブロック（すべてブロック）
resource "aws_s3_bucket_public_access_block" "spa" {
  bucket = aws_s3_bucket.spa.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3バケットの暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "spa" {
  bucket = aws_s3_bucket.spa.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3バケットの所有者設定
resource "aws_s3_bucket_ownership_controls" "spa" {
  bucket = aws_s3_bucket.spa.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# ログ用のS3バケットはACLを有効化する必要がある
# https://dev.classmethod.jp/articles/terraform-cloudfront-log-acl/
resource aws_s3_bucket_ownership_controls "logs" {
    bucket = aws_s3_bucket.logs.id
    rule {
        object_ownership = "BucketOwnerPreferred"
    }
}

resource aws_s3_bucket_acl logs {
    bucket = aws_s3_bucket.logs.id
    acl    = "private"
    depends_on = [ aws_s3_bucket_ownership_controls.logs ]
}
