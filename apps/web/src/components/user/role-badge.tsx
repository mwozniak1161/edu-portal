import { Badge } from '@/components/ui/badge'
import { Role } from '@/types'

const variantMap: Record<Role, 'default' | 'secondary' | 'outline'> = {
  [Role.ADMIN]: 'default',
  [Role.TEACHER]: 'secondary',
  [Role.STUDENT]: 'outline',
}

const labelMap: Record<Role, string> = {
  [Role.ADMIN]: 'Admin',
  [Role.TEACHER]: 'Teacher',
  [Role.STUDENT]: 'Student',
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant={variantMap[role]}>{labelMap[role]}</Badge>
}
