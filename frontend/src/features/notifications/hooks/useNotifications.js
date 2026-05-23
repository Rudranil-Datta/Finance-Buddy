import { useCallback, useEffect, useState } from 'react'
import { notificationsApi } from '@/api'
import { DEFAULT_NOTIFICATION_LIMIT, DEFAULT_UPCOMING_BILLS_DAYS } from '@/utils/constants.js'
import {
  normalizeNotification,
  normalizeUpcomingBill,
} from '../utils/notificationHelpers.js'

/**
 * Full notifications page data: list, bills, mark read actions.
 */
export function useNotifications({ readFilter = '' } = {}) {
  const [notifications, setNotifications] = useState([])
  const [upcomingBills, setUpcomingBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = { limit: DEFAULT_NOTIFICATION_LIMIT }
    if (readFilter === 'unread') params.read = false
    if (readFilter === 'read') params.read = true

    try {
      const [notifData, billsData] = await Promise.all([
        notificationsApi.list(params),
        notificationsApi.getUpcomingBills({ days: DEFAULT_UPCOMING_BILLS_DAYS }),
      ])

      setNotifications(
        Array.isArray(notifData) ? notifData.map(normalizeNotification) : [],
      )
      setUpcomingBills(
        Array.isArray(billsData) ? billsData.map(normalizeUpcomingBill) : [],
      )
    } catch (err) {
      setError(err?.message || 'Failed to load notifications')
      setNotifications([])
      setUpcomingBills([])
    } finally {
      setLoading(false)
    }
  }, [readFilter])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markRead = useCallback(async (id) => {
    setActionLoading(true)
    try {
      const updated = await notificationsApi.markRead(id)
      const normalized = normalizeNotification(updated)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? normalized : n)),
      )
      return normalized
    } finally {
      setActionLoading(false)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    setActionLoading(true)
    try {
      await notificationsApi.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } finally {
      setActionLoading(false)
    }
  }, [])

  const syncBillReminders = useCallback(async () => {
    setActionLoading(true)
    try {
      await notificationsApi.syncBillReminders({
        days: DEFAULT_UPCOMING_BILLS_DAYS,
      })
      await fetchAll()
    } finally {
      setActionLoading(false)
    }
  }, [fetchAll])

  return {
    notifications,
    upcomingBills,
    unreadCount,
    loading,
    actionLoading,
    error,
    refresh: fetchAll,
    markRead,
    markAllRead,
    syncBillReminders,
  }
}
