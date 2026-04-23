# Reusable UI Components

## 1. Shadcn Primitives to Install

These come from shadcn/ui — configure and theme, don't build from scratch.

| Component                       | Used In                                          |
| ------------------------------- | ------------------------------------------------ |
| Button                          | everywhere                                       |
| Input / Textarea                | all forms                                        |
| Dialog / AlertDialog            | edit forms, confirmation dialogs                 |
| Table                           | all list/grid views                              |
| Badge                           | role labels, attendance status, grade indicators |
| Skeleton                        | loading states for all data views                |
| Toast (Sonner)                  | success/error feedback after mutations           |
| Select / Combobox               | role picker, class picker, subject picker        |
| DatePicker (Calendar + Popover) | attendance date, timeslot creation               |
| Tabs                            | panel switching (e.g. grades by term)            |
| Avatar                          | user display in lists and rosters                |
| DropdownMenu                    | row actions (edit/delete/disable)                |

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

- **`<PanelLayout navItems sidebarFooter?>`** — responsive shell; permanent sidebar on `md+`, slide-out drawer on mobile with backdrop and hamburger top bar. Client component (`'use client'`); manages drawer open/close state internally.
- **`<NavSidebar navItems footer? onNavigate?>`** — role-based sidebar menu. Pass `onNavigate` to close the mobile drawer on link click.
- **`<PageHeader title description? action?>`** — responsive page title row; title scales `text-2xl → text-3xl` across breakpoints. Optional action slot (top-right) for "Create" buttons.

**Mobile navigation behavior:**

1. `PanelLayout` keeps a `drawerOpen` boolean with `useState`.
2. Hamburger button in the mobile top bar sets it to `true`; backdrop click or any nav link sets it to `false` (via `onNavigate`).
3. The sidebar wrapper uses `fixed inset-y-0 left-0 md:relative` + Tailwind `translate-x-*` transitions — no JS animation library required.
4. Overlay: a fixed `bg-black/40` div fades in/out via `opacity` + `pointer-events` toggle.

### Feedback

- **`<ConfirmDialog>`** — AlertDialog wrapper with confirm/cancel; used for delete/disable actions
- **`<FormError message>`** — inline field-level or form-level error; used inside react-hook-form forms
