import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import { disabledStyles, focusRing, inputBase, inputError } from '@/lib/variants.js'

const Select = forwardRef(function Select(
  { className, error, children, ...props },
  ref,
) {
  return (
    <div className="relative isolate">
      <select
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={cn(
          inputBase,
          'appearance-none pr-9',
          focusRing,
          disabledStyles,
          error && inputError,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  )
})

export default Select
