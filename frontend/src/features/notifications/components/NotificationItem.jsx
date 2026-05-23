import { cn } from '@/lib/cn.js'
import Badge from '@/components/ui/Badge.jsx'
import { formatDate, formatRelative } from '@/utils/format.js'
import {
  getNotificationMeta,
  priorityVariant,
} from '../utils/notificationHelpers.js'

export default function NotificationItem({
  notification,
  compact = false,
  onMarkRead,
  onClick,
}) {
  const meta = getNotificationMeta(notification.type)
  const Icon = meta.icon

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.read) onMarkRead?.(notification.id)
        onClick?.(notification)
      }}
      className={cn(
        'flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-background',
        !notification.read && 'bg-accent-muted/40',
        compact && 'px-2 py-2',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
          notification.read
            ? 'border-border bg-surface text-muted'
            : 'border-accent/20 bg-accent-muted text-accent',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              'truncate text-sm',
              notification.read
                ? 'font-medium text-muted'
                : 'font-semibold text-foreground',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
          )}
        </div>
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">
            {notification.message}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant={meta.variant} size="sm">
            {meta.label}
          </Badge>
          {notification.priority === 'high' && (
            <Badge variant={priorityVariant(notification.priority)} size="sm">
              High
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground">
            {notification.dueDate
              ? `Due ${formatDate(notification.dueDate)}`
              : formatRelative(notification.createdAt)}
          </span>
        </div>
      </div>
    </button>
  )
}
