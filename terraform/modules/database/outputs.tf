output "aurora_cluster_id" {
  description = "ID of the Aurora cluster"
  value       = aws_rds_cluster.aurora.id
}

output "aurora_cluster_arn" {
  description = "ARN of the Aurora cluster"
  value       = aws_rds_cluster.aurora.arn
}

output "aurora_cluster_endpoint" {
  description = "Writer endpoint of the Aurora cluster"
  value       = aws_rds_cluster.aurora.endpoint
}

output "aurora_cluster_port" {
  description = "Port number of the Aurora cluster"
  value       = aws_rds_cluster.aurora.port
}

output "aurora_security_group_id" {
  description = "ID of the Aurora security group"
  value       = aws_security_group.aurora.id
}

output "aurora_secret_arn" {
  description = "ARN of the Aurora secret in Secrets Manager"
  value       = aws_secretsmanager_secret.aurora.arn
}

output "aurora_database_name" {
  description = "Name of the database"
  value       = var.aurora_config.database_name
}
