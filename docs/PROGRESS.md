# Progress Tracker

## 🚧 In Progress
_(move a task here when you start it)_

## 📋 Backlog — MVP

### 🏗️ Foundation
- [x] Monorepo scaffold (pnpm workspaces, apps/api, apps/web, packages/shared)
- [x] docker-compose.yml with Postgres + pgAdmin + API + Web
- [x] Prisma schema (User, Class, Subject, TeacherClass, Grade, Attendance, Timeslot, LessonInstance)
- [x] NestJS bootstrap: GlobalExceptionFilter, TransformInterceptor `{ data: T }`, Swagger at /api
- [x] JWT auth: register, login, refresh token, Passport strategy
- [x] RolesGuard + @Roles() decorator wired to all protected routes
- [x] Reusable UI components: shadcn primitives installed + custom composites built (see `docs/ReusableComponents.md`)
- [x] **Eduportal Design System Implementation** - Implement distinctive visual design from mockups
- [x] **Student Dashboard Enhancement** - Transform simple navigator to rich dashboard per mockups
- [x] **Design System Component Compliance** - Ensure all existing components match Eduportal specifications

### 👤 Admin Panel
- [x] **User Management**
  - List users with search by email/role/status
  - Create user → triggers welcome email with credentials
  - Enable/disable user, assign role
  - _Skip for MVP: bulk import/export CSV, bulk actions_
- [x] **Class Management**
  - CRUD classes, assign students to class
- [x] **TeacherClass Management**
  - Assign teacher + subject + class (creates TeacherClass record)
  - List matrix view: which teacher covers which subject in which class
- [x] **Timeslot Management**
  - Create timeslots tied to TeacherClass (weekDay, startingHour)
  - Edit/delete timeslot with confirmation
  - _Skip for MVP: drag-and-drop UI, holiday calendar, conflict detection_

### 👨‍🏫 Teacher Panel
- [x] **Attendance Management**
  - Pick date → select lesson instance for that day → roster of class students
  - Set status per student (Present/Absent/Late), batch save
  - Attendance linked to LessonInstance (not TeacherClass+date); unique per studentId+lessonInstanceId
  - AttendanceService guard: teacher owns the lesson instance before write
- [x] **Grade Management**
  - View all students in a class with their grades per TeacherClass
  - Add grade (value, weight, comment)
  - Correction logic: link a correction grade, excluded original from avg
  - Weighted average calculated backend: `sum(value * weight) / sum(weight)`
  - _Skip for MVP: export PDF/CSV, visual trend charts_
- [x] **Lesson Instance Management**
  - List timeslots as lesson instances per week
  - Click timeslot → dialog to add/edit topic + comment
  - [x] **Automatic Lesson Instance Generation**
    - Daily cron job generates lesson instances from TeacherClass + Timeslots
    - Runs at 2:00 AM server time
    - Creates lesson instances for upcoming weekdays based on existing timeslots
    - Skips dates that already have lesson instances (no overwrite)
  - _Skip for MVP: topic suggestions from previous lessons_

### 🎓 Student Panel
- [x] **Schedule View**
  - Display weekly timetable from Timeslots where classId matches student's class
- [x] **Gradebook View**
  - List TeacherClasses for student's class
  - Per subject: list grades + weighted average (calculated backend)
  - _Skip for MVP: filter by term, skill gap analysis, self-assessment_

### 🔐 Landing Page
- [x] Login page (email + password, role-based redirect)
- [x] Landing page (`/`) — EduPortal one-liner, links to demo / login / contact email
- [ ] Demo mode: pre-seeded admin/teacher/student accounts with one-click login buttons
- [ ] Password reset flow (token via email)
- [ ] _Skip for MVP: captcha, social login, onboarding wizard, subscription_

### 📧 Email
- [ ] Nodemailer setup with Mailtrap (dev) / SES (prod)
- [ ] Welcome email with credentials on account creation
- [ ] Grade added notification to student
- [ ] _Skip for MVP: attendance alerts, bulk announcements_

### 🧪 Testing
- [x] Unit tests: weighted average calculation, correction grade logic
- [x] Unit tests: AttendanceService ownership guard
- [ ] E2E: auth flow (login, refresh, protected route)
- [ ] E2E: grade CRUD + average endpoint
- [ ] **FE Visual Testing** - Validate implementation against mockups
- [ ] **Design System Compliance Testing** - Verify Eduportal-specific styling
- [ ] **ESLint setup** — CI currently runs `tsc --noEmit` as a temporary replacement; needs proper `.eslintrc` per app (API + Web) so real linting can run in CI

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
- [ ] Real-time collaboration features
- [ ] Mobile-responsive design enhancements

## ✅ Done
- [x] Monorepo scaffold (pnpm workspaces, apps/api, apps/web, packages/shared)
- [x] docker-compose.yml with Postgres + pgAdmin + API + Web (full containerization)
- [x] Prisma schema (User, Class, Subject, TeacherClass, Grade, Attendance, Timeslot, LessonInstance)
- [x] NestJS bootstrap: GlobalExceptionFilter, TransformInterceptor `{ data: T }`, Swagger at /api
- [x] JWT auth: register, login, refresh token, Passport strategy
- [x] RolesGuard + @Roles() decorator wired to all protected routes
- [x] Reusable UI components: shadcn primitives installed + custom composites built (see `docs/ReusableComponents.md`)