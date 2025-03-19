# ユーザ素材用のS3バケット
resource "aws_s3_bucket" "asset" {
  bucket = "${var.project_name}-asset${var.name_suffix}"

  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "asset" {
  bucket = aws_s3_bucket.asset.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3バケットの暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "asset" {
  bucket = aws_s3_bucket.asset.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3バケットの所有者設定
resource "aws_s3_bucket_ownership_controls" "asset" {
  bucket = aws_s3_bucket.asset.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}
