import { forwardRef } from 'react'
import { cn } from '@/lib/cn.js'
import { disabledStyles, focusRing, inputBase, inputError } from '@/lib/variants.js'

const Textarea = forwardRef(function Textarea(
  { className, error, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={error ? true : undefined}
      className={cn(
        inputBase,
        'resize-y min-h-[80px]',
        focusRing,
        disabledStyles,
        error && inputError,
        className,
      )}
      {...props}
    />
  )
})

export default Textarea
