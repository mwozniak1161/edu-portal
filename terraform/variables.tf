variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-central-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "project" {
  description = "Project name — used as prefix for all resource names"
  type        = string
  default     = "edu-portal"
}

variable "ssh_public_key" {
  description = "SSH public key content for EC2 access (paste the contents of ~/.ssh/id_rsa.pub)"
  type        = string
}
