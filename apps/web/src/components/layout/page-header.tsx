interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 pt-2">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-edu-on-surface">{title}</h1>
        {description && (
          <p className="text-edu-outline mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 ml-6">{action}</div>}
    </div>
  )
}
