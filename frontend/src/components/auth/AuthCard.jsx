import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import { cn } from '@/lib/cn.js'

/**
 * Centered auth form shell — title, subtitle, and elevated card styling.
 */
export default function AuthCard({ title, subtitle, children, footer, className }) {
  return (
    <Card
      padding
      className={cn(
        'border-border/80 shadow-[var(--shadow-elevated)] ring-1 ring-black/[0.03]',
        className,
      )}
    >
      <CardHeader className="mb-0 text-center">
        <CardTitle as="h1" className="text-2xl font-semibold tracking-tight">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="mt-2 text-base">{subtitle}</CardDescription>
        )}
      </CardHeader>

      <div className="mt-6">{children}</div>

      {footer && (
        <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
          {footer}
        </div>
      )}
    </Card>
  )
}
