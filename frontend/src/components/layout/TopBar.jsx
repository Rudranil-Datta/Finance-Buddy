import { Menu } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import { APP_NAME } from '@/utils/constants.js'
import { useAuth } from '@/hooks/useAuth.js'
import Avatar from '@/components/ui/Avatar.jsx'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@/components/ui/Dropdown.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function TopBar({ onMenuOpen, className }) {
  const { user, logout } = useAuth()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm sm:gap-4 md:h-16 md:px-6',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-background hover:text-foreground md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 md:hidden">
          <p className="truncate text-sm font-semibold text-foreground">
            {APP_NAME}
          </p>
        </div>

        <div className="hidden md:block">
          <p className="text-sm text-muted">
            Welcome back
            {user?.name ? (
              <>
                ,{' '}
                <span className="font-medium text-foreground">{user.name}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell />

        <Dropdown align="end">
          <DropdownTrigger className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 transition-colors hover:border-border-strong">
            <Avatar name={user?.name} size="sm" />
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground sm:inline">
              {user?.name || 'Account'}
            </span>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem disabled className="text-xs text-muted">
              Profile — coming soon
            </DropdownItem>
            <DropdownItem disabled className="text-xs text-muted">
              Settings — coming soon
            </DropdownItem>
            <DropdownItem destructive onClick={logout}>
              Log out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}
