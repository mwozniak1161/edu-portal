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