# 🛠️ Development Process

**Git Workflow:**
1. Branching Strategy:
   - Feature branches from `main`
   - PR merge strategy (CI checks required)
2. Code Reviews:
   - Mandatory 2-person review
   - Convention checks
   - Documentation updates required
3. Testing:
   - Jest + ESLint pre-commit hooks
   - Auto-format on commit (Prettier)

**CI/CD Pipeline:**
- Docker containerization
- Environment variables per stage


# Testing Strategy
- **Unit Tests**: Jest with `@nestjs/testing`
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for critical user flows
- Test coverage targets: 80%+ for services, 90%+ for utilities
- Mock external dependencies in unit tests

# Testing Framework

**Test Types:**
1. Unit Tests:
  - Jest with `@nestjs/testing`
  - Coverage: >80% for services
  - Use Zod.classValidate()

2. Integration Tests:
  - Supertest for API endpoints
  - Verify full stack flow

3. E2E Tests:
  - Playwright for critical user flows
  - Browser-based testing

**Testing Workflow:**
1. Write tests before implementation (TDD)
2. Mock external dependencies
3. Manual UI testing for design consistency