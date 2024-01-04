terraform {
  backend "gcs" {
    bucket = "storybooksdocker-tfstate-terraform"
    prefix = "/state/storybooksdocker"
  }
}