import { forwardRef } from 'react'
import { cn } from '@/lib/cn.js'
import { disabledStyles, focusRing } from '@/lib/variants.js'
import Spinner from './Spinner.jsx'

const variants = {
  primary:
    'bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-background shadow-sm',
  ghost: 'bg-transparent text-muted hover:bg-background hover:text-foreground',
  danger:
    'bg-danger text-white hover:bg-danger/90 shadow-sm',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-background',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled,
    children,
    leftIcon,
    rightIcon,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        focusRing,
        disabledStyles,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="text-current" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

export default Button
