# Security group = EC2's firewall rules.
# Inbound: what traffic is allowed IN to the server.
# Outbound: all traffic out is allowed (default).

resource "aws_security_group" "ec2" {
  name        = "${var.project}-ec2-sg"
  description = "Allow HTTP, HTTPS, and SSH"

  # HTTP — nginx serves the app here
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS — nginx with SSL certificate
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH — GitHub Actions uses this to trigger redeploy
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound (needed for ECR pull, apt install, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-ec2-sg"
  }
}
