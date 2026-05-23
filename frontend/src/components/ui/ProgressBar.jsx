import { cn } from '@/lib/cn.js'

const toneClasses = {
  safe: 'bg-accent',
  warning: 'bg-warning',
  danger: 'bg-danger',
  success: 'bg-success',
}

/**
 * Horizontal progress bar with optional label row.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  tone = 'safe',
  showLabel = false,
  label,
  className,
  barClassName,
}) {
  const pct = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0
  const barTone = toneClasses[tone] ?? toneClasses.safe

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span>{label}</span>
          <span className="font-medium text-foreground">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={cn('h-full rounded-full transition-all duration-300', barTone, barClassName)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
