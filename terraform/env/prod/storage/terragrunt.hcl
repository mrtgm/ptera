include {
  path = find_in_parent_folders("root.hcl")
}


terraform {
  source = "../../../modules//storage"
}

dependencies {
  paths = []
}

inputs = {
  logs_expiration_days = 7
}
