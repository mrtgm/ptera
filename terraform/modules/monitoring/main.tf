resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts${var.name_suffix}"

  tags = var.tags
}

# SNSトピックにメール登録
resource "aws_sns_topic_subscription" "email" {
  count     = length(var.alert_emails)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_emails[count.index]
}

# 予算アラート - 月間合計予算
resource "aws_budgets_budget" "monthly" {
  name              = "${var.project_name}-monthly-budget${var.name_suffix}"
  budget_type       = "COST"
  limit_amount      = var.budget_config.monthly_limit
  limit_unit        = "USD"
  time_period_end   = "2087-06-15_00:00"
  time_period_start = "2023-01-01_00:00"
  time_unit         = "MONTHLY"

  # タグによるフィルタリング
  cost_filter {
    name = "TagKeyValue"
    values = [
      "user:Environment$${var.env}"
    ]
  }

  # 閾値の通知
  dynamic "notification" {
    for_each = var.budget_config.alert_thresholds
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = "ACTUAL"
      subscriber_sns_topic_arns  = [aws_sns_topic.alerts.arn]
    }
  }
}

# 主要サービス別予算アラート設定
locals {
  services = [
    "Lambda",
    "CloudFront",
    "RDS",
    "S3",
  ]
}

# サービス別予算アラート（1日あたり$5以上増加した場合）
resource "aws_budgets_budget" "service_alerts" {
  count             = length(local.services)
  name              = "${var.project_name}-${lower(local.services[count.index])}-alert${var.name_suffix}"
  budget_type       = "COST"
  limit_amount      = 5 # $5の増加でアラート
  limit_unit        = "USD"
  time_period_start = "2023-01-01_00:00"
  time_period_end   = "2087-06-15_00:00"
  time_unit         = "DAILY"

  # サービスでフィルタリング
  cost_filter {
    name = "Service"
    values = [
      local.services[count.index]
    ]
  }

  # タグによるフィルタリング
  cost_filter {
    name = "TagKeyValue"
    values = [
      "user:Environment$${var.env}"
    ]
  }

  # 閾値通知
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_sns_topic_arns  = [aws_sns_topic.alerts.arn]
  }
}

# CloudWatch アラーム - Lambda エラー率
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-lambda-errors${var.name_suffix}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300  # 5分
  statistic           = "Sum"
  threshold           = 5    # 5回以上のエラー
  alarm_description   = "Lambda function error rate is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  tags = var.tags
}

# CloudWatch アラーム - Lambda 実行時間（タイムアウト検出）
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${var.project_name}-lambda-duration${var.name_suffix}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300  # 5分
  statistic           = "Maximum"
  threshold           = 9000 # 9秒 (タイムアウトは10秒)
  alarm_description   = "Lambda function duration is approaching timeout"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  tags = var.tags
}

# CloudWatch アラーム - Aurora Serverless v2 ACU使用率
resource "aws_cloudwatch_metric_alarm" "aurora_acu_utilization" {
  alarm_name          = "${var.project_name}-aurora-acu${var.name_suffix}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "ServerlessDatabaseCapacity"
  namespace           = "AWS/RDS"
  period              = 300  # 5分
  statistic           = "Maximum"
  threshold           = var.aurora_config.max_capacity * 0.8 # 最大ACUの80%
  alarm_description   = "Aurora Serverless v2 capacity utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = var.aurora_cluster_id
  }

  tags = var.tags
}

# CloudWatch アラーム - Aurora Serverless v2 CPUUtilization
resource "aws_cloudwatch_metric_alarm" "aurora_cpu_utilization" {
  alarm_name          = "${var.project_name}-aurora-cpu${var.name_suffix}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300  # 5分
  statistic           = "Average"
  threshold           = 90   # 90%以上のCPU使用率
  alarm_description   = "Aurora Serverless v2 CPU utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = var.aurora_cluster_id
  }

  tags = var.tags
}

