include {
  path = find_in_parent_folders("root.hcl")
}

# モジュールのソース
terraform {
  source = "../../../modules//networking"
}

# 依存関係
dependencies {
  paths = []  # VPCは他のリソースに依存しない
}

inputs = {
  vpc_cidr = "10.10.0.0/16"  # 開発環境用
}
