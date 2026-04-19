# Style Guide — Educational ERP

## Design Direction

**Clean Modern SaaS** — inspired by Linear, Vercel Dashboard, and Notion.

Core principles:
- Flat UI — no gradients, no heavy shadows, no decorative flourishes
- Generous whitespace — let content breathe, never feel cramped
- High contrast text on neutral backgrounds
- Subtle borders over shadows for separation
- Every element has a clear purpose — nothing decorative

This aesthetic reads as professional and trustworthy for admin staff, teachers, and students alike. It also lets data (grades, attendance, schedules) be the visual focus rather than the chrome around it.

---

## Color Palette

Built on top of shadcn CSS variables (`--background`, `--foreground`, etc.). Override in `globals.css` under `@layer base`.

### Base (Neutral — Slate)
| Role | Tailwind | Hex | Usage |
|------|----------|-----|-------|
| Background | `slate-50` | `#f8fafc` | Page background |
| Surface | `white` | `#ffffff` | Cards, sidebar, modals |
| Border | `slate-200` | `#e2e8f0` | All dividers and outlines |
| Muted text | `slate-500` | `#64748b` | Labels, captions, placeholders |
| Body text | `slate-700` | `#334155` | Table cells, descriptions |
| Heading | `slate-900` | `#0f172a` | Page titles, headings |

### Brand (Indigo)
| Role | Tailwind | Hex | Usage |
|------|----------|-----|-------|
| Primary | `indigo-600` | `#4f46e5` | Primary buttons, active nav indicator |
| Primary hover | `indigo-700` | `#4338ca` | Button hover state |
| Primary subtle | `indigo-50` | `#eef2ff` | Active nav background, selected row |
| Primary text | `indigo-700` | `#4338ca` | Links |

### Semantic
| Role | Tailwind | Hex | Usage |
|------|----------|-----|-------|
| Success | `emerald-500` | `#10b981` | Attendance PRESENT, active status badge |
| Warning | `amber-500` | `#f59e0b` | Attendance LATE, pending |
| Destructive | `red-500` | `#ef4444` | Errors, ABSENT, delete |
| Info | `sky-500` | `#0ea5e9` | Informational badges, highlights |

### Role Colors (badges only)
| Role | Color | Variant |
|------|-------|---------|
| Admin | Indigo | `default` (filled) |
| Teacher | Sky | `secondary` |
| Student | Slate | `outline` |

---

## Typography

Font: **Geist** (already loaded via `next/font`). Monospaced numbers use `font-mono` (Geist Mono) for grade values and averages.

| Scale | Class | Usage |
|-------|-------|-------|
| Caption | `text-xs text-muted-foreground` | Table sub-labels, timestamps |
| Body | `text-sm` | Table cells, form labels, nav items |
| Default | `text-base` | Paragraph content |
| Section title | `text-lg font-semibold` | Card headings, section headers |
| Page title | `text-2xl font-semibold tracking-tight` | `<PageHeader>` title |

Weight rules:
- `font-normal` — body copy
- `font-medium` — nav labels, badge text, form field values
- `font-semibold` — headings only

---

## Spacing & Layout

| Token | Value | Where |
|-------|-------|-------|
| Page padding | `px-6 py-8` | `PanelLayout` main content area |
| Section gap | `space-y-6` | Between page sections |
| Form field gap | `space-y-4` | Between form fields |
| Card padding | `p-6` | Inside bordered card containers |
| Table row height | `py-3 px-4` | Table cell padding |
| Sidebar width | `w-60` | `NavSidebar` |
| Content max-width | `max-w-7xl` | `PanelLayout` container |
| Modal max-width | `max-w-md` | Standard dialog |

---

## Component Conventions

### Buttons
| Intent | Variant | Example |
|--------|---------|---------|
| Primary action | `default` | Save, Create, Login |
| Secondary action | `outline` | Cancel, Edit, Export |
| Danger action | `destructive` | Delete, Disable |
| Tertiary / icon-only | `ghost` | Row action icon buttons |

### Borders & Radius
- `rounded-md` — inputs, badges, table rows
- `rounded-lg` — cards, dialogs, dropdowns
- `rounded-full` — avatars only
- Border color: always `border-border` (`slate-200`) — never custom colors on structural borders

### Shadows
- `shadow-sm` — floating elements only (dropdown menus, popovers)
- No shadow on cards — use `border` for separation instead
- No `shadow-md` or larger in the UI

### Tables
- Header: `bg-muted/50` with `text-xs font-medium text-muted-foreground uppercase tracking-wide`
- Row hover: `hover:bg-muted/40`
- Row divider: `divide-y divide-border`
- No zebra striping — hover state is enough visual feedback

### Forms
- Label above input, never inline placeholder as the only label
- Error state: red border + `<FormError>` message below the field
- Required fields: asterisk `*` in label, `text-destructive`
- Full-width inputs inside forms, `max-w-sm` for standalone search inputs

### Empty states
- Centered in the table/panel, `InboxIcon` + title + optional CTA button
- Tone: neutral, not apologetic ("No students found" not "Oops, nothing here!")

### Navigation (sidebar)
- Active item: `bg-indigo-50 text-indigo-700 font-medium`
- Inactive item: `text-slate-600 hover:bg-slate-100`
- Icon size: `h-4 w-4`, always `shrink-0`
- Group labels (if used): `text-xs font-semibold uppercase tracking-widest text-slate-400 px-3 mb-1`

---

## Iconography

Library: **lucide-react** (already installed).  
Size: `h-4 w-4` inline, `h-5 w-5` for standalone action icons, `h-10 w-10` for empty state illustrations.  
Color: inherit from parent text color — never hardcode icon colors.

Common icon mapping:
| Action/concept | Icon |
|----------------|------|
| Users | `Users` |
| Class / group | `BookOpen` |
| Grades | `GraduationCap` |
| Attendance | `ClipboardList` |
| Schedule | `CalendarDays` |
| Settings | `Settings` |
| Logout | `LogOut` |
| Add | `Plus` |
| Delete | `Trash2` |
| Edit | `Pencil` |
| Search | `Search` |

---

## Dark Mode

Not in MVP scope. shadcn CSS variables are already dark-mode ready — when needed, add `class="dark"` to `<html>` and the theme switches automatically. No extra work required at that point.
