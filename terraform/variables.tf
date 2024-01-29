### GENERAL
variable "app_name" {
  type = string
}

## ATLAS
variable "mongodbatlas_public_key" {
  type = string  
}

variable "mongodbatlas_private_key" {
  type = string  
}

### GCP
variable "gcp_machine_type"{
  type = string
}

### CLOUDFLARE
variable "cloudflare_api_token" {
  type = string  
}