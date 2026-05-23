import { cn } from '@/lib/cn.js'

export default function SectionHeader({
  title,
  description,
  action,
  className,
  size = 'md',
}) {
  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {title && (
          <h2
            className={cn(
              'font-semibold tracking-tight text-foreground',
              titleSizes[size] ?? titleSizes.md,
            )}
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {action && <div className="header-actions shrink-0">{action}</div>}
    </div>
  )
}
