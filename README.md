# Education Portal

Full-stack Educational ERP (Librus/Moodle clone) built to practice **NestJS**, **Next.js** and **Claude code**. The goal is to handle complex relational data and role-based access in a modern TS stack.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- pnpm (v8+ recommended) — only needed for local dev outside Docker

### 🐳 Docker (recommended)

1. **Copy env and configure**:
   ```bash
   cp .env.example .env
   # Edit .env if you need different credentials
   ```

2. **Start all services** (Postgres, API, Web, pgAdmin):
   ```bash
   docker compose up -d
   ```
   - **Next.js Frontend**: http://localhost:3001
   - **NestJS API**: http://localhost:3000
   - **Swagger docs**: http://localhost:3000/api
   - **pgAdmin**: http://localhost:5050

   Migrations run automatically on API startup.

3. **Rebuild after code changes**:
   ```bash
   docker compose build api   # or: web
   docker compose up -d
   ```

### 🛠️ Local Development (without Docker for app services)

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Postgres only**:
   ```bash
   docker compose up -d postgres pgadmin
   ```

3. **Run migrations**:
   ```bash
   cd apps/api && DATABASE_URL=<your-url> pnpm exec prisma migrate dev
   ```

4. **Start both frontend and backend**:
   ```bash
   pnpm dev
   ```
   - **NestJS API**: http://localhost:3000
   - **Next.js Frontend**: http://localhost:3001

#### Start services individually:
```bash
# Backend only
pnpm --filter @edu-portal/api run start:dev

# Frontend only
pnpm --filter @edu-portal/web dev
```

### 📧 Email Setup

Welcome emails are sent on account creation via Gmail SMTP — free, no custom domain needed.

1. Enable **2-Step Verification** on your Google account (required for App Passwords)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → create an App Password
3. Add to `.env`:
   ```
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-address@gmail.com
   MAIL_PASS=xxxx xxxx xxxx xxxx   # the 16-char App Password, spaces optional
   MAIL_FROM="EduPortal <your-address@gmail.com>"
   ```

> **Note:** Use the App Password, not your regular Gmail password. Gmail allows ~500 emails/day on a free account — more than enough for a portfolio demo.

### 🗄️ Database

- **PostgreSQL 16** runs in Docker on port `5432`
- **pgAdmin** UI available at http://localhost:5050 (credentials in `.env`)
- Schema lives in `apps/api/prisma/schema.prisma` — Prisma is the source of truth
- Generated client outputs to `apps/api/src/generated/prisma/`

Useful Prisma commands (run from `apps/api/`, requires `DATABASE_URL` in env):
```bash
pnpm exec prisma migrate dev --name <name>   # create + apply a migration
pnpm exec prisma generate                    # regenerate the client after schema changes
pnpm exec prisma studio                      # visual DB browser
pnpm exec prisma migrate reset               # wipe DB and re-apply all migrations (dev only)
```

### 🧪 Testing

```bash
# Run all tests
pnpm test

# Backend tests only
pnpm --filter @edu-portal/api run test
```

### ☁️ AWS Deployment

The app deploys to a single EC2 instance via GitHub Actions on every push to `master`.

Flow: `push to master` → CI (lint + tests) → build Docker images → push to ECR → SSH deploy to EC2

See [`terraform/README.md`](terraform/README.md) for full setup instructions including:
- Provisioning AWS infrastructure with Terraform
- Required IAM permissions
- GitHub secrets checklist

## 🏗️ Project Structure

```
education-portal/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types, schemas, utils
├── terraform/        # AWS infrastructure (EC2, ECR, IAM)
├── nginx/            # Reverse proxy config
├── docs/             # Documentation and progress tracking
└── .claude/          # Claude Code configurations and skills
```
