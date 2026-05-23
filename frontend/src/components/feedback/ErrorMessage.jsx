import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn.js'

export default function ErrorMessage({ message, className, children }) {
  if (!message && !children) return null

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-danger/20 bg-danger-muted px-3 py-2 text-sm text-danger',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{message || children}</div>
    </div>
  )
}
