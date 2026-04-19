import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'active' | 'inactive'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === 'active'
          ? 'border-green-500 text-green-600'
          : 'border-red-400 text-red-500',
      )}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  )
}
