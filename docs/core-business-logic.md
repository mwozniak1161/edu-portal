# Core Business Logic

## 1. Weighted Grade Average

### Formula

```
weightedAverage = sum(grade.value * grade.weight) / sum(grade.weight)
```

### Rules

- Only non-excluded grades are included in the calculation.
- A grade is excluded (`isExcluded = true`) when a correction grade references it via `correctionForId`.
- Grades with `weight = 0` are not allowed (DB constraint: `weight > 0`).
- The result is rounded to 2 decimal places.

### Implementation (GradeService)

```typescript
calculateWeightedAverage(grades: Grade[]): number {
  const active = grades.filter(g => !g.isExcluded);
  if (active.length === 0) return 0;

  const totalWeight = active.reduce((sum, g) => sum + g.weight, 0);
  const weightedSum = active.reduce((sum, g) => sum + Number(g.value) * g.weight, 0);

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}
```

### Endpoint

```
GET /grades/average/:teacherClassId/:studentId
→ { data: { average: number, gradeCount: number } }
```

This endpoint fetches all non-excluded grades for the student in the given TeacherClass and runs the formula above.

---

## 2. Correction Grade Logic

When a teacher issues a correction grade (e.g., replacing a "1" with a "4"):

1. Create a new Grade with `correctionForId = <originalGradeId>`.
2. Set `isExcluded = true` on the original grade.
3. The correction grade itself has `isExcluded = false` and participates in the average normally.

### Rules

- One correction per original grade (`correctionForId` is `@unique` in the schema).
- The original grade record is kept for audit — never deleted.
- The correction grade carries its own `weight` (defaults to the same as the original, but can differ).
- Cascading corrections are not supported (you cannot correct a correction).

### Implementation (GradeService.createCorrection)

```typescript
async createCorrection(dto: CreateCorrectionGradeDto): Promise<Grade> {
  const original = await this.prisma.grade.findUniqueOrThrow({
    where: { id: dto.correctionForId },
  });

  if (original.isExcluded) {
    throw new ConflictException('Grade is already corrected');
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.grade.update({
      where: { id: original.id },
      data: { isExcluded: true },
    });

    return tx.grade.create({
      data: {
        value: dto.value,
        weight: dto.weight ?? original.weight,
        comment: dto.comment,
        studentId: original.studentId,
        teacherClassId: original.teacherClassId,
        correctionForId: original.id,
      },
    });
  });
}
```

---

## 3. Attendance Ownership Guard

Before a teacher can write attendance (or grades) for a TeacherClass, the service must verify the teacher actually owns that TeacherClass.

### Rule

```
TeacherClass.teacherId === request.user.id
```

### Implementation (shared guard logic used in AttendanceService and GradeService)

```typescript
async assertTeacherOwnsTeacherClass(
  teacherClassId: string,
  teacherId: string,
): Promise<TeacherClass> {
  const tc = await this.prisma.teacherClass.findUniqueOrThrow({
    where: { id: teacherClassId },
  });

  if (tc.teacherId !== teacherId) {
    throw new ForbiddenException('You do not own this teacher-class');
  }

  return tc;
}
```

Call this at the start of any write operation in `AttendanceService` and `GradeService`.

### Batch Attendance Save

The batch endpoint accepts an array of `{ studentId, status }` for a given `teacherClassId` and `date`. It uses `upsert` so re-submitting the form doesn't create duplicates:

```typescript
async batchUpsertAttendance(
  teacherClassId: string,
  date: Date,
  entries: AttendanceEntryDto[],
  teacherId: string,
): Promise<Attendance[]> {
  await this.assertTeacherOwnsTeacherClass(teacherClassId, teacherId);

  return this.prisma.$transaction(
    entries.map(entry =>
      this.prisma.attendance.upsert({
        where: {
          studentId_teacherClassId_date: {
            studentId: entry.studentId,
            teacherClassId,
            date,
          },
        },
        update: { status: entry.status },
        create: {
          studentId: entry.studentId,
          teacherClassId,
          date,
          status: entry.status,
        },
      }),
    ),
  );
}
```

---

## 4. Student Grade Query

Students can only read grades where they are the subject (`studentId = request.user.id`). The service enforces this — the controller never trusts a `studentId` from the request body for read operations.

```typescript
// GradeService
async findForStudent(studentId: string, teacherClassId?: string) {
  return this.prisma.grade.findMany({
    where: {
      studentId,
      ...(teacherClassId ? { teacherClassId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

---

## 5. Schedule View (Student)

A student's timetable is derived from `Timeslot` records where the `TeacherClass.classId` matches the student's own `classId`.

```
GET /timeslots?classId=<student.classId>

→ Join: Timeslot → TeacherClass → Subject + Teacher (name fields)
→ Group by weekDay for weekly timetable display
```

The backend includes teacher name and subject name in the response so the frontend can render the full schedule without additional requests.
