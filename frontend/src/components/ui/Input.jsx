import { forwardRef } from 'react'
import { cn } from '@/lib/cn.js'
import { disabledStyles, focusRing, inputBase, inputError } from '@/lib/variants.js'

const Input = forwardRef(function Input(
  { className, error, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={error ? true : undefined}
      className={cn(
        inputBase,
        focusRing,
        disabledStyles,
        error && inputError,
        className,
      )}
      {...props}
    />
  )
})

export default Input
