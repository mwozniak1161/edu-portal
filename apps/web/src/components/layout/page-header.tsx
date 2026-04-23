interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 pt-2 md:mb-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-edu-on-surface md:text-3xl">
          {title}
        </h1>
        {description && <p className="text-edu-outline mt-2 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0 ml-6">{action}</div>}
    </div>
  );
}
