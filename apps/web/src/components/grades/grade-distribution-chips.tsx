import { cn } from '@/lib/utils'
import type { Grade } from '@/lib/api/types'

function gradeColorClass(value: number): string {
  if (value >= 5) return 'bg-green-100 text-green-800 border-green-200'
  if (value >= 4) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (value >= 3) return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

interface GradeDistributionChipsProps {
  grades: Grade[]
}

export function GradeDistributionChips({ grades }: GradeDistributionChipsProps) {
  const active = grades.filter((g) => !g.isExcluded)
  const counts = new Map<number, number>()
  for (const g of active) {
    counts.set(g.value, (counts.get(g.value) ?? 0) + 1)
  }
  const sorted = [...counts.entries()].sort((a, b) => b[0] - a[0])

  if (sorted.length === 0) {
    return <span className="text-muted-foreground text-xs">No grades</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {sorted.map(([value, count]) => (
        <span
          key={value}
          className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-data border', gradeColorClass(value))}
        >
          {value}{' '}
          <span className="ml-0.5 opacity-70">(×{count})</span>
        </span>
      ))}
    </div>
  )
}
