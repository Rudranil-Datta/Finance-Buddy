import { Calendar, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Button from '@/components/ui/Button.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency, formatDate } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

function daysUntil(date) {
  const due = new Date(date)
  const now = new Date()
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  return diff
}

export default function UpcomingBillsWidget({
  bills = [],
  currency = 'USD',
  loading = false,
  actionLoading = false,
  onSyncReminders,
  className,
}) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Upcoming bills</CardTitle>
            <CardDescription>Recurring payments due soon</CardDescription>
          </div>
          {onSyncReminders && (
            <Button
              variant="secondary"
              size="sm"
              loading={actionLoading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={onSyncReminders}
            >
              Sync reminders
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <SkeletonLoader className="h-14 w-full rounded-lg" />
              </li>
            ))}
          </ul>
        ) : bills.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-5 w-5" />}
            title="No upcoming bills"
            description="Add recurring transactions to see due dates here."
          />
        ) : (
          <ul className="space-y-2">
            {bills.map((bill) => {
              const days = daysUntil(bill.nextDueDate)
              const urgent = days <= 3

              return (
                <li
                  key={bill.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: bill.categoryColor }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {bill.title}
                    </p>
                    <p className="text-xs text-muted">
                      {bill.categoryName} · {formatDate(bill.nextDueDate)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(bill.amount, currency)}
                    </p>
                    <Badge variant={urgent ? 'danger' : 'outline'} size="sm">
                      {days <= 0 ? 'Due today' : `${days}d`}
                    </Badge>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
