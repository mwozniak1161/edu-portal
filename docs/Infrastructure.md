# Infrastructure

## EC2 + Docker Compose (Production)

The app runs on a single EC2 instance (Amazon Linux 2023) via `docker-compose.prod.yml`.
Images are built in CI and pushed to ECR; EC2 pulls them on each deploy.

App directory on EC2: `/home/ec2-user/app/`

Services:

- `edu-portal-nginx` — nginx:alpine, ports 80 + 443
- `edu-portal-api` — NestJS on port 3000 (internal only)
- `edu-portal-web` — Next.js on port 3001 (internal only)
- `edu-portal-postgres` — Postgres 16, port 5432 (localhost only)

## HTTPS / SSL (Let's Encrypt)

### How it works

nginx uses the official `nginx:alpine` image's built-in `envsubst` support.
`nginx/nginx.conf.template` is mounted at `/etc/nginx/templates/default.conf.template`;
the entrypoint substitutes `${DOMAIN}` at container start.

The `DOMAIN` env var must be set in `.env` on EC2 and is passed to the nginx container via `docker-compose.prod.yml`.

Certs live at `/etc/letsencrypt/live/${DOMAIN}/` on the EC2 host and are mounted read-only into the nginx container.

### First-time SSL setup on a new server

```bash
# 1. Install certbot (Amazon Linux 2023)
sudo dnf install -y certbot

# 2. Stop nginx so certbot can bind port 80
docker stop edu-portal-nginx

# 3. Issue the cert (replace the domain and email)
sudo certbot certonly --standalone \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos \
  --non-interactive

# 4. Add DOMAIN to /home/ec2-user/app/.env
echo "DOMAIN=yourdomain.com" >> ~/app/.env

# 5. Start nginx — it will pick up the cert via the template mount
cd ~/app && docker compose -f docker-compose.prod.yml up -d nginx
```

Also make sure port 443 is open in the EC2 Security Group (inbound HTTPS from 0.0.0.0/0 and ::/0).

### Auto-renewal

`certbot-renew.timer` (systemd) is enabled and runs daily.
Renewal hooks stop/start the nginx container around the renewal so certbot can bind port 80:

- `/etc/letsencrypt/renewal-hooks/pre/stop-nginx.sh` — `docker stop edu-portal-nginx`
- `/etc/letsencrypt/renewal-hooks/post/start-nginx.sh` — `docker start edu-portal-nginx`

To check renewal timer status:

```bash
sudo systemctl status certbot-renew.timer
```

To test renewal dry-run:

```bash
sudo certbot renew --dry-run
```

Current cert expiry: 2026-07-21 (auto-renews before expiry).
