import { AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'
import { Card } from '@/components/ui/Card.jsx'
import { cn } from '@/lib/cn.js'

export default function FullPageError({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  secondaryAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex min-h-[50vh] items-center justify-center p-4 sm:min-h-[60vh]',
        className,
      )}
    >
      <Card padding className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        {(onRetry || secondaryAction) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {onRetry && (
              <Button onClick={onRetry}>{retryLabel}</Button>
            )}
            {secondaryAction}
          </div>
        )}
      </Card>
    </div>
  )
}
