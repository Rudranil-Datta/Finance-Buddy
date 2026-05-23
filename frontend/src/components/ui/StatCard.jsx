import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import { Card } from './Card.jsx'
import SkeletonLoader from './SkeletonLoader.jsx'
import Badge from './Badge.jsx'

export default function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  trend,
  badge,
  loading = false,
  className,
}) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <Card padding className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted">{title}</p>
        {badge}
      </div>

      {loading ? (
        <>
          <SkeletonLoader className="h-8 w-28" />
          <SkeletonLoader className="h-3 w-20" />
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {(subtitle || change) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {subtitle && <span className="text-muted">{subtitle}</span>}
              {change != null && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 font-medium',
                    trend === 'up' && 'text-success',
                    trend === 'down' && 'text-danger',
                    !trend && 'text-muted',
                  )}
                >
                  {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
                  {change}
                  {changeLabel && (
                    <span className="font-normal text-muted-foreground">
                      {changeLabel}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export function StatCardBadge({ children, variant = 'accent' }) {
  return (
    <Badge variant={variant} size="sm">
      {children}
    </Badge>
  )
}
