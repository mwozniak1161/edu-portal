## Authentication Rules
- Use JWT access tokens with 15-minute expiration
- Implement 7-day refresh token lifetime
- Store refresh tokens with `revoked` flag tracking
- Enforce role-based access controls

## API Standards
- All REST endpoints should return `{data: ...}` format
- Auto-generated Swagger documentation at `/api`
- Standardized error responses:
  ```typescript
  {
    statusCode: number,
    message: string,
    error?: string,
    details?: any
  }
  ```
- Always use `@ApiResponse()` decorators

## Database Schema Rules
- All columns in snake_case
- UUID primary keys
- Automatic `createdAt`/`updatedAt` timestamps
- Foreign keys: `tableId` pattern
- `onDelete: 'CASCADE'` for all relationships

## File Structure
- Services: `<feature>.service.ts`
- Controllers: `<feature>.controller.ts`
- DTOs: `<feature>.dto.ts`
- Entities: `<feature>.entity.ts`
- Modules: `<feature>.module.ts`

## Validation Strategies
- `@Transform()` for input sanitization
- `@IsOptional()` with validation pipes
- Global `ValidationPipe` configuration

## Error Handling
- Custom exception filters for DB/validation errors
- Standardized error formatting
- Context-aware logging

## Testing Practices
- Table-driven validation tests
- E2E tests for auth/API/database flows
- Coverage targets: 80% services, 90% controllers

## Architecture
- Factory/value providers for DI
- ForwardRef only when necessary
- Service/Controller separation

## Security
- Rate limiting with guards
- Content security policies
- Input sanitization

## i18n Standards
- Localization files in `/src/common/i18n/messages`
- `@TranslationKey()` decorators
- Safe string interpolation

## Nest CLI Usage Guidelines
- Use `nest generate` CLI for creating modules, controllers, services, etc.
- Always run `nest build` before testing to ensure proper compilation
- Use `nest start --watch` for development with hot reload
- When creating new features, use the CLI to maintain consistent structure:
  - `nest generate module <name>`
  - `nest generate controller <name>`
  - `nest generate service <name>`
  - `nest generate class <name> --no-spec` (for DTOs/entities)
- CLI automatically handles proper imports and follows NestJS conventions
- After generating files with CLI, verify imports are correct and adjust as needed
- For custom generators or schematics, document them in project-specific documentation

## TypeScript Configuration for NestJS
- Ensure `experimentalDecorators: true` and `emitDecoratorMetadata: true` are set in tsconfig.json
- Configure TypeScript to properly resolve imports based on project structure
- Use consistent import styles throughout the codebase
- When working in a monorepo, ensure proper package references are configured
- Avoid deep relative imports - prefer cleaner import patterns
- Verify that all NestJS decorators (@Controller, @Injectable, etc.) are properly recognized by TypeScript