import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface WeightedGradeCellProps {
  value: number
  weight: number
  comment?: string
}

export function WeightedGradeCell({ value, weight, comment }: WeightedGradeCellProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="inline-flex items-center gap-1 cursor-default">
          <span className="font-medium">{value}</span>
          <Badge variant="outline" className="text-xs px-1 py-0">
            ×{weight}
          </Badge>
        </span>
      </TooltipTrigger>
      {comment && (
        <TooltipContent>
          <p className="max-w-xs text-sm">{comment}</p>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
