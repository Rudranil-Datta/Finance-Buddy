import { Link, Outlet } from 'react-router-dom'
import { APP_NAME } from '@/utils/constants.js'
import { ROUTES } from '@/app/router/paths.js'

/**
 * Centered layout for login and register.
 */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-muted)_0%,_transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:4rem_4rem]"
        aria-hidden
      />

      <header className="relative z-10 px-6 py-8">
        <Link
          to={ROUTES.HOME}
          className="mx-auto flex max-w-md flex-col items-center text-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-sm">
            FB
          </span>
          <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-accent">
            {APP_NAME}
          </span>
          <span className="mt-1 text-sm text-muted">
            AI-powered personal finance
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
        <div className="w-full max-w-md pb-[env(safe-area-inset-bottom)]">
          <Outlet />
        </div>
      </main>

      <footer className="relative z-10 px-4 py-6 text-center text-xs text-muted-foreground">
        Secure · Analytics-first · Built for clarity
      </footer>
    </div>
  )
}
