include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//iam"
}

dependencies {
  paths = []
}

inputs = {
}
