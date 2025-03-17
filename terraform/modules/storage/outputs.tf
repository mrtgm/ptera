output "asset_bucket_name" {
  description = "Name of the asset bucket"
  value       = aws_s3_bucket.asset.id
}

output "asset_bucket_arn" {
  description = "ARN of the asset bucket"
  value       = aws_s3_bucket.asset.arn
}

output "asset_bucket_domain_name" {
  description = "Domain name of the asset bucket"
  value       = aws_s3_bucket.asset.bucket_regional_domain_name
}
