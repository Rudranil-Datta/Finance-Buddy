import { cn } from '@/lib/cn.js'
import { cardBase } from '@/lib/variants.js'

export function Card({ className, children, padding = true, ...props }) {
  return (
    <div
      className={cn(cardBase, padding && 'p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('mb-4 flex flex-col gap-1', className)}>{children}</div>
  )
}

export function CardTitle({ className, children, as: Tag = 'h3' }) {
  return (
    <Tag className={cn('text-base font-semibold text-foreground', className)}>
      {children}
    </Tag>
  )
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('text-sm text-muted', className)}>{children}</p>
  )
}

export function CardContent({ className, children }) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={cn(
        'mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
