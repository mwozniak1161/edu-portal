# Reusable UI Components

## 1. Shadcn Primitives to Install
These come from shadcn/ui — configure and theme, don't build from scratch.

| Component | Used In |
|-----------|---------|
| Button | everywhere |
| Input / Textarea | all forms |
| Dialog / AlertDialog | edit forms, confirmation dialogs |
| Table | all list/grid views |
| Badge | role labels, attendance status, grade indicators |
| Skeleton | loading states for all data views |
| Toast (Sonner) | success/error feedback after mutations |
| Select / Combobox | role picker, class picker, subject picker |
| DatePicker (Calendar + Popover) | attendance date, timeslot creation |
| Tabs | panel switching (e.g. grades by term) |
| Avatar | user display in lists and rosters |
| DropdownMenu | row actions (edit/delete/disable) |

---

## 2. Custom Composites to Build

### Auth & Access
- **`<ShowFor roles={[Role.ADMIN]}>`** — renders children only if JWT role matches; used in layout and nav
- **`<ProtectedRoute>`** — redirect to login if unauthenticated; wraps all panel layouts

### Data Display
- **`<DataTable>`** — Table + search input + pagination + empty state; generic over row type
  - Props: `columns`, `data`, `isLoading`, `searchPlaceholder`
- **`<EmptyState>`** — "No results" placeholder with icon + optional CTA; used inside DataTable and standalone
- **`<Pagination>`** — page controls wired to TanStack Query `page` param; reused across all list views

### User & Identity
- **`<UserAvatar>`** — Avatar with fallback initials; used in rosters, grade lists, schedule views
- **`<RoleBadge role={Role}>`** — colored Badge variant per role (Admin/Teacher/Student)
- **`<StatusBadge status="active"|"inactive">`** — user enabled/disabled indicator

### Attendance
- **`<AttendanceStatusBadge status="PRESENT"|"ABSENT"|"LATE">`** — colored badge for attendance status
- **`<AttendanceBatchForm>`** — full roster with per-student status selector + batch save; Teacher Panel only

### Grades
- **`<WeightedGradeCell value weight comment>`** — single grade display with tooltip for weight/comment
- **`<GradeAverage teacherClassId studentId>`** — computed weighted average chip; calls backend avg endpoint

### Layout & Navigation
- **`<PanelLayout>`** — sidebar + topbar shell; accepts `navItems` prop; used for Admin/Teacher/Student layouts
- **`<NavSidebar navItems={[...]}>`** — role-based sidebar menu built on top of PanelLayout
- **`<PageHeader title action?>`** — consistent page title row with optional action button (e.g. "Create User")

### Feedback
- **`<ConfirmDialog>`** — AlertDialog wrapper with confirm/cancel; used for delete/disable actions
- **`<FormError message>`** — inline field-level or form-level error; used inside react-hook-form forms
