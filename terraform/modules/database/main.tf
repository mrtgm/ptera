resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# DBクラスター用のセキュリティグループ
resource "aws_security_group" "aurora" {
  name        = "${var.project_name}-aurora${var.name_suffix}"
  description = "Allow access to Aurora Serverless v2"
  vpc_id      = var.vpc_id

  # データAPIはインバウンドの許可が不要

  # 全ての送信トラフィックを許可
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

# AWS Secrets Managerにデータベース認証情報を保存
resource "aws_secretsmanager_secret" "aurora" {
  name        = "${var.project_name}/database${var.name_suffix}"
  description = "Aurora Serverless v2 credentials for ${var.project_name} ${var.env} environment"

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "aurora" {
  secret_id = aws_secretsmanager_secret.aurora.id

  secret_string = jsonencode({
    username             = "postgres"
    password             = random_password.db_password.result
    engine               = "postgres"
    host                 = aws_rds_cluster.aurora.endpoint
    port                 = 5432
    dbClusterIdentifier  = aws_rds_cluster.aurora.id
    dbname               = var.aurora_config.database_name
  })
}

# Aurora Serverless v2 クラスター
resource "aws_rds_cluster" "aurora" {
  cluster_identifier     = "${var.project_name}-aurora${var.name_suffix}"
  engine                 = var.aurora_config.engine
  engine_version         = var.aurora_config.engine_version
  database_name          = var.aurora_config.database_name
  master_username        = "postgres"
  master_password        = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.aurora.name
  vpc_security_group_ids = [aws_security_group.aurora.id]

  # Serverless v2 設定
  engine_mode            = "provisioned"  # Serverless v2 uses provisioned mode

  serverlessv2_scaling_configuration {
    min_capacity = var.aurora_config.min_capacity
    max_capacity = var.aurora_config.max_capacity
    seconds_until_auto_pause = 3600
  }

  enable_http_endpoint = true  # Data API を有効化

  # バックアップ設定
  backup_retention_period = var.aurora_config.backup_retention
  skip_final_snapshot     = true  # 環境の削除時に最終スナップショットをスキップ
  apply_immediately       = true

  monitoring_interval  = 0 # モニタリングを無効化

  # PostgreSQLクラスターに必要なパラメータ
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.aurora.name
  tags = var.tags
}

# Aurora Serverless v2 のインスタンス（1つのみ作成）
resource "aws_rds_cluster_instance" "aurora" {
  identifier           = "${var.project_name}-aurora-instance${var.name_suffix}"
  cluster_identifier   = aws_rds_cluster.aurora.id
  instance_class       = "db.serverless"  # Serverless v2 用インスタンスクラス
  engine               = aws_rds_cluster.aurora.engine
  engine_version       = aws_rds_cluster.aurora.engine_version

  # 自動アップグレードを無効化（コスト削減のため）
  auto_minor_version_upgrade = false
  tags = var.tags
}

# DB サブネットグループ
resource "aws_db_subnet_group" "aurora" {
  name        = "${var.project_name}-aurora${var.name_suffix}"
  description = "Subnet group for Aurora Serverless v2"
  subnet_ids  = var.private_subnet_ids

  tags = var.tags
}

# クラスターパラメータグループ
resource "aws_rds_cluster_parameter_group" "aurora" {
  name        = "${var.project_name}-aurora-cluster${var.name_suffix}"
  family      = "aurora-postgresql15"
  description = "Parameter group for Aurora Serverless v2 PostgreSQL"
  parameter {
    name  = "timezone"
    value = "Asia/Tokyo"
  }
  tags = var.tags
}
