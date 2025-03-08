output "spa_bucket_name" {
  description = "Name of the SPA bucket"
  value       = aws_s3_bucket.spa.id
}

output "spa_bucket_arn" {
  description = "ARN of the SPA bucket"
  value       = aws_s3_bucket.spa.arn
}

output "spa_bucket_domain_name" {
  description = "Domain name of the SPA bucket"
  value       = aws_s3_bucket.spa.bucket_regional_domain_name
}

output "logs_bucket_name" {
  description = "Name of the logs bucket"
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_arn" {
  description = "ARN of the logs bucket"
  value       = aws_s3_bucket.logs.arn
}

output "logs_bucket_domain_name" {
  description = "Domain name of the logs bucket"
  value       = aws_s3_bucket.logs.bucket_regional_domain_name
}
