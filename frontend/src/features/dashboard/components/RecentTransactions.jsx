import { Link } from 'react-router-dom'
import { ArrowRight, Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Button from '@/components/ui/Button.jsx'
import { ROUTES } from '@/app/router/paths.js'
import {
  formatCurrency,
  formatDateShort,
  formatTruncate,
} from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

export default function RecentTransactions({
  transactions = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Latest activity across your accounts</CardDescription>
        </div>
        <Link
          to={ROUTES.TRANSACTIONS}
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-3 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <SkeletonLoader className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader className="h-3 w-32" />
                  <SkeletonLoader className="h-2 w-20" />
                </div>
                <SkeletonLoader className="h-4 w-16" />
              </li>
            ))}
          </ul>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title="No transactions yet"
            description="Import CSV or add your first transaction to see activity here."
            action={
              <Link to={ROUTES.TRANSACTIONS}>
                <Button variant="secondary" size="sm" type="button">
                  Add transaction
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income'
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: tx.categoryColor }}
                    aria-hidden
                  >
                    {tx.categoryName?.charAt(0)?.toUpperCase() ?? '?'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {formatTruncate(tx.description, 36)}
                    </p>
                    <p className="text-xs text-muted">
                      {tx.categoryName} · {formatDateShort(tx.date)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold tabular-nums',
                      isIncome ? 'text-success' : 'text-foreground',
                    )}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(Math.abs(tx.amount), currency)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
