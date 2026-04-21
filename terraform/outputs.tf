# After `terraform apply`, these values are printed to your terminal.
# Copy EC2_PUBLIC_IP into GitHub secrets as EC2_HOST.

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance — add to GitHub secrets as EC2_HOST"
  value       = aws_eip.app.public_ip
}

output "ecr_api_url" {
  description = "ECR URL for the API image — add to GitHub secrets as ECR_API_URL"
  value       = aws_ecr_repository.api.repository_url
}

output "ecr_web_url" {
  description = "ECR URL for the Web image — add to GitHub secrets as ECR_WEB_URL"
  value       = aws_ecr_repository.web.repository_url
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh ec2-user@${aws_eip.app.public_ip}"
}
