# 🛠️ Development Process

**Git Workflow:**
1. Branching Strategy:
   - Feature branches from `master`
   - PR → `master` triggers CI
2. Code Reviews:
   - Solo project — no human reviewer required
   - AI agent posts automated code review on every PR (future)
3. Testing:
   - ESLint pre-commit (lint must pass in CI)
   - No coverage targets enforced

**CI/CD Pipeline (GitHub Actions):**
- On every PR → master: lint (API + Web) + API unit tests + Prisma migrations
- On merge to master: above + Docker image builds
- CD to AWS: planned (ECS or EC2 + docker compose)

# Testing Strategy
- **Unit Tests**: Jest with `@nestjs/testing` — business logic and services
- **Integration Tests**: Supertest for API endpoints (future)
- **E2E Tests**: Playwright for critical user flows (future)
- Mock external dependencies (mail, etc.) in unit tests

# Testing Framework

**Test Types:**
1. Unit Tests:
  - Jest with `@nestjs/testing`
  - Focus: services with business logic (grades, attendance, auth)

2. Integration Tests:
  - Supertest for API endpoints
  - Verify full stack flow

3. E2E Tests:
  - Playwright for critical user flows
  - Browser-based testing

**Testing Workflow:**
1. Tests required for business logic and all endpoints
2. Mock external dependencies (mail, HTTP calls)
3. Manual UI testing for design consistency
