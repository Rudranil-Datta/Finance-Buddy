import { cn } from '@/lib/cn.js'

const variants = {
  default: 'bg-background text-foreground border border-border',
  accent: 'bg-accent-muted text-accent border border-accent/20',
  success: 'bg-success-muted text-success border border-success/20',
  warning: 'bg-warning-muted text-warning border border-warning/20',
  danger: 'bg-danger-muted text-danger border border-danger/20',
  outline: 'bg-transparent text-muted border border-border',
  income: 'bg-success-muted text-income border border-success/20',
  expense: 'bg-background text-expense border border-border',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium whitespace-nowrap',
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
