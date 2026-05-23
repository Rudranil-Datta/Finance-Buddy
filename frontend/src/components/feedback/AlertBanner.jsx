import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import Button from '@/components/ui/Button.jsx'

const variants = {
  info: {
    container: 'border-border bg-accent-muted text-foreground',
    icon: Info,
    iconClass: 'text-accent',
  },
  success: {
    container: 'border-success/20 bg-success-muted text-success',
    icon: CheckCircle2,
    iconClass: 'text-success',
  },
  warning: {
    container: 'border-warning/20 bg-warning-muted text-warning',
    icon: AlertCircle,
    iconClass: 'text-warning',
  },
  error: {
    container: 'border-danger/20 bg-danger-muted text-danger',
    icon: AlertCircle,
    iconClass: 'text-danger',
  },
}

export default function AlertBanner({
  variant = 'info',
  title,
  message,
  onDismiss,
  action,
  className,
}) {
  const config = variants[variant] ?? variants.info
  const Icon = config.icon

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-lg border px-4 py-3',
        config.container,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconClass)} aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {message && (
          <p className={cn('text-sm', title && 'mt-1 opacity-90')}>{message}</p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
