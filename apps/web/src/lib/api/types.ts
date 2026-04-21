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
  teacherClassId: string | null
  weekDay: number
  startingHour: string
  length: number
  teacherClass: TeacherClass | null
  createdAt: string
  updatedAt: string
}

export interface Attendance {
  id: string
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  studentId: string
  lessonInstanceId: string
  student: { id: string; firstName: string; lastName: string }
  lessonInstance: LessonInstance
  createdAt: string
}

export interface Grade {
  id: string
  value: number
  weight: number
  comment: string | null
  isExcluded: boolean
  studentId: string
  teacherClassId: string
  correctionForId: string | null
  student: { id: string; firstName: string; lastName: string }
  teacherClass: TeacherClass
  correctionFor: { id: string; value: number } | null
  correction: { id: string; value: number } | null
  createdAt: string
  updatedAt: string
}

export interface GradeAverage {
  average: number | null
  gradeCount: number
}

export interface LessonInstance {
  id: string
  date: string
  topic: string | null
  comment: string | null
  teacherClassId: string
  teacherClass: TeacherClass
  createdAt: string
  updatedAt: string
}
