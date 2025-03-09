include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//networking"
}

dependencies {
  paths = []  # VPCは他のリソースに依存しない
}

inputs = {
  vpc_cidr = "10.10.0.0/16"  # 開発環境用
}
