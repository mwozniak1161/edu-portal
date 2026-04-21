#!/bin/bash
# Runs once on EC2 first boot. Sets up Docker + docker compose + app directory.
set -e

# Install Docker
dnf update -y
dnf install -y docker git
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# Install docker compose plugin
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Create app directory — GitHub Actions will write docker-compose.prod.yml here on deploy
mkdir -p /home/ec2-user/app
chown ec2-user:ec2-user /home/ec2-user/app

# Log ECR URLs for reference
echo "ECR_API=${ecr_api_url}" >> /home/ec2-user/app/.ecr-urls
echo "ECR_WEB=${ecr_web_url}" >> /home/ec2-user/app/.ecr-urls
echo "AWS_REGION=${aws_region}" >> /home/ec2-user/app/.ecr-urls
