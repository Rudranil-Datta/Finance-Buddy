import { cn } from '@/lib/cn.js'
import Spinner from '@/components/ui/Spinner.jsx'
import { APP_NAME } from '@/utils/constants.js'

export default function LoadingScreen({
  message = 'Loading…',
  fullScreen = true,
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-4',
        fullScreen && 'min-h-screen bg-background',
        className,
      )}
    >
      <Spinner size="lg" className="text-accent" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{APP_NAME}</p>
        <p className="mt-1 text-xs text-muted">{message}</p>
      </div>
    </div>
  )
}
