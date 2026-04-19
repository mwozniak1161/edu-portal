# Authentication System

## Overview

JWT-based auth with short-lived access tokens and long-lived refresh tokens. Passport.js handles strategy wiring. All tokens are stateless on the access side; refresh tokens are stored in the DB with a `revoked` flag for invalidation.

## Token Lifetimes

| Token | TTL | Storage |
|-------|-----|---------|
| Access token | 15 minutes | Client memory (not localStorage) |
| Refresh token | 7 days | HttpOnly cookie or secure client store |

## Flow

### Register

```
POST /auth/register
Body: { email, password, firstName, lastName, role }

1. Hash password with bcrypt (rounds: 12)
2. Create User record
3. Send welcome email with credentials (via Nodemailer/SES)
4. Return { accessToken } + set refresh token cookie
```

### Login

```
POST /auth/login
Body: { email, password }

1. LocalStrategy: validate email + bcrypt.compare(password, hash)
2. On success: generate access token (JWT) + refresh token (UUID or JWT)
3. Store hashed refresh token in RefreshToken table
4. Return { accessToken } + set refresh token cookie
```

### Refresh

```
POST /auth/refresh
Cookie/Header: refreshToken

1. Decode refresh token → extract userId
2. Load RefreshToken from DB; check revoked === false && expiresAt > now
3. Revoke old refresh token (set revoked = true)
4. Issue new access token + new refresh token (rotation)
5. Return { accessToken } + new cookie
```

### Logout

```
POST /auth/logout
Auth: Bearer <accessToken>

1. Revoke all active refresh tokens for the user (or the specific token)
2. Return 200
```

## JWT Payload

```typescript
interface JwtPayload {
  sub: string;   // userId (UUID)
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
```

## Passport Strategies

### JwtStrategy

Validates the access token on every protected request.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### LocalStrategy

Used only at `POST /auth/login` to validate email + password before issuing tokens.

## Guards

### JwtAuthGuard

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Apply to every protected controller or route:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('grades')
export class GradesController {}
```

### RolesGuard

Reads `@Roles()` metadata and compares against `request.user.role`. Returns 403 if the role doesn't match.

## Role Hierarchy

There is no inheritance — roles are flat. Each endpoint explicitly declares the allowed roles via `@Roles()`:

| Resource | ADMIN | TEACHER | STUDENT |
|----------|-------|---------|---------|
| User CRUD | ✅ | ❌ | ❌ |
| Class CRUD | ✅ | ❌ | ❌ |
| TeacherClass CRUD | ✅ | ❌ | ❌ |
| Grade write | ❌ | ✅ (own TC only) | ❌ |
| Grade read | ❌ | ✅ | ✅ (own only) |
| Attendance write | ❌ | ✅ (own TC only) | ❌ |
| Attendance read | ❌ | ✅ | ✅ (own only) |
| Timeslot CRUD | ✅ | ❌ | ❌ |
| LessonInstance write | ❌ | ✅ (own TC only) | ❌ |

## Environment Variables

```env
JWT_SECRET=<random 64-char secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

## Security Notes

- Never log tokens or passwords.
- Refresh token rotation: each `/auth/refresh` call invalidates the previous refresh token.
- On suspicious activity (multiple revoked token reuse), invalidate all user tokens.
- Access tokens are not stored server-side — they cannot be revoked before expiry. Keep TTL short (15 min).
- `@Transform()` sanitizes all string inputs before they reach the auth service.
