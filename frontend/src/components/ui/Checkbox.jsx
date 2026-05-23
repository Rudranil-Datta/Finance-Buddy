import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import { disabledStyles, focusRing } from '@/lib/variants.js'

const Checkbox = forwardRef(function Checkbox(
  { className, label, id, ...props },
  ref,
) {
  const inputId = id || props.name

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer items-start gap-2.5 text-sm text-foreground',
        disabledStyles,
        className,
      )}
    >
      <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            'peer h-4 w-4 shrink-0 appearance-none rounded border border-border bg-surface transition-colors',
            'checked:border-accent checked:bg-accent',
            focusRing,
            disabledStyles,
          )}
          {...props}
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-accent-foreground opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  )
})

export default Checkbox
