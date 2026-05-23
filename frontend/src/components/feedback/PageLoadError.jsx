import AlertBanner from './AlertBanner.jsx'
import Button from '@/components/ui/Button.jsx'
import { cn } from '@/lib/cn.js'

/**
 * Inline page-level error — use when a data fetch fails but the shell can stay visible.
 */
export default function PageLoadError({
  title = 'Could not load data',
  message,
  onRetry,
  className,
}) {
  if (!message) return null

  return (
    <AlertBanner
      variant="warning"
      title={title}
      message={message}
      className={cn(className)}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  )
}
