provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# DNS Zone
data "cloudflare_zone" "example" {
  name = var.domain
}
# DNS A Record