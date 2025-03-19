resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts${var.name_suffix}"

  tags = var.tags
}

resource "aws_sns_topic_subscription" "email" {
  count     = length(var.alert_emails)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_emails[count.index]
}

resource "aws_budgets_budget" "monthly" {
  name              = "${var.project_name}-monthly-budget${var.name_suffix}"
  budget_type       = "COST"
  limit_amount      = var.budget_config.monthly_limit
  limit_unit        = "USD"
  time_period_end   = "2087-06-15_00:00"
  time_period_start = "2023-01-01_00:00"
  time_unit         = "MONTHLY"


  cost_filter {
    name = "TagKeyValue"
    values = [
      "user:Environment$${var.env}"
    ]
  }

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


locals {
  services = [
    "S3",
  ]
}

resource "aws_budgets_budget" "service_alerts" {
  count             = length(local.services)
  name              = "${var.project_name}-${lower(local.services[count.index])}-alert${var.name_suffix}"
  budget_type       = "COST"
  limit_amount      = 5 # $5の増加でアラート
  limit_unit        = "USD"
  time_period_start = "2023-01-01_00:00"
  time_period_end   = "2087-06-15_00:00"
  time_unit         = "DAILY"


  cost_filter {
    name = "Service"
    values = [
      local.services[count.index]
    ]
  }

  cost_filter {
    name = "TagKeyValue"
    values = [
      "user:Environment$${var.env}"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_sns_topic_arns  = [aws_sns_topic.alerts.arn]
  }
}
