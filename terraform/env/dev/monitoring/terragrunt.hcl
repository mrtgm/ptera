include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//monitoring"
}

dependencies {
  paths = []
}

inputs = {
  alert_emails = ["xtarako@gmail.com"]
}
