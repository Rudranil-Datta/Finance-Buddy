import { NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import { APP_NAME } from '@/utils/constants.js'
import { useAuth } from '@/hooks/useAuth.js'
import Avatar from '@/components/ui/Avatar.jsx'
import Badge from '@/components/ui/Badge.jsx'
import { MAIN_NAV_ITEMS } from './navConfig.js'

function navLinkClass({ isActive }) {
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-accent-muted text-accent'
      : 'text-muted hover:bg-background hover:text-foreground',
  )
}

function SidebarPanel({ onNavigate, onLogout, user }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {APP_NAME}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Personal finance
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-md p-1.5 text-muted hover:bg-background md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              onClick={onNavigate}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="outline" size="sm">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger-muted hover:text-danger"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Log out
        </button>
      </div>
    </>
  )
}

/**
 * Desktop: fixed sidebar. Mobile: slide-over drawer.
 */
export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    onClose?.()
    logout()
  }

  const handleNavigate = () => {
    onClose?.()
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface shadow-[var(--shadow-elevated)] transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <SidebarPanel
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          user={user}
        />
      </aside>
    </>
  )
}
