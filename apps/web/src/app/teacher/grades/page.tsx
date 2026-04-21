'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Plus, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WeightedGradeCell } from '@/components/grades/weighted-grade-cell'
import { GradeDistributionChips } from '@/components/grades/grade-distribution-chips'
import { GradeForm } from '@/components/teacher/grade-form'
import { CorrectionGradeForm } from '@/components/teacher/correction-grade-form'
import { UserAvatar } from '@/components/user/user-avatar'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import { useUsers } from '@/lib/api/users'
import {
  useGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
  useCreateCorrectionGrade,
} from '@/lib/api/grades'
import { useAuthStore } from '@/store/auth.store'
import type { Grade } from '@/lib/api/types'
import { Role } from '@/types'
import { cn } from '@/lib/utils'

type DialogMode = 'create' | 'edit' | 'correction'

function computeWeightedAvg(grades: Grade[]): number | null {
  const active = grades.filter((g) => !g.isExcluded)
  if (active.length === 0) return null
  const totalWeight = active.reduce((sum, g) => sum + g.weight, 0)
  if (totalWeight === 0) return null
  return active.reduce((sum, g) => sum + g.value * g.weight, 0) / totalWeight
}

function avgColorClass(avg: number): string {
  if (avg >= 4.5) return 'bg-green-100 text-green-800'
  if (avg >= 3.5) return 'bg-blue-100 text-blue-800'
  if (avg >= 2.5) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

export default function GradesPage() {
  const user = useAuthStore((s) => s.user)
  const [teacherClassId, setTeacherClassId] = useState<string>('')
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>()
  const [preselectStudentId, setPreselectStudentId] = useState<string | undefined>()
  const [studentGradesModal, setStudentGradesModal] = useState<{ id: string; firstName: string; lastName: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data: teacherClasses = [] } = useTeacherClasses()
  const myClasses = teacherClasses.filter((tc) => tc.teacherId === user?.id)
  const selectedTc = myClasses.find((tc) => tc.id === teacherClassId)

  const { data: usersResp } = useUsers(undefined, 1, 200)
  const classStudents = useMemo(
    () => (usersResp?.users ?? []).filter((u) => u.role === Role.STUDENT && u.classId === selectedTc?.classId),
    [usersResp, selectedTc],
  )

  const { data: grades = [], isLoading } = useGrades(teacherClassId || undefined)
  const createGrade = useCreateGrade()
  const updateGrade = useUpdateGrade()
  const deleteGrade = useDeleteGrade()
  const createCorrection = useCreateCorrectionGrade()

  const { classAvg, missingCount } = useMemo(() => {
    const studentAvgs = classStudents
      .map((s) => computeWeightedAvg(grades.filter((g) => g.studentId === s.id)))
      .filter((a): a is number => a !== null)
    const avg = studentAvgs.length > 0
      ? studentAvgs.reduce((s, a) => s + a, 0) / studentAvgs.length
      : null
    const missing = classStudents.filter((s) => !grades.some((g) => g.studentId === s.id)).length
    return { classAvg: avg, missingCount: missing }
  }, [grades, classStudents])

  function openCreate(studentId: string) {
    setPreselectStudentId(studentId)
    setSelectedGrade(undefined)
    setDialogMode('create')
  }

  function openEdit(grade: Grade) {
    setSelectedGrade(grade)
    setPreselectStudentId(undefined)
    setDialogMode('edit')
    setStudentGradesModal(null)
  }

  function openCorrection(grade: Grade) {
    setSelectedGrade(grade)
    setDialogMode('correction')
    setStudentGradesModal(null)
  }

  function closeDialog() {
    setDialogMode(null)
    setSelectedGrade(undefined)
    setPreselectStudentId(undefined)
  }

  async function handleGradeSubmit(values: {
    value: number
    weight: number
    comment: string
    studentId: string
    teacherClassId: string
  }) {
    try {
      if (dialogMode === 'edit' && selectedGrade) {
        await updateGrade.mutateAsync({ id: selectedGrade.id, ...values })
        toast.success('Grade updated')
      } else {
        await createGrade.mutateAsync(values)
        toast.success('Grade added')
      }
      closeDialog()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  async function handleCorrectionSubmit(values: { value: number; weight: number; comment: string }) {
    if (!selectedGrade) return
    try {
      await createCorrection.mutateAsync({ correctionForId: selectedGrade.id, ...values })
      toast.success('Correction grade added')
      closeDialog()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader title="Gradebook" description="Manage grades for your classes." />

      <div className="mb-6 w-72">
        <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Select subject / class" /></SelectTrigger>
          <SelectContent>
            {myClasses.map((tc) => (
              <SelectItem key={tc.id} value={tc.id}>
                {tc.subject.name} — {tc.class.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!teacherClassId ? (
        <p className="text-muted-foreground text-sm">Select a subject / class to view the gradebook.</p>
      ) : (
        <>
          {!isLoading && (
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant">Class Average</p>
                <p className={cn('text-2xl font-bold font-data mt-0.5', classAvg === null && 'text-muted-foreground')}>
                  {classAvg !== null ? classAvg.toFixed(2) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant">No Grades Yet</p>
                <p className={cn('text-2xl font-bold font-data mt-0.5', missingCount > 0 ? 'text-destructive' : 'text-muted-foreground')}>
                  {missingCount}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
            </div>
          ) : classStudents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No students in this class.</p>
          ) : (
            <div className="rounded-md border divide-y">
              <div className="grid grid-cols-[1fr_100px_1fr_80px] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant bg-edu-surface-container/50">
                <span>Student</span>
                <span>Average</span>
                <span>Grades</span>
                <span />
              </div>

              {classStudents.map((student) => {
                const studentGrades = grades.filter((g) => g.studentId === student.id)
                const avg = computeWeightedAvg(studentGrades)

                return (
                  <div key={student.id} className="grid grid-cols-[1fr_100px_1fr_80px] gap-4 px-4 py-3 items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar firstName={student.firstName} lastName={student.lastName} />
                      <span className="font-medium text-sm truncate">{student.firstName} {student.lastName}</span>
                    </div>

                    <div>
                      {avg !== null ? (
                        <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-sm font-bold font-data', avgColorClass(avg))}>
                          {avg.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </div>

                    <GradeDistributionChips grades={studentGrades} />

                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openCreate(student.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      {studentGrades.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setStudentGradesModal(student)}>
                              View grades
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <Dialog open={dialogMode === 'create' || dialogMode === 'edit'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Grade' : 'Add Grade'}</DialogTitle>
            {dialogMode === 'edit' && selectedGrade?.correctionForId && (
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mt-0.5">Correction Grade</p>
            )}
          </DialogHeader>
          <GradeForm
            grade={selectedGrade}
            teacherClasses={myClasses}
            students={classStudents}
            preselectStudentId={preselectStudentId}
            preselectTeacherClassId={teacherClassId || undefined}
            onSubmit={handleGradeSubmit}
            onCancel={closeDialog}
            isLoading={createGrade.isPending || updateGrade.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode === 'correction'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Correction Grade</DialogTitle>
          </DialogHeader>
          {selectedGrade && (
            <CorrectionGradeForm
              originalGrade={selectedGrade}
              onSubmit={handleCorrectionSubmit}
              onCancel={closeDialog}
              isLoading={createCorrection.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!studentGradesModal} onOpenChange={(o) => !o && setStudentGradesModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {studentGradesModal ? `${studentGradesModal.firstName} ${studentGradesModal.lastName}` : ''}
            </DialogTitle>
          </DialogHeader>
          {studentGradesModal && (() => {
            const sg = grades.filter((g) => g.studentId === studentGradesModal.id)
            return sg.length === 0 ? (
              <p className="text-muted-foreground text-sm">No grades yet.</p>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {sg.map((g) => (
                  <div key={g.id} className="flex items-center justify-between py-2.5 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <WeightedGradeCell value={g.value} weight={g.weight} comment={g.comment ?? undefined} />
                      {g.isExcluded && <Badge variant="outline" className="text-xs">Excluded</Badge>}
                      {g.correctionForId && <Badge variant="secondary" className="text-xs">Correction</Badge>}
                      {g.comment && <span className="text-xs text-muted-foreground truncate max-w-36">{g.comment}</span>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEdit(g)}>Edit</Button>
                      {!g.correction && !g.isExcluded && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openCorrection(g)}>Correct</Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => { setDeleteId(g.id); setStudentGradesModal(null) }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete grade?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteGrade.mutateAsync(deleteId)
            toast.success('Grade deleted')
          } catch {
            toast.error('Failed to delete grade')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
