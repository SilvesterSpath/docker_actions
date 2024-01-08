provider "google" {
  credentials = file("terraform-sa-key.json")
  project = "my-project-id"
  region  = "europe-central2"
  zone   = "europe-central2-c"

}