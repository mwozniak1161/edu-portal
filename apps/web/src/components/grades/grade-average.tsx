'use client'

import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/store/auth.store'

interface GradeAverageProps {
  teacherClassId: string
  studentId: string
}

interface AverageResponse {
  data: { average: number | null }
}

export function GradeAverage({ teacherClassId, studentId }: GradeAverageProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const { data, isLoading } = useQuery<AverageResponse>({
    queryKey: ['grade-average', teacherClassId, studentId],
    queryFn: async () => {
      const res = await fetch(
        `${apiUrl}/grades/average?teacherClassId=${teacherClassId}&studentId=${studentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (!res.ok) throw new Error('Failed to fetch average')
      return res.json()
    },
    enabled: !!accessToken,
  })

  if (isLoading) return <Skeleton className="h-5 w-12 inline-block" />

  const avg = data?.data.average
  if (avg === null || avg === undefined) return <span className="text-muted-foreground text-sm">—</span>

  return (
    <Badge variant="secondary" className="font-mono">
      {avg.toFixed(2)}
    </Badge>
  )
}
