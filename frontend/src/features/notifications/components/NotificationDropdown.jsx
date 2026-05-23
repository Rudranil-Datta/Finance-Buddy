import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
} from '@/components/ui/Dropdown.jsx'
import { ROUTES } from '@/app/router/paths.js'
import { cn } from '@/lib/cn.js'
import NotificationItem from './NotificationItem.jsx'

export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  loading = false,
  onMarkRead,
  className,
}) {
  const showBadge = unreadCount > 0

  return (
    <Dropdown align="end">
      <DropdownTrigger
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-border-strong hover:text-foreground',
          className,
        )}
        aria-label={
          showBadge
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
      >
        <Bell className="h-5 w-5" aria-hidden />
        {showBadge && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownTrigger>

      <DropdownMenu className="w-80 p-0 sm:w-96">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted">
            {showBadge ? `${unreadCount} unread` : 'You are all caught up'}
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {loading ? (
            <div className="space-y-2 px-4 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                compact
                onMarkRead={onMarkRead}
              />
            ))
          )}
        </div>

        <div className="border-t border-border px-3 py-2">
          <Link to={ROUTES.NOTIFICATIONS}>
            <Button variant="secondary" size="sm" className="w-full">
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}
