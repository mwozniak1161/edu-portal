import { Badge } from '@/components/ui/badge'
import { AttendanceStatus } from '@/types'
import { cn } from '@/lib/utils'

const styles: Record<AttendanceStatus, string> = {
  [AttendanceStatus.PRESENT]: 'border-green-500 text-green-600',
  [AttendanceStatus.ABSENT]: 'border-red-400 text-red-500',
  [AttendanceStatus.LATE]: 'border-yellow-500 text-yellow-600',
}

const labels: Record<AttendanceStatus, string> = {
  [AttendanceStatus.PRESENT]: 'Present',
  [AttendanceStatus.ABSENT]: 'Absent',
  [AttendanceStatus.LATE]: 'Late',
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <Badge variant="outline" className={cn(styles[status])}>
      {labels[status]}
    </Badge>
  )
}
