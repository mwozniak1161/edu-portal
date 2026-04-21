# Terraform — EduPortal AWS Infrastructure

## What this provisions
- **2 ECR repositories** — private Docker registries for API and Web images
- **EC2 instance** (t3.micro) — runs all services via docker compose
- **Elastic IP** — stable public IP that survives reboots
- **Security group** — firewall: ports 80 (HTTP), 443 (HTTPS), 22 (SSH)
- **IAM role** — lets EC2 pull from ECR without credentials

## Prerequisites
1. [Install Terraform](https://developer.hashicorp.com/terraform/install) (v1.6+)
2. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and run `aws configure`
3. Have an SSH key pair (generate with `ssh-keygen -t ed25519`)

## First-time setup

```bash
cd terraform

# Copy and fill in your values
cp terraform.tfvars.example terraform.tfvars

# Download providers (creates .terraform/ dir)
terraform init

# Preview what will be created
terraform plan

# Create everything on AWS (~2 min)
terraform apply
```

After apply, outputs will show:
- `ec2_public_ip` → add to GitHub secret `EC2_HOST`
- `ecr_api_url` → add to GitHub secret `ECR_API_URL`
- `ecr_web_url` → add to GitHub secret `ECR_WEB_URL`

## Tear down everything

```bash
terraform destroy
```

This deletes ALL resources and stops AWS billing.

---

## IAM permissions required

### For GitHub Actions (CI/CD)
Create an IAM user in AWS Console → IAM → Users → Create user.
Attach this inline policy (replace `<account-id>` and `<region>`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": [
        "arn:aws:ecr:<region>:<account-id>:repository/edu-portal-api",
        "arn:aws:ecr:<region>:<account-id>:repository/edu-portal-web"
      ]
    }
  ]
}
```

Generate an **Access Key** for this user → add to GitHub secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g. `eu-central-1`)

### For your local machine (running Terraform)
Your local AWS CLI user needs broader permissions to create resources.
Easiest: attach `AdministratorAccess` for setup only, then remove it.
Better: use a restricted policy covering EC2, ECR, IAM (advanced).

### EC2 (automatic)
EC2 gets `AmazonEC2ContainerRegistryReadOnly` via IAM instance profile.
No credentials needed on the server — it authenticates via instance metadata.

---

## GitHub Secrets checklist

After `terraform apply`, add these in GitHub → Settings → Secrets → Actions:

| Secret | Source |
|--------|--------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | e.g. `eu-central-1` |
| `EC2_HOST` | Terraform output: `ec2_public_ip` |
| `EC2_SSH_KEY` | Contents of your private key (`~/.ssh/id_ed25519`) |
| `ECR_API_URL` | Terraform output: `ecr_api_url` |
| `ECR_WEB_URL` | Terraform output: `ecr_web_url` |
| `NEXT_PUBLIC_API_URL` | `http://<ec2_public_ip>` |
| `POSTGRES_USER` | Your choice (e.g. `edu_portal`) |
| `POSTGRES_PASSWORD` | Strong random password |
| `POSTGRES_DB` | Your choice (e.g. `edu_portal_db`) |
| `JWT_SECRET` | 64-char random string (`openssl rand -hex 32`) |
| `CORS_ORIGIN` | `http://<ec2_public_ip>` |
| `MAIL_HOST` | `smtp.gmail.com` |
| `MAIL_USER` | Gmail address |
| `MAIL_PASS` | Google App Password |
| `MAIL_FROM` | `EduPortal <you@gmail.com>` |

---

## Security notes

- **SSH (port 22) is open to the internet** — needed for GitHub Actions deploy. Acceptable for a portfolio project. For production: restrict to specific IPs or use AWS SSM Session Manager.
- **Terraform state** (`*.tfstate`) is gitignored — it contains sensitive data. Store in S3 with state locking (DynamoDB) for team use.
- **`.terraform.lock.hcl` is committed** — this pins provider versions and prevents supply-chain attacks via malicious provider updates.
- **EC2 pulls from ECR using IAM role** — no AWS credentials stored on the server.
- **Secrets on EC2** — written to `.env` file at deploy time, owned by `ec2-user`. Not ideal for high-security production (use AWS Secrets Manager), fine for portfolio.
