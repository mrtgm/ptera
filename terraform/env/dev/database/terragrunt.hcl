include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//database"
}

dependencies {
  paths = ["../networking"]
}

dependency "networking" {
  config_path = "../networking"

  mock_outputs = {
    vpc_id         = "vpc-12345678"
    private_subnet_ids = ["subnet-12345678", "subnet-23456789"]
  }
}

inputs = {
  vpc_id         = dependency.networking.outputs.vpc_id
  private_subnet_ids = dependency.networking.outputs.private_subnet_ids
}
