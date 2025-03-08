# 既存のRoute53ホストゾーンを参照
data "aws_route53_zone" "main" {
  name = var.base_domain # example.com
}

# ACM証明書の作成
resource "aws_acm_certificate" "main" {
  # CloudFrontはus-east-1リージョンの証明書を使用する必要がある
  provider = aws.us_east_1

  domain_name       = var.domain_name  # dev.example.com
  validation_method = "DNS"

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

# Route53でDNS検証レコードを作成
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# 証明書の検証を待機
resource "aws_acm_certificate_validation" "main" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
