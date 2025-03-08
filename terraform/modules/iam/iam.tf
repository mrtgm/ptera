# Lambda 実行用の IAM ロール
resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-lambda-execution${var.name_suffix}"
  path = var.iam_role_path

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Lambda基本ログ権限
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# RDS Data API へのアクセス権限
resource "aws_iam_policy" "rds_data_api" {
  name        = "${var.project_name}-rds-data-api-access${var.name_suffix}"
  path        = var.iam_role_path
  description = "Policy for accessing RDS Data API"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "rds-data:ExecuteStatement",
          "rds-data:BatchExecuteStatement",
          "rds-data:BeginTransaction",
          "rds-data:CommitTransaction",
          "rds-data:RollbackTransaction"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_rds_data_api" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.rds_data_api.arn
}

# Secrets Manager へのアクセス権限
resource "aws_iam_policy" "secrets_manager" {
  name        = "${var.project_name}-secrets-manager-access${var.name_suffix}"
  path        = var.iam_role_path
  description = "Policy for accessing Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:secretsmanager:${var.aws_region}:*:secret:*"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_secrets_manager" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.secrets_manager.arn
}


# GitHub Actions用のOIDC Provider
data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github_actions.certificates[0].sha1_fingerprint]
}

# GitHub Actions用のデプロイロール
resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-github-actions${var.name_suffix}" # ptera-github-actions-dev, ptera-github-actions-prod
  path = var.iam_role_path

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github_actions.arn
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub": "repo:mrtgm/${var.project_name}:*"
          }
        }
      }
    ]
  })

  tags = var.tags
}

# GitHub Actions用のデプロイ権限
resource "aws_iam_policy" "github_actions_deploy" {
  name        = "${var.project_name}-github-actions-deploy${var.name_suffix}"
  path        = var.iam_role_path
  description = "Policy for GitHub Actions to deploy resources"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::${var.project_name}-spa${var.name_suffix}",
          "arn:aws:s3:::${var.project_name}-spa${var.name_suffix}/*"
        ]
      },
      {
        Action = [
          "lambda:UpdateFunctionCode",
          "lambda:GetFunction"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:lambda:${var.aws_region}:*:function:${var.project_name}-api${var.name_suffix}"
      },
      {
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_deploy.arn
}
