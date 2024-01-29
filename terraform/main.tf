terraform {
    required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }

    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
  backend "gcs" {
    bucket = "storybooksdocker-tfstate-terraform"
    prefix = "state/storybooksdocker/"
  }
}