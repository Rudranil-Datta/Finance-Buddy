import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn.js'

export default function SuccessMessage({ message, className, children }) {
  if (!message && !children) return null

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-success/20 bg-success-muted px-3 py-2 text-sm text-success',
        className,
      )}
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{message || children}</div>
    </div>
  )
}
