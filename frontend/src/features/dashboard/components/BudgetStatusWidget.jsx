import { Link } from 'react-router-dom'
import { PieChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Button from '@/components/ui/Button.jsx'
import { ROUTES } from '@/app/router/paths.js'
import { formatCurrency, formatPercent, formatBudgetStatus } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

function BudgetRow({ item, currency }) {
  const { label, tone } = formatBudgetStatus(item)
  const pct = Math.min(item.pctUsed ?? 0, 100)

  const barColor =
    tone === 'danger'
      ? 'bg-danger'
      : tone === 'warning'
        ? 'bg-warning'
        : 'bg-accent'

  const badgeVariant =
    tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'success'

  return (
    <li className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate font-medium text-foreground">
            {item.categoryName}
          </span>
        </span>
        <Badge variant={badgeVariant} size="sm">
          {label}
        </Badge>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted">
        {formatCurrency(item.spent, currency)} of{' '}
        {formatCurrency(item.limitAmount, currency)} ·{' '}
        {formatPercent(item.pctUsed)} used
      </p>
    </li>
  )
}

export default function BudgetStatusWidget({
  budgets = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const overCount = budgets.filter((b) => b.isOver).length

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Budget overview</CardTitle>
            <CardDescription>Spending vs limits by category</CardDescription>
          </div>
          {overCount > 0 && (
            <Badge variant="danger" size="sm">
              {overCount} over
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <ul className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="space-y-2">
                <SkeletonLoader className="h-3 w-full" />
                <SkeletonLoader className="h-2 w-full rounded-full" />
              </li>
            ))}
          </ul>
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={<PieChart className="h-5 w-5" />}
            title="No budgets set"
            description="Create category budgets to track limits and alerts."
            action={
              <Link to={ROUTES.BUDGETS}>
                <Button variant="secondary" size="sm" type="button">
                  Manage budgets
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-5">
            {budgets.slice(0, 5).map((item) => (
              <BudgetRow key={item.id ?? item.categoryName} item={item} currency={currency} />
            ))}
          </ul>
        )}
        {!loading && budgets.length > 0 && (
          <Link
            to={ROUTES.BUDGETS}
            className="mt-4 inline-block text-xs font-medium text-accent hover:text-accent-hover"
          >
            View all budgets →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
