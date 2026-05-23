import { useCallback, useEffect, useState } from 'react'
import { notificationsApi } from '@/api'
import { DEFAULT_NOTIFICATION_LIMIT } from '@/utils/constants.js'
import { normalizeNotification } from '../utils/notificationHelpers.js'

/**
 * Lightweight fetch for header bell — recent notifications + unread count.
 */
export function useNotificationPreview() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [all, unread] = await Promise.all([
        notificationsApi.list({ limit: DEFAULT_NOTIFICATION_LIMIT }),
        notificationsApi.list({ read: false, limit: DEFAULT_NOTIFICATION_LIMIT }),
      ])
      const recent = Array.isArray(all) ? all.map(normalizeNotification) : []
      setNotifications(recent.slice(0, 8))
      setUnreadCount(Array.isArray(unread) ? unread.length : 0)
    } catch {
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const markRead = useCallback(async (id) => {
    try {
      const updated = await notificationsApi.markRead(id)
      const normalized = normalizeNotification(updated)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? normalized : n)),
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch {
      /* silent for preview */
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
  }
}
