'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WeightedGradeCell } from '@/components/grades/weighted-grade-cell'
import { GradeAverage } from '@/components/grades/grade-average'
import { GradeForm } from '@/components/teacher/grade-form'
import { CorrectionGradeForm } from '@/components/teacher/correction-grade-form'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
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

type DialogMode = 'create' | 'edit' | 'correction'

export default function GradesPage() {
  const user = useAuthStore((s) => s.user)
  const [teacherClassId, setTeacherClassId] = useState<string>('')
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data: teacherClasses = [] } = useTeacherClasses()
  const myClasses = teacherClasses.filter((tc) => tc.teacherId === user?.id)
  const selectedTc = myClasses.find((tc) => tc.id === teacherClassId)

  const { data: usersResp } = useUsers(undefined, 1, 200)
  const classStudents = (usersResp?.users ?? []).filter(
    (u) => u.role === Role.STUDENT && u.classId === selectedTc?.classId,
  )

  const { data: grades = [], isLoading } = useGrades(teacherClassId || undefined)
  const createGrade = useCreateGrade()
  const updateGrade = useUpdateGrade()
  const deleteGrade = useDeleteGrade()
  const createCorrection = useCreateCorrectionGrade()

  function openCreate() {
    setSelectedGrade(undefined)
    setDialogMode('create')
  }

  function openEdit(grade: Grade) {
    setSelectedGrade(grade)
    setDialogMode('edit')
  }

  function openCorrection(grade: Grade) {
    setSelectedGrade(grade)
    setDialogMode('correction')
  }

  function closeDialog() {
    setDialogMode(null)
    setSelectedGrade(undefined)
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

  const columns: Column<Grade>[] = [
    {
      header: 'Student',
      cell: (g) => `${g.student.firstName} ${g.student.lastName}`,
    },
    {
      header: 'Grade',
      cell: (g) => (
        <span className={g.isExcluded ? 'opacity-40 line-through' : ''}>
          <WeightedGradeCell value={g.value} weight={g.weight} comment={g.comment ?? undefined} />
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (g) =>
        g.isExcluded ? (
          <Badge variant="outline" className="text-xs text-muted-foreground">Excluded</Badge>
        ) : g.correctionForId ? (
          <Badge variant="secondary" className="text-xs">Correction</Badge>
        ) : null,
    },
    {
      header: 'Average',
      cell: (g) =>
        !g.isExcluded && teacherClassId ? (
          <GradeAverage teacherClassId={teacherClassId} studentId={g.studentId} />
        ) : null,
    },
    {
      header: '',
      className: 'w-10',
      cell: (g) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(g)}>Edit</DropdownMenuItem>
            {!g.correction && !g.isExcluded && (
              <DropdownMenuItem onClick={() => openCorrection(g)}>Add Correction</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(g.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Grades"
        description="Manage grades for your teacher-class assignments."
        action={
          teacherClassId ? (
            <Button onClick={openCreate}>Add Grade</Button>
          ) : undefined
        }
      />

      <div className="mb-6 w-72">
        <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject / class" />
          </SelectTrigger>
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
        <p className="text-muted-foreground text-sm">Select a subject / class to view grades.</p>
      ) : (
        <DataTable<Grade>
          columns={columns}
          data={grades}
          isLoading={isLoading}
          keyExtractor={(g) => g.id}
          emptyTitle="No grades yet"
          emptyDescription="Add the first grade for this class."
        />
      )}

      <Dialog open={dialogMode === 'create' || dialogMode === 'edit'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Grade' : 'Add Grade'}</DialogTitle>
          </DialogHeader>
          <GradeForm
            grade={selectedGrade}
            teacherClasses={myClasses}
            students={classStudents}
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
