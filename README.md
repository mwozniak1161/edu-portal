# Education Portal

Full-stack Educational ERP (Librus/Moodle clone) built to practice **NestJS**, **Next.js** and **Claude code**. The goal is to handle complex relational data and role-based access in a modern TS stack.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- pnpm (v8+ recommended)

### 📦 Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Copy env and configure**:
   ```bash
   cp .env.example .env
   # Edit .env if you need different credentials
   ```

3. **Start the database**:
   ```bash
   docker compose up -d
   ```

4. **Run database migrations**:
   ```bash
   cd apps/api && npx prisma migrate dev
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

Useful Prisma commands (run from `apps/api/`):
```bash
npx prisma migrate dev --name <name>   # create + apply a migration
npx prisma generate                    # regenerate the client after schema changes
npx prisma studio                      # visual DB browser
npx prisma migrate reset               # wipe DB and re-apply all migrations (dev only)
```

### 🛠️ Development

#### Start both frontend and backend concurrently:
```bash
pnpm dev
```
This will start:
- **NestJS API**: http://localhost:3000
- **Next.js Frontend**: http://localhost:3001

#### Start services individually:
```bash
# Backend only
pnpm --filter @edu-portal/api run start:dev

# Frontend only  
pnpm --filter @edu-portal/web dev
```

### 🔍 Verify Integration

Once both services are running:
1. Visit http://localhost:3001
2. Look for the green "✅ Connected (Status: 200)" badge
3. Confirm you see "API Response: 'Hello World!'"

### 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Backend tests only
pnpm --filter @edu-portal/api run test

# Frontend tests only
pnpm --filter @edu-portal/web run test
```

### 📦 Building for Production

```bash
# Build both applications
pnpm build

# Start production servers
pnpm --filter @edu-portal/api run start:prod
pnpm --filter @edu-portal/web run start
```

## 🏗️ Project Structure

```
education-portal/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types, schemas, utils
├── docs/             # Documentation and progress tracking
└── .claude/          # Claude Code configurations and skills
```

