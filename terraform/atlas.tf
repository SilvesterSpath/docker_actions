provider "mongodbatlas" {  
  public_key = var.mongodbatlas_public_key
  private_key  = var.mongodbatlas_private_key  
}

# cluster
resource "mongodbatlas_advanced_cluster" "mongo_cluster" {
  project_id   = var.atlas_project_id
  name         = "${var.app_name}-${terraform.workspace}"
  cluster_type = "REPLICASET"
  replication_specs {
    num_shards = 1
  region_configs {
          electable_specs {
        instance_size = "M0"
        node_count    = 3        
      }
    region_name = "CENTRAL_US"
    provider_name = "TENANT"
    backing_provider_name = "GCP"
    priority = 7
      
   }
  }


  # Provider Settings "block"

}

# db user
resource "mongodbatlas_database_user" "mongo_user" {
  username           = "storybooks-user-${terraform.workspace}"
  password           = var.atlas_user_password
  project_id         = var.atlas_project_id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "storybooks"
  }
}

# ip whitelist
resource "mongodbatlas_project_ip_access_list" "test" {
  project_id = var.atlas_project_id
  ip_address = google_compute_address.ip_address.address

}