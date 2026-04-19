# Database Schema Design

## Overview

Prisma is the source of truth. The `schema.sql` file is reference-only — never apply it directly. All migrations go through `prisma migrate dev`.

## Conventions

| Rule | Value |
|------|-------|
| Column names | `snake_case` (via `@map`) |
| Primary keys | UUID, named `id` |
| Timestamps | `createdAt`, `updatedAt` on every model |
| FK naming | `teacherClassId`, `studentId`, etc. |
| Default `onDelete` | `Cascade` unless noted |
| Prisma field names | `camelCase` |

## Models

### User

Represents admin, teacher, and student accounts. Role determines which panels and routes are accessible.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  teacherClasses TeacherClass[] @relation("TeacherClasses")
  studentClass   Class?         @relation("StudentClass", fields: [classId], references: [id])
  classId        String?
  grades         Grade[]
  attendances    Attendance[]
  refreshTokens  RefreshToken[]
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}
```

### Class

A school class (e.g., "3A"). Students belong to one class. TeacherClasses link subjects and teachers to this class.

```prisma
model Class {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  students      User[]         @relation("StudentClass")
  teacherClasses TeacherClass[]
}
```

### Subject

A school subject (e.g., "Mathematics", "Physics").

```prisma
model Subject {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  teacherClasses TeacherClass[]
}
```

### TeacherClass

The central junction entity. Ties a **teacher** + **subject** + **class** together. All grades, attendance, timeslots, and lesson instances hang off this.

```prisma
model TeacherClass {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  teacher   User    @relation("TeacherClasses", fields: [teacherId], references: [id])
  teacherId String
  subject   Subject @relation(fields: [subjectId], references: [id])
  subjectId String
  class     Class   @relation(fields: [classId], references: [id])
  classId   String

  @@unique([teacherId, subjectId, classId])

  grades          Grade[]
  attendances     Attendance[]
  timeslots       Timeslot[]
  lessonInstances LessonInstance[]
}
```

### Grade

A single grade entry for a student in a TeacherClass. Supports weighted averages and correction linking.

```prisma
model Grade {
  id        String   @id @default(uuid())
  value     Decimal  // 1.0 – 6.0
  weight    Int      @default(1)
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  student       User         @relation(fields: [studentId], references: [id])
  studentId     String
  teacherClass  TeacherClass @relation(fields: [teacherClassId], references: [id])
  teacherClassId String

  // Correction logic
  correctionFor   Grade?  @relation("Correction", fields: [correctionForId], references: [id])
  correctionForId String? @unique
  correction      Grade?  @relation("Correction")
  isExcluded      Boolean @default(false)
}
```

> Correction rule: when a correction grade exists, `isExcluded = true` on the original. The corrected grade replaces it in weighted-average calculations.

### Attendance

Records a student's attendance status for a specific TeacherClass on a given date.

```prisma
model Attendance {
  id        String           @id @default(uuid())
  date      DateTime         @db.Date
  status    AttendanceStatus
  createdAt DateTime         @default(now())

  student        User         @relation(fields: [studentId], references: [id])
  studentId      String
  teacherClass   TeacherClass @relation(fields: [teacherClassId], references: [id])
  teacherClassId String

  @@unique([studentId, teacherClassId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}
```

### Timeslot

Defines a recurring weekly lesson slot for a TeacherClass.

```prisma
model Timeslot {
  id           String   @id @default(uuid())
  weekDay      Int      // 1 = Monday … 7 = Sunday
  startingHour DateTime @db.Time
  length       Int      @default(45) // minutes
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  teacherClass   TeacherClass @relation(fields: [teacherClassId], references: [id])
  teacherClassId String

  @@unique([teacherClassId, weekDay, startingHour])
}
```

### LessonInstance

A concrete occurrence of a lesson (one date, one TeacherClass). Teacher can attach a topic and comment.

```prisma
model LessonInstance {
  id        String   @id @default(uuid())
  date      DateTime @db.Date
  topic     String?
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  teacherClass   TeacherClass @relation(fields: [teacherClassId], references: [id])
  teacherClassId String
}
```

### RefreshToken

Stores hashed refresh tokens with revocation support.

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  revoked   Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

## Entity Relationship Summary

```
User (STUDENT) ──┐
                 ├──> Grade
User (TEACHER) ──┤         \
                 └──> TeacherClass ──> Attendance
Class ───────────┘                ──> Timeslot
Subject ─────────┘                ──> LessonInstance
```

## Key Constraints

- A student belongs to at most one `Class` (`classId` on User).
- `TeacherClass` has a unique constraint on `(teacherId, subjectId, classId)` — no duplicate assignments.
- `Attendance` has a unique constraint on `(studentId, teacherClassId, date)` — one record per student per lesson per day.
- `Timeslot` has a unique constraint on `(teacherClassId, weekDay, startingHour)` — no double-booking.
- A correction grade has `correctionForId` pointing to the original; the original has `isExcluded = true`.
