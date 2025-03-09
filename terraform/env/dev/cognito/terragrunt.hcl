include {
  path = find_in_parent_folders("root.hcl")
}


terraform {
  source = "../../../modules//cognito"
}

dependencies {
  paths = []  # 依存するリソースはない
}
