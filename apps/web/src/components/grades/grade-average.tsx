'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useGradeAverage } from '@/lib/api/grades'

interface GradeAverageProps {
  teacherClassId: string
  studentId: string
}

export function GradeAverage({ teacherClassId, studentId }: GradeAverageProps) {
  const { data, isLoading } = useGradeAverage(teacherClassId, studentId)

  if (isLoading) return <Skeleton className="h-5 w-12 inline-block" />

  const avg = data?.average
  if (avg === null || avg === undefined) return <span className="text-muted-foreground text-sm">—</span>

  return (
    <Badge variant="secondary" className="font-mono">
      {avg.toFixed(2)}
    </Badge>
  )
}
