# API Design Standards

## Base URL

```
/api/v1
```

Swagger UI available at `/api` (auto-generated via `@nestjs/swagger`).

## Response Envelope

Every response is wrapped by `TransformInterceptor`:

```json
// Success
{ "data": <T> }

// Error (GlobalExceptionFilter)
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": { "field": "email", "issue": "must be a valid email" }
}
```

Never return raw values — always go through the interceptor.

## HTTP Method Conventions

| Action | Method | Example |
|--------|--------|---------|
| List | `GET` | `GET /grades` |
| Get one | `GET` | `GET /grades/:id` |
| Create | `POST` | `POST /grades` |
| Replace | `PUT` | `PUT /grades/:id` |
| Partial update | `PATCH` | `PATCH /grades/:id` |
| Delete | `DELETE` | `DELETE /grades/:id` |

## Status Codes

| Code | When |
|------|------|
| 200 | Successful GET / PATCH / DELETE |
| 201 | Successful POST (resource created) |
| 400 | Validation error |
| 401 | Missing or invalid JWT |
| 403 | Authenticated but wrong role |
| 404 | Resource not found |
| 409 | Unique constraint violation |
| 500 | Unexpected server error |

## Authentication

All protected routes require `Authorization: Bearer <accessToken>`.

Attach `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(Role.TEACHER)` (or the appropriate role) to every non-public endpoint.

## Swagger Decorators

Every controller method must have:

```typescript
@ApiOperation({ summary: 'Short description' })
@ApiResponse({ status: 200, description: 'OK', type: SomeResponseDto })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
```

Use `@ApiBearerAuth()` on protected controllers.

## DTO Rules

- Request DTOs: use `class-validator` decorators + `@Transform()` for sanitization.
- Response DTOs: plain classes decorated with `@ApiProperty()`.
- Shared Zod schemas live in `packages/shared` and are the canonical source for frontend validation.

```typescript
// Example request DTO
export class CreateGradeDto {
  @ApiProperty({ example: 5.0 })
  @IsNumber()
  @Min(1)
  @Max(6)
  value: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  weight: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty()
  @IsUUID()
  teacherClassId: string;
}
```

## Pagination

For list endpoints returning potentially large datasets, use cursor-based pagination:

```json
GET /users?take=20&cursor=<uuid>

{
  "data": {
    "items": [...],
    "nextCursor": "<uuid> | null"
  }
}
```

Simple admin lists (classes, subjects) may use offset pagination if the dataset is bounded.

## Route Structure

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

GET    /users
POST   /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id

GET    /classes
POST   /classes
GET    /classes/:id
PATCH  /classes/:id
DELETE /classes/:id

GET    /subjects
POST   /subjects

GET    /teacher-classes
POST   /teacher-classes
DELETE /teacher-classes/:id

GET    /grades?teacherClassId=&studentId=
POST   /grades
PATCH  /grades/:id
DELETE /grades/:id
GET    /grades/average/:teacherClassId/:studentId

GET    /attendance?teacherClassId=&date=
POST   /attendance/batch
PATCH  /attendance/:id

GET    /timeslots?teacherClassId=
POST   /timeslots
PATCH  /timeslots/:id
DELETE /timeslots/:id

GET    /lesson-instances?teacherClassId=
POST   /lesson-instances
PATCH  /lesson-instances/:id
```

## Validation Pipe (Global)

Configured in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

`whitelist: true` strips unknown properties. `transform: true` auto-converts primitives to the declared type.

## Error Handling

`GlobalExceptionFilter` catches:

- `HttpException` — forwards status + message.
- `PrismaClientKnownRequestError` — maps P2002 → 409 Conflict, P2025 → 404 Not Found.
- Uncaught errors → 500 with generic message (no stack trace in production).
