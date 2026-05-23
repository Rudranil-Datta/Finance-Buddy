import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn.js'

export default function InlineValidation({ message, className }) {
  if (!message) return null

  return (
    <p
      role="alert"
      className={cn(
        'flex items-center gap-1.5 text-xs text-danger',
        className,
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  )
}
