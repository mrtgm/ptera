locals {
  common_vars = read_terragrunt_config(find_in_parent_folders("common.hcl"))

  env = "dev"

  env_tags = {
    Environment = local.env
  }

  name_suffix = "-${local.env}"

  dev_settings = {
    budget = {
      monthly_limit = 5  # 月額$5
      alert_thresholds = [80, 100]  # 80%と100%でアラート
    }
  }
}


inputs = {
  project_name   = local.common_vars.locals.project_name
  env            = local.env
  aws_region     = local.common_vars.locals.aws_region
  base_domain   = local.common_vars.locals.base_domain
  domain_name    = local.domain_name
  name_suffix    = local.name_suffix

  tags = merge(
    local.common_vars.locals.common_tags,
    local.env_tags
  )

  budget_config = local.dev_settings.budget
}
