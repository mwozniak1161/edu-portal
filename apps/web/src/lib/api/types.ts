import type { Role } from '@/types'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  isActive: boolean
  classId: string | null
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Class {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface TeacherClass {
  id: string
  teacherId: string
  subjectId: string
  classId: string
  teacher: { id: string; firstName: string; lastName: string; email: string }
  subject: Subject
  class: Class
  createdAt: string
  updatedAt: string
}

export interface Timeslot {
  id: string
  teacherClassId: string
  weekDay: number
  startingHour: string
  length: number
  teacherClass: TeacherClass
  createdAt: string
  updatedAt: string
}
