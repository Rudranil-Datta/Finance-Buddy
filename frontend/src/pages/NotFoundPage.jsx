import { Link } from 'react-router-dom'
import { ArrowLeft, Home, LayoutDashboard } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import { APP_NAME } from '@/utils/constants.js'
import { ROUTES } from '@/app/router/paths.js'
import { cn } from '@/lib/cn.js'

/**
 * @param {{ variant?: 'standalone' | 'app' }} props
 */
export default function NotFoundPage({ variant = 'standalone' }) {
  const content = (
    <div className="text-center">
      <p
        className="text-7xl font-semibold tracking-tight text-muted-foreground/80 sm:text-8xl"
        aria-hidden
      >
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Page not found
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
        <Link to={ROUTES.DASHBOARD}>
          <Button
            className="w-full sm:w-auto"
            leftIcon={<LayoutDashboard className="h-4 w-4" />}
          >
            Dashboard
          </Button>
        </Link>
        <Link to={ROUTES.HOME}>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Home
          </Button>
        </Link>
      </div>
    </div>
  )

  if (variant === 'app') {
    return (
      <div className="page-stack flex min-h-[50vh] flex-col items-center justify-center py-12">
        {content}
      </div>
    )
  }

  return (
    <Card
      padding
      className={cn(
        'w-full max-w-md text-center shadow-[var(--shadow-elevated)]',
      )}
    >
      <Link
        to={ROUTES.HOME}
        className="mx-auto mb-6 flex w-fit flex-col items-center"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-sm">
          FB
        </span>
        <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent">
          {APP_NAME}
        </span>
      </Link>
      {content}
      <Link
        to={ROUTES.LOGIN}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </Card>
  )
}
