import NotificationDropdown from '@/features/notifications/components/NotificationDropdown.jsx'
import { useNotificationPreview } from '@/features/notifications/hooks/useNotificationPreview.js'

/**
 * Header notification bell with dropdown preview and unread badge.
 */
export default function NotificationBell({ className }) {
  const { notifications, unreadCount, loading, markRead } =
    useNotificationPreview()

  return (
    <NotificationDropdown
      notifications={notifications}
      unreadCount={unreadCount}
      loading={loading}
      onMarkRead={markRead}
      className={className}
    />
  )
}
