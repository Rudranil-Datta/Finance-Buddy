import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency, formatPeriod } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

export default function MonthlySummaryCard({
  summaries = [],
  currency = 'USD',
  loading = false,
  limit = 6,
  className,
}) {
  const rows = summaries.slice(0, limit)

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Monthly summaries</CardTitle>
        <CardDescription>Income, expenses, and net savings by month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <SkeletonLoader className="h-14 w-full rounded-lg" />
              </li>
            ))}
          </ul>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No monthly data"
            description="Transactions across months will appear here."
          />
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => {
              const netPositive = row.netSavings >= 0
              return (
                <li
                  key={row.period}
                  className="rounded-lg border border-border bg-background px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {formatPeriod(row.period)}
                    </p>
                    <p
                      className={cn(
                        'text-sm font-semibold tabular-nums',
                        netPositive ? 'text-success' : 'text-danger',
                      )}
                    >
                      {netPositive ? '+' : ''}
                      {formatCurrency(row.netSavings, currency)}
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                    <span>
                      Income{' '}
                      <span className="font-medium text-income">
                        {formatCurrency(row.income, currency)}
                      </span>
                    </span>
                    <span>
                      Expenses{' '}
                      <span className="font-medium text-foreground">
                        {formatCurrency(row.expense, currency)}
                      </span>
                    </span>
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
