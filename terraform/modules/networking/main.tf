resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = "${var.project_name}-vpc${var.name_suffix}"
  })
}

# アベイラビリティゾーン情報の取得
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  # 最低でも2つのアベイラビリティゾーンを使用する必要あり
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

resource "aws_subnet" "private" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = false

  tags = merge(var.tags, {
    Name = "${var.project_name}-private-subnet-${count.index}${var.name_suffix}"
  })
}
