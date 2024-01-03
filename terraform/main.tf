terraform {
  backend "gcs" {
    bucket = "storybooks-404706-terraform"
    prefix = "/state/storybooksdocker"
  }
}