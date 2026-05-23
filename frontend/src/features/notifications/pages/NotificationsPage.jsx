import { useState } from 'react'
import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import { Card } from '@/components/ui/Card.jsx'
import Select from '@/components/ui/Select.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { useNotifications } from '../hooks/useNotifications.js'
import {
  NotificationItem,
  UpcomingBillsWidget,
} from '../components/index.js'

const READ_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread only' },
  { value: 'read', label: 'Read only' },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const [readFilter, setReadFilter] = useState('')

  const {
    notifications,
    upcomingBills,
    unreadCount,
    loading,
    actionLoading,
    error,
    refresh,
    markRead,
    markAllRead,
    syncBillReminders,
  } = useNotifications({ readFilter })

  async function handleMarkAll() {
    try {
      await markAllRead()
      toast.success('All notifications marked as read')
    } catch (err) {
      toast.error(err?.message || 'Could not update notifications')
    }
  }

  async function handleMarkOne(id) {
    try {
      await markRead(id)
    } catch (err) {
      toast.error(err?.message || 'Could not mark as read')
    }
  }

  async function handleSyncReminders() {
    try {
      await syncBillReminders()
      toast.success('Bill reminders synced')
    } catch (err) {
      toast.error(err?.message || 'Could not sync reminders')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Budget alerts, bill reminders, and goal milestones in one place."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={refresh}
            >
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                loading={actionLoading}
                leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
                onClick={handleMarkAll}
              >
                Mark all read
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <AlertBanner
          variant="warning"
          title="Could not load notifications"
          message={error}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card padding className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {loading
                ? 'Loading…'
                : `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`}
              {!loading && unreadCount > 0 && (
                <span className="ml-2 font-medium text-accent">
                  · {unreadCount} unread
                </span>
              )}
            </p>
            <div className="w-full sm:w-40">
              <Select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                aria-label="Filter notifications"
              >
                {READ_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {loading ? (
            <Card padding className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-16 w-full rounded-lg" />
              ))}
            </Card>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-5 w-5" />}
              title="No notifications"
              description={
                readFilter === 'unread'
                  ? 'You have read everything — nice work.'
                  : 'Alerts will appear when budgets, bills, or goals need attention.'
              }
            />
          ) : (
            <Card padding className="divide-y divide-border p-0">
              <ul>
                {notifications.map((n) => (
                  <li key={n.id} className="px-2 py-1 first:pt-2 last:pb-2">
                    <NotificationItem
                      notification={n}
                      onMarkRead={handleMarkOne}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <UpcomingBillsWidget
          bills={upcomingBills}
          currency={currency}
          loading={loading}
          actionLoading={actionLoading}
          onSyncReminders={handleSyncReminders}
        />
      </div>
    </div>
  )
}
