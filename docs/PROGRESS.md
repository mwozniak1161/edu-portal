# Progress Tracker

## 🚧 In Progress
_(move a task here when you start it)_

---

## 📋 Backlog — MVP

### 🏗️ Foundation
- [ ] Monorepo scaffold (pnpm workspaces, apps/api, apps/web, packages/shared)
- [ ] docker-compose.yml with Postgres + pgAdmin
- [ ] Prisma schema (User, Class, Subject, TeacherClass, Grade, Attendance, Timeslot, LessonInstance)
- [ ] NestJS bootstrap: GlobalExceptionFilter, TransformInterceptor `{ data: T }`, Swagger at /api
- [ ] JWT auth: register, login, refresh token, Passport strategy
- [ ] RolesGuard + @Roles() decorator wired to all protected routes

### 👤 Admin Panel
- [ ] **User Management**
  - List users with search by email/role/status
  - Create user → triggers welcome email with credentials
  - Enable/disable user, assign role
  - _Skip for MVP: bulk import/export CSV, bulk actions_
- [ ] **Class Management**
  - CRUD classes, assign students to class
- [ ] **TeacherClass Management**
  - Assign teacher + subject + class (creates TeacherClass record)
  - List matrix view: which teacher covers which subject in which class
- [ ] **Timeslot Management**
  - Create timeslots tied to TeacherClass (weekDay, startingHour)
  - Edit/delete timeslot with confirmation
  - _Skip for MVP: drag-and-drop UI, holiday calendar, conflict detection_

### 👨‍🏫 Teacher Panel
- [ ] **Attendance Management**
  - View full class roster for a given TeacherClass + date
  - Set status per student (Present/Absent/Late), batch save
  - AttendanceService guard: verify teacher owns the TeacherClass before write
- [ ] **Grade Management**
  - View all students in a class with their grades per TeacherClass
  - Add grade (value, weight, comment)
  - Correction logic: link a correction grade, excluded original from avg
  - Weighted average calculated backend: `sum(value * weight) / sum(weight)`
  - _Skip for MVP: export PDF/CSV, visual trend charts_
- [ ] **Lesson Instance Management**
  - List timeslots as lesson instances per week
  - Click timeslot → dialog to add/edit topic + comment
  - _Skip for MVP: topic suggestions from previous lessons_

### 🎓 Student Panel
- [ ] **Schedule View**
  - Display weekly timetable from Timeslots where classId matches student's class
- [ ] **Lesson Instance View**
  - Same as teacher view, read-only (no dialog editing)
- [ ] **Gradebook View**
  - List TeacherClasses for student's class
  - Per subject: list grades + weighted average (calculated backend)
  - Filter by term
  - _Skip for MVP: skill gap analysis, self-assessment_

### 🔐 Landing Page
- [ ] Login page (email + password)
- [ ] Demo mode: pre-seeded admin/teacher/student accounts with one-click login buttons
- [ ] Password reset flow (token via email)
- [ ] _Skip for MVP: captcha, social login, onboarding wizard, subscription_

### 📧 Email
- [ ] Nodemailer setup with Mailtrap (dev) / SES (prod)
- [ ] Welcome email with credentials on account creation
- [ ] Grade added notification to student
- [ ] _Skip for MVP: attendance alerts, bulk announcements_

### 🧪 Testing
- [ ] Unit tests: weighted average calculation, correction grade logic
- [ ] Unit tests: AttendanceService ownership guard
- [ ] E2E: auth flow (login, refresh, protected route)
- [ ] E2E: grade CRUD + average endpoint

---

## 📦 Post-MVP Backlog
- [ ] Real-time schedule change notifications (WebSocket)
- [ ] Drag-and-drop timetable (Admin)
- [ ] Holiday/free-day calendar
- [ ] Scheduling conflict detection
- [ ] Bulk user import/export (CSV)
- [ ] Grade export PDF/CSV per student
- [ ] Attendance export PDF/CSV
- [ ] Analytics dashboard (performance trends, class averages)
- [ ] Audit logging
- [ ] Social login
- [ ] Captcha on login
- [ ] Skill gap analysis (Student panel)
- [ ] Notification preferences panel (Admin)

---

## ✅ Done