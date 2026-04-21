# SSH key pair — upload your public key so you can SSH into the server
resource "aws_key_pair" "deployer" {
  key_name   = "${var.project}-deployer"
  public_key = var.ssh_public_key
}

# IAM role — lets the EC2 instance pull from ECR without needing credentials
resource "aws_iam_role" "ec2" {
  name = "${var.project}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project}-ec2-profile"
  role = aws_iam_role.ec2.name
}

# EC2 instance — the actual server running everything
resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  # user_data runs once on first boot — installs Docker and docker compose
  user_data = templatefile("${path.module}/userdata.sh", {
    aws_region   = var.aws_region
    ecr_api_url  = aws_ecr_repository.api.repository_url
    ecr_web_url  = aws_ecr_repository.web.repository_url
  })

  root_block_device {
    volume_size = 30 # GB — minimum required by Amazon Linux 2023 AMI
  }

  tags = {
    Name = "${var.project}-app"
  }
}

# Elastic IP — keeps the server IP stable across reboots
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = {
    Name = "${var.project}-eip"
  }
}
