import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

export default function TopCategoriesList({
  categories = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Top spending categories</CardTitle>
        <CardDescription>Highest expense categories in range</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <SkeletonLoader className="h-8 w-full" />
              </li>
            ))}
          </ul>
        ) : categories.length === 0 ? (
          <EmptyState title="No categories" description="No expense data for this filter." />
        ) : (
          <ul className="space-y-3">
            {categories.map((cat, index) => (
              <li key={cat.categoryId ?? cat.categoryName ?? index}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background text-xs font-semibold text-muted">
                      {index + 1}
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: cat.color ?? '#94a3b8' }}
                    />
                    <span className="truncate font-medium text-foreground">
                      {cat.categoryName}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">
                    {formatCurrency(cat.total, currency)}
                  </span>
                </div>
                {cat.percentage != null && (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                )}
                <p className="mt-0.5 text-right text-[10px] text-muted">
                  {cat.percentage != null ? formatPercent(cat.percentage) : ''} of spend
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
