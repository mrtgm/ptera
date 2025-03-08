include {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../modules//cognito"
}

dependencies {
  paths = []  # 依存するリソースはない
}

inputs = {
  google_client_id     = get_env("GOOGLE_CLIENT_ID", "dummy-client-id-for-dev")
  google_client_secret = get_env("GOOGLE_CLIENT_SECRET", "dummy-client-secret-for-dev")
}
