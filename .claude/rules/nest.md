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

