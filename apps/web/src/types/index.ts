export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}
