include {
  path = find_in_parent_folders("root.hcl")
}


terraform {
  source = "../../../modules//storage"
}

dependencies {
  paths = []  # S3バケットは他のリソースに依存しない
}

inputs = {
  logs_expiration_days = 7
}
